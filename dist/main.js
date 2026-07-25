const d = "paranormal-toolkit", bs = "Paranormal Toolkit", Iu = "ordemparanormal";
class ht {
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
function bt(e) {
  const t = Xr(e);
  return t.ok ? y(t.value.definition) : t;
}
function Xr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Qr(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Lu(e) {
  return Qr(e.getFlag(d, "automation"));
}
function Qr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Du(t.source) && vu(t.definition);
}
function vu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && E(t.label) && Array.isArray(t.steps) && t.steps.every(xu) && (t.ritualForms === void 0 || Bu(t.ritualForms)) && (t.conditionApplications === void 0 || ju(t.conditionApplications));
}
function Du(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? E(t.presetId) && E(t.presetVersion) && E(t.appliedAt) : t.type === "manual" ? E(t.label) && E(t.appliedAt) : !1;
}
function xu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Nu(t);
    case "spendRitualCost":
      return Pu(t);
    case "rollFormula":
      return Mu(t);
    case "modifyResource":
      return Ou(t);
    case "chatCard":
      return Fu(t);
    default:
      return !1;
  }
}
function Nu(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ys(t);
}
function Pu(e) {
  return e.type === "spendRitualCost";
}
function Mu(e) {
  const t = e;
  return t.type === "rollFormula" && E(t.id) && E(t.formula) && (t.intent === void 0 || Qu(t.intent)) && (t.damageType === void 0 || E(t.damageType));
}
function Ou(e) {
  const t = e;
  return t.type === "modifyResource" && As(t.actor) && Yu(t.resource) && Xu(t.operation) && ys(t) && (t.damageType === void 0 || t.damageType === null || E(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Fu(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Bu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Uu(a)
  );
}
function Uu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || E(t.label)) && (t.extraCost === void 0 || Ju(t.extraCost)) && (t.rollFormulaOverrides === void 0 || td(t.rollFormulaOverrides)) && (t.notes === void 0 || ed(t.notes)) && (t.targeting === void 0 || zu(t.targeting));
}
function zu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Gu(t.mode) && E(t.label) && (t.optionLabel === void 0 || E(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || qu(t.template));
}
function qu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || to(t.distance)) && (t.width === void 0 || t.width === null || to(t.width));
}
function Gu(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function ju(e) {
  return Array.isArray(e) && e.every(Vu);
}
function Vu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return E(t.id) && As(t.actor) && E(t.conditionId) && (t.label === void 0 || E(t.label)) && (t.duration === void 0 || t.duration === null || Wu(t.duration)) && (t.source === void 0 || E(t.source)) && (t.actionSectionId === void 0 || E(t.actionSectionId)) && (t.actionSectionTitle === void 0 || E(t.actionSectionTitle)) && (t.executedLabel === void 0 || E(t.executedLabel)) && (t.applyOnResistance === void 0 || Hu(t.applyOnResistance));
}
function Hu(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Wu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Zu(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Ku(t.expiry));
}
function Ku(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ys(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || E(e.amountFrom);
}
function As(e) {
  return e === "self" || e === "target";
}
function Yu(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Xu(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Qu(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Zu(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ju(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function to(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function E(e) {
  return typeof e == "string" && e.length > 0;
}
function ed(e) {
  return Array.isArray(e) && e.every(E);
}
function td(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => E(t) && E(n)
  );
}
function Zr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(no);
    if (ad(t))
      return Array.from(t).filter(no);
  }
  return [];
}
function nd(e) {
  return Zr(e)[0] ?? null;
}
function rd(e) {
  return Zr(e).find(Lu) ?? null;
}
function ad(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function no(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function yt(e) {
  return Zr(e).filter((t) => t.type === "ritual");
}
function _s(e) {
  return yt(e)[0] ?? null;
}
function od(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(an);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = rt("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = wt(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(oo);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = rt("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = wt(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await rr(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = rt("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = wt(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await rr(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: oo(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return ro(e);
    },
    async applyBestPresetsToActorRituals() {
      return ro(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = rt("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = wt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function ro(e) {
  const t = rt("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = yt(t);
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
    const s = await rr(e, a, o.preset);
    r.applied.push(id(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), sd(r), r;
}
async function rr(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function id(e, t, n) {
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
function sd(e) {
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
function rt(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function wt(e) {
  const t = _s(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function xe(e) {
  return e ? {
    id: e.id,
    source: {
      ...ld(e.sourceActor),
      token: e.sourceToken
    },
    item: cd(e.item),
    targets: e.targets.map(ud),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: io(e.rollRequests, Ts),
    rolls: io(e.rolls, dd),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Jr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Jr(e) {
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
function ld(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function cd(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ud(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ts(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function dd(e) {
  return {
    ...Ts(e),
    total: e.total
  };
}
function io(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function md(e) {
  return {
    getSelected() {
      return ht.getSelectedActor();
    },
    logResources() {
      const t = me(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await Ie(
        e,
        "Gasto de PE",
        me("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Ie(
        e,
        "Gasto de PD",
        me("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Ie(
        e,
        "Dano em PV",
        me("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Ie(
        e,
        "Cura de PV",
        me("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Ie(
        e,
        "Dano em SAN",
        me("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Ie(
        e,
        "Recuperação de SAN",
        me("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Ie(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    fd(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, Jr(o));
}
function me(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function fd(e) {
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
function pd() {
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
function ar() {
  return {
    enabled: Ct(J.enabled),
    console: Ct(J.console),
    ui: Ct(J.ui),
    chat: Ct(J.chat)
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
function Ct(e) {
  return game.settings.get(d, e) === !0;
}
function gd() {
  return {
    status() {
      return ar();
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
const Rs = "ritual.costOnly", ks = "ritual.simpleHealing", hd = "ritual.eletrocussao", bd = "ritual.definhar", $s = "ritual.simpleDamage", ws = "generic.simpleHealing", Es = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, ea = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function yd() {
  return [
    Ad(),
    _d(),
    Td(),
    Rd(),
    kd(),
    $d()
  ];
}
function Ad() {
  return {
    id: Rs,
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
function _d() {
  return {
    id: ks,
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
    automation: Cs(),
    itemPatch: Sd()
  };
}
function Td() {
  return {
    id: hd,
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
    automation: Ed(),
    itemPatch: Ld()
  };
}
function Rd() {
  return {
    id: bd,
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
    automation: Cd(),
    itemPatch: Id()
  };
}
function kd() {
  return {
    id: $s,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ta()
  };
}
function $d() {
  return {
    id: ws,
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
function Cs(e = Es) {
  const t = wd(e);
  return Ss(
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
function wd(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Es,
    ...e
  };
}
function Ed() {
  return {
    ...ta("3d6", {
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
function Cd() {
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
function ta(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Ss(
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
function Sd() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: ea,
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
function Id() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: ea,
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
function Ld() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: ea,
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
function Ss(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function na() {
  return Array.from(game.user?.targets ?? []).map(Is);
}
function Is(e) {
  return {
    tokenId: Ne(e.id),
    actorId: Ne(e.actor?.id),
    sceneId: Ne(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Ls() {
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
function vd(e) {
  return {
    logFirstRitualCost() {
      const t = fe("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = pe(t);
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
      const r = fe("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = pe(r);
      if (a) {
        if (!Nd(t, n)) {
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
      const t = fe("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = pe(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = fe("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = pe(t);
      if (!n) return;
      const r = e.automationRegistry.require(Rs);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = fe("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = pe(n);
      if (!r) return;
      if (!so(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(ks);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Cs(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = fe("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = pe(n);
      if (!r) return;
      if (!so(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require($s);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: ta(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = fe("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = pe(t);
      n && await Dd(e, t, n);
    }
  };
}
async function Dd(e, t, n) {
  const r = bt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ls(),
    item: n,
    targets: na()
  });
  if (!a.ok) {
    xd(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", xe(a.value.context));
}
function xd(e) {
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
function fe(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function pe(e) {
  const t = _s(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Nd(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function so(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Pd = ["strict", "open"], vs = "strict";
function Md(e) {
  return Pd.includes(e) ? e : vs;
}
function Od(e) {
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
const Fd = ["disabled", "ask", "automatic"], Bd = ["buttons", "confirm"], Ds = "ask";
function Ud(e) {
  return typeof e == "string" && Fd.includes(e);
}
function zd(e) {
  return typeof e == "string" && Bd.includes(e);
}
function qd(e) {
  return Ud(e) ? e : zd(e) ? "ask" : Ds;
}
const Gd = ["keep", "replace"], jd = ["manual", "assisted"], xs = "keep", Ns = "assisted", Vd = !0, P = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Hd() {
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
    default: Ds
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
    default: xs
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
    default: vs
  }), game.settings.register(d, P.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Vd
  }), game.settings.register(d, P.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function or() {
  const e = qd(game.settings.get(d, P.executionMode)), t = Os(game.settings.get(d, P.systemCardMode)), n = Fs(game.settings.get(d, P.damageResolutionMode)), r = ra();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Ms()
  };
}
function Ps() {
  return Os(game.settings.get(d, P.systemCardMode));
}
function Wd() {
  return Fs(game.settings.get(d, P.damageResolutionMode));
}
function ra() {
  return Md(game.settings.get(d, P.resistanceGateMode));
}
function Ms() {
  return game.settings.get(d, P.ritualCastingCheckEnabled) === !0;
}
async function ge(e) {
  await game.settings.set(d, P.executionMode, e);
}
function Os(e) {
  return Gd.includes(e) ? e : xs;
}
function Fs(e) {
  return jd.includes(e) ? e : Ns;
}
function Kd(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await ge("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await ge("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await ge(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await ge("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await ge("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await ge("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await ge("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Yd = [
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
function Xd(e) {
  return {
    phases() {
      return Yd;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Cn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = rd(t);
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
      if (!Jd(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Zd(n) ?? Cn("Nenhum ator encontrado para executar automação do item.");
      r && await lo(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Cn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = nd(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(ws);
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
  const r = bt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ls(),
    item: n,
    targets: na()
  });
  if (!a.ok) {
    Qd(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", xe(a.value.context));
}
function Qd(e) {
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
function Cn(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Zd(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Jd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function em(e) {
  const t = md(e), n = od(e), r = vd(e), a = Xd(e), o = gd(), s = Kd(e);
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
const Mt = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function tm(e) {
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
      return nm(a), a;
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
      return rm(r), r;
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
function nm(e) {
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
function rm(e) {
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
function aa(e) {
  const t = e.badges ?? [], n = t.length > 0 ? `<div class="paranormal-toolkit-chat-card-header__badges">${t.map(am).join("")}</div>` : "", r = e.context ? `<p class="paranormal-toolkit-chat-card-header__context">${De(e.context)}</p>` : "";
  return `<header class="paranormal-toolkit-chat-card-header">
    <img class="paranormal-toolkit-chat-card-header__image" src="${De(e.imageUrl)}" alt="${De(e.imageAlt ?? "")}">
    <div class="paranormal-toolkit-chat-card-header__content">
      <div class="paranormal-toolkit-chat-card-header__topline">
        <span class="paranormal-toolkit-chat-card-header__eyebrow">${De(e.eyebrow)}</span>
        ${n}
      </div>
      <h3 class="paranormal-toolkit-chat-card-header__title">${De(e.title)}</h3>
      ${r}
    </div>
  </header>`;
}
function am(e) {
  return `<span class="paranormal-toolkit-chat-card-header__badge paranormal-toolkit-chat-card-header__badge--${e.tone ?? "neutral"}">${De(e.label)}</span>`;
}
function De(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function om(e) {
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
    conditions: tm(e.conditions),
    debug: em(e),
    hooks: Mt,
    dev: im()
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const r = game.modules.get(d);
  return r && (r.api = t), t;
}
function im() {
  return {
    async postChatCardHeaderExample() {
      if (!game.user?.isGM) {
        ui.notifications?.warn("Paranormal Toolkit: comando de teste disponível apenas para GMs.");
        return;
      }
      await ChatMessage.create({
        content: aa({
          imageUrl: "icons/svg/book.svg",
          imageAlt: "Ícone de ritual",
          eyebrow: "Ritual · teste de desenvolvimento",
          title: "Eletrocussão",
          context: "Mercy → Malvadão",
          badges: [{ label: "Energia", tone: "energy" }]
        })
      });
    }
  };
}
class uo {
  static isSupportedSystem() {
    return game.system.id === Iu;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const Sn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function sm(e) {
  if (!fm(e.item)) return null;
  const t = ir(e.actor) ? e.actor : lm(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: um(e.token) ?? cm(t),
    targets: na(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function lm(e) {
  const t = e;
  return ir(t.actor) ? t.actor : ir(e.parent) ? e.parent : null;
}
function cm(e) {
  const t = dm(e) ?? mm(e);
  return t ? Bs(t) : null;
}
function um(e) {
  return sr(e) ? Bs(e) : null;
}
function dm(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return sr(n) ? n : (t.getActiveTokens?.() ?? []).find(sr) ?? null;
}
function mm(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Bs(e) {
  const t = e.actor ?? null;
  return {
    tokenId: In(e.id),
    actorId: In(t?.id),
    sceneId: In(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function fm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ir(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function sr(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function In(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Us {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Sn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${Sn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = sm(pm(t));
    if (!n) {
      f.warn(`${Sn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function pm(e) {
  return e && typeof e == "object" ? e : {};
}
function Gt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function oa() {
  const e = globalThis.game;
  return sn(e) ? e : null;
}
function W(e, t) {
  const n = gm(e, t);
  return Ae(n);
}
function gm(e, t) {
  return t.split(".").reduce((n, r) => sn(n) ? n[r] : null, e);
}
function hm(e, t) {
  const n = e.indexOf(":");
  return n < 0 || dt(e.slice(0, n)) !== dt(t) ? null : we(e.slice(n + 1));
}
function Ae(e) {
  return typeof e == "string" ? we(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function sn(e) {
  return !!e && typeof e == "object";
}
function bm(e) {
  return typeof e == "string";
}
function ia(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function we(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function dt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function lr(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function le(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function zs(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const jt = "abilityRollConfig", qs = [
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
], cr = 20, ur = 20, ym = [10, 40, 65, 99];
function Gs() {
  return {
    schemaVersion: 1,
    rolls: [js(1)]
  };
}
function js(e) {
  return {
    id: _m(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function Am() {
  return ym.map((e) => ({ minNex: e, formula: "" }));
}
function _m() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function Vs(e) {
  return sa(
    e.getFlag(d, jt)
  );
}
function Tm(e) {
  return Vs(e) ?? Gs();
}
async function Rm(e, t) {
  const n = sa(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, jt, n), n;
}
async function km(e) {
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
  if (!ze(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, cr).map((r, a) => Im(r, a, t)).filter((r) => r !== null)
  };
}
function $m(e, t) {
  const n = Vs(t);
  return n ? wm(n, Em(e)) : [];
}
function wm(e, t) {
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
function Em(e) {
  const t = ze(e.system) ? e.system : {}, n = t.NEX ?? t.nex, r = ze(n) ? n.value : n, a = typeof r == "number" ? r : Number(r);
  return Number.isFinite(a) ? Ws(a) : 0;
}
function Hs(e) {
  return qs.find((t) => t.value === e)?.label ?? e;
}
function Cm(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function Sm(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function Im(e, t, n) {
  if (!ze(e)) return null;
  const r = `roll-${t + 1}`, a = Pm(Nm(e.id, r), n), o = Dm(e.intent), s = Lm(e.formula);
  return !o || !s ? null : {
    id: a,
    label: ln(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? Mm(e.damageType) : null,
    formula: s
  };
}
function Lm(e) {
  if (!ze(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: ln(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, ur).map(vm).filter((r) => r !== null) : [];
  t.sort((r, a) => r.minNex - a.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const r of t) n.set(r.minNex, r);
  return {
    mode: "nex",
    resolution: xm(e.resolution),
    steps: [...n.values()]
  };
}
function vm(e) {
  if (!ze(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: Ws(t),
    formula: ln(e.formula)
  } : null;
}
function Dm(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function xm(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function Nm(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function Pm(e, t) {
  let n = e, r = 2;
  for (; t.has(n); )
    n = `${e}-${r}`, r += 1;
  return t.add(n), n;
}
function Ws(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function ln(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Mm(e) {
  const t = ln(e);
  return t.length > 0 ? t : null;
}
function ze(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const la = "data-paranormal-toolkit-ability-roll-id";
function Om(e) {
  if (!Ks(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = ie(e.actorUuid), n = ie(e.itemUuid), r = ie(e.abilityName);
  if (!t) return null;
  const a = e.rolls.map(Fm).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: r || "Habilidade",
    rolls: a,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: Ln(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: Ln(e.resourceBefore),
    resourceAfter: Ln(e.resourceAfter)
  };
}
function Fm(e) {
  if (!Ks(e)) return null;
  const t = ie(e.id), n = ie(e.sourceRollId), r = ie(e.label), a = ie(e.formula), o = Bm(e.intent);
  if (!t || !n || !r || !a || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: r,
    formula: a,
    intent: o,
    damageType: o === "damage" ? Um(e.damageType) : null,
    nexThreshold: s
  };
}
function Bm(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function ie(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Um(e) {
  const t = ie(e);
  return t.length > 0 ? t : null;
}
function Ln(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function Ks(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const mo = "paranormalToolkitAbilityRollBound";
let fo = !1;
function zm() {
  if (fo) return;
  fo = !0;
  const e = (t, n) => {
    qm(t, Gt(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function qm(e, t) {
  if (!t) return 0;
  const n = `[${la}]`, r = Qm(t, n);
  let a = 0;
  for (const o of r)
    o.dataset[mo] !== "true" && (o.dataset[mo] = "true", o.addEventListener("click", () => {
      Gm(e, o);
    }), a += 1);
  return a;
}
async function Gm(e, t) {
  const n = t.getAttribute(la)?.trim();
  if (!n) return;
  const r = jm(e), a = r?.rolls.find((l) => l.id === n);
  if (!r || !a) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await Vm(r.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!Km(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const s = Hm();
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
      Wm(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: Ym(r.abilityName, a)
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
function jm(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : Om(
    t.getFlag(d, "abilityUse")
  );
}
async function Vm(e) {
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
function Hm() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function Wm(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function Km(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function Ym(e, t) {
  const n = [Xm(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${vn(e)}</strong>
      <span>${vn(t.label)}</span>
      <small>${vn(n.join(" · "))}</small>
    </div>
  `;
}
function Xm(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Hs(e.damageType)}` : "Dano";
  }
}
function Qm(e, t) {
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
function vn(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const Zm = "paranormal-toolkit-chat-message--full-width-card", ho = ".paranormal-toolkit-ability-card", bo = "li.chat-message";
let yo = !1;
function Jm() {
  if (yo) return;
  yo = !0;
  const e = Hooks, t = (n, r) => {
    Ao(Gt(r));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), Ao(document);
}
function Ao(e) {
  if (!e) return 0;
  const t = ca(e), n = ef(t), r = /* @__PURE__ */ new Set();
  for (const a of n) {
    const o = tf(t, a);
    o?.classList && r.add(o);
  }
  for (const a of r)
    a.classList?.add(Zm);
  return r.size;
}
function ef(e) {
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
function tf(e, t) {
  if (e.matches?.(bo)) return e;
  const n = t.closest?.(bo);
  return n ? ca(n) : null;
}
function ca(e) {
  return e && typeof e == "object" ? e : {};
}
function nf(e) {
  const t = rf(e.cost), n = af(e.currentResource), r = t > 0 && !e.passive, a = n >= t;
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
function rf(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function af(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: of } = foundry.applications.api;
class lt extends of {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = nf(t), this.spendResource = this.model.cost.spendResourceChecked;
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
      useAbility: lt.onUseAbility,
      cancel: lt.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new lt(t, n).render({ force: !0 });
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
          src="${sf(this.model.header.image)}"
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
function sf(e) {
  return U(e);
}
function lf(e, t) {
  const n = pf(t.system), r = Vt(n.activation), a = mf(r), o = uf();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: gf(t),
    activation: r,
    activationLabel: df(r),
    description: Vt(n.description),
    chatDescription: cf(
      n.chatDescription,
      n.description
    ),
    cost: a ? 0 : ff(n.cost),
    resource: o,
    passive: a,
    rolls: $m(e, t)
  };
}
function cf(e, t) {
  const n = Vt(e);
  return n.trim().length > 0 ? n : Vt(t);
}
function uf() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function df(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, r = hf()?.(t) ?? t;
  return r === t ? e : r;
}
function mf(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function ff(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function pf(e) {
  return e && typeof e == "object" ? e : {};
}
function Vt(e) {
  return typeof e == "string" ? e : "";
}
function gf(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function hf() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class bf {
  async publish(t, n, r) {
    const a = await kf(n), o = yf({
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
    }, c = Rf(t.message);
    if (Ps() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function yf(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, r = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", a = Af(e.rolls), o = Tf(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      ${aa({
    imageUrl: e.abilityImage,
    imageAlt: e.abilityName,
    eyebrow: "Habilidade",
    title: e.abilityName,
    context: e.actorName
  })}

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${Pe(e.activationLabel)}</span>
        <span><strong>Custo</strong>${Pe(t)}</span>
      </div>

      ${a}
      ${o}

      <footer class="paranormal-toolkit-ability-card__status ${r}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${Pe(n)}</span>
      </footer>
    </article>
  `;
}
function Af(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const r = `paranormal-toolkit-ability-card__roll--${n.intent}`, a = _f(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${r}"
          ${la}="${_o(n.id)}"
          title="${_o(n.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${Pe(n.label)}</strong>
            <small>${Pe(a)}</small>
          </span>
          ${o}
        </button>
      `;
  }).join("")}
      </div>
    </section>
  `;
}
function _f(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Hs(e.damageType)}` : "Dano";
  }
}
function Tf(e) {
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
function Rf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function Pe(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function _o(e) {
  return Pe(e);
}
async function kf(e) {
  const t = e.chatDescription || e.description, n = $f();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: wf(e.actor)
  });
}
function $f() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function wf(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class Ef {
  constructor(t, n, r = new bf()) {
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
    if (!Cf(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const r = lf(n, t.item), a = this.readCurrentResource(r);
    if (!a.ok)
      return this.fail(
        "resource-unavailable",
        a.message
      );
    const o = await lt.request({
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
function Cf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const To = 1e3;
class Sf {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new Ef(t, n), this.strategy = new Us(
      (r) => this.handleItemUsed(r)
    );
  }
  register() {
    this.strategy.register(), Jm(), zm(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (or().executionMode === "disabled" || !Lf(t.item)) return;
    const n = vf(t);
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
    return n !== void 0 && Date.now() - n < To;
  }
  pruneRecentExecutions() {
    const t = Date.now() - To;
    for (const [n, r] of this.recentExecutions)
      r < t && this.recentExecutions.delete(n);
  }
}
function If(e, t) {
  const n = new Sf(e, t);
  return n.register(), n;
}
function Lf(e) {
  if (e.type !== "ability") return !1;
  const t = Xr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function vf(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let Ro = !1, Dn = !1, xn = !1, St = null;
const Df = 1e3, xf = 750, Nf = 1e3;
function Pf(e) {
  Ro || (Hooks.on("combatTurnChange", (t) => {
    Of(e, ko(t));
  }), Hooks.on("deleteCombat", (t) => {
    Ff(e, ko(t));
  }), Ro = !0, Mf(e));
}
function Mf(e) {
  cn() && (Dn || (Dn = !0, globalThis.setTimeout(() => {
    Dn = !1, ua(e, "ready");
  }, Df)));
}
function Of(e, t) {
  cn() && t && (St && globalThis.clearTimeout(St), St = globalThis.setTimeout(() => {
    St = null, ua(e, "combat-turn-change", t);
  }, xf));
}
function Ff(e, t) {
  cn() && t && (xn || (xn = !0, globalThis.setTimeout(() => {
    xn = !1, ua(e, "combat-deleted", t);
  }, Nf)));
}
async function ua(e, t, n) {
  if (cn())
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
function cn() {
  return game.user?.isGM === !0;
}
function ko(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Ys = {
  enabled: "dice.animations.enabled"
};
function Bf() {
  game.settings.register(d, Ys.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Uf() {
  return {
    enabled: game.settings.get(d, Ys.enabled) === !0
  };
}
const un = "chatCard", $o = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, zf = `.${i}__title`, Xs = `.${i}__header`, qf = `.${i}__roll-card`, Gf = `.${i}__roll-meta`, jf = `.${i}__roll-meta-pill`, da = `.${i}__resistance`, Vf = `.${i}__resistance-header`, Qs = `.${i}__resistance-description`, dn = `.${i}__resistance-roll-button`, Zs = `.${i}__resistance-roll-result`, wo = `${i}__resistance-content`, Js = `.${i}__workflow-section`, el = `.${i}__workflow-roll`, ma = `${i}__workflow-roll--dice-open`, fa = `.${i}__workflow-roll-formula`, pa = `${i}__workflow-roll-formula--toggle`, mn = `.${i}__workflow-dice-tray`, Hf = `.${i}__roll-detail-toggle`, Wf = `.${i}__roll-detail-list`, Kf = `.${i}__ritual-metadata`, Yf = "casting-backlash", Xf = "data-paranormal-toolkit-action-section", Qf = "data-paranormal-toolkit-prompt-id", Zf = "data-paranormal-toolkit-pending-id", Eo = "data-paranormal-toolkit-casting-backlash-enhanced", Co = `.${i}`, Jf = `.${i}__workflow-section--casting`, ep = `.${i}__workflow-section-header`, tp = `.${i}__workflow-notes`, np = `[${Xf}="${Yf}"]`, So = `${i}__workflow-section-title-row`, rp = `${i}__workflow-section-header--casting-backlash`, tl = `${i}__casting-backlash-button`;
function ap(e) {
  for (const t of op(e))
    ip(t), dp(t);
}
function op(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Co) && t.add(e);
  for (const n of e.querySelectorAll(Co))
    t.add(n);
  return Array.from(t);
}
function ip(e) {
  const t = e.querySelector(np);
  if (!t) return;
  const n = sp(t);
  if (!n) return;
  const r = e.querySelector(`${Jf} ${ep}`);
  r && (r.classList.add(rp), lp(r), cp(n), r.append(n), t.remove());
}
function sp(e) {
  return e.querySelector(
    `button[${Zf}], button[${Qf}]`
  );
}
function lp(e) {
  const t = e.querySelector(`:scope > .${So}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(So);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(tl) || n.append(a));
  return n;
}
function cp(e) {
  if (e.getAttribute(Eo) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = up(t, e.disabled);
  e.classList.add(tl), e.setAttribute(Eo, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function up(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function dp(e) {
  for (const t of e.querySelectorAll(tp)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function mp(e) {
  for (const t of Array.from(e.querySelectorAll(Js)))
    for (const n of Array.from(t.querySelectorAll(`${Hf}, ${Wf}`)))
      n.remove();
}
const fp = {
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
}, pp = new Set(
  Object.values(fp)
), gp = {
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
function hp(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = bp(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = gp[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : pp.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function nl(e) {
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
function bp(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class rl {
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
      const g = yp(m, u);
      if (!g.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const A = hp(m.damageType);
      if (!A.ok)
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
          Ap(g.id, m, A.value)
        );
        continue;
      }
      try {
        const k = await Promise.resolve(
          o.call(n, g.amount, {
            damageType: A.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const $ of Tp(k.conditions))
          l.add($);
        const R = _p(k.newPV);
        R !== null && (c = R), s.push({
          id: g.id,
          label: m.label ?? nl(A.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: g.amount,
          finalDamage: Io(k.finalDamage, g.amount),
          blocked: Io(k.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: A.value,
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
function yp(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Ap(e, t, n) {
  return {
    id: e,
    label: t.label ?? nl(n),
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
function Io(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function _p(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Tp(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class ga {
  async rollResistance(t) {
    const n = await kp(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? Re(t.skill),
      roll: n,
      formula: wp(n),
      total: Ep(n),
      diceBreakdown: Cp(n)
    };
  }
  getSkillLabel(t) {
    return Re(t);
  }
}
async function Rp(e, t) {
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
async function kp(e, t) {
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
  return $p(r);
}
function $p(e) {
  return Lo(e) ? e : Array.isArray(e) ? e.find(Lo) ?? null : null;
}
function Lo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function wp(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Ep(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Cp(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Sp);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Sp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class al {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class ol {
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
function Ip(e, t) {
  const n = Mp(e?.rounds);
  if (!n)
    return vo(null);
  const r = e?.anchor ?? il(t);
  if (!r)
    return {
      ...vo(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Lp(),
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
function il(e) {
  const t = Op();
  if (!t?.id || !sl(t.round)) return null;
  const n = Np(t), r = vp(e, n) ?? xp(t), a = oe(r?.id), o = Bp(r?.initiative), s = Dp(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: Fp()
  };
}
function Lp() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function vo(e) {
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
function vp(e, t) {
  return e?.id ? t.find((n) => Pp(n) === e.id) ?? null : null;
}
function Dp(e, t, n) {
  const r = oe(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Up(e.turn) ? e.turn : null;
}
function xp(e) {
  return Ot(e.combatant) ? e.combatant : null;
}
function Np(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Ot);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Ot);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Ot);
  }
  return [];
}
function Pp(e) {
  return oe(e.actor?.id) ?? oe(e.actorId) ?? oe(e.token?.actor?.id) ?? oe(e.token?.actorId) ?? oe(e.document?.actor?.id) ?? oe(e.document?.actorId);
}
function Mp(e) {
  return sl(e) ? Math.trunc(e) : null;
}
function Op() {
  return game.combat ?? null;
}
function Fp() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Ot(e) {
  return !!(e && typeof e == "object");
}
function oe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Bp(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function sl(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Up(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class ll {
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
    if (!Xp(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = Ip(t.duration, r), s = zp(a, t, o), c = t.refreshExisting ?? !0 ? Qp(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(Do(r, a, c.id ?? null, !1, !0, o));
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
      return y(Do(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = ul(n, r);
    let o = 0;
    try {
      for (const s of a)
        await xo(n, s) === "deleted" && (o += 1);
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
    const n = eg(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = ha(s);
      a += l.length;
      for (const c of l) {
        if (!jp(c, t)) continue;
        const u = cl(c);
        try {
          await xo(s, c) === "deleted" && (o += 1);
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
function zp(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: ug(),
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
    duration: qp(n.duration),
    start: Gp(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function qp(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Gp(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: cg(),
    ...e
  };
}
function Do(e, t, n, r, a, o) {
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
function jp(e, t) {
  const n = cl(e);
  if (!n.conditionId || !Vp(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = lg();
  return n.durationMode === "combatantTurn" || Hp(n) ? Kp(n, r) : Wp(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !K(n.startRound) || !K(n.requestedRounds) || !K(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Vp(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && K(e.requestedRounds);
}
function Hp(e) {
  return !!(e.combatDurationApplied && K(e.requestedRounds) && K(e.startRound) && (e.startCombatantId || Ht(e.startTurn)));
}
function Wp(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Kp(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !K(e.startRound) || !K(e.requestedRounds) || !K(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Yp(t);
  return e.startCombatantId ? r === e.startCombatantId : Ht(e.startTurn) && Ht(t.turn) ? t.turn === e.startTurn : !1;
}
function Yp(e) {
  return Me(e.combatant?.id);
}
function cl(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ft(e, "conditionId"),
    requestedRounds: No(e, "requestedRounds") ?? at(t.value) ?? at(t.rounds),
    combatDurationApplied: Nn(e, "combatDurationApplied"),
    combatId: Ft(e, "combatId") ?? Me(n.combat) ?? Me(t.combat),
    startCombatantId: Ft(e, "startCombatantId") ?? Me(n.combatant),
    startInitiative: ag(e, "startInitiative") ?? dl(n.initiative),
    startRound: No(e, "startRound") ?? at(n.round) ?? at(t.startRound),
    startTurn: rg(e, "startTurn") ?? dr(n.turn) ?? dr(t.startTurn),
    expiryEvent: og(e, "expiryEvent") ?? ml(t.expiry),
    durationMode: ig(e, "durationMode"),
    deleteOnExpire: Nn(e, "deleteOnExpire"),
    expiresWithCombat: Nn(e, "expiresWithCombat")
  };
}
function Xp(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Qp(e, t) {
  return ul(e, t)[0] ?? null;
}
function ul(e, t) {
  return ha(e).filter((n) => ng(n) === t);
}
async function xo(e, t) {
  const n = t.id ?? null, r = n ? Zp(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (Jp(a)) return "missing";
    throw a;
  }
}
function Zp(e, t) {
  return ha(e).find((n) => n.id === t) ?? null;
}
function Jp(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function eg() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      It(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    It(e, n);
  });
  for (const n of tg())
    It(e, n.actor), It(e, n.document?.actor);
  return Array.from(e.values());
}
function It(e, t) {
  if (!sg(t)) return;
  const r = Me(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function tg() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function ha(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function ng(e) {
  return Ft(e, "conditionId");
}
function Ft(e, t) {
  return Me(Ee(e, t));
}
function No(e, t) {
  return at(Ee(e, t));
}
function rg(e, t) {
  return dr(Ee(e, t));
}
function ag(e, t) {
  return dl(Ee(e, t));
}
function og(e, t) {
  return ml(Ee(e, t));
}
function ig(e, t) {
  const n = Ee(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Nn(e, t) {
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
function Me(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function at(e) {
  return K(e) ? Math.trunc(e) : null;
}
function dr(e) {
  return Ht(e) ? Math.trunc(e) : null;
}
function dl(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ml(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function sg(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function lg() {
  return game.combat ?? null;
}
function cg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function K(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ht(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function ug() {
  return game.user?.id ?? null;
}
const dg = "icons/svg/downgrade.svg", mg = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function T(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? dg,
    description: mg,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const fg = T({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), pg = T({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), gg = T({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), hg = T({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), bg = T({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), yg = T({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Ag = T({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), _g = T({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Tg = T({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Rg = T({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), kg = T({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), $g = T({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), wg = T({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Eg = T({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Cg = T({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Sg = T({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Ig = T({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Lg = T({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), vg = T({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Dg = T({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), xg = T({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Ng = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Pg = T({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Mg = T({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Og = T({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Fg = T({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Bg = T({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Ug = T({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), zg = T({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), qg = T({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Gg = T({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), jg = T({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Vg = T({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Hg = T({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Wg = [
  fg,
  pg,
  gg,
  hg,
  bg,
  yg,
  Ag,
  _g,
  Tg,
  Rg,
  kg,
  $g,
  wg,
  Eg,
  Cg,
  Sg,
  Ig,
  Lg,
  vg,
  Dg,
  xg,
  Ng,
  Pg,
  Mg,
  Og,
  Fg,
  Bg,
  Ug,
  zg,
  qg,
  Gg,
  jg,
  Vg,
  Hg
];
class Kg {
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
    return Array.from(this.definitions.values()).map(Po);
  }
  get(t) {
    const n = this.lookup.get(Mo(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Po(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Mo(t);
    r && this.lookup.set(r, n);
  }
}
function fl() {
  return new Kg(Wg);
}
function Po(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Mo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function qe(e) {
  return e.applyOnResistance ?? "failure";
}
function pl(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function gl(e, t) {
  const n = qe(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function hl(e) {
  const t = qe(e);
  return t === "failure" || t === "success";
}
function Yg(e, t, n, r) {
  const a = e.filter((c) => gl(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => qe(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const Xg = {
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
}, Qg = {
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
function Zg(e) {
  return yl(e, Xg, !1);
}
function Jg(e) {
  return yl(e, Qg, !e.allowsSuccessfulResistance);
}
function Ke(e) {
  return e.kind === "waiting-resistance";
}
function bl(e) {
  return e.kind === "resisted";
}
function yl(e, t, n) {
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
const ot = "data-paranormal-toolkit-prompt-id", eh = "data-paranormal-toolkit-resistance-roll-result", th = "Conjuração DT";
function nh(e) {
  const t = e.querySelector(dn)?.getAttribute(eh), n = mt(t);
  if (n !== null) return n;
  const r = e.querySelector(Zs)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return mt(a?.[1] ?? null);
}
function ba(e) {
  const t = Al(e), n = ih(t);
  if (n !== null) return n;
  const r = oh(t);
  return r !== null ? r : sh(e);
}
function rh(e) {
  const t = Al(e);
  return t ? {
    actorId: Pn(t.actorId),
    itemId: Pn(t.itemId),
    itemName: Pn(t.itemName)
  } : null;
}
function ah(e) {
  const t = e.getAttribute(ot);
  if (!t) return null;
  const n = _l(e), r = Tl(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => fn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function ce(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function mr(e) {
  return ce(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function oh(e) {
  const t = ch(e);
  return t.length === 0 ? null : mt(uh(t, th));
}
function ih(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Oo(r, ["system", "ritual", "DT"]) ?? Oo(r, ["system", "ritual", "dt"]);
}
function sh(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return mt(n?.[1] ?? null);
}
function Al(e) {
  const t = lh(e);
  if (!t) return null;
  const n = _l(e), r = Tl(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => fn(o) ? o.pendingId === t : !1) ?? null;
}
function lh(e) {
  return (e.closest(`[${ot}]`) ?? e.querySelector(`[${ot}]`) ?? e.parentElement?.querySelector(`[${ot}]`) ?? null)?.getAttribute(ot) ?? null;
}
function _l(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return dh(a) ? a : null;
}
function Tl(e) {
  const t = e?.getFlag?.(d, un);
  return fn(t) ? t : null;
}
function ch(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function uh(e, t) {
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
    if (!fn(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : mt(typeof n == "string" ? n : null);
}
function mt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function dh(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function fn(e) {
  return !!(e && typeof e == "object");
}
function Pn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function pn(e) {
  return Rl({
    hasResistance: !!e.querySelector(da),
    difficulty: ba(e),
    resistanceTotal: nh(e)
  });
}
function mh(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Rl({
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
function Rl(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Od(e)
  };
}
function Ce() {
  return game.user?.isGM === !0;
}
function ke() {
  return Ce();
}
function fh(e) {
  const t = on(e.resistanceGateMode, e.resistanceState), n = ph(e.resistanceState, e.hasDamage), r = gh(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = Zg({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Jg({
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
function ph(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function gh(e, t, n = !1) {
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
    policy: fh({
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
function hh(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = yh(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function bh(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function yh(e, t) {
  const n = Ah(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of _h(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Ah(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function _h(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Fo(e, "highest") : n.includes("kl") ? Fo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Fo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const Th = "data-paranormal-toolkit-resistance-skill", Rh = "data-paranormal-toolkit-resistance-skill-label", kh = "data-paranormal-toolkit-roll-card-target-names", $h = "data-paranormal-toolkit-roll-card-resistance", wh = "data-paranormal-toolkit-roll-card-resistance-skill", Eh = "data-paranormal-toolkit-roll-card-resistance-skill-label", kl = "pending", Aa = "success", _a = "failure", $l = "rolled";
function Ch(e) {
  const t = Dh(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Lh(e.damageSection) : null, r = Bo(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = Sh(e.rollCard).map((o, s) => {
    const l = Ih(o, s), c = e.resistanceResults.get(l) ?? null, u = Fh(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, A = mh({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: Gh(u)
    }).state, k = Bo(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      pl(A)
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
        resistanceState: A,
        damage: n,
        effect: k,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!g,
        effectCanApplyOnSuccessfulResistance: k?.applyOnResistance === "success" || k?.applyOnResistance === "always",
        effectRequiresResolvedResistance: k ? hl(k) : !1
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
function Sh(e) {
  const t = e.getAttribute(kh), n = t ? qh(t) : [];
  if (n.length > 0) return n;
  const a = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = a.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && wl(s) !== "nenhum alvo") : [];
}
function Ih(e, t) {
  return `${wl(e)}:${t}`;
}
function Lh(e) {
  const t = Bh(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: zh(e),
    formula: Uh(e) ?? "—",
    total: t,
    diceBreakdown: bh(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Bo(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: vh(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: qe(o)
  } : null;
}
function vh(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function Dh(e, t) {
  const n = Nh(t), r = xh(e), a = r.description ?? Ph(n)?.textContent?.trim(), o = Mh(n), s = r.skill ?? o?.getAttribute(Th) ?? null, l = r.skillLabel ?? o?.getAttribute(Rh) ?? (s ? Re(s) : null);
  return !a && !s ? null : {
    description: a ?? "Resistência do alvo.",
    formula: Oh(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: ba(e)
  };
}
function xh(e) {
  return {
    description: Mn(e, $h),
    skill: Mn(e, wh),
    skillLabel: Mn(e, Eh)
  };
}
function Nh(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function Ph(e) {
  return Ta(e, `.${i}__resistance-description`);
}
function Mh(e) {
  return Ta(e, dn);
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
function Fh(e, t) {
  return e ? t === null ? $l : e.total >= t ? Aa : _a : kl;
}
function Bh(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Uh(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function zh(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function qh(e) {
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
function wl(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function Gh(e) {
  return e === Aa ? "succeeded" : e === _a ? "failed" : "pending";
}
function El(e) {
  if (!e) return null;
  const t = e.actorId ? Hh(e.actorId) : null, n = t ? jh(t, e.itemId, e.itemName) : null;
  return n || Vh(e.itemId, e.itemName);
}
function jh(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Oe(o)) return o;
  }
  const a = Wt(n);
  if (a) {
    const o = r?.find?.((s) => Oe(s) ? Wt(s.name) === a : !1);
    if (Oe(o)) return o;
  }
  return null;
}
function Vh(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Oe(a)) return a;
  }
  const r = Wt(t);
  if (r) {
    const a = n?.find?.((o) => Oe(o) ? Wt(o.name) === r : !1);
    if (Oe(a)) return a;
  }
  return null;
}
function Hh(e) {
  const n = game.actors?.get?.(e);
  return Wh(n) ? n : null;
}
function Wh(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Oe(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Wt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ra(e) {
  const t = On(e);
  if (!t) return null;
  const n = Kh().filter((o) => On(Yh(o)) === t).map((o) => Cl(o)).find(ct) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => ct(o) && On(o.name) === t);
  return ct(a) ? a : null;
}
function Kh() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Yh(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Cl(e)?.name ?? null;
}
function Cl(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ct(t)) return t;
  const n = e.document?.actor;
  return ct(n) ? n : null;
}
function ct(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function On(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Sl(e) {
  const t = Jh();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Xh(e)
  });
}
function Xh(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Bt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Qh(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Bt(e.conditions.join(", "))}</li>` : "";
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
function Qh(e) {
  const t = Zh(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Bt(a)}</li>`;
}
function Zh(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Uo(n?.value);
  return r === null ? null : {
    value: r,
    max: Uo(n?.max)
  };
}
function Uo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Jh() {
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
async function eb(e) {
  await Sl(tb(e));
}
function tb(e) {
  if (nb(e)) return e;
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
function nb(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Il(e) {
  return e.mode, `✓ ${Ll(e.inputAmount)} PV`;
}
function rb(e) {
  const t = Ll(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ll(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class ab {
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
class ob {
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
class ib {
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
const sb = `.${i}__actions`, ka = `.${i}__actions-title`, Ge = `.${i}__button`, lb = "data-paranormal-toolkit-action-section", cb = `${i}__button--executed`, ub = "data-paranormal-toolkit-executed-label";
function vl(e) {
  return ce(e.querySelector(ka)?.textContent);
}
function db(e, t) {
  const n = e.querySelector(ka);
  n && (n.textContent = t);
}
function At(e, t) {
  const n = ce(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return ce(a) === n;
  }) ?? null;
}
function $a(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Se(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Dl(e) {
  const t = mb(e.difficulty);
  if (t === null) return null;
  const n = zo(e.skillLabel) ?? "Resistência", r = zo(e.description), a = fb(r, n), o = pb(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function mb(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function zo(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function fb(e, t) {
  if (!e) return null;
  const n = qo(e), r = qo(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function pb(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function qo(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const Lt = "data-paranormal-toolkit-prompt-id", xl = "multiTargetResistanceResults", Nl = "multiTargetDamageApplications", Pl = "multiTargetEffectApplications";
function gb(e) {
  const t = /* @__PURE__ */ new Map(), r = gn(e)?.[xl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    Rb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function hb(e, t) {
  await wa(e, xl, t.targetId, t);
}
function bb(e) {
  const t = /* @__PURE__ */ new Map(), r = gn(e)?.[Nl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    kb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function yb(e, t) {
  await wa(
    e,
    Nl,
    t.targetId,
    t
  );
}
function Ab(e) {
  const t = /* @__PURE__ */ new Map(), r = gn(e)?.[Pl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    wb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function _b(e, t) {
  await wa(
    e,
    Pl,
    t.targetId,
    t
  );
}
function Tb(e) {
  const t = gn(e);
  return t ? {
    actorId: Fn(t.actorId),
    itemId: Fn(t.itemId),
    itemName: Fn(t.itemName)
  } : null;
}
async function wa(e, t, n, r) {
  const a = Ml(e);
  if (!a) return;
  const o = Ol(e), s = Fl(o);
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
  l && await Promise.resolve(o.setFlag?.(d, un, {
    ...s,
    prompts: c
  }));
}
function gn(e) {
  const t = Ml(e);
  if (!t) return null;
  const n = Ol(e), r = Fl(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Y(o) ? o.pendingId === t : !1) ?? null;
}
function Ml(e) {
  return (e.closest(`[${Lt}]`) ?? e.querySelector(`[${Lt}]`) ?? e.parentElement?.querySelector(`[${Lt}]`) ?? null)?.getAttribute(Lt) ?? null;
}
function Ol(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Eb(a) ? a : null;
}
function Fl(e) {
  const t = e?.getFlag?.(d, un);
  return Y(t) ? t : null;
}
function Rb(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function kb(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && $b(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function $b(e) {
  return e === "normal" || e === "half";
}
function wb(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Fn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Eb(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Y(e) {
  return !!(e && typeof e == "object");
}
const Cb = "data-paranormal-toolkit-resistance-skill", Sb = "data-paranormal-toolkit-resistance-skill-label", fr = "data-paranormal-toolkit-multi-target-section", Ea = "data-paranormal-toolkit-multi-target-damage-info", Bl = "data-paranormal-toolkit-multi-target-effect-info", Ul = "data-paranormal-toolkit-multi-target-toggle", zl = "data-paranormal-toolkit-multi-target-details", j = "data-paranormal-toolkit-multi-target-target", Ib = "data-paranormal-toolkit-multi-target-state", pr = "data-paranormal-toolkit-multi-target-roll-total", gr = "data-paranormal-toolkit-multi-target-roll-formula", Ut = "data-paranormal-toolkit-multi-target-roll-dice", hr = "data-paranormal-toolkit-multi-target-roll-skill", br = "data-paranormal-toolkit-multi-target-roll-skill-label", yr = "data-paranormal-toolkit-multi-target-roll-target-name", Ar = "data-paranormal-toolkit-multi-target-roll-rolled-at", _r = "data-paranormal-toolkit-multi-target-damage-mode", Tr = "data-paranormal-toolkit-multi-target-damage-input-amount", Go = "data-paranormal-toolkit-multi-target-damage-final-amount", jo = "data-paranormal-toolkit-multi-target-damage-blocked", Rr = "data-paranormal-toolkit-multi-target-damage-target-name", kr = "data-paranormal-toolkit-multi-target-damage-applied-at", $r = "data-paranormal-toolkit-multi-target-effect-condition-id", wr = "data-paranormal-toolkit-multi-target-effect-condition-label", Er = "data-paranormal-toolkit-multi-target-effect-effect-id", Cr = "data-paranormal-toolkit-multi-target-effect-created", Sr = "data-paranormal-toolkit-multi-target-effect-refreshed", Ir = "data-paranormal-toolkit-multi-target-effect-target-name", Lr = "data-paranormal-toolkit-multi-target-effect-applied-at", Lb = new ll(fl()), vb = new al(new rl()), Db = new ol(new ga()), xb = new ib(Db), Nb = new ab(vb), Pb = new ob(Lb), Mb = kl, Ye = Aa, _t = _a, Ob = $l;
function Fb(e) {
  const t = ql(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Wb(e);
  const n = Kb(e.rollCard, t), r = Yb(e.rollCard, t);
  !n && r && vy(e.rollCard, r, e.effectSection);
  const a = ty(e.rollCard);
  return Vl(a, t), Sy(
    e.rollCard,
    a,
    Xb(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && Dy(e.rollCard, r, a), !0;
}
function ql(e) {
  return Ch({
    ...e,
    resistanceResults: zb(e.rollCard),
    damageApplications: qb(e.rollCard),
    effectApplications: Gb(e.rollCard),
    resolveTargetConditionApplication: Bb,
    resistanceGateMode: Sa()
  });
}
function Bb(e, t, n) {
  const r = Tb(e), a = El(r);
  if (!a) return null;
  const o = bt(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = Ub(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function Ub(e, t, n) {
  const r = Yg(
    e,
    n,
    t,
    Bn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = Bn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => Bn(s) === a)) ?? null : null;
}
function zb(e) {
  const t = gb(e);
  for (const [n, r] of Hb(e))
    t.set(n, r);
  return t;
}
function qb(e) {
  const t = bb(e);
  for (const [n, r] of Vb(e))
    t.set(n, r);
  return t;
}
function Gb(e) {
  const t = Ab(e);
  for (const [n, r] of jb(e))
    t.set(n, r);
  return t;
}
function jb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute($r), o = n.getAttribute(wr), s = n.getAttribute(Er), l = Wo(n.getAttribute(Cr)), c = Wo(n.getAttribute(Sr)), u = n.getAttribute(Ir), m = n.getAttribute(Lr);
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
function Vb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute(_r), o = tc(n.getAttribute(Tr)), s = n.getAttribute(Rr), l = n.getAttribute(kr);
    !r || !Py(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function Hb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = tc(n.getAttribute(pr)), o = n.getAttribute(gr), s = n.getAttribute(hr), l = n.getAttribute(br), c = n.getAttribute(yr), u = n.getAttribute(Ar);
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
function Wb(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Kb(e, t) {
  if (!t.damage)
    return Gl(e)?.remove(), null;
  const n = Qb(e);
  return Zb(n, t.damage), ey(e, n), n;
}
function Yb(e, t) {
  if (!t.effect)
    return ec(e)?.remove(), null;
  const n = Iy(e);
  return Ly(n, t.effect), n;
}
function Xb(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : At(e, "Conjuração");
}
function Qb(e) {
  const t = Gl(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Ea, "true"), n;
}
function Gl(e) {
  return e.querySelector(`[${Ea}="true"]`);
}
function Zb(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(jl(t.formula, t.total, t.diceBreakdown));
}
function jl(e, t, n, r = !1) {
  const a = hh({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Jb(a, r), a;
}
function Jb(e, t) {
  const n = e.querySelector(mn), r = e.querySelector(fa);
  if (!n || !r) return;
  e.classList.toggle(ma, t), n.hidden = !t, r.classList.add(pa), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function ey(e, t) {
  const n = At(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ty(e) {
  const t = e.querySelector(`[${fr}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(fr, "true"), n;
}
function Vl(e, t) {
  const n = ny(e), r = ay(t.resistance), a = [ry(t)];
  r && a.push(r), a.push(sy(t, n)), e.replaceChildren(...a);
}
function ny(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${j}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(j)).filter(Ny)
  );
}
function ry(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = iy(e.targets), t.append(n, r), t;
}
function ay(e) {
  const t = Dl({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), oy(n, t), n;
}
function oy(e, t) {
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
function iy(e) {
  const t = e.length, n = e.filter((l) => l.state === _t).length, r = e.filter((l) => l.state === Ye).length, a = e.filter((l) => l.state === Mb).length, o = e.filter((l) => l.state === Ob).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function sy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(ly(r, e, t.has(r.id)));
  return n;
}
function ly(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(j, e.id), r.setAttribute(Ib, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Hl(r, e.resistanceResult), Wl(r, e.damageApplication), Kl(r, e.effectApplication);
  const a = cy(e, t, r), o = $y(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    Ho(s.target) || Vo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || Ho(s.target) || (s.preventDefault(), Vo(r));
  }), r.append(a, o), r;
}
function Hl(e, t) {
  if (!t) {
    e.removeAttribute(pr), e.removeAttribute(gr), e.removeAttribute(Ut), e.removeAttribute(hr), e.removeAttribute(br), e.removeAttribute(yr), e.removeAttribute(Ar);
    return;
  }
  e.setAttribute(pr, String(t.total)), e.setAttribute(gr, t.formula), e.setAttribute(hr, t.skill), e.setAttribute(br, t.skillLabel), e.setAttribute(yr, t.targetName), e.setAttribute(Ar, t.rolledAt), t.diceBreakdown ? e.setAttribute(Ut, t.diceBreakdown) : e.removeAttribute(Ut);
}
function Wl(e, t) {
  if (!t) {
    e.removeAttribute(_r), e.removeAttribute(Tr), e.removeAttribute(Go), e.removeAttribute(jo), e.removeAttribute(Rr), e.removeAttribute(kr);
    return;
  }
  e.setAttribute(_r, t.mode), e.setAttribute(Tr, String(t.inputAmount)), e.removeAttribute(Go), e.removeAttribute(jo), e.setAttribute(Rr, t.targetName), e.setAttribute(kr, t.appliedAt);
}
function Kl(e, t) {
  if (!t) {
    e.removeAttribute($r), e.removeAttribute(wr), e.removeAttribute(Er), e.removeAttribute(Cr), e.removeAttribute(Sr), e.removeAttribute(Ir), e.removeAttribute(Lr);
    return;
  }
  e.setAttribute($r, t.conditionId), e.setAttribute(wr, t.conditionLabel), e.setAttribute(Er, t.effectId ?? ""), e.setAttribute(Cr, String(t.created)), e.setAttribute(Sr, String(t.refreshed)), e.setAttribute(Ir, t.targetName), e.setAttribute(Lr, t.appliedAt);
}
function cy(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = uy(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = dy(e, t.resistance);
  gy(l, n, e, t);
  const c = ky(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), Zl(u, [
    Yl(e, t, "compact"),
    Ql(e, t, "compact")
  ]), r.append(a, u), r;
}
function uy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function dy(e, t) {
  if (!Ce())
    return my(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", py(e, t)), t?.skill && (n.setAttribute(Cb, t.skill), n.setAttribute(Sb, t.skillLabel ?? Re(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ye ? "✓" : e.state === _t ? "✕" : "", n.append(r, a), n;
}
function my(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", fy(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ye ? "✓" : e.state === _t ? "✕" : "", n.append(r, a), n;
}
function fy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Ye ? "sucesso" : e.state === _t ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function py(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Ye ? "sucesso" : e.state === _t ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function gy(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !Ce() || e.addEventListener("click", (a) => {
    a.stopPropagation(), hy(t, e, n, r);
  });
}
async function hy(e, t, n, r) {
  if (!Ce()) {
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
    const u = await xb.execute({ actor: l, skill: o, skillLabel: s });
    await xy(u.roll);
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
    Hl(e, m);
    try {
      await hb(r.rollCard, m);
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
  const t = e.closest(`[${fr}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = ql({
    rollCard: n,
    damageSection: by(n) ?? At(n, "Dano"),
    effectSection: yy(n)
  });
  r && Vl(t, r);
}
function by(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Ea) !== "true") ?? null;
}
function yy(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Ay(e) {
  return Ke(e.assistedActions.policy.damageActionState);
}
function _y(e) {
  return Ke(e.assistedActions.policy.effectActionState);
}
function Sa() {
  try {
    return ra();
  } catch {
    return "strict";
  }
}
function Yl(e, t, n) {
  if (e.damageApplication)
    return se(
      "✓",
      Il({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Ke(r))
    return se(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = Xl(a, t.damage);
  if (o === null)
    return se(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = rb({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = se(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = u.closest(`[${j}]`);
    g && Ty(g, u, e, t);
  }), u;
}
function Xl(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Ty(e, t, n, r) {
  if (n.damageApplication) return;
  if (Ay(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = Xl(o, a);
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
    Wl(e, m);
    try {
      await yb(r.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await eb(u.value);
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
function Ql(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (e.effectApplication)
    return se(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!a) return null;
  if (Ke(r))
    return se(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (bl(r))
    return se(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = se(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${j}]`);
    l && Ry(l, o, e, t);
  }), o;
}
async function Ry(e, t, n, r) {
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
    const l = await Pb.execute({
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
    Kl(e, c);
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
function Zl(e, t) {
  for (const n of t)
    n && e.append(n);
}
function se(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function ky(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Ul, "true"), t.setAttribute("aria-hidden", "true"), Jl(e, t), t;
}
function Vo(e) {
  const t = e.querySelector(`[${zl}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Ul}="true"]`);
  r && Jl(e, r);
}
function Jl(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function Ho(e) {
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
function $y(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(zl, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = wy(e, t.resistance);
  s && r.append(s);
  const l = Ey(e, t.resistance), c = Cy(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function wy(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Ye ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Ey(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = jl(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Cy(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), Zl(n, [
    Yl(e, t, "full"),
    Ql(e, t, "full")
  ]), n;
}
function Sy(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Iy(e) {
  const t = ec(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Bl, "true"), n;
}
function ec(e) {
  return e.querySelector(`[${Bl}="true"]`);
}
function Ly(e, t) {
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
function vy(e, t, n) {
  const r = n?.parentElement === e ? n : At(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Dy(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Bn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function xy(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Ny(e) {
  return typeof e == "string" && e.length > 0;
}
function Py(e) {
  return e === "normal" || e === "half";
}
function Wo(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function tc(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Ko = "data-paranormal-toolkit-card-layout-refresh-bound";
function My(e) {
  const t = e.rollCard.querySelector(dn);
  t && t.getAttribute(Ko) !== "true" && (t.setAttribute(Ko, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Fe = "data-paranormal-toolkit-prompt-id", Oy = "apply-damage", Fy = "data-paranormal-toolkit-multi-target-damage-info";
function By(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(Fy) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function Uy(e) {
  const t = qy(e);
  return t.find((n) => n.getAttribute(lb) === Oy) ?? t.find((n) => vl(n) === "aplicar danos") ?? null;
}
function zy(e) {
  const t = nc(e), n = Yo(t);
  return n || Yo(Gy(e));
}
function Yo(e) {
  return e.find((t) => {
    const n = vl(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function qy(e) {
  const t = nc(e);
  return t.length > 0 ? t : Ia(e);
}
function nc(e) {
  const t = Hy(e);
  return t ? Ia(e).filter((n) => Vy(n, t)) : [];
}
function Gy(e) {
  const t = rc(e);
  if (!t) return [];
  const n = jy(e, t);
  return Ia(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => ac(e, r)).filter((r) => !n || Wy(r, n));
}
function Ia(e) {
  const t = rc(e);
  return t ? Array.from(t.querySelectorAll(sb)) : [];
}
function rc(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function jy(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && ac(e, n)) ?? null;
}
function Vy(e, t) {
  return e.getAttribute(Fe) === t ? !0 : Array.from(e.querySelectorAll(`[${Fe}]`)).some((n) => n.getAttribute(Fe) === t);
}
function Hy(e) {
  return e.getAttribute(Fe) ?? e.querySelector(`[${Fe}]`)?.getAttribute(Fe) ?? null;
}
function ac(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Wy(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Ky(e) {
  const t = oc(), n = pn(e.rollCard).state, r = ya({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Ke(a), s = bl(a);
  return e.applied ? et({
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
  }) : r.policy.canShowApplyEffect ? et(o ? {
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
  }) : et({
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
function et(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function Yy(e) {
  const { rollCard: t } = e, n = Zy(), r = oc(), a = pn(t).state, o = ya({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Ke(s), c = Qy(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: N(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: N(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: Xy(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: N("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: N("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: N("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: N("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      normalButton: N("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: N("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: N("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: N("half", !0, !0, !1, !!e.halfButtonSkipped),
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
      normalButton: N("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: N("half", !1, !1, !1, !!e.halfButtonSkipped),
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
    normalButton: N("normal", !u, !u, !1, !!e.normalButtonSkipped),
    halfButton: N("half", u, u, !1, !!e.halfButtonSkipped),
    summary: {
      state: u ? "resisted" : "failed",
      message: u ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function Xy(e) {
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
function N(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function Qy(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function Zy() {
  try {
    return Wd();
  } catch {
    return "assisted";
  }
}
function oc() {
  try {
    return ra();
  } catch {
    return "strict";
  }
}
const Jy = "data-paranormal-toolkit-damage-resolution-state", Xo = "data-paranormal-toolkit-damage-icon-enhanced", La = "data-paranormal-toolkit-damage-original-label", eA = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, ic = "Outra opção escolhida";
function tA(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), db(t, "Aplicar dano"), nA(e, t);
}
function nA(e, t) {
  const n = Array.from(t.querySelectorAll(Ge)), r = Zo(n, "normal"), a = Zo(n, "half");
  if (!r || !a) {
    rA(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  Jo(r, "normal"), Jo(a, "half");
  const o = Yy({
    rollCard: e,
    normalButtonApplied: Kt(r),
    halfButtonApplied: Kt(a),
    normalButtonSkipped: vr(r),
    halfButtonSkipped: vr(a)
  });
  if (!o.canShowApplyDamage) {
    ei(r), ei(a), ti(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), Qo(r, o.normalButton), Qo(a, o.halfButton), ti(t, o.summary.state, o.summary.message);
}
function Qo(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    oA(e, t.visible), iA(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function rA(e) {
  for (const t of e)
    vr(t) && t.remove();
}
function Kt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(ic);
}
function vr(e) {
  return e.textContent?.includes(ic) ?? !1;
}
function Zo(e, t) {
  const n = eA[t];
  return e.find((r) => n.test(aA(r))) ?? null;
}
function aA(e) {
  return [
    e.getAttribute(La),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Jo(e, t) {
  if (e.getAttribute(Xo) === "true") return;
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
  ), e.setAttribute(Xo, "true"), e.setAttribute(La, n), e.setAttribute("aria-label", n), e.replaceChildren(r, Se(n));
}
function ei(e) {
  Kt(e) || e.remove();
}
function oA(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function iA(e, t, n, r = "Role resistência") {
  if (!Kt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(Se(r));
      return;
    }
    e.removeAttribute("aria-disabled"), sA(e, n);
  }
}
function sA(e, t) {
  const n = e.getAttribute(La) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(lA(t), Se(n)));
}
function lA(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function ti(e, t, n) {
  e.setAttribute(Jy, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(ka)?.after(a);
}
const ft = "data-paranormal-toolkit-effect-icon-enhanced", je = "data-paranormal-toolkit-effect-action-compacted", hn = "data-paranormal-toolkit-effect-resistance-gate", va = "data-paranormal-toolkit-effect-section", Da = "data-paranormal-toolkit-effect-label";
function cA(e) {
  return e.querySelector(`[${va}="true"]`);
}
function uA(e) {
  const t = mA(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? pA(), r = kA(n, e.sourceActions, t);
  return r && n.setAttribute(Da, r), gA(n, t, r), TA(e.rollCard, n, e.after ?? e.fallbackAfter), RA(e.sourceActions, n), n;
}
function dA(e, t) {
  const n = t.querySelector(Ge);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = uc(t, n, r), o = sc(e, n), s = Ky({
    rollCard: e,
    effectLabel: a,
    applied: Na(n, r),
    effectCanApplyOnSuccessfulResistance: o ? qe(o) === "success" || qe(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? hl(o) : !1
  });
  if (s.applied) {
    wA(n);
    return;
  }
  if (!s.visible) {
    EA(n);
    return;
  }
  if (s.waitingForResistance) {
    CA(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    SA(n, s.compactLabel);
    return;
  }
  IA(n), cc(n, s.displayLabel);
}
function mA(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Ge) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Ge) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : fA(e.rollCard, r) ?? r[0] ?? null;
}
function fA(e, t) {
  const n = pn(e).state, r = pl(n), a = lc(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = sc(e, o, a);
    if (s && gl(s, r)) return o;
  }
  return null;
}
function sc(e, t, n = lc(e)) {
  const r = xa(t, t.textContent?.trim() ?? ""), a = mr(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => mr(s) === a)) ?? null : null;
}
function lc(e) {
  const t = El(rh(e));
  if (!t) return [];
  const n = bt(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function pA() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(va, "true"), e;
}
function gA(e, t, n) {
  e.setAttribute(va, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = hA(e), a = bA(r);
  a.textContent = "Efeito";
  const o = yA(e, r), s = AA(o);
  s.textContent = LA(n ?? uc(e, t, t.textContent?.trim() ?? ""));
  const l = _A(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Ge)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Na(t, c) && !$A(t, c) && cc(t, n ?? c);
}
function hA(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function bA(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function yA(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function AA(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function _A(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function TA(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function RA(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Ge)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function kA(e, t, n) {
  const r = e.getAttribute(Da);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || xa(n, n.textContent?.trim() ?? "");
}
function xa(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && ce(n) !== "efeito aplicado") return n;
  const r = ah(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && ce(a) !== "aplicado" ? a : null;
}
function Na(e, t) {
  return e.classList.contains(cb) || ce(t).includes("aplicado");
}
function $A(e, t) {
  const n = e.getAttribute(hn);
  if (n === "pending" || n === "resisted") return !0;
  const r = mr(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function cc(e, t) {
  e.getAttribute(je) === "true" && e.getAttribute(ft) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(je, "true"), e.setAttribute(ft, "true"), e.setAttribute(ub, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    $a("✦", `${i}__button-icon--effect`),
    Se("Aplicar")
  ));
}
function wA(e) {
  e.getAttribute(je) === "true" && ce(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(je, "true"), e.setAttribute(ft, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    $a("✓", `${i}__button-icon--effect-applied`),
    Se("Aplicado")
  ));
}
function uc(e, t, n) {
  const r = e.getAttribute(Da) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : xa(t, n) ?? n;
}
function EA(e) {
  Na(e, e.textContent?.trim() ?? "") || e.remove();
}
function CA(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(je), e.removeAttribute(ft), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(hn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Se(t));
}
function SA(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(je), e.removeAttribute(ft), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(hn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    $a("✓", `${i}__button-icon--effect-resisted`),
    Se(t)
  );
}
function IA(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(hn), e.removeAttribute("aria-disabled");
}
function LA(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const vA = "data-paranormal-toolkit-card-layout-normalized";
function DA(e) {
  const t = xA(e.rollCard), n = NA(t);
  return My({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function xA(e) {
  return {
    rollCard: e,
    damageSection: By(e),
    resistance: e.querySelector(da),
    damageActions: Uy(e),
    effectActionSource: zy(e),
    effectSection: cA(e)
  };
}
function NA(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(vA, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = At(t, "Conjuração"), c = PA({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), tA(t, a));
  const u = uA({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: MA(n, c),
    fallbackAfter: l
  });
  return u && dA(t, u), u;
}
function PA(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function MA(e, t) {
  return e ?? t;
}
const dc = [0, 80, 180, 400, 900, 1600, 3e3], ni = /* @__PURE__ */ new WeakSet();
function OA(e) {
  mc(e), FA(e);
}
function mc(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    fc(t);
}
function FA(e) {
  if (!ni.has(e)) {
    ni.add(e);
    for (const t of dc)
      globalThis.setTimeout(() => {
        mc(e);
      }, t);
  }
}
function fc(e) {
  const t = DA({
    rollCard: e,
    refreshDelaysMs: dc,
    onRefresh: () => fc(e)
  });
  Fb({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const BA = "data-paranormal-toolkit-resistance-roll-result-enhanced", ri = "data-paranormal-toolkit-resistance-original-description", UA = "data-paranormal-toolkit-resistance-skill", zA = "data-paranormal-toolkit-resistance-skill-label", qA = `${i}__resistance--without-roll-button`, GA = ["Fortitude", "Reflexos", "Vontade"];
function jA(e) {
  for (const t of Array.from(e.querySelectorAll(da)))
    VA(t);
  OA(e);
}
function VA(e) {
  const t = e.querySelector(Vf), n = e.querySelector(Qs), r = e.querySelector(dn), a = XA(r) ? r : null, o = e.querySelector(Zs);
  if (!t && !n && !o && !r) return;
  e.classList.toggle(qA, !a);
  const s = YA(e, r);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!r || !r.contains(o)) && e.append(o), JA(o)), HA(e, r, n), a && (a_(a), a.parentElement !== e && e.append(a));
}
function HA(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = KA(n), o = Dl({
    description: a,
    skillLabel: QA(t, a),
    difficulty: ba(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  WA(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function WA(e, t) {
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
function KA(e) {
  const t = e.getAttribute(ri);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(ri, n), n;
}
function YA(e, t) {
  const n = e.querySelector(`.${wo}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(wo), e.insertBefore(r, t?.parentElement === e ? t : e.firstChild), r;
}
function XA(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function QA(e, t) {
  const n = e?.getAttribute(zA) ?? e?.getAttribute(UA) ?? null;
  return n || ZA(t);
}
function ZA(e) {
  const t = ai(e);
  return GA.find((n) => t.startsWith(ai(n))) ?? null;
}
function ai(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function JA(e) {
  const t = e_(e.textContent ?? "");
  t && (e.setAttribute(BA, "true"), e.replaceChildren(r_(t)));
}
function e_(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = t_(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function t_(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: n_(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function n_(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function r_(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = o_(e);
  return r && t.append(r), t;
}
function a_(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = pn(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function o_(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of i_(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function i_(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? oi(e, "highest") : n.includes("kl") ? oi(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function oi(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function s_(e) {
  for (const t of Array.from(e.querySelectorAll(qf))) {
    const n = p_(t);
    l_(t), n && (c_(t, n), u_(t, n));
  }
}
function l_(e) {
  for (const t of Array.from(e.querySelectorAll(Gf)))
    t.remove();
}
function c_(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Xs) ?? null;
  if (!r || r.querySelector(".paranormal-toolkit-chat-card-header")) return;
  const a = pc(e), o = a ? gc(a) : null, s = we(
    r.querySelector(zf)?.textContent
  ), l = Ae(o?.name) ?? s ?? "Ritual", c = Ae(o?.img) ?? "", u = t.elementLabel ? [{
    label: S_(t),
    tone: t.elementTone ?? "neutral"
  }] : [], m = document.createElement("template");
  m.innerHTML = aa({
    imageUrl: c,
    imageAlt: l,
    eyebrow: "Ritual",
    title: l,
    context: a?.summary ?? void 0,
    badges: u
  }), r.replaceChildren(m.content);
}
function u_(e, t) {
  const n = d_(e);
  m_(e, n);
  const r = f_(t);
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
  const o = e.querySelector(Js);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function d_(e) {
  return e.closest(`.${i}`)?.querySelector(Xs) ?? null;
}
function m_(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Kf)))
      a.remove();
}
function f_(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${lr(e.target)}` : null,
    e.duration ? `Duração: ${lr(e.duration)}` : null,
    e.resistance ? `Resistência: ${zs(e.resistance)}` : null
  ].filter(ia);
}
function p_(e) {
  const t = pc(e), n = A_(e), a = (t ? gc(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Pa(W(a, "element")), l = te("op.elementChoices", s) ?? ii(be(o, "Elemento")) ?? ii(n.damageType), c = s ?? I_(l), u = W(a, "circle") ?? be(o, "Círculo"), m = R_(a) ?? be(o, "Alvo"), g = E_(a, "duration", "op.durationChoices") ?? be(o, "Duração"), A = __(e) ?? $_(a) ?? be(o, "Resistência"), k = T_(o) ?? n.cost, R = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: k,
    target: m,
    duration: g,
    resistance: A
  };
  return C_(R) ? R : null;
}
function pc(e) {
  const t = g_(e);
  if (!t) return null;
  const n = t.getFlag?.(d, un), r = b_(n);
  if (r.length === 0) return null;
  const a = h_(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function g_(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? oa()?.messages?.get?.(n) ?? null : null;
}
function h_(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${$o}]`))) {
    const a = r.getAttribute($o)?.trim();
    a && n.add(a);
  }
  return n;
}
function b_(e) {
  if (!sn(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(y_).filter((n) => n !== null) : [];
}
function y_(e) {
  return sn(e) ? {
    pendingId: Ae(e.pendingId),
    actorId: Ae(e.actorId),
    itemId: Ae(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(bm) : [],
    summary: Ae(e.summary)
  } : null;
}
function gc(e) {
  if (!e.itemId) return null;
  const t = oa(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function A_(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(jf))) {
    const a = we(r.textContent);
    if (!a) continue;
    const o = hm(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function __(e) {
  const t = we(e.querySelector(Qs)?.textContent);
  return t ? zs(t) : null;
}
function be(e, t) {
  const n = dt(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || dt(r.slice(0, a)) !== n))
      return we(r.slice(a + 1));
  }
  return null;
}
function T_(e) {
  const t = be(e, "Custo") ?? be(e, "PE");
  return t || (e.map(we).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function R_(e) {
  const t = W(e, "target");
  if (!t) return null;
  if (t === "area")
    return k_(e) ?? te("op.targetChoices", t) ?? "Área";
  const n = te("op.targetChoices", t) ?? le(t);
  return [t === "people" || t === "creatures" ? W(e, "targetQtd") : null, n].filter(ia).join(" ");
}
function k_(e) {
  const t = W(e, "area.name"), n = W(e, "area.size"), r = W(e, "area.type"), a = t ? te("op.areaChoices", t) ?? le(t) : null, o = r ? te("op.areaTypeChoices", r) ?? le(r) : null;
  return a ? n ? o ? `${a} ${n}m ${lr(o)}` : `${a} ${n}m` : a : null;
}
function $_(e) {
  const t = W(e, "skillResis"), n = W(e, "resistance");
  if (!t || !n) return null;
  const r = te("op.skill", t) ?? le(t), a = w_(n);
  return [r, a].filter(ia).join(" ");
}
function w_(e) {
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
      return te("op.resistanceChoices", e) ?? le(e);
  }
}
function E_(e, t, n) {
  const r = W(e, t);
  return r ? te(n, r) ?? le(r) : null;
}
function C_(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function S_(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Pa(e) {
  const t = dt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function ii(e) {
  const t = Pa(e);
  return t ? te("op.elementChoices", t) ?? le(t) : e ? le(e) : null;
}
function I_(e) {
  return Pa(e);
}
function te(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = oa()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const si = "data-paranormal-toolkit-dice-toggle-enhanced";
function L_(e) {
  for (const t of Array.from(e.querySelectorAll(el)))
    hc(t);
}
function v_(e) {
  const t = yc(e.target);
  if (!t) return;
  const n = Ma(t);
  n && (e.preventDefault(), bc(n, t));
}
function D_(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = yc(e.target);
  if (!t) return;
  const n = Ma(t);
  n && (e.preventDefault(), bc(n, t));
}
function hc(e) {
  const t = e.querySelector(mn);
  if (!t) return;
  const n = e.querySelector(fa);
  if (n && n.getAttribute(si) !== "true" && (n.setAttribute(si, "true"), n.classList.add(pa), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function bc(e, t) {
  const n = e.querySelector(mn);
  if (!n) return;
  const r = !e.classList.contains(ma);
  x_(e, t, n, r);
}
function x_(e, t, n, r) {
  e.classList.toggle(ma, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function yc(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(fa);
  if (!t) return null;
  const n = Ma(t);
  return n ? (hc(n), t.classList.contains(pa) ? t : null) : null;
}
function Ma(e) {
  const t = e.closest(el);
  return t && t.querySelector(mn) ? t : null;
}
const li = `${d}-workflow-dice-toggle-styles`;
function N_() {
  if (document.getElementById(li)) return;
  const e = document.createElement("style");
  e.id = li, e.textContent = `
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
const P_ = [0, 100, 500, 1500, 3e3];
let ci = !1, Un = null;
function M_() {
  if (!ci) {
    ci = !0, N_(), Hooks.on("renderChatMessageHTML", (e, t) => {
      it(Gt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      it(Gt(t));
    }), Hooks.once("ready", () => {
      it(document), O_();
    }), document.addEventListener("click", v_), document.addEventListener("keydown", D_);
    for (const e of P_)
      globalThis.setTimeout(() => it(document), e);
  }
}
function O_() {
  Un || !document.body || (Un = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && it(n);
  }), Un.observe(document.body, { childList: !0, subtree: !0 }));
}
function it(e) {
  e && (mp(e), s_(e), jA(e), L_(e), ap(e));
}
function F_() {
  M_();
}
const B_ = "data-paranormal-toolkit-action-section", U_ = "ritual-log", z_ = ".paranormal-toolkit-item-use-prompt__actions", q_ = ".paranormal-toolkit-item-use-prompt__actions-title", G_ = [0, 100, 500, 1500];
let di = !1;
function j_() {
  if (di) return;
  const e = (t, n) => {
    mi(K_(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), mi(document), di = !0;
}
function mi(e) {
  for (const t of G_)
    globalThis.setTimeout(() => V_(e), t);
}
function V_(e) {
  H_(e), W_(e);
}
function H_(e) {
  for (const t of e.querySelectorAll(
    `[${B_}="${U_}"]`
  ))
    t.remove();
}
function W_(e) {
  for (const t of e.querySelectorAll(z_)) {
    if (fi(t.querySelector(q_)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => fi(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function K_(e) {
  if (e instanceof HTMLElement || Y_(e))
    return e;
  if (X_(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Y_(e) {
  return e instanceof HTMLElement;
}
function X_(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function fi(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const st = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Ac = {
  PV: "system.attributes.hp"
}, Dr = {
  PV: [st.PV, Ac.PV],
  SAN: [st.SAN],
  PE: [st.PE],
  PD: [st.PD]
}, xr = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Q_ {
  getResource(t, n) {
    const r = pi(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = hi(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = hi(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = pi(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function pi(e, t) {
  const n = Z_(e.type, t);
  if (n && gi(e, n))
    return y(n);
  const r = Dr[t].find(
    (a) => gi(e, a)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: J_(e, t),
    path: Dr[t].join(" | ")
  });
}
function Z_(e, t) {
  return e === "threat" ? Ac[t] ?? null : e === "agent" ? st[t] : null;
}
function gi(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function J_(e, t) {
  const n = e.type ?? "unknown", r = Dr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function hi(e, t, n, r, a) {
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
class eT {
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
      const s = xr.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = tT(a);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of xr.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function tT(e) {
  if (bi(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (bi(n))
      return n;
  }
  return null;
}
function bi(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const nT = "dice-so-nice";
async function _c(e) {
  if (!rT() || !aT()) return;
  const t = oT();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function rT() {
  try {
    return Uf().enabled;
  } catch {
    return !1;
  }
}
function aT() {
  return game.modules?.get?.(nT)?.active === !0;
}
function oT() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const yi = "occultism";
class Tc {
  getDifficulty(t) {
    return iT(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await lT(t, yi);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await _c(r);
    const a = dT(r);
    return {
      skill: yi,
      skillLabel: "Ocultismo",
      roll: r,
      formula: uT(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: mT(r)
    };
  }
}
function iT(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function sT(e) {
  return new Tc().rollCastingCheck(e);
}
async function lT(e, t) {
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
  return cT(r);
}
function cT(e) {
  return Ai(e) ? e : Array.isArray(e) ? e.find(Ai) ?? null : null;
}
function Ai(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function uT(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function dT(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function mT(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(fT);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function fT(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const pT = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class gT {
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
    const r = n.value, a = hT(t.ritual, r);
    return a.ok ? a.value ? y(a.value) : y({
      resource: "PE",
      amount: pT[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function hT(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : bT(n) ? {
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
function bT(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class yT {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return zn("missing-item-patch");
    if (t.type !== "ritual") return zn("unsupported-item-type");
    const a = AT(r);
    return Object.keys(a).length === 0 ? zn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function AT(e) {
  const t = {};
  M(t, "name", e.name), M(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (M(t, "system.circle", n.circle), M(t, "system.element", n.element), M(t, "system.target", n.target), M(t, "system.targetQtd", n.targetQuantity), M(t, "system.execution", n.execution), M(t, "system.range", n.range), M(t, "system.duration", n.duration), M(t, "system.skillResis", n.resistanceSkill), M(t, "system.resistance", n.resistance), M(t, "system.studentForm", n.studentForm), M(t, "system.trueForm", n.trueForm)), t;
}
function M(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function zn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class _T {
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
    return this.getNumber(t, xr.ritual.dt, 0);
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
class TT {
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
class RT {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = kT(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, qn(t)), y(t)) : n;
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
    return n ? qn(n) : null;
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
    return Array.from(this.presets.values()).map(qn);
  }
  findForItem(t) {
    return this.list().map((n) => $T(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function kT(e) {
  return !Gn(e.id) || !Gn(e.version) || !Gn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function $T(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = wT(a, t);
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
function wT(e, t) {
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
      const n = ET(t), r = n !== null && e.circles.includes(n);
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
function ET(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function qn(e) {
  return structuredClone(e);
}
function Gn(e) {
  return typeof e == "string" && e.length > 0;
}
function Yt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = bn(e.amountFrom);
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
function bn(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function CT(e, t, n) {
  if (!Ti(e.id) || !Ti(e.formula))
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
    await _c(a);
    const l = {
      ...n.rollRequests[e.id] ?? Rc(e, t),
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
function Rc(e, t) {
  const n = e.intent ?? ST(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function ST(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Ti(e) {
  return typeof e == "string" && e.length > 0;
}
async function Xt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? vt(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? vt(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? vt(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? vt(t, n, r, a) : e.recover(t, n, a);
  }
}
function vt(e, t, n, r) {
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
function IT(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = LT(t, n, r, a);
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
    const s = vT(t, n, r, a);
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
function LT(e, t, n, r) {
  const a = bn(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: kc(t.id, "damage", r, t.damageInstances.length),
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
function vT(e, t, n, r) {
  const a = bn(e.amountFrom);
  return {
    id: kc(t.id, "healing", r, t.healingInstances.length),
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
function kc(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function DT(e, t, n) {
  const r = bn(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function xT(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), $c("before", e), Ri("before", e), Ri("resolve", e);
}
function NT(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), $c("apply", e);
}
function PT(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function $c(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = MT(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Ri(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function MT(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function OT(e, t, n) {
  return y(void 0);
}
async function FT(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return BT(e, t);
    case "spendRitualCost":
      return UT(e, t);
  }
}
async function BT(e, t) {
  const { context: n, resources: r } = e, a = Yt(t, n);
  return a.ok ? wc(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function UT(e, t) {
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
  }), wc(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function wc(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function zT(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = qT(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function qT(e) {
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
class GT {
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
        return zT({
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
    const a = await FT({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Rc(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await CT(t, r, n);
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Yt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = DT(t, n, a.value);
    xT({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), NT({
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
      IT({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return PT({
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
    const a = await OT(this.messages);
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
    const l = jT(t, n.intent);
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
function jT(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class VT {
  emitCastStarted(t) {
    Hooks.callAll(Mt.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(Mt.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(Mt.ritual.castFinished, t);
  }
}
class HT {
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
class WT {
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
function Ec(e) {
  return {
    id: KT(),
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
function KT() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class YT {
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
    return xe(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Ec(n);
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
class XT {
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
class QT {
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
    const n = ar();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: ZT(),
      flags: {
        ...t.flags,
        [d]: {
          ...JT(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = ar();
    if (!r.enabled)
      return;
    const a = n.notification ?? ki(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = ki(n);
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
function ki(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function ZT() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function JT(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const eR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Cc = `${d}-inline-roll-neutralized`, tR = `${d}-inline-roll-notice`, Oa = `data-${d}-inline-roll-neutralized`, $i = `data-${d}-inline-roll-notice`, nR = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function wi(e) {
  const t = hR(e.message), n = await rR(e.message), r = aR(t);
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
async function rR(e) {
  const t = fR(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = oR(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await pR(t, n.content), replacementCount: n.replacementCount };
}
function aR(e) {
  const t = e ? gR(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Sc(t);
  return n > 0 && Ic(uR(t)), { replacementCount: n };
}
function oR(e) {
  const t = iR(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Sc(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Ic(n.content), { content: n.innerHTML, replacementCount: a });
}
function iR(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, lR(a.trim()))), replacementCount: t };
}
function Sc(e) {
  const t = sR(e);
  for (const n of t)
    n.replaceWith(cR(dR(n)));
  return t.length;
}
function sR(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(eR))
    n.getAttribute(Oa) !== "true" && t.add(n);
  return Array.from(t);
}
function lR(e) {
  return `<span class="${Cc}" ${Oa}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${bR(e)}</span>`;
}
function cR(e) {
  const t = document.createElement("span");
  return t.classList.add(Cc), t.setAttribute(Oa, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Ic(e) {
  if (e.querySelector?.(`[${$i}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(tR), t.setAttribute($i, "true"), t.textContent = nR, e.append(t);
}
function uR(e) {
  return e.querySelector(".message-content") ?? e;
}
function dR(e) {
  const n = e.getAttribute("data-formula") ?? mR(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function mR(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function fR(e) {
  return e && typeof e == "object" ? e : null;
}
async function pR(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function gR(e) {
  const t = yR(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function hR(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function bR(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function yR(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Qt = "ritualRollConfig", Zt = "ritual-roll", AR = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function yn() {
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
function Lc(e) {
  const t = e.getFlag(d, Qt);
  return Nr(t);
}
function vc(e) {
  return Lc(e) ?? yn();
}
async function _R(e, t) {
  const n = Nr(t) ?? Nr({
    ...yn(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Qt, n), n;
}
async function TR(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Qt));
    return;
  }
  await e.setFlag(d, Qt, null);
}
function Nr(e) {
  if (!An(e)) return null;
  const t = vR(e.intent);
  if (!t) return null;
  const n = yn();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Pr(e.damageType),
    utilityLabel: Pr(e.utilityLabel) ?? n.utilityLabel,
    note: Fa(e.note),
    forms: xR(e.forms)
  };
}
function RR(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function kR(e) {
  const t = Lc(e), n = Dc(e);
  if (!t)
    return Ei(e, n);
  const r = IR(e, t);
  if (!r)
    return Ei(e, n);
  const a = $R(t, r), o = [
    { type: "spendRitualCost" },
    a,
    ...wR(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: CR(e, t),
    resistance: n
  };
}
function Ei(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: SR(e),
    resistance: t
  } : null;
}
function $R(e, t) {
  const n = {
    type: "rollFormula",
    id: Zt,
    formula: t,
    intent: LR(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function wR(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Zt}.total`,
          ...ER(e.damageType)
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
function ER(e) {
  return e ? { damageType: e } : {};
}
function CR(e, t) {
  const n = {
    base: jn("Padrão", t.forms.base.formula)
  };
  return Ve(e, "discente") && (n.discente = jn("Discente", t.forms.discente.formula, 2)), Ve(e, "verdadeiro") && (n.verdadeiro = jn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function jn(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [Zt]: t.trim()
    }
  };
}
function SR(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Ve(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Ve(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function IR(e, t) {
  return [
    t.forms.base.formula.trim(),
    Ve(e, "discente") ? t.forms.discente.formula.trim() : "",
    Ve(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((r) => r.length > 0) ?? null;
}
function Dc(e) {
  const t = xc(e), n = Pr(t.skillResis), r = DR(t.resistance);
  if (!n || !r) return;
  const a = NR(n), o = AR[r];
  return {
    skill: n,
    label: a,
    effect: r,
    summary: `${a} ${o}`
  };
}
function LR(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function vR(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function DR(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function xR(e) {
  const t = yn();
  return An(e) ? {
    base: Vn(e.base),
    discente: Vn(e.discente),
    verdadeiro: Vn(e.verdadeiro)
  } : t.forms;
}
function Vn(e) {
  return An(e) ? { formula: Fa(e.formula) } : { formula: "" };
}
function Ve(e, t) {
  const n = xc(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return PR(r);
}
function xc(e) {
  const t = e.system;
  return An(t) ? t : {};
}
function NR(e) {
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
function PR(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Fa(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Pr(e) {
  const t = Fa(e);
  return t.length > 0 ? t : null;
}
function An(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function MR(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function OR(e) {
  switch (FR(e)) {
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
      return BR(String(e ?? ""));
  }
}
function FR(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function BR(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function UR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function zR(e) {
  return {
    ...Ba(e),
    type: "ritual.cast.started"
  };
}
function qR(e) {
  return {
    ...Ba(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function GR(e) {
  return {
    ...Ba(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function jR(e) {
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
function VR(e, t = {}) {
  const n = ik(e), r = [
    ...lk(t.candidates ?? []),
    ...ck(e)
  ], a = dk(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = sk(t) ?? mk(r) ?? pk(a), s = hk(canvas?.grid?.size), l = HR(o, a, r), c = ek(r), u = JR(l);
  return {
    type: "rectangleRay",
    sceneId: gk(e, n),
    regionId: xi(n?.id) ?? xi(e.id),
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
function HR(e, t, n) {
  const r = {
    x: x(e, "x") ?? 0,
    y: x(e, "y") ?? 0,
    width: x(e, "width") ?? t.width,
    height: x(e, "height") ?? t.height,
    direction: x(e, "direction") ?? 0,
    elevation: x(e, "elevation")
  };
  return {
    ...r,
    direction: WR(r, t, n)
  };
}
function WR(e, t, n) {
  const r = KR(n);
  return r !== null ? r : XR(e, t) ?? e.direction;
}
function KR(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = Ci(n, t);
    if (r !== null) return r;
    const a = _n(n), o = Ci(a, t);
    if (o !== null) return o;
  }
  return null;
}
function Ci(e, t) {
  for (const n of t) {
    const r = YR(G(e, n));
    if (r !== null) return r;
  }
  return null;
}
function YR(e) {
  const t = pt(e);
  if (t === null) return null;
  const n = za(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function XR(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Ii(Si(e, e.direction), t), r = QR(e, t);
  if (r === null) return null;
  const o = ZR([
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
    error: Ii(Si(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? za(o.direction) : null;
}
function QR(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = Ni(o, 0, 1), c = Ni(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : bk(Math.atan2(c, l));
}
function Si(e, t) {
  const n = Pc(t), r = {
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
  ], s = o.map((A) => A.x), l = o.map((A) => A.y), c = Math.min(...s), u = Math.max(...s), m = Math.min(...l), g = Math.max(...l);
  return {
    x: c,
    y: m,
    width: u - c,
    height: g - m
  };
}
function Ii(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function ZR(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = za(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function JR(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Pc(e.direction), n = {
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
function ek(e) {
  for (const t of e) {
    const n = Li(t, "ray.start"), r = Li(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Li(e, t) {
  const n = G(e, t), r = pt(G(n, "x")), a = pt(G(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function Ba(e) {
  const t = jR(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: rk(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: tk(e.context.item, e.form, e.formLabel, t),
    targets: n.map(ak),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function tk(e, t, n, r) {
  return {
    name: e.name,
    slug: Hn(e, "system.slug") ?? Hn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: Hn(e, "system.element"),
    circle: ok(e),
    form: nk(t),
    formLabel: n
  };
}
function nk(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function rk(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function ak(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function ok(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : Te(t);
}
function Hn(e, t) {
  return Te(foundry.utils.getProperty(e, t));
}
function Te(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function ik(e) {
  return "document" in e && e.document ? e.document : e;
}
function sk(e) {
  return Nc(e.shape);
}
function lk(e) {
  return e.filter(Ua);
}
function ck(e) {
  return [
    e,
    uk(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Ua);
}
function uk(e) {
  return "object" in e && Ua(e.object) ? e.object : null;
}
function Ua(e) {
  return !!(e && typeof e == "object");
}
function dk(e) {
  for (const t of e) {
    const n = vi(G(_n(t), "bounds"));
    if (n) return n;
    const r = vi(G(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function vi(e) {
  const t = x(e, "x"), n = x(e, "y"), r = x(e, "width"), a = x(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function x(e, t) {
  return pt(G(e, t));
}
function mk(e) {
  for (const t of e) {
    const n = fk(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function fk(e) {
  if (!e || typeof e != "object") return [];
  const t = Di(_n(e));
  return t.length > 0 ? t : Di(e);
}
function Di(e) {
  const t = G(e, "shapes");
  return Array.isArray(t) ? t.map(Nc).filter((n) => n !== null) : [];
}
function Nc(e) {
  const t = _n(e) ?? e, n = G(t, "type");
  return typeof n != "string" ? null : {
    type: n,
    x: x(t, "x"),
    y: x(t, "y"),
    width: x(t, "width"),
    height: x(t, "height"),
    direction: x(t, "direction"),
    elevation: x(t, "elevation")
  };
}
function pk(e) {
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
function gk(e, t) {
  return Wn(e, "parent.id") ?? Wn(e, "document.parent.id") ?? Wn(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Wn(e, t) {
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
function _n(e) {
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
function xi(e) {
  return Te(e);
}
function pt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function hk(e) {
  const t = pt(e);
  return t !== null && t > 0 ? t : null;
}
function Pc(e) {
  return e * Math.PI / 180;
}
function bk(e) {
  return e * 180 / Math.PI;
}
function za(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Ni(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class yk {
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
class Tn {
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
const Ak = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class _k {
  constructor(t = new Tn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = Tk(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(Ak);
  }
}
function Tk(e, t) {
  const n = [], r = Rk(e), a = Pi(r), o = Pi(e);
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
function Rk(e) {
  return kk(e) ? e.document ?? null : e;
}
function kk(e) {
  return "bounds" in e;
}
function Pi(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const $k = 100, wk = 12;
class Ek {
  constructor(t = new Tn()) {
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
      const a = this.foundryAdapter.getGridSize() ?? $k, o = vk(n), s = await this.foundryAdapter.placeRegion(
        Ck(t, this.foundryAdapter.getUserColor(), a),
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
        message: Lk(a)
      };
    }
  }
}
function Ck(e, t, n) {
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
    shapes: [Sk(e, n)]
  };
}
function Sk(e, t) {
  const n = Ik(e, t);
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
function Ik(e, t) {
  return {
    length: Mi(e.length, wk, t),
    width: Mi(e.width, 1, t)
  };
}
function Mi(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function Lk(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function vk(e) {
  const t = (n) => {
    const r = Dk(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function Dk(e) {
  return xk(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function xk(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class Nk {
  constructor(t = new Tn()) {
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
    const n = Pk(t);
    Mk(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Oi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function Pk(e) {
  return Array.from(new Set(e));
}
function Mk(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class Ok {
  constructor(t = new Tn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Is)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(Fk(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(Bk(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: Mr(r.region)
    }));
    for (const r of t) {
      if (!Mr(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = zk(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function Fk(e) {
  return [
    { source: "document", region: _e(e.document) },
    { source: "document.object", region: _e(e.document.object) },
    { source: "preview", region: _e(e.preview) },
    { source: "preview.document.object", region: _e(e.preview?.document?.object) }
  ];
}
function Bk(e) {
  return [
    { source: "input", region: _e(e) },
    { source: "input.object", region: Uk(e) ? _e(e.object) : null },
    { source: "input.document.object", region: Mc(e) ? _e(e.document?.object) : null }
  ];
}
function _e(e) {
  return Mr(e) ? e : null;
}
function Mr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Dt(n.x) && Dt(n.y) && Dt(n.width) && Dt(n.height);
}
function Mc(e) {
  return "document" in e && "bounds" in e;
}
function Uk(e) {
  return !Mc(e);
}
function zk(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function Dt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class qk {
  async minimizeForPlacement() {
    const t = [];
    for (const n of Vk())
      await Gk(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await jk(n);
      }
    };
  }
}
async function Gk(e) {
  if (Oc(e) || !Jk(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function jk(e) {
  if (Oc(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function Vk() {
  const e = /* @__PURE__ */ new Set();
  for (const t of Hk())
    Yk(t) && Xk(t) && e.add(t);
  return [...e];
}
function Hk() {
  return [
    ...Fi(Wk()),
    ...Fi(Kk())
  ];
}
function Fi(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function Wk() {
  return globalThis.ui?.windows ?? null;
}
function Kk() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function Yk(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function Xk(e) {
  const t = Qk(e), n = Zk(t);
  return n === "Actor" || n === "Item";
}
function Qk(e) {
  return e.document ?? e.object ?? null;
}
function Zk(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function Jk(e) {
  const t = e$(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function e$(e) {
  const t = e.element;
  if (Bi(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (Bi(n)) return n;
  }
  return null;
}
function Bi(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function Oc(e) {
  return e.minimized === !0;
}
const t$ = "Nenhum alvo encontrado na linha.";
class n$ {
  constructor(t = new Ek(), n = new Ok(), r = new _k(), a = new Nk(), o = new yk(), s = new qk()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = a$(r), m = VR(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(t$), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = r$(c);
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
function r$(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function a$(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function o$(e) {
  return {
    header: {
      eyebrow: bs,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: f$(e.ritual)
    },
    forms: e.variantOptions.map((t) => i$(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: c$(e.targetNames, e.variantOptions, e.ritual),
    automation: m$(e.automationStatus ?? "assisted")
  };
}
function i$(e, t) {
  const n = s$(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? l$(t) : "—",
    details: n
  };
}
function s$(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function l$(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function c$(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => u$(a, n))
  };
}
function u$(e, t) {
  const n = e.targeting ?? d$(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function d$(e, t) {
  const n = bt(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function m$(e) {
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
function f$(e) {
  const t = e.system, n = [g$(t?.element), p$(t?.circle)].filter(y$);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function p$(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function g$(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (h$(e)) {
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
      return b$(e);
  }
}
function h$(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function b$(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function y$(e) {
  return typeof e == "string" && e.length > 0;
}
const Fc = ["base", "discente", "verdadeiro"];
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
  return typeof e == "string" && Fc.includes(e);
}
const { ApplicationV2: A$ } = foundry.applications.api;
class ut extends A$ {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = o$(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: ut.onCast,
      cancel: ut.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new ut(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    R$(a, (o) => {
      this.selectedVariant = o, Or(a, o);
    }), Or(a, this.selectedVariant), k$(a, (o) => {
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
          ${this.model.forms.map(_$).join("")}
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
          ${this.model.targets.forms.map(T$).join("")}
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
    const n = C$(t), r = $$(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function _$(e) {
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
function T$(e) {
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
function R$(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => Ui(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Ui(e, a, t));
    });
  const r = Bc(e);
  r && t(r);
}
function Ui(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Jt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Bc(e), Or(e, r.value));
}
function Bc(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Jt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Or(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function k$(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function $$(e, t, n) {
  const r = E$(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = w$(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function w$(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function E$(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Jt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Jt(n) ? n : null;
}
function C$(e) {
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
async function S$(e) {
  return ut.request(e);
}
const Ga = {
  label: "Padrão"
}, I$ = {
  label: "Discente",
  extraCost: 2
}, L$ = {
  label: "Verdadeiro",
  extraCost: 5
};
class v$ {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new n$();
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
    const a = this.resolveCostPreview(t), o = ww(n), s = Rw(
      n,
      t.item,
      a,
      o
    ), l = await S$({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((w) => w.name),
      cost: a,
      defaultSpendResource: vw(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = D$(l), u = Cw(
      n,
      t.item,
      c.variant,
      o
    ), m = UR(), g = u.label ?? qa(c.variant), A = F$(u), k = (w = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: g,
      targets: w
    }), R = (w, S = t.targets, B = {}) => {
      this.ritualEvents.emitCastFinished(
        GR({
          ...k(S),
          status: w,
          ...B
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      zR(k())
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
    const b = x$(
      t,
      $.targets
    );
    $.areaSnapshot && this.ritualEvents.emitAreaResolved(
      qR({
        ...k($.targets),
        area: $.areaSnapshot
      })
    );
    const I = Ms();
    let _ = null;
    if (I) {
      const w = await P$(
        this.resources,
        b.actor,
        c,
        u,
        a
      );
      if (!w.ok)
        return R("failed", b.targets, {
          reason: w.reason,
          message: w.message
        }), {
          status: "failed",
          reason: w.reason,
          message: w.message
        };
      try {
        const S = await sT(
          b.actor
        );
        _ = B$(
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
    const F = N$(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !I
      }
    );
    if (F.steps.length === 0) {
      const w = Ew(
        b,
        c
      ), S = qi(
        n,
        b
      ), B = zi(
        b.actor,
        _,
        u,
        a
      ), H = Gi(
        n,
        c,
        u,
        a,
        w,
        b,
        _
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
      const $t = [
        ...B,
        ...S.actions
      ];
      return $t.length > 0 ? (R("ready", b.targets), {
        status: "ready",
        workflowContext: w,
        itemUseContext: b,
        actions: $t,
        summaryLines: H
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: w,
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
    const V = D.value.context, L = V$(
      n,
      b,
      V,
      A
    ), z = qi(
      n,
      b
    ), kt = zi(
      b.actor,
      _,
      u,
      a
    ), de = Gi(
      n,
      c,
      u,
      a,
      V,
      b,
      _
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
      ...kt,
      ...L.actions,
      ...z.actions
    ];
    return C.length === 0 ? (R("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: V,
      itemUseContext: b,
      summaryLines: de
    }) : (R("ready", b.targets), {
      status: "ready",
      workflowContext: V,
      itemUseContext: b,
      actions: C,
      summaryLines: de
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
function D$(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function x$(e, t) {
  return {
    ...e,
    targets: t
  };
}
function N$(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Va(l) && (!a.includeCostSteps || !s))
      continue;
    const c = M$(l, n);
    c && o.push(c);
  }
  return a.includeCostSteps && s && r && Dw(n.extraCost) && o.push({
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
async function P$(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Xe(a, r);
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
function M$(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = O$(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function O$(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const r = n[t];
  return typeof r == "string" ? r.trim() : "";
}
function F$(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function B$(e, t, n) {
  const a = U$(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function U$(e, t) {
  const n = Xe(e, t);
  return n ? MR(n.amount) : null;
}
function zi(e, t, n, r) {
  if (!t || t.success) return [];
  const a = Xe(r, n);
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
function qi(e, t) {
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
      const s = il(o);
      n.push(
        z$(
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
function z$(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? j$(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: q$(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: G$(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function q$(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function G$(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function j$(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function V$(e, t, n, r = /* @__PURE__ */ new Set()) {
  const a = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || H$(s, r)) continue;
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
      if (W$(s)) {
        K$(
          o,
          u,
          Y$(s, n, l.value)
        );
        continue;
      }
      a.push(Q$(s, u, l.value));
    }
  }
  for (const s of o.values())
    a.push(
      ...X$(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: a };
}
function H$(e, t) {
  const n = Uc(e.amountFrom);
  return n !== null && t.has(n);
}
function W$(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function K$(e, t, n) {
  const r = tw(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Y$(e, t, n) {
  const r = Uc(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function X$(e, t, n, r) {
  const a = ow(e), o = a.length > 1 ? lw() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const g = iw(u.amount, s);
        return {
          id: Z$(u, s, m),
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
      label: J$(c, s, a.length > 1),
      executedLabel: ew(
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
function Q$(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = aw(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: nw(e, r, n),
    executedLabel: rw(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Z$(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function J$(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function ew(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function tw(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Uc(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function nw(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function rw(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function aw(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function ow(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function iw(e, t) {
  const n = e * t.multiplier, r = sw(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function sw(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function lw() {
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
function Gi(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${qa(t.variant)}`,
    mw(t, n, r),
    ...dw(s),
    ...Object.values(a.rolls).flatMap(fw),
    ...cw(e, o),
    ...pw(e.resistance),
    ..._w(n)
  ];
}
function cw(e, t) {
  return uw(e) ? ja("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function uw(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function dw(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function mw(e, t, n) {
  const r = Xe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function fw(e) {
  const n = [`${Tw(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = gw(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${OR(e.damageType)}`), n;
}
function pw(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function gw(e) {
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
    const s = hw(o);
    s && (Aw(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function hw(e) {
  const t = bw(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : yw(e);
}
function bw(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function yw(e) {
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
function Aw(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function _w(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Tw(e) {
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
function Rw(e, t, n, r) {
  return Fc.map((a) => {
    const o = zc(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? qa(a),
      enabled: s,
      details: o ? kw(o, n) : [],
      finalCostText: o ? $w(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function kw(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  a.length > 0 ? r.push(a.join(", ")) : r.push("efeito manual");
  const o = Xe(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function Xe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function $w(e, t) {
  const n = Xe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function ww(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Va);
}
function Ew(e, t) {
  return Ec({
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
function Cw(e, t, n, r) {
  return zc(e, t, n, r) ?? Ga;
}
function zc(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? Iw(t, n) ? Sw(n) : null : n === "base" ? Ga : null);
}
function Sw(e) {
  switch (e) {
    case "base":
      return Ga;
    case "discente":
      return I$;
    case "verdadeiro":
      return L$;
  }
}
function Iw(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Lw(foundry.utils.getProperty(e, n));
}
function Lw(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function vw(e) {
  return e.steps.some(Va);
}
function Va(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Dw(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const qc = "itemUsePrompts", Gc = "chatCard", Rn = "data-paranormal-toolkit-prompt-id", kn = "data-paranormal-toolkit-pending-id", Ha = "data-paranormal-toolkit-executed-label", Fr = "data-paranormal-toolkit-choice-group", jc = "data-paranormal-toolkit-skipped-label", en = "data-paranormal-toolkit-action-section", ji = "data-paranormal-toolkit-detail-key", Vi = "data-paranormal-toolkit-roll-card", Wa = "data-paranormal-toolkit-roll-detail-toggle", Vc = "data-paranormal-toolkit-roll-detail-id", Hc = "data-paranormal-toolkit-resistance-roll-button", Wc = "data-paranormal-toolkit-resistance-skill", Kc = "data-paranormal-toolkit-resistance-skill-label", Yc = "data-paranormal-toolkit-resistance-target-actor-id", Xc = "data-paranormal-toolkit-resistance-target-name", Qc = "data-paranormal-toolkit-resistance-roll-result", Hi = "data-paranormal-toolkit-system-card-replaced", xw = `[${kn}]`, Nw = `[${Wa}]`, Pw = `[${Hc}]`, Br = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, Mw = `${h}__actions`, Wi = `${h}__details`, Zc = `${h}__summary`, Ow = `${h}__title`, Jc = `${h}__button--executed`, xt = `${h}__roll-card`, Fw = "data-paranormal-toolkit-roll-card-target-mode", Bw = "data-paranormal-toolkit-roll-card-target-names", Uw = "data-paranormal-toolkit-roll-card-resistance", zw = "data-paranormal-toolkit-roll-card-resistance-skill", qw = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let Ki = !1, Ur = null;
const X = /* @__PURE__ */ new Map(), Gw = [0, 100, 500, 1500, 3e3], jw = 3e4, Vw = [0, 100, 500, 1500, 3e3];
function Hw(e) {
  if (Ur = e, Ki) {
    Xi(e);
    return;
  }
  const t = (n, r) => {
    tu(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Ki = !0, Xi(e);
}
async function Yi(e) {
  const t = eu(e);
  X.set(e.pendingId, t), await Xa(t) || fu(t), nu(e.pendingId);
}
async function Ww(e) {
  const t = eu({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", X.set(e.pendingId, t), await Xa(t) || fu(t), nu(e.pendingId);
}
async function Kn(e, t) {
  const n = X.get(e);
  X.delete(e), n && await QE(n, t);
}
function Ka(e) {
  const t = Au();
  for (const n of t) {
    const r = re(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Kw(e, t) {
  const n = Ka(e);
  if (!n) return;
  const r = re(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Qe(n.message, r));
}
async function Yw(e, t, n) {
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
  o && await Qe(r.message, a);
}
function eu(e) {
  const t = ue(e.context.message), n = e.context.targets.find((s) => jr(s)), r = n ? jr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: kE(e.context),
    executed: !1
  };
}
function tu(e, t, n) {
  XE();
  const r = wn(t);
  if (!r) return;
  const a = WE(e, r);
  a.length > 0 && tn(r);
  for (const o of a)
    zr(r, o);
  su(r, n), qr(r), Gr(r);
}
function Xi(e) {
  for (const t of Vw)
    globalThis.setTimeout(() => {
      Xw(e);
    }, t);
}
function Xw(e) {
  for (const t of Qw()) {
    const n = $n(t);
    Zw(n) && tu(n, t, e);
  }
}
function Qw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Zw(e) {
  return e ? Qa(e) ? !0 : JE(e).length > 0 : !1;
}
function nu(e) {
  const t = X.get(e);
  if (!t) return;
  const n = t.messageId ? KE(t.messageId) : null;
  if (n) {
    ts(n, t), tn(n), zr(n, t), Qi(n), qr(n), Gr(n);
    return;
  }
  if (t.messageId) {
    Hr(t);
    return;
  }
  const r = YE(t);
  if (r) {
    ts(r, t), tn(r), zr(r, t), Qi(r), qr(r), Gr(r);
    return;
  }
  Hr(t);
}
function Qi(e) {
  Ur && su(e, Ur);
}
function tn(e) {
  const t = Jw();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = iu(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Hi) === "true") return;
  const r = n.querySelector(`.${Br}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Hi, "true");
}
function Jw() {
  try {
    return Ps() === "replace";
  } catch {
    return !1;
  }
}
function zr(e, t) {
  if (tn(e), e.querySelector(`[${Rn}="${Ze(t.pendingId)}"]`)) return;
  const n = tE(e, t);
  rE(n, t);
  const r = AE(t);
  if (eE(r)) return;
  yE(n, r).append(RE(t));
}
function eE(e) {
  return au(e.id) && !ke();
}
function ru(e) {
  const n = e.closest(`[${en}]`)?.getAttribute(en) ?? null;
  return au(n) && !ke();
}
function au(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function tE(e, t) {
  const n = e.querySelector(`.${Br}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Br, h);
  const a = document.createElement("div");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Ow), s.textContent = nE(t);
  const l = document.createElement("span");
  return l.classList.add(Zc), l.textContent = t.summary, a.append(o, s, l), r.append(a), wE(e).append(r), r;
}
function nE(e) {
  const t = O(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function rE(e, t) {
  const n = t.summaryLines ?? [], r = du(n, t);
  if (r) {
    aE(e, r, t);
    return;
  }
  _E(e, n);
}
function aE(e, t, n) {
  if (e.querySelector(`[${Vi}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(
    xt,
    `${xt}--${t.intent}`,
    `${xt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && r.classList.add(`${xt}--multi-target`), r.setAttribute(Vi, "true"), r.setAttribute(Fw, t.targetMode), r.setAttribute(Bw, JSON.stringify(t.targetNames)), fE(r, t), t.castingCheck && Zi(r, iE(t.castingCheck), n.pendingId, "casting"), oE(t) && Zi(r, sE(t), n.pendingId, "effect"), mE(r, t), pE(r, t, n), bE(r, t), e.append(r);
}
function oE(e) {
  return e.intent !== "casting";
}
function iE(e) {
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
function sE(e) {
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
function Zi(e, t, n, r) {
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
  lE(a, t), hE(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function lE(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = cE(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function cE(e, t) {
  const n = uE(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of dE(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function uE(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function dE(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ji(e, "highest") : n.includes("kl") ? Ji(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ji(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function mE(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(bC);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function fE(e, t) {
  t.resistance && (e.setAttribute(Uw, t.resistance), t.resistanceSkill && e.setAttribute(zw, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(qw, t.resistanceSkillLabel));
}
function pE(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = gE(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(ou(t.resistanceRollResult)), e.append(r);
}
function gE(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !Ce())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Rn, t.pendingId), n.setAttribute(Hc, "true"), n.setAttribute(Wc, e.resistanceSkill), n.setAttribute(Kc, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Yc, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Xc, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Qc, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function ou(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = cu(e), t;
}
function hE(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Wa, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Vc, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const g = document.createElement("dd");
    g.textContent = u.value, c.append(m, g);
  }
  e.append(l, c);
}
function bE(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function yE(e, t) {
  const n = `[${en}="${Ze(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(Mw), a.setAttribute(en, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function AE(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = du(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function _E(e, t) {
  if (t.length === 0) return;
  const n = TE(e);
  for (const r of t) {
    const a = yC(r);
    if (n.querySelector(`[${ji}="${Ze(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(ji, a), n.append(o);
  }
}
function TE(e) {
  const t = e.querySelector(`.${Wi}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Wi), e.append(n), n;
}
function RE(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Rn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Jc), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(kn, e.pendingId), t.setAttribute(Ha, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Fr, e.choiceGroupId), t.setAttribute(jc, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function kE(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = $E(e);
  return `${t} → ${n}`;
}
function $E(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function wE(e) {
  return iu(e) ?? e;
}
function iu(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function su(e, t) {
  const n = wn(e);
  if (!n) return;
  const r = n.querySelectorAll(xw);
  for (const a of r) {
    if (ru(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      BE(a, t);
    }));
  }
}
function qr(e) {
  const t = wn(e);
  if (!t) return;
  const n = t.querySelectorAll(Nw);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      EE(t, r);
    }));
}
function Gr(e) {
  const t = wn(e);
  if (!t) return;
  const n = t.querySelectorAll(Pw);
  for (const r of n) {
    if (!Ce()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      CE(t, r);
    }));
  }
}
function EE(e, t) {
  const n = t.getAttribute(Wa);
  if (!n) return;
  const r = e.querySelector(`[${Vc}="${Ze(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function CE(e, t) {
  if (!Ce()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(Rn), r = t.getAttribute(Wc), a = t.getAttribute(Kc) ?? (r ? Re(r) : "Resistência");
  if (!n || !r) return;
  const o = LE(e, n), s = vE(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Rp(s, r);
    await ME(c.roll);
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
    SE(t, u), IE(t, u), OE(n, u), await FE(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function SE(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Qc, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function IE(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? ou(t);
  if (r) {
    r.textContent = cu(t);
    return;
  }
  n.append(a);
}
function LE(e, t) {
  const n = X.get(t);
  if (n) return n;
  const r = $n(e);
  return re(r)[t] ?? null;
}
function vE(e, t) {
  const n = e?.resistanceTargetActor;
  if (ee(n)) return n;
  const a = e?.context?.targets.map(jr).find(ee) ?? null;
  if (a) return a;
  const o = t.getAttribute(Yc) ?? e?.resistanceTargetActorId ?? null, s = o ? xE(o) : null;
  return s || NE(
    t.getAttribute(Xc) ?? e?.resistanceTargetName ?? DE(t)
  );
}
function DE(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Zc}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function jr(e) {
  const t = e.actor;
  if (ee(t)) return t;
  const n = e.token, r = gt(n);
  if (r) return r;
  const a = e.document;
  return gt(a);
}
function gt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ee(t)) return t;
  const n = e.document?.actor;
  return ee(n) ? n : null;
}
function xE(e) {
  const n = game.actors?.get?.(e);
  return ee(n) ? n : lu().map((o) => gt(o)).find((o) => o?.id === e) ?? null;
}
function NE(e) {
  const t = Be(e);
  if (!t) return null;
  const n = lu().filter((o) => Be(PE(o)) === t).map((o) => gt(o)).find(ee) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => ee(o) && Be(o.name) === t);
  return ee(a) ? a : null;
}
function lu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function PE(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : gt(e)?.name ?? null;
}
function Be(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function cu(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function ME(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function OE(e, t) {
  const n = X.get(e);
  n && (n.resistanceRollResult = t);
}
async function FE(e, t, n) {
  const r = $n(e);
  if (r)
    try {
      const a = re(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Qe(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function $n(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return ne(r?.get?.(n));
}
async function BE(e, t) {
  if (ru(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(kn);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    uu(e, e.getAttribute(Ha) ?? "✓ Automação aplicada"), UE(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function uu(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Jc), e.removeAttribute(kn), e.removeAttribute(Ha);
}
function UE(e) {
  const t = e.getAttribute(Fr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Fr}="${Ze(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(jc) ?? "✓ Outra opção escolhida";
    uu(a, o);
  }
}
function du(e, t) {
  const n = e.map(Ya).filter(gC), r = n.find(($) => $.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = O(e, "Forma"), o = O(e, "Custo"), s = O(e, "Dados") ?? O(e, `Dados (${r.label})`), l = O(e, "Tipo"), c = O(e, "Resistência"), u = O(e, "Resistência Perícia"), m = O(e, "Resistência Rótulo") ?? (u ? Re(u) : null), g = mu(e, "Observação"), A = e.filter(($) => HE($, r)), k = jE(e), R = zE(t);
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
    details: A,
    castingCheck: k,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function zE(e) {
  const t = qE(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function qE(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && GE(n) !== "nenhum alvo") : [];
}
function GE(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function jE(e) {
  const t = e.map(Ya).find((o) => o?.intent === "casting") ?? null, n = O(e, "Conjuração DT"), r = O(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: O(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: O(e, "Dados (Conjuração)")
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
    intent: VE(n)
  } : null;
}
function VE(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function O(e, t) {
  return mu(e, t)[0] ?? null;
}
function mu(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function HE(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Ya(e) ? !1 : e.trim().length > 0;
}
function WE(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of X.values())
    Vr(r, e, t) && n.set(r.pendingId, r);
  for (const r of ZE(e))
    Vr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Vr(e, t, n) {
  const r = ue(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !es(n, "itemId", e.itemId) ? !1 : !e.actorId || es(n, "actorId", e.actorId);
}
function es(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${AC(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function KE(e) {
  const t = Ze(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function YE(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Vr(e, null, t))
      return t;
  return null;
}
function XE() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of X.entries())
    e - r.createdAt > t && X.delete(n);
}
async function ts(e, t) {
  const n = $n(e);
  if (!n) return !1;
  try {
    const r = re(n);
    return r[t.pendingId] = Za(t, ue(n)), await Qe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Xa(e) {
  const t = hu(e);
  if (!t) return !1;
  try {
    const n = re(t);
    return n[e.pendingId] = Za(e, ue(t)), await Qe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function fu(e) {
  for (const t of Gw)
    globalThis.setTimeout(() => {
      Hr(e);
    }, t);
}
async function Hr(e) {
  const t = hu(e);
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
async function QE(e, t) {
  const n = gu(e.context.message);
  if (n)
    try {
      const r = re(n), a = r[e.pendingId] ?? Za(e, ue(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Qe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function ZE(e) {
  return Object.values(re(ne(e))).filter(Tt);
}
function re(e) {
  if (!e) return {};
  const t = {}, n = Qa(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(pu(e)))
    t[r] ??= a;
  return t;
}
function JE(e) {
  return Object.values(pu(ne(e))).filter(Tt);
}
function pu(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, qc);
  if (!He(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    Tt(a) && (n[r] = a);
  return n;
}
async function Qe(e, t) {
  typeof e.setFlag == "function" && (await tC(e, t), await eC(e, t));
}
async function eC(e, t) {
  await Promise.resolve(e.setFlag?.(d, qc, t));
}
function Qa(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Gc);
  return fC(t) ? t : null;
}
async function tC(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Tt).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? ue(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: nC(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Gc, a));
}
function nC(e) {
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
function gu(e) {
  const t = ne(e);
  if (t?.setFlag)
    return t;
  const n = rC(e);
  if (n?.setFlag)
    return n;
  const r = ue(e);
  if (!r) return null;
  const a = game.messages;
  return ne(a?.get?.(r));
}
function rC(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(ne).find((n) => typeof n?.setFlag == "function") ?? null;
}
function hu(e) {
  const t = gu(e.context.message);
  if (t) return t;
  const n = e.messageId ? aC(e.messageId) : null;
  if (n) return n;
  const r = Au().slice().reverse();
  return r.find((a) => oC(a, e)) ?? r.find((a) => iC(a, e)) ?? null;
}
function aC(e) {
  const t = game.messages;
  return ne(t?.get?.(e));
}
function oC(e, t) {
  const n = ue(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!bu(e, t)) return !1;
  const a = yu(e);
  return !t.actorId || !a || a === t.actorId;
}
function iC(e, t) {
  if (!lC(e, t)) return !1;
  const n = yu(e);
  return t.actorId && n === t.actorId ? !0 : bu(e, t);
}
function bu(e, t) {
  const n = Be(sC(e));
  if (!n) return !1;
  const r = Be(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Be(t.itemId);
  return !!(a && n.includes(a));
}
function sC(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function yu(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function lC(e, t) {
  const n = cC(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= jw;
}
function cC(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function ne(e) {
  return e && typeof e == "object" ? e : null;
}
function Tt(e) {
  return He(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && q(e.messageId) && q(e.itemId) && q(e.actorId) && q(e.itemName) && he(e.resistanceTargetActorId) && he(e.resistanceTargetName) && pC(e.resistanceRollResult) && uC(e.actionPayload) && Yn(e.title) && Yn(e.buttonLabel) && Yn(e.executedLabel) && he(e.choiceGroupId) && he(e.skippedLabel) && he(e.actionSectionId) && he(e.actionSectionTitle) && hC(e.summaryLines) : !1;
}
function uC(e) {
  return e == null ? !0 : He(e) ? e.kind === "resource-operation" && q(e.actorId) && q(e.actorUuid) && typeof e.actorName == "string" && dC(e.resource) && mC(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function dC(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function mC(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function fC(e) {
  return He(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && q(e.messageId) && He(e.source) && q(e.source.actorId) && q(e.source.actorName) && q(e.source.itemId) && q(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Tt) : !1;
}
function pC(e) {
  return e == null ? !0 : He(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && he(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function gC(e) {
  return e !== null;
}
function He(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function q(e) {
  return e === null || typeof e == "string";
}
function Yn(e) {
  return e === void 0 || typeof e == "string";
}
function he(e) {
  return e == null || typeof e == "string";
}
function hC(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function bC(e) {
  return typeof e == "string" && e.length > 0;
}
function Au() {
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
function ue(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function yC(e) {
  return e.trim().toLowerCase();
}
function AC(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Ze(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ns = 1e3;
class _C {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new v$(
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
      settings: or(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = or();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Xr(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && CC(t.item) && n.executionMode === "ask") {
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
    if (await wi(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Zn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = RC(
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
      return this.pendingExecutions.delete(t), await Kn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Kn(
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
    const r = n.prompt.actionPayload, a = LC(r);
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
    return o.ok ? (await Kw(t), await Yw(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Hw(
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
    if (await wi(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Zn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      SC(t.item),
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
          xe(a.workflowContext)
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
      return a.ok ? (EC(n, a.value), await Sl(a.value), {
        ok: !0,
        executedLabel: TC(a.value)
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
    const n = Xn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && Xn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await Kn(
        a,
        rs(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Jn();
    await Ww({
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
      const l = Jn();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Yi({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Xn(s),
        skippedLabel: rs(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: IC(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      xe(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Jn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Yi({
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
      xe(a.value.context)
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
    const n = Date.now(), r = as(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > ns && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= ns;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(as(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = Zn(
      t,
      n,
      r,
      a
    );
  }
}
function TC(e) {
  return Il({ inputAmount: e.totalRawDamage });
}
function RC(e, t) {
  if (t.resistance || !kC(t))
    return t;
  const n = Dc(e);
  return n ? { ...t, resistance: n } : t;
}
function kC(e) {
  return $C(e) && !wC(e);
}
function $C(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function wC(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function Xn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function rs(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function EC(e, t) {
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
function CC(e) {
  return e.type === "ritual";
}
function SC(e) {
  return kR(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function IC(e) {
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
function LC(e) {
  const t = e.actorUuid ? vC(e.actorUuid) : null;
  if (We(t)) return t;
  const n = e.actorId ? DC(e.actorId) : null;
  return n || xC(e.actorName);
}
function vC(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function DC(e) {
  const n = game.actors?.get?.(e);
  if (We(n)) return n;
  for (const r of _u()) {
    const a = Ja(r);
    if (a?.id === e) return a;
  }
  return null;
}
function xC(e) {
  const t = Qn(e);
  if (!t) return null;
  for (const a of _u()) {
    const o = NC(a);
    if (Qn(o) === t) {
      const s = Ja(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => We(a) && Qn(a.name) === t
  );
  return We(r) ? r : null;
}
function _u() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function NC(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ja(e)?.name ?? null;
}
function Ja(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (We(t)) return t;
  const n = e.document?.actor;
  return We(n) ? n : null;
}
function Qn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function We(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Zn(e, t, n, r) {
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
function as(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Jn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class PC {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = yt(t);
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
class MC {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = yt(t).map((l) => this.analyzeRitual(l)), r = n.filter(Nt("upToDate")), a = n.filter(Nt("available")), o = n.filter(Nt("outdated")), s = n.filter(Nt("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = OC(t);
    return n ? r ? r.source.type !== "preset" ? tt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? tt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : tt({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: FC(r, n.preset)
    }) : tt({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : tt({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function tt(e) {
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
function OC(e) {
  const t = e.getFlag(d, "automation");
  return Qr(t) ? t : null;
}
function FC(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Nt(e) {
  return (t) => t.status === e;
}
class BC {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = Jr(t.transaction);
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
    const n = Pt(t.actorName), r = Pt(t.resource), a = Pt(UC(t)), o = Pt(zC(t));
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
function UC(e) {
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
function zC(e) {
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
function Pt(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function qC() {
  const e = new Q_(), t = new HT(e), n = new al(new rl()), r = new ol(new ga()), a = new WT(new Tc()), o = new eT(), s = new gT(o), l = new _T(e), c = new RT(), u = c.registerMany(
    yd()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new TT(), g = new yT(), A = fl(), k = new ll(A), R = new MC(
    c
  ), $ = new PC(
    R,
    m,
    g
  ), b = new QT(), I = new BC(b), _ = new XT(), F = new VT(), D = new GT(
    t,
    s,
    I,
    _
  ), V = new YT(D, _), L = new _C(
    V,
    t,
    s,
    n,
    k,
    b,
    F
  );
  return L.addStrategy(
    new Us(
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
    conditionRegistry: A,
    conditions: k,
    debugOutput: b,
    chatMessages: I,
    workflowHooks: _,
    ritualEvents: F,
    automation: D,
    workflow: V,
    itemUseIntegration: L,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: GC } = foundry.applications.api;
class nn extends GC {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${Z(bs)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${Z(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${er("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${er("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${er("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function er(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${Z(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? jC(n) : HC(t)}
    </section>
  `;
}
function jC(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(VC).join("")}</ol>`;
}
function VC(e) {
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
function HC(e) {
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
const rn = `${d}.manageRitualPresets`, os = `__${d}_ritualPresetHeaderControlRegistered`, WC = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function KC(e) {
  const t = globalThis;
  if (!t[os]) {
    for (const n of WC)
      Hooks.on(n, (r, a) => {
        YC(r, a, e);
      });
    t[os] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function YC(e, t, n) {
  Array.isArray(t) && QC(e) && (XC(e, n), !t.some((r) => r.action === rn) && t.push({
    action: rn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Tu(e, n);
    }
  }));
}
function XC(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[rn] && (e.options.actions[rn] = (n) => {
    n.preventDefault(), n.stopPropagation(), Tu(e, t);
  }));
}
function QC(e) {
  if (!game.user?.isGM) return !1;
  const t = Ru(e);
  return t ? t.type === "agent" && yt(t).length > 0 : !1;
}
function Tu(e, t) {
  const n = Ru(e);
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
function Ru(e) {
  return is(e.actor) ? e.actor : is(e.document) ? e.document : null;
}
function is(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Wr = "data-paranormal-toolkit-stylesheet";
function ZC(e) {
  const t = rS(e), n = JC(t), r = tS(n), a = eS(n, t);
  if (a)
    return a.href = r, a.setAttribute(Wr, t), a;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = r, o.setAttribute(Wr, t), document.head.append(o), o;
}
function JC(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, r = n.getRoute;
  return typeof r == "function" ? r.call(n, t) : t;
}
function eS(e, t) {
  const n = ss(e);
  for (const r of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (r.getAttribute(Wr) === t || ss(r.href) === n)
      return r;
  return null;
}
function tS(e) {
  const t = nS();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function nS() {
  const e = game.modules.get(d), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function ss(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function rS(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function ye(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const r = document.createElement("span");
  return r.textContent = e, n.append(r, t), n;
}
function Kr(e, t, n) {
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
function ku(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const r = document.createElement("i");
  return r.className = t, n.append(r), n;
}
function nt(e, t, n = !1) {
  const r = document.createElement("option");
  return r.value = e, r.textContent = t, r.selected = n, r;
}
function aS(e) {
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
  const g = ku("Remover rolagem", "fa-solid fa-trash");
  g.disabled = !r, g.addEventListener("click", o), l.append(c, g);
  const A = document.createElement("div");
  A.classList.add(`${d}-ability-roll-config__fields`);
  const k = Kr(
    t.label,
    "Ex.: Dano adicional",
    r
  );
  k.addEventListener("input", () => {
    t.label = k.value, a();
  }), A.append(ye("Nome da rolagem", k));
  const R = document.createElement("select");
  R.disabled = !r;
  for (const C of [
    "generic",
    "damage",
    "healing"
  ])
    R.append(
      nt(
        C,
        Cm(C),
        t.intent === C
      )
    );
  R.addEventListener("change", () => {
    t.intent = lS(R.value), kt(), a();
  }), A.append(ye("Tipo da rolagem", R));
  const $ = document.createElement("div");
  $.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), A.append($);
  const b = document.createElement("section");
  b.classList.add(
    `${d}-ability-roll-config__formula-section`
  );
  const I = document.createElement("div");
  I.classList.add(
    `${d}-ability-roll-config__formula-header`
  );
  const _ = document.createElement("strong");
  _.textContent = "Fórmula";
  const F = document.createElement("label");
  F.classList.add(`${d}-ability-roll-config__scaling-toggle`);
  const D = document.createElement("input");
  D.type = "checkbox", D.checked = t.formula.mode === "nex", D.disabled = !r;
  const V = document.createElement("span");
  V.textContent = "Varia conforme o NEX", F.append(D, V), I.append(_, F);
  const L = document.createElement("div");
  return L.classList.add(`${d}-ability-roll-config__formula`), b.append(I, L), D.addEventListener("change", () => {
    t.formula = D.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: iS(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, z(), de(), a();
  }), s.append(l, A, b), z(), kt(), de(), s;
  function z() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function kt() {
    $.replaceChildren();
    const C = t.intent === "damage";
    if (A.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), $.hidden = !C, !C) return;
    const w = document.createElement("select");
    w.disabled = !r, w.append(nt("", "—", !t.damageType));
    for (const { value: S, label: B } of qs)
      w.append(nt(S, B, t.damageType === S));
    w.addEventListener("change", () => {
      t.damageType = w.value || null, a();
    }), $.append(ye("Tipo de dano", w));
  }
  function de() {
    if (L.replaceChildren(), t.formula.mode === "fixed") {
      const H = Kr(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        r
      );
      H.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = H.value, a());
      }), L.append(ye("Expressão", H));
      return;
    }
    const C = t.formula, w = document.createElement("select");
    w.disabled = !r, w.append(
      nt(
        "highest-unlocked",
        "Usar a maior fórmula liberada",
        C.resolution === "highest-unlocked"
      ),
      nt(
        "choose-unlocked",
        "Escolher entre as fórmulas liberadas",
        C.resolution === "choose-unlocked"
      )
    ), w.addEventListener("change", () => {
      C.resolution = cS(w.value), a();
    }), L.append(ye("Comportamento", w));
    const S = document.createElement("div");
    S.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((H, $t) => {
      S.append(
        oS({
          step: H,
          editable: r,
          onChange: a,
          onRemove: () => {
            C.steps.splice($t, 1), de(), a();
          }
        })
      );
    }), L.append(S);
    const B = zt(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    B.disabled = !r || C.steps.length >= ur, B.addEventListener("click", () => {
      C.steps.length >= ur || (C.steps.push({
        minNex: sS(
          C.steps.map((H) => H.minNex)
        ),
        formula: ""
      }), de(), a());
    }), L.append(B);
  }
}
function oS(e) {
  const { step: t, editable: n, onChange: r, onRemove: a } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = uS(Number(s.value)), s.value = String(t.minNex), r();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(s, c);
  const u = Kr(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, r();
  });
  const m = ku("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", a), o.append(
    ye("NEX mínimo", l),
    ye("Fórmula", u),
    m
  ), o;
}
function iS(e) {
  const t = Am(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function sS(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function lS(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function cS(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function uS(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function dS(e) {
  let t = tr(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const r = mS(t), a = document.createElement("p");
  a.classList.add(`${d}-ability-roll-config__hint`), a.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const s = zt(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= cr || (t.rolls.push(js(t.rolls.length + 1)), A(), I("Rolagem adicionada. Salve para confirmar."));
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
  }), A(), n;
  function A() {
    if (o.replaceChildren(), t.rolls.length === 0) {
      const _ = document.createElement("p");
      _.classList.add(`${d}-ability-roll-config__empty`), _.textContent = "Nenhuma rolagem configurada.", o.append(_);
    } else
      t.rolls.forEach((_, F) => {
        o.append(
          aS({
            roll: _,
            index: F,
            editable: e.editable,
            onChange: () => {
              Yr(r, t), I("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(F, 1), A(), I("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    Yr(r, t), b(!1);
  }
  async function k() {
    $(!0), I("Salvando configuração...");
    try {
      const _ = sa(t);
      if (!_) throw new Error("Configuração inválida.");
      t = tr(await e.onSave(_)), A(), I("Configuração salva.");
    } catch (_) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        _
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
      t = tr(await e.onClear()), A(), I("Configuração removida.");
    } catch (_) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        _
      ), I("Não foi possível limpar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade."
      );
    } finally {
      $(!1);
    }
  }
  function $(_) {
    n.classList.toggle(`${d}-ability-roll-config--busy`, _), b(_);
  }
  function b(_) {
    c.disabled = _ || !e.editable, u.disabled = _ || !e.editable, s.disabled = _ || !e.editable || t.rolls.length >= cr;
  }
  function I(_) {
    g.textContent = _;
  }
}
function mS(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const r = document.createElement("strong");
  r.textContent = "Paranormal Toolkit";
  const a = document.createElement("span");
  a.textContent = "Fórmulas de rolagem", n.append(r, a);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), Yr(t, e), t;
}
function Yr(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = Sm(t) ? "Configurada" : "Rascunho");
}
function tr(e) {
  return JSON.parse(JSON.stringify(e));
}
const fS = "[data-paranormal-toolkit-ability-roll-config]", ls = `__${d}_abilityRollConfigBlockRegistered`, pS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function gS() {
  const e = globalThis;
  if (!e[ls]) {
    ZC("styles/ability-roll-config.css");
    for (const t of pS)
      Hooks.on(t, (...n) => {
        hS(n[0], n[1]);
      });
    e[ls] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function hS(e, t) {
  const n = yS(e);
  if (!n || n.type !== "ability") return;
  const r = _S(t);
  if (!r) return;
  const a = r.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!a) return;
  for (const s of Array.from(
    a.querySelectorAll(fS)
  ))
    s.remove();
  const o = dS({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: Tm(n),
    editable: AS(n),
    onSave: async (s) => {
      const l = await Rm(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await km(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), Gs())
  });
  bS(a, o);
}
function bS(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function yS(e) {
  return cs(e.item) ? e.item : cs(e.document) ? e.document : null;
}
function AS(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function _S(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function cs(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const $u = "data-paranormal-toolkit-ritual-roll-config", Rt = "data-paranormal-toolkit-ritual-roll-field", $e = "data-paranormal-toolkit-ritual-roll-action", us = `__${d}_ritualRollConfigBlockRegistered`, TS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], RS = [
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
function kS() {
  const e = globalThis;
  if (!e[us]) {
    $S();
    for (const t of TS)
      Hooks.on(t, (...n) => {
        wS(n[0], n[1]);
      });
    e[us] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function $S() {
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
function wS(e, t) {
  const n = BS(e);
  if (!n || n.type !== "ritual") return;
  const r = qS(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  CS(a);
  const o = Eu(n), s = vc(n), l = US(n), c = SS(n, s, o, l);
  NS(c, n, o, l), ES(a, c), eo(c);
}
function ES(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function CS(e) {
  for (const t of Array.from(e.querySelectorAll(`[${$u}]`)))
    t.remove();
}
function SS(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute($u, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(ds("strong", "Paranormal Toolkit")), s.append(ds("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Su(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(IS(t, r)), u.append(LS(t, r)), u.append(vS(t, r)), a.append(u), a.append(DS(t, n, r)), a.append(xS(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function IS(e, t) {
  const n = En("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Rt, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = RR(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function LS(e, t) {
  const n = En("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Rt, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of RS) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function vS(e, t) {
  const n = En("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Rt, "utilityLabel"), n.append(r), n;
}
function DS(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(nr("base", "Padrão", e.forms.base.formula, !0, n)), o.append(nr("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(nr("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function nr(e, t, n, r, a) {
  const o = En(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(Rt, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function xS(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute($e, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute($e, "clear"), t.append(n, r), t;
}
function En(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function ds(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function NS(e, t, n, r) {
  Je(e, "intent")?.addEventListener("change", () => eo(e)), ps(e, "system.studentForm")?.addEventListener("change", () => ms(e, t)), ps(e, "system.trueForm")?.addEventListener("change", () => ms(e, t)), e.querySelector(`[${$e}="save"]`)?.addEventListener("click", () => {
    r && PS(e, t, n);
  }), e.querySelector(`[${$e}="clear"]`)?.addEventListener("click", () => {
    r && MS(e, t);
  });
}
async function PS(e, t, n) {
  const r = e.querySelector(`[${$e}="save"]`);
  r?.setAttribute("disabled", "true"), Ue(e, "Salvando configuração...");
  try {
    const a = OS(e, n);
    await _R(t, a), wu(e, a), Ue(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Ue(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function MS(e, t) {
  const n = e.querySelector(`[${$e}="clear"]`);
  n?.setAttribute("disabled", "true"), Ue(e, "Limpando configuração...");
  try {
    await TR(t);
    const r = vc(t);
    FS(e, r), wu(e, r), Ue(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Ue(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function wu(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Su(t) ? "Configurada" : "Rascunho");
}
function OS(e, t) {
  return {
    schemaVersion: 1,
    intent: Cu(Je(e, "intent")?.value),
    damageType: gs(e, "damageType"),
    utilityLabel: gs(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: qt(e, "formula.base") },
      discente: { formula: qt(e, "formula.discente") },
      verdadeiro: { formula: qt(e, "formula.verdadeiro") }
    }
  };
}
function FS(e, t) {
  ve(e, "intent", t.intent), ve(e, "damageType", t.damageType ?? ""), ve(e, "utilityLabel", t.utilityLabel ?? "Resultado"), ve(e, "formula.base", t.forms.base.formula), ve(e, "formula.discente", t.forms.discente.formula), ve(e, "formula.verdadeiro", t.forms.verdadeiro.formula), eo(e);
}
function eo(e) {
  const t = Cu(Je(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function ms(e, t) {
  const n = Eu(t);
  fs(e, "discente", n.discente), fs(e, "verdadeiro", n.verdadeiro);
}
function fs(e, t, n) {
  const r = Je(e, `formula.${t}`);
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
function Ue(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Eu(e) {
  const t = zS(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function BS(e) {
  return hs(e.item) ? e.item : hs(e.document) ? e.document : null;
}
function US(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function zS(e) {
  const t = e.system;
  return GS(t) ? t : {};
}
function ps(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Je(e, t) {
  return e.querySelector(`[${Rt}="${jS(t)}"]`);
}
function qt(e, t) {
  return Je(e, t)?.value.trim() ?? "";
}
function gs(e, t) {
  const n = qt(e, t);
  return n.length > 0 ? n : null;
}
function ve(e, t, n) {
  const r = Je(e, t);
  r && (r.value = n);
}
function Cu(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Su(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function qS(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function hs(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function GS(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function jS(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let Q = null;
Hooks.once("init", () => {
  pd(), Hd(), Bf(), F_(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!uo.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${uo.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Q = qC(), Q.itemUseIntegration.registerStrategies(), If(Q.resources, Q.resourceAdapter), Pf(Q.conditions), om(Q), j_(), KC(Q), kS(), gS(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function VS() {
  if (!Q)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Q;
}
export {
  VS as getToolkitServices
};
//# sourceMappingURL=main.js.map
