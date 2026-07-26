const d = "paranormal-toolkit", _s = "Paranormal Toolkit", Du = "ordemparanormal";
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
  const t = Jr(e);
  return t.ok ? y(t.value.definition) : t;
}
function Jr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : ea(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function xu(e) {
  return ea(e.getFlag(d, "automation"));
}
function ea(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Pu(t.source) && Nu(t.definition);
}
function Nu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Mu) && (t.ritualForms === void 0 || qu(t.ritualForms)) && (t.conditionApplications === void 0 || Wu(t.conditionApplications));
}
function Pu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Mu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Ou(t);
    case "spendRitualCost":
      return Fu(t);
    case "rollFormula":
      return Bu(t);
    case "modifyResource":
      return Uu(t);
    case "chatCard":
      return zu(t);
    default:
      return !1;
  }
}
function Ou(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && As(t);
}
function Fu(e) {
  return e.type === "spendRitualCost";
}
function Bu(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || ed(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Uu(e) {
  const t = e;
  return t.type === "modifyResource" && Ts(t.actor) && Zu(t.resource) && Ju(t.operation) && As(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function zu(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function qu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Gu(a)
  );
}
function Gu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || nd(t.extraCost)) && (t.rollFormulaOverrides === void 0 || ad(t.rollFormulaOverrides)) && (t.notes === void 0 || rd(t.notes)) && (t.targeting === void 0 || ju(t.targeting));
}
function ju(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Hu(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Vu(t.template));
}
function Vu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || no(t.distance)) && (t.width === void 0 || t.width === null || no(t.width));
}
function Hu(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Wu(e) {
  return Array.isArray(e) && e.every(Ku);
}
function Ku(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && Ts(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || Xu(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || Yu(t.applyOnResistance));
}
function Yu(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Xu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || td(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Qu(t.expiry));
}
function Qu(e) {
  return e === "turnStart" || e === "turnEnd";
}
function As(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Ts(e) {
  return e === "self" || e === "target";
}
function Zu(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ju(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function ed(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function td(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function nd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function no(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function rd(e) {
  return Array.isArray(e) && e.every(w);
}
function ad(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function ta(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(ro);
    if (sd(t))
      return Array.from(t).filter(ro);
  }
  return [];
}
function od(e) {
  return ta(e)[0] ?? null;
}
function id(e) {
  return ta(e).find(xu) ?? null;
}
function sd(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function ro(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function bt(e) {
  return ta(e).filter((t) => t.type === "ritual");
}
function Rs(e) {
  return bt(e)[0] ?? null;
}
function ld(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(an);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = nt("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Et(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(io);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = nt("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Et(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await or(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = nt("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Et(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await or(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: io(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return ao(e);
    },
    async applyBestPresetsToActorRituals() {
      return ao(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = nt("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Et(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function ao(e) {
  const t = nt("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = bt(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), oo(t);
  const r = oo(t, n.length);
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
    const s = await or(e, a, o.preset);
    r.applied.push(cd(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), ud(r), r;
}
async function or(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function cd(e, t, n) {
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
function oo(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ud(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function io(e) {
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
function Et(e) {
  const t = Rs(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function De(e) {
  return e ? {
    id: e.id,
    source: {
      ...dd(e.sourceActor),
      token: e.sourceToken
    },
    item: md(e.item),
    targets: e.targets.map(fd),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: so(e.rollRequests, ks),
    rolls: so(e.rolls, pd),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(na),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function na(e) {
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
function dd(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function md(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function fd(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function ks(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function pd(e) {
  return {
    ...ks(e),
    total: e.total
  };
}
function so(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function gd(e) {
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
      await Ie(
        e,
        "Gasto de PE",
        fe("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Ie(
        e,
        "Gasto de PD",
        fe("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Ie(
        e,
        "Dano em PV",
        fe("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Ie(
        e,
        "Cura de PV",
        fe("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Ie(
        e,
        "Dano em SAN",
        fe("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Ie(
        e,
        "Recuperação de SAN",
        fe("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Ie(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    hd(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, na(o));
}
function fe(e) {
  const t = gt.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function hd(e) {
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
function bd() {
  $t(J.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), $t(J.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), $t(J.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), $t(J.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function ir() {
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
function $t(e, t) {
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
function yd() {
  return {
    status() {
      return ir();
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
const Es = "ritual.costOnly", $s = "ritual.simpleHealing", _d = "ritual.eletrocussao", Ad = "ritual.definhar", ws = "ritual.simpleDamage", Cs = "generic.simpleHealing", Ss = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, ra = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Td() {
  return [
    Rd(),
    kd(),
    Ed(),
    $d(),
    wd(),
    Cd()
  ];
}
function Rd() {
  return {
    id: Es,
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
function kd() {
  return {
    id: $s,
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
    automation: Is(),
    itemPatch: vd()
  };
}
function Ed() {
  return {
    id: _d,
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
    automation: Id(),
    itemPatch: xd()
  };
}
function $d() {
  return {
    id: Ad,
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
    automation: Ld(),
    itemPatch: Dd()
  };
}
function wd() {
  return {
    id: ws,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: aa()
  };
}
function Cd() {
  return {
    id: Cs,
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
function Is(e = Ss) {
  const t = Sd(e);
  return Ls(
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
function Sd(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Ss,
    ...e
  };
}
function Id() {
  return {
    ...aa("3d6", {
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
function Ld() {
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
function aa(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Ls(
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
function vd() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: ra,
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
function Dd() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: ra,
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
function xd() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: ra,
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
function Ls(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function oa() {
  return Array.from(game.user?.targets ?? []).map(vs);
}
function vs(e) {
  return {
    tokenId: xe(e.id),
    actorId: xe(e.actor?.id),
    sceneId: xe(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Ds() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: xe(e.id),
    actorId: xe(t?.id),
    sceneId: xe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function xe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Nd(e) {
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
        if (!Od(t, n)) {
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
      const r = e.automationRegistry.require(Es);
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
      if (!lo(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require($s);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Is(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = pe("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ge(n);
      if (!r) return;
      if (!lo(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(ws);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: aa(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = pe("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = ge(t);
      n && await Pd(e, t, n);
    }
  };
}
async function Pd(e, t, n) {
  const r = ht(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ds(),
    item: n,
    targets: oa()
  });
  if (!a.ok) {
    Md(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", De(a.value.context));
}
function Md(e) {
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
  const t = Rs(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Od(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function lo(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Fd = ["strict", "open"], xs = "strict";
function Bd(e) {
  return Fd.includes(e) ? e : xs;
}
function Ud(e) {
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
const zd = ["disabled", "ask", "automatic"], qd = ["buttons", "confirm"], Ns = "ask";
function Gd(e) {
  return typeof e == "string" && zd.includes(e);
}
function jd(e) {
  return typeof e == "string" && qd.includes(e);
}
function Vd(e) {
  return Gd(e) ? e : jd(e) ? "ask" : Ns;
}
const Hd = ["keep", "replace"], Wd = ["manual", "assisted"], Ps = "keep", Ms = "assisted", Kd = !0, P = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Yd() {
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
    default: Ns
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
    default: Ps
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
    default: Ms
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
    default: xs
  }), game.settings.register(d, P.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Kd
  }), game.settings.register(d, P.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function sr() {
  const e = Vd(game.settings.get(d, P.executionMode)), t = Bs(game.settings.get(d, P.systemCardMode)), n = Us(game.settings.get(d, P.damageResolutionMode)), r = ia();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Fs()
  };
}
function Os() {
  return Bs(game.settings.get(d, P.systemCardMode));
}
function Xd() {
  return Us(game.settings.get(d, P.damageResolutionMode));
}
function ia() {
  return Bd(game.settings.get(d, P.resistanceGateMode));
}
function Fs() {
  return game.settings.get(d, P.ritualCastingCheckEnabled) === !0;
}
async function he(e) {
  await game.settings.set(d, P.executionMode, e);
}
function Bs(e) {
  return Hd.includes(e) ? e : Ps;
}
function Us(e) {
  return Wd.includes(e) ? e : Ms;
}
function Qd(e) {
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
const Zd = [
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
function Jd(e) {
  return {
    phases() {
      return Zd;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Sn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = id(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await co(e, t, n);
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
      if (!nm(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = tm(n) ?? Sn("Nenhum ator encontrado para executar automação do item.");
      r && await co(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Sn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = od(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Cs);
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
async function co(e, t, n) {
  const r = ht(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ds(),
    item: n,
    targets: oa()
  });
  if (!a.ok) {
    em(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", De(a.value.context));
}
function em(e) {
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
function tm(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function nm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function rm(e) {
  const t = gd(e), n = ld(e), r = Nd(e), a = Jd(e), o = yd(), s = Qd(e);
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
function am(e) {
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
      const r = uo();
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
      return om(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = uo();
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
      return im(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function uo() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function om(e) {
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
function im(e) {
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
function Te(e) {
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
function zs(e) {
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${e.tone ?? "accent"}">${Te(e.label)}</span>`;
}
const sm = '<svg class="paranormal-toolkit-chat-card-header__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7a2 2 0 0 1-2-2V4.5Zm2 0V17a3 3 0 0 0-1 .17M9 8h6M9 11h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function lm(e) {
  const t = e?.src?.trim();
  return t ? `<img class="paranormal-toolkit-chat-card-header__image-content" src="${Te(t)}" alt="${Te(e?.alt ?? "")}">` : sm;
}
function cm(e) {
  const t = e.subtitle ? `<span class="paranormal-toolkit-chat-card-header__subtitle">· ${Te(e.subtitle)}</span>` : "", n = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(zs).join("")}</div>` : "", r = e.context ? `<div class="paranormal-toolkit-chat-card-header__context">${Te(e.context)}</div>` : "";
  return `<header class="paranormal-toolkit-chat-card-header">
  <div class="paranormal-toolkit-chat-card-header__image">${lm(e.image)}</div>
  <div class="paranormal-toolkit-chat-card-header__content">
    <div class="paranormal-toolkit-chat-card-header__heading">
      <div class="paranormal-toolkit-chat-card-header__title-group">
        <span class="paranormal-toolkit-chat-card-header__title">${Te(e.title)}</span>${t}
      </div>${n}
    </div>${r}
  </div>
</header>`;
}
function qs(e) {
  return `<article class="paranormal-toolkit-chat-card-shell">${e.content}</article>`;
}
const mo = {
  casting: "paranormal-toolkit-section-card--casting",
  damage: "paranormal-toolkit-section-card--damage",
  resistance: "paranormal-toolkit-section-card--resistance"
};
function um(e) {
  return mo[e] ?? mo.casting;
}
function dm(e) {
  return `<section class="paranormal-toolkit-section-card ${um(e.tone)}">${e.content}</section>`;
}
function mm(e) {
  const t = e.trailing ? `<div class="paranormal-toolkit-section-header__trailing">${e.trailing}</div>` : "";
  return `<div class="paranormal-toolkit-section-header"><span class="paranormal-toolkit-section-header__title">${Te(e.title)}</span>${t}</div>`;
}
const Gs = "devChatCardExample", fm = "devChatCardHeaderExample";
function In() {
  if (!game.user?.isGM)
    throw new Error("Apenas GMs podem gerenciar exemplos de chat card.");
}
function pm() {
  const e = canvas?.tokens?.controlled?.[0], t = [...game.user?.targets ?? []], n = e?.name || e?.actor?.name || "Mercy", r = t.length > 1 ? `${t.length} alvos` : t[0]?.name || t[0]?.actor?.name || "Nenhum alvo", a = foundry.utils.getProperty(e, "document.texture.src") ?? foundry.utils.getProperty(e, "actor.img");
  return {
    image: typeof a == "string" ? { src: a, alt: `Imagem de ${n}` } : void 0,
    title: n,
    subtitle: "Runtime",
    badges: [{ label: "RUNTIME", tone: "neutral" }],
    context: `${n} → ${r}`
  };
}
function gm(e) {
  return e === "runtime" ? pm() : e === "ability" ? {
    title: "Habilidade Genérica",
    subtitle: "Habilidade",
    badges: [{ label: "HABILIDADE", tone: "wine" }],
    context: "Mercy → Cultista"
  } : {
    title: e === "long-title" ? "Eletrocussão Extraordinariamente Prolongada para Validar a Quebra Natural do Título" : "Eletrocussão",
    subtitle: "Padrão",
    badges: [{ label: "ENERGIA 1" }],
    context: {
      single: "Mercy → Malvadão",
      none: "Mercy → Nenhum alvo",
      multi: "Mercy → 3 alvos",
      "long-title": "Mercy → Malvadão",
      "long-context": "Mercy → Criatura paranormal com um nome excepcionalmente longo para validar a quebra natural do contexto"
    }[e]
  };
}
function hm(e) {
  switch (e) {
    case "casting-title":
      return { tone: "casting", title: "Conjuração" };
    case "casting-badge":
      return {
        tone: "casting",
        title: "Conjuração",
        trailing: zs({ label: "SUCESSO", tone: "neutral" })
      };
    case "damage-text":
      return {
        tone: "damage",
        title: "Dano",
        trailing: '<span class="paranormal-toolkit-section-header__demo-text">Eletricidade</span>'
      };
    case "resistance-button":
      return {
        tone: "resistance",
        title: "Resistência",
        trailing: '<button class="paranormal-toolkit-section-header__demo-button" type="button" aria-label="Botão visual de demonstração">◇</button>'
      };
  }
}
function bm(e) {
  const t = hm(e);
  return qs({
    content: dm({
      tone: t.tone,
      content: mm({
        title: t.title,
        trailing: t.trailing
      })
    })
  });
}
function fo(e, t) {
  return ChatMessage.create({
    content: e,
    flags: { [d]: { [Gs]: t } }
  });
}
function ym() {
  const e = async () => {
    In();
    const n = (game.messages.contents ?? []).filter(
      (r) => typeof r.getFlag?.(d, Gs) == "string" || r.getFlag?.(d, fm) === !0
    );
    await Promise.all(
      n.map(
        (r) => r.delete?.()
      )
    );
  };
  return {
    async postChatCardHeaderExample(t) {
      return In(), fo(
        qs({
          content: cm(gm(t))
        }),
        "header"
      );
    },
    async postSectionCardExample(t) {
      In();
      const n = t === "all" ? [
        "casting-title",
        "casting-badge",
        "damage-text",
        "resistance-button"
      ] : [t];
      return Promise.all(
        n.map(
          (r) => fo(bm(r), "section")
        )
      );
    },
    clearChatCardExamples: e,
    clearChatCardHeaderExamples: e
  };
}
function _m(e) {
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
    conditions: am(e.conditions),
    debug: rm(e),
    dev: ym(),
    hooks: Pt
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const r = game.modules.get(d);
  return r && (r.api = t), t;
}
class po {
  static isSupportedSystem() {
    return game.system.id === Du;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const Ln = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Am(e) {
  if (!wm(e.item)) return null;
  const t = lr(e.actor) ? e.actor : Tm(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: km(e.token) ?? Rm(t),
    targets: oa(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Tm(e) {
  const t = e;
  return lr(t.actor) ? t.actor : lr(e.parent) ? e.parent : null;
}
function Rm(e) {
  const t = Em(e) ?? $m(e);
  return t ? js(t) : null;
}
function km(e) {
  return cr(e) ? js(e) : null;
}
function Em(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return cr(n) ? n : (t.getActiveTokens?.() ?? []).find(cr) ?? null;
}
function $m(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function js(e) {
  const t = e.actor ?? null;
  return {
    tokenId: vn(e.id),
    actorId: vn(t?.id),
    sceneId: vn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function wm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function lr(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function cr(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function vn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Vs {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Ln.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${Ln.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Am(Cm(t));
    if (!n) {
      f.warn(`${Ln.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Cm(e) {
  return e && typeof e == "object" ? e : {};
}
function Gt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function sa() {
  const e = globalThis.game;
  return sn(e) ? e : null;
}
function W(e, t) {
  const n = Sm(e, t);
  return Mt(n);
}
function Sm(e, t) {
  return t.split(".").reduce((n, r) => sn(n) ? n[r] : null, e);
}
function Im(e, t) {
  const n = e.indexOf(":");
  return n < 0 || ut(e.slice(0, n)) !== ut(t) ? null : He(e.slice(n + 1));
}
function Mt(e) {
  return typeof e == "string" ? He(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function sn(e) {
  return !!e && typeof e == "object";
}
function Lm(e) {
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
function ur(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function ce(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Hs(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const jt = "abilityRollConfig", Ws = [
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
], dr = 20, mr = 20, vm = [10, 40, 65, 99];
function Ks() {
  return {
    schemaVersion: 1,
    rolls: [Ys(1)]
  };
}
function Ys(e) {
  return {
    id: xm(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function Dm() {
  return vm.map((e) => ({ minNex: e, formula: "" }));
}
function xm() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function Xs(e) {
  return la(
    e.getFlag(d, jt)
  );
}
function Nm(e) {
  return Xs(e) ?? Ks();
}
async function Pm(e, t) {
  const n = la(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, jt, n), n;
}
async function Mm(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, d, jt)
    );
    return;
  }
  await e.setFlag(d, jt, null);
}
function la(e) {
  if (!Be(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, dr).map((r, a) => qm(r, a, t)).filter((r) => r !== null)
  };
}
function Om(e, t) {
  const n = Xs(t);
  return n ? Fm(n, Bm(e)) : [];
}
function Fm(e, t) {
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
function Bm(e) {
  const t = Be(e.system) ? e.system : {}, n = t.NEX ?? t.nex, r = Be(n) ? n.value : n, a = typeof r == "number" ? r : Number(r);
  return Number.isFinite(a) ? Zs(a) : 0;
}
function Qs(e) {
  return Ws.find((t) => t.value === e)?.label ?? e;
}
function Um(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function zm(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function qm(e, t, n) {
  if (!Be(e)) return null;
  const r = `roll-${t + 1}`, a = Km(Wm(e.id, r), n), o = Vm(e.intent), s = Gm(e.formula);
  return !o || !s ? null : {
    id: a,
    label: cn(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? Ym(e.damageType) : null,
    formula: s
  };
}
function Gm(e) {
  if (!Be(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: cn(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, mr).map(jm).filter((r) => r !== null) : [];
  t.sort((r, a) => r.minNex - a.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const r of t) n.set(r.minNex, r);
  return {
    mode: "nex",
    resolution: Hm(e.resolution),
    steps: [...n.values()]
  };
}
function jm(e) {
  if (!Be(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: Zs(t),
    formula: cn(e.formula)
  } : null;
}
function Vm(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function Hm(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function Wm(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function Km(e, t) {
  let n = e, r = 2;
  for (; t.has(n); )
    n = `${e}-${r}`, r += 1;
  return t.add(n), n;
}
function Zs(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function cn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Ym(e) {
  const t = cn(e);
  return t.length > 0 ? t : null;
}
function Be(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const ca = "data-paranormal-toolkit-ability-roll-id";
function Xm(e) {
  if (!Js(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = se(e.actorUuid), n = se(e.itemUuid), r = se(e.abilityName);
  if (!t) return null;
  const a = e.rolls.map(Qm).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: r || "Habilidade",
    rolls: a,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: Dn(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: Dn(e.resourceBefore),
    resourceAfter: Dn(e.resourceAfter)
  };
}
function Qm(e) {
  if (!Js(e)) return null;
  const t = se(e.id), n = se(e.sourceRollId), r = se(e.label), a = se(e.formula), o = Zm(e.intent);
  if (!t || !n || !r || !a || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: r,
    formula: a,
    intent: o,
    damageType: o === "damage" ? Jm(e.damageType) : null,
    nexThreshold: s
  };
}
function Zm(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function se(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Jm(e) {
  const t = se(e);
  return t.length > 0 ? t : null;
}
function Dn(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function Js(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const go = "paranormalToolkitAbilityRollBound";
let ho = !1;
function ef() {
  if (ho) return;
  ho = !0;
  const e = (t, n) => {
    tf(t, Gt(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function tf(e, t) {
  if (!t) return 0;
  const n = `[${ca}]`, r = df(t, n);
  let a = 0;
  for (const o of r)
    o.dataset[go] !== "true" && (o.dataset[go] = "true", o.addEventListener("click", () => {
      nf(e, o);
    }), a += 1);
  return a;
}
async function nf(e, t) {
  const n = t.getAttribute(ca)?.trim();
  if (!n) return;
  const r = rf(e), a = r?.rolls.find((l) => l.id === n);
  if (!r || !a) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await af(r.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!lf(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const s = of();
  if (!s) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível."
    );
    return;
  }
  bo(t, !0);
  try {
    const l = new s(
      a.formula,
      sf(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: cf(r.abilityName, a)
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
    bo(t, !1);
  }
}
function rf(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : Xm(
    t.getFlag(d, "abilityUse")
  );
}
async function af(e) {
  const t = globalThis;
  if (typeof t.fromUuid == "function")
    try {
      const o = await t.fromUuid(e);
      if (yo(o)) return o;
    } catch (o) {
      f.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${e}.`,
        o
      );
    }
  const n = e.startsWith("Actor.") ? e.slice(6) : e, a = game.actors?.get?.(n);
  return yo(a) ? a : null;
}
function of() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function sf(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function lf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function cf(e, t) {
  const n = [uf(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${xn(e)}</strong>
      <span>${xn(t.label)}</span>
      <small>${xn(n.join(" · "))}</small>
    </div>
  `;
}
function uf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Qs(e.damageType)}` : "Dano";
  }
}
function df(e, t) {
  const n = [];
  return e instanceof HTMLButtonElement && e.matches(t) && n.push(e), "querySelectorAll" in e && n.push(
    ...Array.from(e.querySelectorAll(t))
  ), n;
}
function bo(e, t) {
  e.disabled = t, e.classList.toggle(
    "paranormal-toolkit-ability-card__roll--busy",
    t
  );
  const n = e.querySelector("i");
  n && (n.classList.toggle("fa-dice-d20", !t), n.classList.toggle("fa-spinner", t), n.classList.toggle("fa-spin", t));
}
function yo(e) {
  return !!(e && typeof e == "object" && "system" in e && ("uuid" in e || "id" in e));
}
function xn(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const mf = "paranormal-toolkit-chat-message--full-width-card", _o = ".paranormal-toolkit-ability-card", Ao = "li.chat-message";
let To = !1;
function ff() {
  if (To) return;
  To = !0;
  const e = Hooks, t = (n, r) => {
    Ro(Gt(r));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), Ro(document);
}
function Ro(e) {
  if (!e) return 0;
  const t = ua(e), n = pf(t), r = /* @__PURE__ */ new Set();
  for (const a of n) {
    const o = gf(t, a);
    o?.classList && r.add(o);
  }
  for (const a of r)
    a.classList?.add(mf);
  return r.size;
}
function pf(e) {
  const t = [];
  e.matches?.(_o) && t.push(e);
  const n = e.querySelectorAll?.(_o);
  if (!n) return t;
  for (const r of Array.from(n)) {
    const a = ua(r);
    t.includes(a) || t.push(a);
  }
  return t;
}
function gf(e, t) {
  if (e.matches?.(Ao)) return e;
  const n = t.closest?.(Ao);
  return n ? ua(n) : null;
}
function ua(e) {
  return e && typeof e == "object" ? e : {};
}
function hf(e) {
  const t = bf(e.cost), n = yf(e.currentResource), r = t > 0 && !e.passive, a = n >= t;
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
function bf(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function yf(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: _f } = foundry.applications.api;
class st extends _f {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = hf(t), this.spendResource = this.model.cost.spendResourceChecked;
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
          src="${Af(this.model.header.image)}"
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
function Af(e) {
  return U(e);
}
function Tf(e, t) {
  const n = Cf(t.system), r = Vt(n.activation), a = $f(r), o = kf();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Sf(t),
    activation: r,
    activationLabel: Ef(r),
    description: Vt(n.description),
    chatDescription: Rf(
      n.chatDescription,
      n.description
    ),
    cost: a ? 0 : wf(n.cost),
    resource: o,
    passive: a,
    rolls: Om(e, t)
  };
}
function Rf(e, t) {
  const n = Vt(e);
  return n.trim().length > 0 ? n : Vt(t);
}
function kf() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function Ef(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, r = If()?.(t) ?? t;
  return r === t ? e : r;
}
function $f(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function wf(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function Cf(e) {
  return e && typeof e == "object" ? e : {};
}
function Vt(e) {
  return typeof e == "string" ? e : "";
}
function Sf(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function If() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class Lf {
  async publish(t, n, r) {
    const a = await Mf(n), o = vf({
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
    }, c = Pf(t.message);
    if (Os() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function vf(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, r = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", a = Df(e.rolls), o = Nf(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${fr(e.abilityImage)}" alt="">
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
function Df(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const r = `paranormal-toolkit-ability-card__roll--${n.intent}`, a = xf(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${r}"
          ${ca}="${fr(n.id)}"
          title="${fr(n.formula)}"
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
function xf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Qs(e.damageType)}` : "Dano";
  }
}
function Nf(e) {
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
function Pf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function ie(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function fr(e) {
  return ie(e);
}
async function Mf(e) {
  const t = e.chatDescription || e.description, n = Of();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: Ff(e.actor)
  });
}
function Of() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function Ff(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class Bf {
  constructor(t, n, r = new Lf()) {
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
    if (!Uf(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const r = Tf(n, t.item), a = this.readCurrentResource(r);
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
function Uf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const ko = 1e3;
class zf {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new Bf(t, n), this.strategy = new Vs(
      (r) => this.handleItemUsed(r)
    );
  }
  register() {
    this.strategy.register(), ff(), ef(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (sr().executionMode === "disabled" || !Gf(t.item)) return;
    const n = jf(t);
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
    return n !== void 0 && Date.now() - n < ko;
  }
  pruneRecentExecutions() {
    const t = Date.now() - ko;
    for (const [n, r] of this.recentExecutions)
      r < t && this.recentExecutions.delete(n);
  }
}
function qf(e, t) {
  const n = new zf(e, t);
  return n.register(), n;
}
function Gf(e) {
  if (e.type !== "ability") return !1;
  const t = Jr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function jf(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let Eo = !1, Nn = !1, Pn = !1, Ct = null;
const Vf = 1e3, Hf = 750, Wf = 1e3;
function Kf(e) {
  Eo || (Hooks.on("combatTurnChange", (t) => {
    Xf(e, $o(t));
  }), Hooks.on("deleteCombat", (t) => {
    Qf(e, $o(t));
  }), Eo = !0, Yf(e));
}
function Yf(e) {
  un() && (Nn || (Nn = !0, globalThis.setTimeout(() => {
    Nn = !1, da(e, "ready");
  }, Vf)));
}
function Xf(e, t) {
  un() && t && (Ct && globalThis.clearTimeout(Ct), Ct = globalThis.setTimeout(() => {
    Ct = null, da(e, "combat-turn-change", t);
  }, Hf));
}
function Qf(e, t) {
  un() && t && (Pn || (Pn = !0, globalThis.setTimeout(() => {
    Pn = !1, da(e, "combat-deleted", t);
  }, Wf)));
}
async function da(e, t, n) {
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
function $o(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const el = {
  enabled: "dice.animations.enabled"
};
function Zf() {
  game.settings.register(d, el.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Jf() {
  return {
    enabled: game.settings.get(d, el.enabled) === !0
  };
}
const dn = "chatCard", wo = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, ep = `.${i}__title`, tl = `.${i}__header`, tp = `.${i}__roll-card`, np = `.${i}__roll-meta`, rp = `.${i}__roll-meta-pill`, ma = `.${i}__resistance`, ap = `.${i}__resistance-header`, nl = `.${i}__resistance-description`, mn = `.${i}__resistance-roll-button`, rl = `.${i}__resistance-roll-result`, Co = `${i}__resistance-content`, al = `.${i}__workflow-section`, ol = `.${i}__workflow-roll`, fa = `${i}__workflow-roll--dice-open`, pa = `.${i}__workflow-roll-formula`, ga = `${i}__workflow-roll-formula--toggle`, fn = `.${i}__workflow-dice-tray`, op = `.${i}__roll-detail-toggle`, ip = `.${i}__roll-detail-list`, sp = `.${i}__ritual-element-badge`, lp = `.${i}__ritual-metadata`, cp = "casting-backlash", up = "data-paranormal-toolkit-action-section", dp = "data-paranormal-toolkit-prompt-id", mp = "data-paranormal-toolkit-pending-id", So = "data-paranormal-toolkit-casting-backlash-enhanced", Io = `.${i}`, fp = `.${i}__workflow-section--casting`, pp = `.${i}__workflow-section-header`, gp = `.${i}__workflow-notes`, hp = `[${up}="${cp}"]`, Lo = `${i}__workflow-section-title-row`, bp = `${i}__workflow-section-header--casting-backlash`, il = `${i}__casting-backlash-button`;
function yp(e) {
  for (const t of _p(e))
    Ap(t), $p(t);
}
function _p(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Io) && t.add(e);
  for (const n of e.querySelectorAll(Io))
    t.add(n);
  return Array.from(t);
}
function Ap(e) {
  const t = e.querySelector(hp);
  if (!t) return;
  const n = Tp(t);
  if (!n) return;
  const r = e.querySelector(`${fp} ${pp}`);
  r && (r.classList.add(bp), Rp(r), kp(n), r.append(n), t.remove());
}
function Tp(e) {
  return e.querySelector(
    `button[${mp}], button[${dp}]`
  );
}
function Rp(e) {
  const t = e.querySelector(`:scope > .${Lo}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Lo);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(il) || n.append(a));
  return n;
}
function kp(e) {
  if (e.getAttribute(So) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Ep(t, e.disabled);
  e.classList.add(il), e.setAttribute(So, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Ep(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function $p(e) {
  for (const t of e.querySelectorAll(gp)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function wp(e) {
  for (const t of Array.from(e.querySelectorAll(al)))
    for (const n of Array.from(t.querySelectorAll(`${op}, ${ip}`)))
      n.remove();
}
const Cp = {
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
}, Sp = new Set(
  Object.values(Cp)
), Ip = {
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
function Lp(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = vp(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Ip[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Sp.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function sl(e) {
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
function vp(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class ll {
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
      const g = Dp(m, u);
      if (!g.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const _ = Lp(m.damageType);
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
          xp(g.id, m, _.value)
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
        for (const E of Pp(k.conditions))
          l.add(E);
        const R = Np(k.newPV);
        R !== null && (c = R), s.push({
          id: g.id,
          label: m.label ?? sl(_.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: g.amount,
          finalDamage: vo(k.finalDamage, g.amount),
          blocked: vo(k.blocked, 0),
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
function Dp(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function xp(e, t, n) {
  return {
    id: e,
    label: t.label ?? sl(n),
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
function vo(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Np(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Pp(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class ha {
  async rollResistance(t) {
    const n = await Op(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? ke(t.skill),
      roll: n,
      formula: Bp(n),
      total: Up(n),
      diceBreakdown: zp(n)
    };
  }
  getSkillLabel(t) {
    return ke(t);
  }
}
async function Mp(e, t) {
  return new ha().rollResistance({ actor: e, skill: t });
}
function ke(e) {
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
async function Op(e, t) {
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
  return Fp(r);
}
function Fp(e) {
  return Do(e) ? e : Array.isArray(e) ? e.find(Do) ?? null : null;
}
function Do(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Bp(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Up(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function zp(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(qp);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function qp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class cl {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class ul {
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
function Gp(e, t) {
  const n = Xp(e?.rounds);
  if (!n)
    return xo(null);
  const r = e?.anchor ?? dl(t);
  if (!r)
    return {
      ...xo(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: jp(),
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
function dl(e) {
  const t = Qp();
  if (!t?.id || !ml(t.round)) return null;
  const n = Kp(t), r = Vp(e, n) ?? Wp(t), a = oe(r?.id), o = Jp(r?.initiative), s = Hp(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: Zp()
  };
}
function jp() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function xo(e) {
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
function Vp(e, t) {
  return e?.id ? t.find((n) => Yp(n) === e.id) ?? null : null;
}
function Hp(e, t, n) {
  const r = oe(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return eg(e.turn) ? e.turn : null;
}
function Wp(e) {
  return Ot(e.combatant) ? e.combatant : null;
}
function Kp(e) {
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
function Yp(e) {
  return oe(e.actor?.id) ?? oe(e.actorId) ?? oe(e.token?.actor?.id) ?? oe(e.token?.actorId) ?? oe(e.document?.actor?.id) ?? oe(e.document?.actorId);
}
function Xp(e) {
  return ml(e) ? Math.trunc(e) : null;
}
function Qp() {
  return game.combat ?? null;
}
function Zp() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Ot(e) {
  return !!(e && typeof e == "object");
}
function oe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Jp(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ml(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function eg(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class fl {
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
    if (!ug(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = Gp(t.duration, r), s = tg(a, t, o), c = t.refreshExisting ?? !0 ? dg(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(No(r, a, c.id ?? null, !1, !0, o));
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
      return y(No(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = gl(n, r);
    let o = 0;
    try {
      for (const s of a)
        await Po(n, s) === "deleted" && (o += 1);
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
    const n = pg(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = ba(s);
      a += l.length;
      for (const c of l) {
        if (!ag(c, t)) continue;
        const u = pl(c);
        try {
          await Po(s, c) === "deleted" && (o += 1);
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
function tg(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Eg(),
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
    duration: ng(n.duration),
    start: rg(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function ng(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function rg(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: kg(),
    ...e
  };
}
function No(e, t, n, r, a, o) {
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
function ag(e, t) {
  const n = pl(e);
  if (!n.conditionId || !og(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Rg();
  return n.durationMode === "combatantTurn" || ig(n) ? lg(n, r) : sg(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !K(n.startRound) || !K(n.requestedRounds) || !K(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function og(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && K(e.requestedRounds);
}
function ig(e) {
  return !!(e.combatDurationApplied && K(e.requestedRounds) && K(e.startRound) && (e.startCombatantId || Ht(e.startTurn)));
}
function sg(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function lg(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !K(e.startRound) || !K(e.requestedRounds) || !K(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = cg(t);
  return e.startCombatantId ? r === e.startCombatantId : Ht(e.startTurn) && Ht(t.turn) ? t.turn === e.startTurn : !1;
}
function cg(e) {
  return Ne(e.combatant?.id);
}
function pl(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ft(e, "conditionId"),
    requestedRounds: Mo(e, "requestedRounds") ?? rt(t.value) ?? rt(t.rounds),
    combatDurationApplied: Mn(e, "combatDurationApplied"),
    combatId: Ft(e, "combatId") ?? Ne(n.combat) ?? Ne(t.combat),
    startCombatantId: Ft(e, "startCombatantId") ?? Ne(n.combatant),
    startInitiative: yg(e, "startInitiative") ?? hl(n.initiative),
    startRound: Mo(e, "startRound") ?? rt(n.round) ?? rt(t.startRound),
    startTurn: bg(e, "startTurn") ?? pr(n.turn) ?? pr(t.startTurn),
    expiryEvent: _g(e, "expiryEvent") ?? bl(t.expiry),
    durationMode: Ag(e, "durationMode"),
    deleteOnExpire: Mn(e, "deleteOnExpire"),
    expiresWithCombat: Mn(e, "expiresWithCombat")
  };
}
function ug(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function dg(e, t) {
  return gl(e, t)[0] ?? null;
}
function gl(e, t) {
  return ba(e).filter((n) => hg(n) === t);
}
async function Po(e, t) {
  const n = t.id ?? null, r = n ? mg(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (fg(a)) return "missing";
    throw a;
  }
}
function mg(e, t) {
  return ba(e).find((n) => n.id === t) ?? null;
}
function fg(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function pg() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      St(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    St(e, n);
  });
  for (const n of gg())
    St(e, n.actor), St(e, n.document?.actor);
  return Array.from(e.values());
}
function St(e, t) {
  if (!Tg(t)) return;
  const r = Ne(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function gg() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function ba(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function hg(e) {
  return Ft(e, "conditionId");
}
function Ft(e, t) {
  return Ne(we(e, t));
}
function Mo(e, t) {
  return rt(we(e, t));
}
function bg(e, t) {
  return pr(we(e, t));
}
function yg(e, t) {
  return hl(we(e, t));
}
function _g(e, t) {
  return bl(we(e, t));
}
function Ag(e, t) {
  const n = we(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Mn(e, t) {
  return we(e, t) === !0;
}
function we(e, t) {
  const n = e.getFlag?.(d, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const a = r[d];
  if (!(!a || typeof a != "object"))
    return a[t];
}
function Ne(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function rt(e) {
  return K(e) ? Math.trunc(e) : null;
}
function pr(e) {
  return Ht(e) ? Math.trunc(e) : null;
}
function hl(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function bl(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Tg(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Rg() {
  return game.combat ?? null;
}
function kg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function K(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ht(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Eg() {
  return game.user?.id ?? null;
}
const $g = "icons/svg/downgrade.svg", wg = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function T(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? $g,
    description: wg,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Cg = T({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Sg = T({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Ig = T({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Lg = T({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), vg = T({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Dg = T({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), xg = T({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Ng = T({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Pg = T({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Mg = T({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Og = T({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Fg = T({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Bg = T({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Ug = T({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), zg = T({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), qg = T({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Gg = T({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), jg = T({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Vg = T({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Hg = T({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Wg = T({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Kg = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Yg = T({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Xg = T({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Qg = T({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Zg = T({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Jg = T({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), eh = T({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), th = T({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), nh = T({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), rh = T({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), ah = T({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), oh = T({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), ih = T({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), sh = [
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
  Hg,
  Wg,
  Kg,
  Yg,
  Xg,
  Qg,
  Zg,
  Jg,
  eh,
  th,
  nh,
  rh,
  ah,
  oh,
  ih
];
class lh {
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
    return Array.from(this.definitions.values()).map(Oo);
  }
  get(t) {
    const n = this.lookup.get(Fo(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Oo(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Fo(t);
    r && this.lookup.set(r, n);
  }
}
function yl() {
  return new lh(sh);
}
function Oo(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Fo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Ue(e) {
  return e.applyOnResistance ?? "failure";
}
function _l(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function Al(e, t) {
  const n = Ue(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function Tl(e) {
  const t = Ue(e);
  return t === "failure" || t === "success";
}
function ch(e, t, n, r) {
  const a = e.filter((c) => Al(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => Ue(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const uh = {
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
}, dh = {
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
function mh(e) {
  return kl(e, uh, !1);
}
function fh(e) {
  return kl(e, dh, !e.allowsSuccessfulResistance);
}
function We(e) {
  return e.kind === "waiting-resistance";
}
function Rl(e) {
  return e.kind === "resisted";
}
function kl(e, t, n) {
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
const at = "data-paranormal-toolkit-prompt-id", ph = "data-paranormal-toolkit-resistance-roll-result", gh = "Conjuração DT";
function hh(e) {
  const t = e.querySelector(mn)?.getAttribute(ph), n = dt(t);
  if (n !== null) return n;
  const r = e.querySelector(rl)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return dt(a?.[1] ?? null);
}
function ya(e) {
  const t = El(e), n = Ah(t);
  if (n !== null) return n;
  const r = _h(t);
  return r !== null ? r : Th(e);
}
function bh(e) {
  const t = El(e);
  return t ? {
    actorId: On(t.actorId),
    itemId: On(t.itemId),
    itemName: On(t.itemName)
  } : null;
}
function yh(e) {
  const t = e.getAttribute(at);
  if (!t) return null;
  const n = $l(e), r = wl(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => pn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function ue(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function gr(e) {
  return ue(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function _h(e) {
  const t = kh(e);
  return t.length === 0 ? null : dt(Eh(t, gh));
}
function Ah(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Bo(r, ["system", "ritual", "DT"]) ?? Bo(r, ["system", "ritual", "dt"]);
}
function Th(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return dt(n?.[1] ?? null);
}
function El(e) {
  const t = Rh(e);
  if (!t) return null;
  const n = $l(e), r = wl(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => pn(o) ? o.pendingId === t : !1) ?? null;
}
function Rh(e) {
  return (e.closest(`[${at}]`) ?? e.querySelector(`[${at}]`) ?? e.parentElement?.querySelector(`[${at}]`) ?? null)?.getAttribute(at) ?? null;
}
function $l(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return $h(a) ? a : null;
}
function wl(e) {
  const t = e?.getFlag?.(d, dn);
  return pn(t) ? t : null;
}
function kh(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Eh(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function Bo(e, t) {
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
function $h(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function pn(e) {
  return !!(e && typeof e == "object");
}
function On(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function gn(e) {
  return Cl({
    hasResistance: !!e.querySelector(ma),
    difficulty: ya(e),
    resistanceTotal: hh(e)
  });
}
function wh(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Cl({
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
function Cl(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Ud(e)
  };
}
function Ce() {
  return game.user?.isGM === !0;
}
function Ee() {
  return Ce();
}
function Ch(e) {
  const t = on(e.resistanceGateMode, e.resistanceState), n = Sh(e.resistanceState, e.hasDamage), r = Ih(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = mh({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = fh({
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
function Sh(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Ih(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function _a(e) {
  const t = e.isGM ?? Ee();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Ch({
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
function Lh(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = Dh(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function vh(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Dh(e, t) {
  const n = xh(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of Nh(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function xh(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Nh(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Uo(e, "highest") : n.includes("kl") ? Uo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Uo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const Ph = "data-paranormal-toolkit-resistance-skill", Mh = "data-paranormal-toolkit-resistance-skill-label", Oh = "data-paranormal-toolkit-roll-card-target-names", Fh = "data-paranormal-toolkit-roll-card-resistance", Bh = "data-paranormal-toolkit-roll-card-resistance-skill", Uh = "data-paranormal-toolkit-roll-card-resistance-skill-label", Sl = "pending", Aa = "success", Ta = "failure", Il = "rolled";
function zh(e) {
  const t = Hh(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? jh(e.damageSection) : null, r = zo(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = qh(e.rollCard).map((o, s) => {
    const l = Gh(o, s), c = e.resistanceResults.get(l) ?? null, u = Zh(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, _ = wh({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: rb(u)
    }).state, k = zo(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      _l(_)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: g,
      effect: k,
      assistedActions: _a({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: _,
        damage: n,
        effect: k,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!g,
        effectCanApplyOnSuccessfulResistance: k?.applyOnResistance === "success" || k?.applyOnResistance === "always",
        effectRequiresResolvedResistance: k ? Tl(k) : !1
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
function qh(e) {
  const t = e.getAttribute(Oh), n = t ? nb(t) : [];
  if (n.length > 0) return n;
  const a = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = a.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && Ll(s) !== "nenhum alvo") : [];
}
function Gh(e, t) {
  return `${Ll(e)}:${t}`;
}
function jh(e) {
  const t = Jh(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: tb(e),
    formula: eb(e) ?? "—",
    total: t,
    diceBreakdown: vh(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function zo(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: Vh(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Ue(o)
  } : null;
}
function Vh(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function Hh(e, t) {
  const n = Kh(t), r = Wh(e), a = r.description ?? Yh(n)?.textContent?.trim(), o = Xh(n), s = r.skill ?? o?.getAttribute(Ph) ?? null, l = r.skillLabel ?? o?.getAttribute(Mh) ?? (s ? ke(s) : null);
  return !a && !s ? null : {
    description: a ?? "Resistência do alvo.",
    formula: Qh(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: ya(e)
  };
}
function Wh(e) {
  return {
    description: Fn(e, Fh),
    skill: Fn(e, Bh),
    skillLabel: Fn(e, Uh)
  };
}
function Kh(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function Yh(e) {
  return Ra(e, `.${i}__resistance-description`);
}
function Xh(e) {
  return Ra(e, mn);
}
function Qh(e) {
  return Ra(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Ra(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function Zh(e, t) {
  return e ? t === null ? Il : e.total >= t ? Aa : Ta : Sl;
}
function Jh(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function eb(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function tb(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function nb(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function Fn(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function Ll(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function rb(e) {
  return e === Aa ? "succeeded" : e === Ta ? "failed" : "pending";
}
function vl(e) {
  if (!e) return null;
  const t = e.actorId ? ib(e.actorId) : null, n = t ? ab(t, e.itemId, e.itemName) : null;
  return n || ob(e.itemId, e.itemName);
}
function ab(e, t, n) {
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
function ob(e, t) {
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
function ib(e) {
  const n = game.actors?.get?.(e);
  return sb(n) ? n : null;
}
function sb(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Pe(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Wt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ka(e) {
  const t = Bn(e);
  if (!t) return null;
  const n = lb().filter((o) => Bn(cb(o)) === t).map((o) => Dl(o)).find(lt) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => lt(o) && Bn(o.name) === t);
  return lt(a) ? a : null;
}
function lb() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function cb(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Dl(e)?.name ?? null;
}
function Dl(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (lt(t)) return t;
  const n = e.document?.actor;
  return lt(n) ? n : null;
}
function lt(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Bn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function xl(e) {
  const t = fb();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: ub(e)
  });
}
function ub(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Bt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = db(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Bt(e.conditions.join(", "))}</li>` : "";
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
function db(e) {
  const t = mb(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Bt(a)}</li>`;
}
function mb(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = qo(n?.value);
  return r === null ? null : {
    value: r,
    max: qo(n?.max)
  };
}
function qo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function fb() {
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
async function pb(e) {
  await xl(gb(e));
}
function gb(e) {
  if (hb(e)) return e;
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
function hb(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Nl(e) {
  return e.mode, `✓ ${Pl(e.inputAmount)} PV`;
}
function bb(e) {
  const t = Pl(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Pl(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class yb {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? Ee()) !== !0 ? {
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
class _b {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? Ee()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : on(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Ab {
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
const Tb = `.${i}__actions`, Ea = `.${i}__actions-title`, ze = `.${i}__button`, Rb = "data-paranormal-toolkit-action-section", kb = `${i}__button--executed`, Eb = "data-paranormal-toolkit-executed-label";
function Ml(e) {
  return ue(e.querySelector(Ea)?.textContent);
}
function $b(e, t) {
  const n = e.querySelector(Ea);
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
function Se(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Ol(e) {
  const t = wb(e.difficulty);
  if (t === null) return null;
  const n = Go(e.skillLabel) ?? "Resistência", r = Go(e.description), a = Cb(r, n), o = Sb(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function wb(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function Go(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Cb(e, t) {
  if (!e) return null;
  const n = jo(e), r = jo(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function Sb(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function jo(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const It = "data-paranormal-toolkit-prompt-id", Fl = "multiTargetResistanceResults", Bl = "multiTargetDamageApplications", Ul = "multiTargetEffectApplications";
function Ib(e) {
  const t = /* @__PURE__ */ new Map(), r = hn(e)?.[Fl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    Mb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Lb(e, t) {
  await wa(e, Fl, t.targetId, t);
}
function vb(e) {
  const t = /* @__PURE__ */ new Map(), r = hn(e)?.[Bl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    Ob(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Db(e, t) {
  await wa(
    e,
    Bl,
    t.targetId,
    t
  );
}
function xb(e) {
  const t = /* @__PURE__ */ new Map(), r = hn(e)?.[Ul];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    Bb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Nb(e, t) {
  await wa(
    e,
    Ul,
    t.targetId,
    t
  );
}
function Pb(e) {
  const t = hn(e);
  return t ? {
    actorId: Un(t.actorId),
    itemId: Un(t.itemId),
    itemName: Un(t.itemName)
  } : null;
}
async function wa(e, t, n, r) {
  const a = zl(e);
  if (!a) return;
  const o = ql(e), s = Gl(o);
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
  const t = zl(e);
  if (!t) return null;
  const n = ql(e), r = Gl(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Y(o) ? o.pendingId === t : !1) ?? null;
}
function zl(e) {
  return (e.closest(`[${It}]`) ?? e.querySelector(`[${It}]`) ?? e.parentElement?.querySelector(`[${It}]`) ?? null)?.getAttribute(It) ?? null;
}
function ql(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Ub(a) ? a : null;
}
function Gl(e) {
  const t = e?.getFlag?.(d, dn);
  return Y(t) ? t : null;
}
function Mb(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Ob(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Fb(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Fb(e) {
  return e === "normal" || e === "half";
}
function Bb(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Un(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ub(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Y(e) {
  return !!(e && typeof e == "object");
}
const zb = "data-paranormal-toolkit-resistance-skill", qb = "data-paranormal-toolkit-resistance-skill-label", hr = "data-paranormal-toolkit-multi-target-section", Ca = "data-paranormal-toolkit-multi-target-damage-info", jl = "data-paranormal-toolkit-multi-target-effect-info", Vl = "data-paranormal-toolkit-multi-target-toggle", Hl = "data-paranormal-toolkit-multi-target-details", j = "data-paranormal-toolkit-multi-target-target", Gb = "data-paranormal-toolkit-multi-target-state", br = "data-paranormal-toolkit-multi-target-roll-total", yr = "data-paranormal-toolkit-multi-target-roll-formula", Ut = "data-paranormal-toolkit-multi-target-roll-dice", _r = "data-paranormal-toolkit-multi-target-roll-skill", Ar = "data-paranormal-toolkit-multi-target-roll-skill-label", Tr = "data-paranormal-toolkit-multi-target-roll-target-name", Rr = "data-paranormal-toolkit-multi-target-roll-rolled-at", kr = "data-paranormal-toolkit-multi-target-damage-mode", Er = "data-paranormal-toolkit-multi-target-damage-input-amount", Vo = "data-paranormal-toolkit-multi-target-damage-final-amount", Ho = "data-paranormal-toolkit-multi-target-damage-blocked", $r = "data-paranormal-toolkit-multi-target-damage-target-name", wr = "data-paranormal-toolkit-multi-target-damage-applied-at", Cr = "data-paranormal-toolkit-multi-target-effect-condition-id", Sr = "data-paranormal-toolkit-multi-target-effect-condition-label", Ir = "data-paranormal-toolkit-multi-target-effect-effect-id", Lr = "data-paranormal-toolkit-multi-target-effect-created", vr = "data-paranormal-toolkit-multi-target-effect-refreshed", Dr = "data-paranormal-toolkit-multi-target-effect-target-name", xr = "data-paranormal-toolkit-multi-target-effect-applied-at", jb = new fl(yl()), Vb = new cl(new ll()), Hb = new ul(new ha()), Wb = new Ab(Hb), Kb = new yb(Vb), Yb = new _b(jb), Xb = Sl, Ke = Aa, _t = Ta, Qb = Il;
function Zb(e) {
  const t = Wl(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), sy(e);
  const n = ly(e.rollCard, t), r = cy(e.rollCard, t);
  !n && r && Vy(e.rollCard, r, e.effectSection);
  const a = gy(e.rollCard);
  return Xl(a, t), qy(
    e.rollCard,
    a,
    uy(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && Hy(e.rollCard, r, a), !0;
}
function Wl(e) {
  return zh({
    ...e,
    resistanceResults: ty(e.rollCard),
    damageApplications: ny(e.rollCard),
    effectApplications: ry(e.rollCard),
    resolveTargetConditionApplication: Jb,
    resistanceGateMode: Ia()
  });
}
function Jb(e, t, n) {
  const r = Pb(e), a = vl(r);
  if (!a) return null;
  const o = ht(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = ey(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function ey(e, t, n) {
  const r = ch(
    e,
    n,
    t,
    zn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = zn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => zn(s) === a)) ?? null : null;
}
function ty(e) {
  const t = Ib(e);
  for (const [n, r] of iy(e))
    t.set(n, r);
  return t;
}
function ny(e) {
  const t = vb(e);
  for (const [n, r] of oy(e))
    t.set(n, r);
  return t;
}
function ry(e) {
  const t = xb(e);
  for (const [n, r] of ay(e))
    t.set(n, r);
  return t;
}
function ay(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute(Cr), o = n.getAttribute(Sr), s = n.getAttribute(Ir), l = Yo(n.getAttribute(Lr)), c = Yo(n.getAttribute(vr)), u = n.getAttribute(Dr), m = n.getAttribute(xr);
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
function oy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute(kr), o = ic(n.getAttribute(Er)), s = n.getAttribute($r), l = n.getAttribute(wr);
    !r || !Yy(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function iy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = ic(n.getAttribute(br)), o = n.getAttribute(yr), s = n.getAttribute(_r), l = n.getAttribute(Ar), c = n.getAttribute(Tr), u = n.getAttribute(Rr);
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
function sy(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function ly(e, t) {
  if (!t.damage)
    return Kl(e)?.remove(), null;
  const n = dy(e);
  return my(n, t.damage), py(e, n), n;
}
function cy(e, t) {
  if (!t.effect)
    return oc(e)?.remove(), null;
  const n = Gy(e);
  return jy(n, t.effect), n;
}
function uy(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : yt(e, "Conjuração");
}
function dy(e) {
  const t = Kl(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Ca, "true"), n;
}
function Kl(e) {
  return e.querySelector(`[${Ca}="true"]`);
}
function my(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Yl(t.formula, t.total, t.diceBreakdown));
}
function Yl(e, t, n, r = !1) {
  const a = Lh({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return fy(a, r), a;
}
function fy(e, t) {
  const n = e.querySelector(fn), r = e.querySelector(pa);
  if (!n || !r) return;
  e.classList.toggle(fa, t), n.hidden = !t, r.classList.add(ga), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function py(e, t) {
  const n = yt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function gy(e) {
  const t = e.querySelector(`[${hr}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(hr, "true"), n;
}
function Xl(e, t) {
  const n = hy(e), r = yy(t.resistance), a = [by(t)];
  r && a.push(r), a.push(Ty(t, n)), e.replaceChildren(...a);
}
function hy(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${j}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(j)).filter(Ky)
  );
}
function by(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Ay(e.targets), t.append(n, r), t;
}
function yy(e) {
  const t = Ol({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), _y(n, t), n;
}
function _y(e, t) {
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
function Ay(e) {
  const t = e.length, n = e.filter((l) => l.state === _t).length, r = e.filter((l) => l.state === Ke).length, a = e.filter((l) => l.state === Xb).length, o = e.filter((l) => l.state === Qb).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Ty(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Ry(r, e, t.has(r.id)));
  return n;
}
function Ry(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(j, e.id), r.setAttribute(Gb, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Ql(r, e.resistanceResult), Zl(r, e.damageApplication), Jl(r, e.effectApplication);
  const a = ky(e, t, r), o = Fy(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    Ko(s.target) || Wo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || Ko(s.target) || (s.preventDefault(), Wo(r));
  }), r.append(a, o), r;
}
function Ql(e, t) {
  if (!t) {
    e.removeAttribute(br), e.removeAttribute(yr), e.removeAttribute(Ut), e.removeAttribute(_r), e.removeAttribute(Ar), e.removeAttribute(Tr), e.removeAttribute(Rr);
    return;
  }
  e.setAttribute(br, String(t.total)), e.setAttribute(yr, t.formula), e.setAttribute(_r, t.skill), e.setAttribute(Ar, t.skillLabel), e.setAttribute(Tr, t.targetName), e.setAttribute(Rr, t.rolledAt), t.diceBreakdown ? e.setAttribute(Ut, t.diceBreakdown) : e.removeAttribute(Ut);
}
function Zl(e, t) {
  if (!t) {
    e.removeAttribute(kr), e.removeAttribute(Er), e.removeAttribute(Vo), e.removeAttribute(Ho), e.removeAttribute($r), e.removeAttribute(wr);
    return;
  }
  e.setAttribute(kr, t.mode), e.setAttribute(Er, String(t.inputAmount)), e.removeAttribute(Vo), e.removeAttribute(Ho), e.setAttribute($r, t.targetName), e.setAttribute(wr, t.appliedAt);
}
function Jl(e, t) {
  if (!t) {
    e.removeAttribute(Cr), e.removeAttribute(Sr), e.removeAttribute(Ir), e.removeAttribute(Lr), e.removeAttribute(vr), e.removeAttribute(Dr), e.removeAttribute(xr);
    return;
  }
  e.setAttribute(Cr, t.conditionId), e.setAttribute(Sr, t.conditionLabel), e.setAttribute(Ir, t.effectId ?? ""), e.setAttribute(Lr, String(t.created)), e.setAttribute(vr, String(t.refreshed)), e.setAttribute(Dr, t.targetName), e.setAttribute(xr, t.appliedAt);
}
function ky(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Ey(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = $y(e, t.resistance);
  Iy(l, n, e, t);
  const c = Oy(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), rc(u, [
    ec(e, t, "compact"),
    nc(e, t, "compact")
  ]), r.append(a, u), r;
}
function Ey(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function $y(e, t) {
  if (!Ce())
    return wy(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Sy(e, t)), t?.skill && (n.setAttribute(zb, t.skill), n.setAttribute(qb, t.skillLabel ?? ke(t.skill))), !t?.skill)
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
function wy(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Cy(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ke ? "✓" : e.state === _t ? "✕" : "", n.append(r, a), n;
}
function Cy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Ke ? "sucesso" : e.state === _t ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function Sy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Ke ? "sucesso" : e.state === _t ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Iy(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !Ce() || e.addEventListener("click", (a) => {
    a.stopPropagation(), Ly(t, e, n, r);
  });
}
async function Ly(e, t, n, r) {
  if (!Ce()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? ke(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = ka(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Wb.execute({ actor: l, skill: o, skillLabel: s });
    await Wy(u.roll);
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
    Ql(e, m);
    try {
      await Lb(r.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", g);
    }
    Sa(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Sa(e) {
  const t = e.closest(`[${hr}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Wl({
    rollCard: n,
    damageSection: vy(n) ?? yt(n, "Dano"),
    effectSection: Dy(n)
  });
  r && Xl(t, r);
}
function vy(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Ca) !== "true") ?? null;
}
function Dy(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function xy(e) {
  return We(e.assistedActions.policy.damageActionState);
}
function Ny(e) {
  return We(e.assistedActions.policy.effectActionState);
}
function Ia() {
  try {
    return ia();
  } catch {
    return "strict";
  }
}
function ec(e, t, n) {
  if (e.damageApplication)
    return le(
      "✓",
      Nl({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
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
  const o = tc(a, t.damage);
  if (o === null)
    return le(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = bb({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = le(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = u.closest(`[${j}]`);
    g && Py(g, u, e, t);
  }), u;
}
function tc(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Py(e, t, n, r) {
  if (n.damageApplication) return;
  if (xy(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = tc(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = ka(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await Kb.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Ia(),
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
    Zl(e, m);
    try {
      await Db(r.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await pb(u.value);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", g);
    }
    Sa(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function nc(e, t, n) {
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
  if (Rl(r))
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
    l && My(l, o, e, t);
  }), o;
}
async function My(e, t, n, r) {
  if (n.effectApplication) return;
  if (Ny(n)) {
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
  const o = ka(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await Yb.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Ia(),
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
    Jl(e, c);
    try {
      await Nb(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Sa(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function rc(e, t) {
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
function Oy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Vl, "true"), t.setAttribute("aria-hidden", "true"), ac(e, t), t;
}
function Wo(e) {
  const t = e.querySelector(`[${Hl}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Vl}="true"]`);
  r && ac(e, r);
}
function ac(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function Ko(e) {
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
function Fy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Hl, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = By(e, t.resistance);
  s && r.append(s);
  const l = Uy(e, t.resistance), c = zy(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function By(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Ke ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Uy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Yl(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function zy(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), rc(n, [
    ec(e, t, "full"),
    nc(e, t, "full")
  ]), n;
}
function qy(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Gy(e) {
  const t = oc(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(jl, "true"), n;
}
function oc(e) {
  return e.querySelector(`[${jl}="true"]`);
}
function jy(e, t) {
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
function Vy(e, t, n) {
  const r = n?.parentElement === e ? n : yt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Hy(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function zn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Wy(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Ky(e) {
  return typeof e == "string" && e.length > 0;
}
function Yy(e) {
  return e === "normal" || e === "half";
}
function Yo(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function ic(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Xo = "data-paranormal-toolkit-card-layout-refresh-bound";
function Xy(e) {
  const t = e.rollCard.querySelector(mn);
  t && t.getAttribute(Xo) !== "true" && (t.setAttribute(Xo, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Me = "data-paranormal-toolkit-prompt-id", Qy = "apply-damage", Zy = "data-paranormal-toolkit-multi-target-damage-info";
function Jy(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(Zy) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function e_(e) {
  const t = n_(e);
  return t.find((n) => n.getAttribute(Rb) === Qy) ?? t.find((n) => Ml(n) === "aplicar danos") ?? null;
}
function t_(e) {
  const t = sc(e), n = Qo(t);
  return n || Qo(r_(e));
}
function Qo(e) {
  return e.find((t) => {
    const n = Ml(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function n_(e) {
  const t = sc(e);
  return t.length > 0 ? t : La(e);
}
function sc(e) {
  const t = i_(e);
  return t ? La(e).filter((n) => o_(n, t)) : [];
}
function r_(e) {
  const t = lc(e);
  if (!t) return [];
  const n = a_(e, t);
  return La(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => cc(e, r)).filter((r) => !n || s_(r, n));
}
function La(e) {
  const t = lc(e);
  return t ? Array.from(t.querySelectorAll(Tb)) : [];
}
function lc(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function a_(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && cc(e, n)) ?? null;
}
function o_(e, t) {
  return e.getAttribute(Me) === t ? !0 : Array.from(e.querySelectorAll(`[${Me}]`)).some((n) => n.getAttribute(Me) === t);
}
function i_(e) {
  return e.getAttribute(Me) ?? e.querySelector(`[${Me}]`)?.getAttribute(Me) ?? null;
}
function cc(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function s_(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function l_(e) {
  const t = uc(), n = gn(e.rollCard).state, r = _a({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = We(a), s = Rl(a);
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
function c_(e) {
  const { rollCard: t } = e, n = m_(), r = uc(), a = gn(t).state, o = _a({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = We(s), c = d_(e);
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
      summary: u_(a)
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
function u_(e) {
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
function d_(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function m_() {
  try {
    return Xd();
  } catch {
    return "assisted";
  }
}
function uc() {
  try {
    return ia();
  } catch {
    return "strict";
  }
}
const f_ = "data-paranormal-toolkit-damage-resolution-state", Zo = "data-paranormal-toolkit-damage-icon-enhanced", va = "data-paranormal-toolkit-damage-original-label", p_ = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, dc = "Outra opção escolhida";
function g_(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), $b(t, "Aplicar dano"), h_(e, t);
}
function h_(e, t) {
  const n = Array.from(t.querySelectorAll(ze)), r = ei(n, "normal"), a = ei(n, "half");
  if (!r || !a) {
    b_(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  ti(r, "normal"), ti(a, "half");
  const o = c_({
    rollCard: e,
    normalButtonApplied: Kt(r),
    halfButtonApplied: Kt(a),
    normalButtonSkipped: Nr(r),
    halfButtonSkipped: Nr(a)
  });
  if (!o.canShowApplyDamage) {
    ni(r), ni(a), ri(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), Jo(r, o.normalButton), Jo(a, o.halfButton), ri(t, o.summary.state, o.summary.message);
}
function Jo(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    __(e, t.visible), A_(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function b_(e) {
  for (const t of e)
    Nr(t) && t.remove();
}
function Kt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(dc);
}
function Nr(e) {
  return e.textContent?.includes(dc) ?? !1;
}
function ei(e, t) {
  const n = p_[t];
  return e.find((r) => n.test(y_(r))) ?? null;
}
function y_(e) {
  return [
    e.getAttribute(va),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function ti(e, t) {
  if (e.getAttribute(Zo) === "true") return;
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
  ), e.setAttribute(Zo, "true"), e.setAttribute(va, n), e.setAttribute("aria-label", n), e.replaceChildren(r, Se(n));
}
function ni(e) {
  Kt(e) || e.remove();
}
function __(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function A_(e, t, n, r = "Role resistência") {
  if (!Kt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(Se(r));
      return;
    }
    e.removeAttribute("aria-disabled"), T_(e, n);
  }
}
function T_(e, t) {
  const n = e.getAttribute(va) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(R_(t), Se(n)));
}
function R_(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function ri(e, t, n) {
  e.setAttribute(f_, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(Ea)?.after(a);
}
const mt = "data-paranormal-toolkit-effect-icon-enhanced", qe = "data-paranormal-toolkit-effect-action-compacted", bn = "data-paranormal-toolkit-effect-resistance-gate", Da = "data-paranormal-toolkit-effect-section", xa = "data-paranormal-toolkit-effect-label";
function k_(e) {
  return e.querySelector(`[${Da}="true"]`);
}
function E_(e) {
  const t = w_(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? S_(), r = O_(n, e.sourceActions, t);
  return r && n.setAttribute(xa, r), I_(n, t, r), P_(e.rollCard, n, e.after ?? e.fallbackAfter), M_(e.sourceActions, n), n;
}
function $_(e, t) {
  const n = t.querySelector(ze);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = gc(t, n, r), o = mc(e, n), s = l_({
    rollCard: e,
    effectLabel: a,
    applied: Pa(n, r),
    effectCanApplyOnSuccessfulResistance: o ? Ue(o) === "success" || Ue(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? Tl(o) : !1
  });
  if (s.applied) {
    B_(n);
    return;
  }
  if (!s.visible) {
    U_(n);
    return;
  }
  if (s.waitingForResistance) {
    z_(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    q_(n, s.compactLabel);
    return;
  }
  G_(n), pc(n, s.displayLabel);
}
function w_(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(ze) ?? []), n = Array.from(e.existingSection?.querySelectorAll(ze) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : C_(e.rollCard, r) ?? r[0] ?? null;
}
function C_(e, t) {
  const n = gn(e).state, r = _l(n), a = fc(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = mc(e, o, a);
    if (s && Al(s, r)) return o;
  }
  return null;
}
function mc(e, t, n = fc(e)) {
  const r = Na(t, t.textContent?.trim() ?? ""), a = gr(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => gr(s) === a)) ?? null : null;
}
function fc(e) {
  const t = vl(bh(e));
  if (!t) return [];
  const n = ht(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function S_() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Da, "true"), e;
}
function I_(e, t, n) {
  e.setAttribute(Da, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = L_(e), a = v_(r);
  a.textContent = "Efeito";
  const o = D_(e, r), s = x_(o);
  s.textContent = j_(n ?? gc(e, t, t.textContent?.trim() ?? ""));
  const l = N_(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(ze)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Pa(t, c) && !F_(t, c) && pc(t, n ?? c);
}
function L_(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function v_(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function D_(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function x_(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function N_(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function P_(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function M_(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(ze)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function O_(e, t, n) {
  const r = e.getAttribute(xa);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Na(n, n.textContent?.trim() ?? "");
}
function Na(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && ue(n) !== "efeito aplicado") return n;
  const r = yh(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && ue(a) !== "aplicado" ? a : null;
}
function Pa(e, t) {
  return e.classList.contains(kb) || ue(t).includes("aplicado");
}
function F_(e, t) {
  const n = e.getAttribute(bn);
  if (n === "pending" || n === "resisted") return !0;
  const r = gr(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function pc(e, t) {
  e.getAttribute(qe) === "true" && e.getAttribute(mt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(qe, "true"), e.setAttribute(mt, "true"), e.setAttribute(Eb, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    $a("✦", `${i}__button-icon--effect`),
    Se("Aplicar")
  ));
}
function B_(e) {
  e.getAttribute(qe) === "true" && ue(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(qe, "true"), e.setAttribute(mt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    $a("✓", `${i}__button-icon--effect-applied`),
    Se("Aplicado")
  ));
}
function gc(e, t, n) {
  const r = e.getAttribute(xa) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Na(t, n) ?? n;
}
function U_(e) {
  Pa(e, e.textContent?.trim() ?? "") || e.remove();
}
function z_(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(qe), e.removeAttribute(mt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(bn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Se(t));
}
function q_(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(qe), e.removeAttribute(mt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(bn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    $a("✓", `${i}__button-icon--effect-resisted`),
    Se(t)
  );
}
function G_(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(bn), e.removeAttribute("aria-disabled");
}
function j_(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const V_ = "data-paranormal-toolkit-card-layout-normalized";
function H_(e) {
  const t = W_(e.rollCard), n = K_(t);
  return Xy({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function W_(e) {
  return {
    rollCard: e,
    damageSection: Jy(e),
    resistance: e.querySelector(ma),
    damageActions: e_(e),
    effectActionSource: t_(e),
    effectSection: k_(e)
  };
}
function K_(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(V_, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = yt(t, "Conjuração"), c = Y_({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), g_(t, a));
  const u = E_({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: X_(n, c),
    fallbackAfter: l
  });
  return u && $_(t, u), u;
}
function Y_(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function X_(e, t) {
  return e ?? t;
}
const hc = [0, 80, 180, 400, 900, 1600, 3e3], ai = /* @__PURE__ */ new WeakSet();
function Q_(e) {
  bc(e), Z_(e);
}
function bc(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    yc(t);
}
function Z_(e) {
  if (!ai.has(e)) {
    ai.add(e);
    for (const t of hc)
      globalThis.setTimeout(() => {
        bc(e);
      }, t);
  }
}
function yc(e) {
  const t = H_({
    rollCard: e,
    refreshDelaysMs: hc,
    onRefresh: () => yc(e)
  });
  Zb({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const J_ = "data-paranormal-toolkit-resistance-roll-result-enhanced", oi = "data-paranormal-toolkit-resistance-original-description", eA = "data-paranormal-toolkit-resistance-skill", tA = "data-paranormal-toolkit-resistance-skill-label", nA = `${i}__resistance--without-roll-button`, rA = ["Fortitude", "Reflexos", "Vontade"];
function aA(e) {
  for (const t of Array.from(e.querySelectorAll(ma)))
    oA(t);
  Q_(e);
}
function oA(e) {
  const t = e.querySelector(ap), n = e.querySelector(nl), r = e.querySelector(mn), a = uA(r) ? r : null, o = e.querySelector(rl);
  if (!t && !n && !o && !r) return;
  e.classList.toggle(nA, !a);
  const s = cA(e, r);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!r || !r.contains(o)) && e.append(o), fA(o)), iA(e, r, n), a && (yA(a), a.parentElement !== e && e.append(a));
}
function iA(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = lA(n), o = Ol({
    description: a,
    skillLabel: dA(t, a),
    difficulty: ya(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  sA(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function sA(e, t) {
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
function lA(e) {
  const t = e.getAttribute(oi);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(oi, n), n;
}
function cA(e, t) {
  const n = e.querySelector(`.${Co}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Co), e.insertBefore(r, t?.parentElement === e ? t : e.firstChild), r;
}
function uA(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function dA(e, t) {
  const n = e?.getAttribute(tA) ?? e?.getAttribute(eA) ?? null;
  return n || mA(t);
}
function mA(e) {
  const t = ii(e);
  return rA.find((n) => t.startsWith(ii(n))) ?? null;
}
function ii(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function fA(e) {
  const t = pA(e.textContent ?? "");
  t && (e.setAttribute(J_, "true"), e.replaceChildren(bA(t)));
}
function pA(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = gA(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function gA(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: hA(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function hA(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function bA(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = _A(e);
  return r && t.append(r), t;
}
function yA(e) {
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
function _A(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of AA(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function AA(e, t) {
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
function TA(e) {
  for (const t of Array.from(e.querySelectorAll(tp))) {
    const n = SA(t);
    RA(t), n && (kA(t, n), EA(t, n));
  }
}
function RA(e) {
  for (const t of Array.from(e.querySelectorAll(np)))
    t.remove();
}
function kA(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(tl) ?? null, a = r?.querySelector(ep) ?? null, o = r ?? e, s = o.querySelector(sp);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = VA(t.elementTone), l.textContent = jA(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function EA(e, t) {
  const n = $A(e);
  wA(e, n);
  const r = CA(t);
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
  const o = e.querySelector(al);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function $A(e) {
  return e.closest(`.${i}`)?.querySelector(tl) ?? null;
}
function wA(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(lp)))
      a.remove();
}
function CA(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${ur(e.target)}` : null,
    e.duration ? `Duração: ${ur(e.duration)}` : null,
    e.resistance ? `Resistência: ${Hs(e.resistance)}` : null
  ].filter(ln);
}
function SA(e) {
  const t = IA(e), n = PA(e), a = (t ? NA(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Ma(W(a, "element")), l = te("op.elementChoices", s) ?? li(ye(o, "Elemento")) ?? li(n.damageType), c = s ?? HA(l), u = W(a, "circle") ?? ye(o, "Círculo"), m = FA(a) ?? ye(o, "Alvo"), g = qA(a, "duration", "op.durationChoices") ?? ye(o, "Duração"), _ = MA(e) ?? UA(a) ?? ye(o, "Resistência"), k = OA(o) ?? n.cost, R = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: k,
    target: m,
    duration: g,
    resistance: _
  };
  return GA(R) ? R : null;
}
function IA(e) {
  const t = LA(e);
  if (!t) return null;
  const n = t.getFlag?.(d, dn), r = DA(n);
  if (r.length === 0) return null;
  const a = vA(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function LA(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? sa()?.messages?.get?.(n) ?? null : null;
}
function vA(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${wo}]`))) {
    const a = r.getAttribute(wo)?.trim();
    a && n.add(a);
  }
  return n;
}
function DA(e) {
  if (!sn(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(xA).filter((n) => n !== null) : [];
}
function xA(e) {
  return sn(e) ? {
    pendingId: Mt(e.pendingId),
    actorId: Mt(e.actorId),
    itemId: Mt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Lm) : []
  } : null;
}
function NA(e) {
  if (!e.itemId) return null;
  const t = sa(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function PA(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(rp))) {
    const a = He(r.textContent);
    if (!a) continue;
    const o = Im(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function MA(e) {
  const t = He(e.querySelector(nl)?.textContent);
  return t ? Hs(t) : null;
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
function OA(e) {
  const t = ye(e, "Custo") ?? ye(e, "PE");
  return t || (e.map(He).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function FA(e) {
  const t = W(e, "target");
  if (!t) return null;
  if (t === "area")
    return BA(e) ?? te("op.targetChoices", t) ?? "Área";
  const n = te("op.targetChoices", t) ?? ce(t);
  return [t === "people" || t === "creatures" ? W(e, "targetQtd") : null, n].filter(ln).join(" ");
}
function BA(e) {
  const t = W(e, "area.name"), n = W(e, "area.size"), r = W(e, "area.type"), a = t ? te("op.areaChoices", t) ?? ce(t) : null, o = r ? te("op.areaTypeChoices", r) ?? ce(r) : null;
  return a ? n ? o ? `${a} ${n}m ${ur(o)}` : `${a} ${n}m` : a : null;
}
function UA(e) {
  const t = W(e, "skillResis"), n = W(e, "resistance");
  if (!t || !n) return null;
  const r = te("op.skill", t) ?? ce(t), a = zA(n);
  return [r, a].filter(ln).join(" ");
}
function zA(e) {
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
function qA(e, t, n) {
  const r = W(e, t);
  return r ? te(n, r) ?? ce(r) : null;
}
function GA(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function jA(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function VA(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(ln).join(" ");
}
function Ma(e) {
  const t = ut(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function li(e) {
  const t = Ma(e);
  return t ? te("op.elementChoices", t) ?? ce(t) : e ? ce(e) : null;
}
function HA(e) {
  return Ma(e);
}
function te(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = sa()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const ci = "data-paranormal-toolkit-dice-toggle-enhanced";
function WA(e) {
  for (const t of Array.from(e.querySelectorAll(ol)))
    _c(t);
}
function KA(e) {
  const t = Tc(e.target);
  if (!t) return;
  const n = Oa(t);
  n && (e.preventDefault(), Ac(n, t));
}
function YA(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Tc(e.target);
  if (!t) return;
  const n = Oa(t);
  n && (e.preventDefault(), Ac(n, t));
}
function _c(e) {
  const t = e.querySelector(fn);
  if (!t) return;
  const n = e.querySelector(pa);
  if (n && n.getAttribute(ci) !== "true" && (n.setAttribute(ci, "true"), n.classList.add(ga), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Ac(e, t) {
  const n = e.querySelector(fn);
  if (!n) return;
  const r = !e.classList.contains(fa);
  XA(e, t, n, r);
}
function XA(e, t, n, r) {
  e.classList.toggle(fa, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function Tc(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(pa);
  if (!t) return null;
  const n = Oa(t);
  return n ? (_c(n), t.classList.contains(ga) ? t : null) : null;
}
function Oa(e) {
  const t = e.closest(ol);
  return t && t.querySelector(fn) ? t : null;
}
const di = `${d}-workflow-dice-toggle-styles`;
function QA() {
  if (document.getElementById(di)) return;
  const e = document.createElement("style");
  e.id = di, e.textContent = `
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
const ZA = [0, 100, 500, 1500, 3e3];
let mi = !1, qn = null;
function JA() {
  if (!mi) {
    mi = !0, QA(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ot(Gt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ot(Gt(t));
    }), Hooks.once("ready", () => {
      ot(document), eT();
    }), document.addEventListener("click", KA), document.addEventListener("keydown", YA);
    for (const e of ZA)
      globalThis.setTimeout(() => ot(document), e);
  }
}
function eT() {
  qn || !document.body || (qn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ot(n);
  }), qn.observe(document.body, { childList: !0, subtree: !0 }));
}
function ot(e) {
  e && (wp(e), TA(e), aA(e), WA(e), yp(e));
}
function tT() {
  JA();
}
const nT = "data-paranormal-toolkit-action-section", rT = "ritual-log", aT = ".paranormal-toolkit-item-use-prompt__actions", oT = ".paranormal-toolkit-item-use-prompt__actions-title", iT = [0, 100, 500, 1500];
let fi = !1;
function sT() {
  if (fi) return;
  const e = (t, n) => {
    pi(dT(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), pi(document), fi = !0;
}
function pi(e) {
  for (const t of iT)
    globalThis.setTimeout(() => lT(e), t);
}
function lT(e) {
  cT(e), uT(e);
}
function cT(e) {
  for (const t of e.querySelectorAll(
    `[${nT}="${rT}"]`
  ))
    t.remove();
}
function uT(e) {
  for (const t of e.querySelectorAll(aT)) {
    if (gi(t.querySelector(oT)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => gi(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function dT(e) {
  if (e instanceof HTMLElement || mT(e))
    return e;
  if (fT(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function mT(e) {
  return e instanceof HTMLElement;
}
function fT(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function gi(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const it = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Rc = {
  PV: "system.attributes.hp"
}, Pr = {
  PV: [it.PV, Rc.PV],
  SAN: [it.SAN],
  PE: [it.PE],
  PD: [it.PD]
}, Mr = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class pT {
  getResource(t, n) {
    const r = hi(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = yi(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = yi(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = hi(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function hi(e, t) {
  const n = gT(e.type, t);
  if (n && bi(e, n))
    return y(n);
  const r = Pr[t].find(
    (a) => bi(e, a)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: hT(e, t),
    path: Pr[t].join(" | ")
  });
}
function gT(e, t) {
  return e === "threat" ? Rc[t] ?? null : e === "agent" ? it[t] : null;
}
function bi(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function hT(e, t) {
  const n = e.type ?? "unknown", r = Pr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function yi(e, t, n, r, a) {
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
class bT {
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
      const s = Mr.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = yT(a);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Mr.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function yT(e) {
  if (_i(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (_i(n))
      return n;
  }
  return null;
}
function _i(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const _T = "dice-so-nice";
async function kc(e) {
  if (!AT() || !TT()) return;
  const t = RT();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function AT() {
  try {
    return Jf().enabled;
  } catch {
    return !1;
  }
}
function TT() {
  return game.modules?.get?.(_T)?.active === !0;
}
function RT() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Ai = "occultism";
class Ec {
  getDifficulty(t) {
    return kT(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await $T(t, Ai);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await kc(r);
    const a = ST(r);
    return {
      skill: Ai,
      skillLabel: "Ocultismo",
      roll: r,
      formula: CT(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: IT(r)
    };
  }
}
function kT(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function ET(e) {
  return new Ec().rollCastingCheck(e);
}
async function $T(e, t) {
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
  return wT(r);
}
function wT(e) {
  return Ti(e) ? e : Array.isArray(e) ? e.find(Ti) ?? null : null;
}
function Ti(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function CT(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function ST(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function IT(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(LT);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function LT(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const vT = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class DT {
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
    const r = n.value, a = xT(t.ritual, r);
    return a.ok ? a.value ? y(a.value) : y({
      resource: "PE",
      amount: vT[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function xT(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : NT(n) ? {
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
function NT(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class PT {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return Gn("missing-item-patch");
    if (t.type !== "ritual") return Gn("unsupported-item-type");
    const a = MT(r);
    return Object.keys(a).length === 0 ? Gn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function MT(e) {
  const t = {};
  M(t, "name", e.name), M(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (M(t, "system.circle", n.circle), M(t, "system.element", n.element), M(t, "system.target", n.target), M(t, "system.targetQtd", n.targetQuantity), M(t, "system.execution", n.execution), M(t, "system.range", n.range), M(t, "system.duration", n.duration), M(t, "system.skillResis", n.resistanceSkill), M(t, "system.resistance", n.resistance), M(t, "system.studentForm", n.studentForm), M(t, "system.trueForm", n.trueForm)), t;
}
function M(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Gn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class OT {
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
    return this.getNumber(t, Mr.ritual.dt, 0);
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
class FT {
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
class BT {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = UT(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, jn(t)), y(t)) : n;
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
    return n ? jn(n) : null;
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
    return Array.from(this.presets.values()).map(jn);
  }
  findForItem(t) {
    return this.list().map((n) => zT(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function UT(e) {
  return !Vn(e.id) || !Vn(e.version) || !Vn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function zT(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = qT(a, t);
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
function qT(e, t) {
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
      const n = Ri(t.name), r = e.names.map(Ri).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = GT(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Ri(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function GT(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function jn(e) {
  return structuredClone(e);
}
function Vn(e) {
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
async function jT(e, t, n) {
  if (!ki(e.id) || !ki(e.formula))
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
    await kc(a);
    const l = {
      ...n.rollRequests[e.id] ?? $c(e, t),
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
function $c(e, t) {
  const n = e.intent ?? VT(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function VT(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function ki(e) {
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
function HT(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = WT(t, n, r, a);
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
    const s = KT(t, n, r, a);
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
function WT(e, t, n, r) {
  const a = yn(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: wc(t.id, "damage", r, t.damageInstances.length),
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
function KT(e, t, n, r) {
  const a = yn(e.amountFrom);
  return {
    id: wc(t.id, "healing", r, t.healingInstances.length),
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
function wc(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function YT(e, t, n) {
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
function XT(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Cc("before", e), Ei("before", e), Ei("resolve", e);
}
function QT(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Cc("apply", e);
}
function ZT(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Cc(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = JT(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Ei(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function JT(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function eR(e, t, n) {
  return y(void 0);
}
async function tR(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return nR(e, t);
    case "spendRitualCost":
      return rR(e, t);
  }
}
async function nR(e, t) {
  const { context: n, resources: r } = e, a = Yt(t, n);
  return a.ok ? Sc(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function rR(e, t) {
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
  }), Sc(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Sc(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function aR(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = oR(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function oR(e) {
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
class iR {
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
        return aR({
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
    const a = await tR({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = $c(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await jT(t, r, n);
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Yt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = YT(t, n, a.value);
    XT({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), QT({
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
      HT({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return ZT({
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
    const a = await eR(this.messages);
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
    const l = sR(t, n.intent);
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
function sR(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class lR {
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
class cR {
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
class uR {
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
function Ic(e) {
  return {
    id: dR(),
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
function dR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class mR {
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
    const r = Ic(n);
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
class fR {
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
class pR {
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
    const n = ir();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: gR(),
      flags: {
        ...t.flags,
        [d]: {
          ...hR(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = ir();
    if (!r.enabled)
      return;
    const a = n.notification ?? $i(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = $i(n);
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
function $i(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function gR() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function hR(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const bR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Lc = `${d}-inline-roll-neutralized`, yR = `${d}-inline-roll-notice`, Fa = `data-${d}-inline-roll-neutralized`, wi = `data-${d}-inline-roll-notice`, _R = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ci(e) {
  const t = xR(e.message), n = await AR(e.message), r = TR(t);
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
async function AR(e) {
  const t = LR(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = RR(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await vR(t, n.content), replacementCount: n.replacementCount };
}
function TR(e) {
  const t = e ? DR(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = vc(t);
  return n > 0 && Dc(CR(t)), { replacementCount: n };
}
function RR(e) {
  const t = kR(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = vc(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Dc(n.content), { content: n.innerHTML, replacementCount: a });
}
function kR(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, $R(a.trim()))), replacementCount: t };
}
function vc(e) {
  const t = ER(e);
  for (const n of t)
    n.replaceWith(wR(SR(n)));
  return t.length;
}
function ER(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(bR))
    n.getAttribute(Fa) !== "true" && t.add(n);
  return Array.from(t);
}
function $R(e) {
  return `<span class="${Lc}" ${Fa}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${NR(e)}</span>`;
}
function wR(e) {
  const t = document.createElement("span");
  return t.classList.add(Lc), t.setAttribute(Fa, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Dc(e) {
  if (e.querySelector?.(`[${wi}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(yR), t.setAttribute(wi, "true"), t.textContent = _R, e.append(t);
}
function CR(e) {
  return e.querySelector(".message-content") ?? e;
}
function SR(e) {
  const n = e.getAttribute("data-formula") ?? IR(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function IR(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function LR(e) {
  return e && typeof e == "object" ? e : null;
}
async function vR(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function DR(e) {
  const t = PR(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function xR(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function NR(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function PR(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Qt = "ritualRollConfig", Zt = "ritual-roll", MR = {
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
function xc(e) {
  const t = e.getFlag(d, Qt);
  return Or(t);
}
function Nc(e) {
  return xc(e) ?? _n();
}
async function OR(e, t) {
  const n = Or(t) ?? Or({
    ..._n(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Qt, n), n;
}
async function FR(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Qt));
    return;
  }
  await e.setFlag(d, Qt, null);
}
function Or(e) {
  if (!An(e)) return null;
  const t = KR(e.intent);
  if (!t) return null;
  const n = _n();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Fr(e.damageType),
    utilityLabel: Fr(e.utilityLabel) ?? n.utilityLabel,
    note: Ba(e.note),
    forms: XR(e.forms)
  };
}
function BR(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function UR(e) {
  const t = xc(e), n = Pc(e);
  if (!t)
    return Si(e, n);
  const r = HR(e, t);
  if (!r)
    return Si(e, n);
  const a = zR(t, r), o = [
    { type: "spendRitualCost" },
    a,
    ...qR(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: jR(e, t),
    resistance: n
  };
}
function Si(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: VR(e),
    resistance: t
  } : null;
}
function zR(e, t) {
  const n = {
    type: "rollFormula",
    id: Zt,
    formula: t,
    intent: WR(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function qR(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Zt}.total`,
          ...GR(e.damageType)
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
function GR(e) {
  return e ? { damageType: e } : {};
}
function jR(e, t) {
  const n = {
    base: Hn("Padrão", t.forms.base.formula)
  };
  return Ge(e, "discente") && (n.discente = Hn("Discente", t.forms.discente.formula, 2)), Ge(e, "verdadeiro") && (n.verdadeiro = Hn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function Hn(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [Zt]: t.trim()
    }
  };
}
function VR(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Ge(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Ge(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function HR(e, t) {
  return [
    t.forms.base.formula.trim(),
    Ge(e, "discente") ? t.forms.discente.formula.trim() : "",
    Ge(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((r) => r.length > 0) ?? null;
}
function Pc(e) {
  const t = Mc(e), n = Fr(t.skillResis), r = YR(t.resistance);
  if (!n || !r) return;
  const a = QR(n), o = MR[r];
  return {
    skill: n,
    label: a,
    effect: r,
    summary: `${a} ${o}`
  };
}
function WR(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function KR(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function YR(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function XR(e) {
  const t = _n();
  return An(e) ? {
    base: Wn(e.base),
    discente: Wn(e.discente),
    verdadeiro: Wn(e.verdadeiro)
  } : t.forms;
}
function Wn(e) {
  return An(e) ? { formula: Ba(e.formula) } : { formula: "" };
}
function Ge(e, t) {
  const n = Mc(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return ZR(r);
}
function Mc(e) {
  const t = e.system;
  return An(t) ? t : {};
}
function QR(e) {
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
function ZR(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Ba(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Fr(e) {
  const t = Ba(e);
  return t.length > 0 ? t : null;
}
function An(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function JR(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function ek(e) {
  switch (tk(e)) {
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
      return nk(String(e ?? ""));
  }
}
function tk(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function nk(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function rk() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ak(e) {
  return {
    ...Ua(e),
    type: "ritual.cast.started"
  };
}
function ok(e) {
  return {
    ...Ua(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function ik(e) {
  return {
    ...Ua(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function sk(e) {
  if (e.type === "preset") {
    const t = Re(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: Re(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: Re(e.label),
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
function lk(e, t = {}) {
  const n = kk(e), r = [
    ...$k(t.candidates ?? []),
    ...wk(e)
  ], a = Sk(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = Ek(t) ?? Ik(r) ?? vk(a), s = xk(canvas?.grid?.size), l = ck(o, a, r), c = bk(r), u = hk(l);
  return {
    type: "rectangleRay",
    sceneId: Dk(e, n),
    regionId: Pi(n?.id) ?? Pi(e.id),
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
function ck(e, t, n) {
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
    direction: uk(r, t, n)
  };
}
function uk(e, t, n) {
  const r = dk(n);
  return r !== null ? r : fk(e, t) ?? e.direction;
}
function dk(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = Ii(n, t);
    if (r !== null) return r;
    const a = Tn(n), o = Ii(a, t);
    if (o !== null) return o;
  }
  return null;
}
function Ii(e, t) {
  for (const n of t) {
    const r = mk(G(e, n));
    if (r !== null) return r;
  }
  return null;
}
function mk(e) {
  const t = ft(e);
  if (t === null) return null;
  const n = qa(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function fk(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = vi(Li(e, e.direction), t), r = pk(e, t);
  if (r === null) return null;
  const o = gk([
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
    error: vi(Li(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? qa(o.direction) : null;
}
function pk(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = Mi(o, 0, 1), c = Mi(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : Nk(Math.atan2(c, l));
}
function Li(e, t) {
  const n = Fc(t), r = {
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
function vi(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function gk(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = qa(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function hk(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Fc(e.direction), n = {
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
function bk(e) {
  for (const t of e) {
    const n = Di(t, "ray.start"), r = Di(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Di(e, t) {
  const n = G(e, t), r = ft(G(n, "x")), a = ft(G(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function Ua(e) {
  const t = sk(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: Ak(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: yk(e.context.item, e.form, e.formLabel, t),
    targets: n.map(Tk),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function yk(e, t, n, r) {
  return {
    name: e.name,
    slug: Kn(e, "system.slug") ?? Kn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: Kn(e, "system.element"),
    circle: Rk(e),
    form: _k(t),
    formLabel: n
  };
}
function _k(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function Ak(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function Tk(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function Rk(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : Re(t);
}
function Kn(e, t) {
  return Re(foundry.utils.getProperty(e, t));
}
function Re(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function kk(e) {
  return "document" in e && e.document ? e.document : e;
}
function Ek(e) {
  return Oc(e.shape);
}
function $k(e) {
  return e.filter(za);
}
function wk(e) {
  return [
    e,
    Ck(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(za);
}
function Ck(e) {
  return "object" in e && za(e.object) ? e.object : null;
}
function za(e) {
  return !!(e && typeof e == "object");
}
function Sk(e) {
  for (const t of e) {
    const n = xi(G(Tn(t), "bounds"));
    if (n) return n;
    const r = xi(G(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function xi(e) {
  const t = x(e, "x"), n = x(e, "y"), r = x(e, "width"), a = x(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function x(e, t) {
  return ft(G(e, t));
}
function Ik(e) {
  for (const t of e) {
    const n = Lk(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function Lk(e) {
  if (!e || typeof e != "object") return [];
  const t = Ni(Tn(e));
  return t.length > 0 ? t : Ni(e);
}
function Ni(e) {
  const t = G(e, "shapes");
  return Array.isArray(t) ? t.map(Oc).filter((n) => n !== null) : [];
}
function Oc(e) {
  const t = Tn(e) ?? e, n = G(t, "type");
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
function vk(e) {
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
function Dk(e, t) {
  return Yn(e, "parent.id") ?? Yn(e, "document.parent.id") ?? Yn(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Yn(e, t) {
  return Re(G(e, t));
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
function Pi(e) {
  return Re(e);
}
function ft(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function xk(e) {
  const t = ft(e);
  return t !== null && t > 0 ? t : null;
}
function Fc(e) {
  return e * Math.PI / 180;
}
function Nk(e) {
  return e * 180 / Math.PI;
}
function qa(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Mi(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class Pk {
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
const Mk = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class Ok {
  constructor(t = new Rn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = Fk(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(Mk);
  }
}
function Fk(e, t) {
  const n = [], r = Bk(e), a = Oi(r), o = Oi(e);
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
function Bk(e) {
  return Uk(e) ? e.document ?? null : e;
}
function Uk(e) {
  return "bounds" in e;
}
function Oi(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const zk = 100, qk = 12;
class Gk {
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
      const a = this.foundryAdapter.getGridSize() ?? zk, o = Kk(n), s = await this.foundryAdapter.placeRegion(
        jk(t, this.foundryAdapter.getUserColor(), a),
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
        message: Wk(a)
      };
    }
  }
}
function jk(e, t, n) {
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
    shapes: [Vk(e, n)]
  };
}
function Vk(e, t) {
  const n = Hk(e, t);
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
function Hk(e, t) {
  return {
    length: Fi(e.length, qk, t),
    width: Fi(e.width, 1, t)
  };
}
function Fi(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function Wk(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function Kk(e) {
  const t = (n) => {
    const r = Yk(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function Yk(e) {
  return Xk(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function Xk(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class Qk {
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
    this.applyTargets(Bi(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Bi(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = Zk(t);
    Jk(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Bi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function Zk(e) {
  return Array.from(new Set(e));
}
function Jk(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class eE {
  constructor(t = new Rn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(vs)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(tE(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(nE(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: Br(r.region)
    }));
    for (const r of t) {
      if (!Br(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = aE(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function tE(e) {
  return [
    { source: "document", region: Ae(e.document) },
    { source: "document.object", region: Ae(e.document.object) },
    { source: "preview", region: Ae(e.preview) },
    { source: "preview.document.object", region: Ae(e.preview?.document?.object) }
  ];
}
function nE(e) {
  return [
    { source: "input", region: Ae(e) },
    { source: "input.object", region: rE(e) ? Ae(e.object) : null },
    { source: "input.document.object", region: Bc(e) ? Ae(e.document?.object) : null }
  ];
}
function Ae(e) {
  return Br(e) ? e : null;
}
function Br(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return vt(n.x) && vt(n.y) && vt(n.width) && vt(n.height);
}
function Bc(e) {
  return "document" in e && "bounds" in e;
}
function rE(e) {
  return !Bc(e);
}
function aE(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function vt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class oE {
  async minimizeForPlacement() {
    const t = [];
    for (const n of lE())
      await iE(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await sE(n);
      }
    };
  }
}
async function iE(e) {
  if (Uc(e) || !hE(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function sE(e) {
  if (Uc(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function lE() {
  const e = /* @__PURE__ */ new Set();
  for (const t of cE())
    mE(t) && fE(t) && e.add(t);
  return [...e];
}
function cE() {
  return [
    ...Ui(uE()),
    ...Ui(dE())
  ];
}
function Ui(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function uE() {
  return globalThis.ui?.windows ?? null;
}
function dE() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function mE(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function fE(e) {
  const t = pE(e), n = gE(t);
  return n === "Actor" || n === "Item";
}
function pE(e) {
  return e.document ?? e.object ?? null;
}
function gE(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function hE(e) {
  const t = bE(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function bE(e) {
  const t = e.element;
  if (zi(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (zi(n)) return n;
  }
  return null;
}
function zi(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function Uc(e) {
  return e.minimized === !0;
}
const yE = "Nenhum alvo encontrado na linha.";
class _E {
  constructor(t = new Gk(), n = new eE(), r = new Ok(), a = new Qk(), o = new Pk(), s = new oE()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = TE(r), m = lk(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(yE), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = AE(c);
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
function AE(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function TE(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function RE(e) {
  return {
    header: {
      eyebrow: _s,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: LE(e.ritual)
    },
    forms: e.variantOptions.map((t) => kE(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: wE(e.targetNames, e.variantOptions, e.ritual),
    automation: IE(e.automationStatus ?? "assisted")
  };
}
function kE(e, t) {
  const n = EE(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? $E(t) : "—",
    details: n
  };
}
function EE(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function $E(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function wE(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => CE(a, n))
  };
}
function CE(e, t) {
  const n = e.targeting ?? SE(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function SE(e, t) {
  const n = ht(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function IE(e) {
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
function LE(e) {
  const t = e.system, n = [DE(t?.element), vE(t?.circle)].filter(PE);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function vE(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function DE(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (xE(e)) {
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
      return NE(e);
  }
}
function xE(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function NE(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function PE(e) {
  return typeof e == "string" && e.length > 0;
}
const zc = ["base", "discente", "verdadeiro"];
function Ga(e) {
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
  return typeof e == "string" && zc.includes(e);
}
const { ApplicationV2: ME } = foundry.applications.api;
class ct extends ME {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = RE(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    BE(a, (o) => {
      this.selectedVariant = o, Ur(a, o);
    }), Ur(a, this.selectedVariant), UE(a, (o) => {
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
          ${this.model.forms.map(OE).join("")}
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
          ${this.model.targets.forms.map(FE).join("")}
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
    const n = jE(t), r = zE(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function OE(e) {
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
function FE(e) {
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
function BE(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => qi(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), qi(e, a, t));
    });
  const r = qc(e);
  r && t(r);
}
function qi(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Jt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), qc(e), Ur(e, r.value));
}
function qc(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Jt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Ur(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function UE(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function zE(e, t, n) {
  const r = GE(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = qE(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function qE(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function GE(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Jt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Jt(n) ? n : null;
}
function jE(e) {
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
async function VE(e) {
  return ct.request(e);
}
const ja = {
  label: "Padrão"
}, HE = {
  label: "Discente",
  extraCost: 2
}, WE = {
  label: "Verdadeiro",
  extraCost: 5
};
class KE {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new _E();
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
    const a = this.resolveCostPreview(t), o = q$(n), s = B$(
      n,
      t.item,
      a,
      o
    ), l = await VE({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map(($) => $.name),
      cost: a,
      defaultSpendResource: K$(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = YE(l), u = j$(
      n,
      t.item,
      c.variant,
      o
    ), m = rk(), g = u.label ?? Ga(c.variant), _ = t$(u), k = ($ = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: g,
      targets: $
    }), R = ($, S = t.targets, B = {}) => {
      this.ritualEvents.emitCastFinished(
        ik({
          ...k(S),
          status: $,
          ...B
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      ak(k())
    );
    const E = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if (E.status === "cancelled")
      return R("cancelled", t.targets, { reason: E.reason }), { status: "cancelled" };
    if (E.status === "failed")
      return R("failed", t.targets, {
        reason: E.reason,
        message: E.message
      }), {
        status: "failed",
        reason: E.reason,
        message: E.message
      };
    const b = XE(
      t,
      E.targets
    );
    E.areaSnapshot && this.ritualEvents.emitAreaResolved(
      ok({
        ...k(E.targets),
        area: E.areaSnapshot
      })
    );
    const I = Fs();
    let A = null;
    if (I) {
      const $ = await ZE(
        this.resources,
        b.actor,
        c,
        u,
        a
      );
      if (!$.ok)
        return R("failed", b.targets, {
          reason: $.reason,
          message: $.message
        }), {
          status: "failed",
          reason: $.reason,
          message: $.message
        };
      try {
        const S = await ET(
          b.actor
        );
        A = n$(
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
    const F = QE(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !I
      }
    );
    if (F.steps.length === 0) {
      const $ = G$(
        b,
        c
      ), S = ji(
        n,
        b
      ), B = Gi(
        b.actor,
        A,
        u,
        a
      ), H = Vi(
        n,
        c,
        u,
        a,
        $,
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
        workflowContext: $,
        itemUseContext: b,
        actions: kt,
        summaryLines: H
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: $,
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
    const V = D.value.context, L = l$(
      n,
      b,
      V,
      _
    ), z = ji(
      n,
      b
    ), Rt = Gi(
      b.actor,
      A,
      u,
      a
    ), me = Vi(
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
function YE(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function XE(e, t) {
  return {
    ...e,
    targets: t
  };
}
function QE(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Ha(l) && (!a.includeCostSteps || !s))
      continue;
    const c = JE(l, n);
    c && o.push(c);
  }
  return a.includeCostSteps && s && r && Y$(n.extraCost) && o.push({
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
async function ZE(e, t, n, r, a) {
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
function JE(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = e$(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function e$(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const r = n[t];
  return typeof r == "string" ? r.trim() : "";
}
function t$(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function n$(e, t, n) {
  const a = r$(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function r$(e, t) {
  const n = Ye(e, t);
  return n ? JR(n.amount) : null;
}
function Gi(e, t, n, r) {
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
function ji(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = Va(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = dl(o);
      n.push(
        a$(
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
function a$(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? s$(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: o$(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: i$(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function o$(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function i$(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function s$(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function l$(e, t, n, r = /* @__PURE__ */ new Set()) {
  const a = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || c$(s, r)) continue;
    const l = Yt(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = Va(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (u$(s)) {
        d$(
          o,
          u,
          m$(s, n, l.value)
        );
        continue;
      }
      a.push(p$(s, u, l.value));
    }
  }
  for (const s of o.values())
    a.push(
      ...f$(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: a };
}
function c$(e, t) {
  const n = Gc(e.amountFrom);
  return n !== null && t.has(n);
}
function u$(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function d$(e, t, n) {
  const r = y$(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function m$(e, t, n) {
  const r = Gc(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function f$(e, t, n, r) {
  const a = R$(e), o = a.length > 1 ? $$() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const g = k$(u.amount, s);
        return {
          id: g$(u, s, m),
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
      label: h$(c, s, a.length > 1),
      executedLabel: b$(
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
function p$(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = T$(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: _$(e, r, n),
    executedLabel: A$(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function g$(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function h$(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function b$(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function y$(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Gc(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function _$(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function A$(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function T$(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function R$(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function k$(e, t) {
  const n = e * t.multiplier, r = E$(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function E$(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function $$() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Va(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Vi(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${Ga(t.variant)}`,
    I$(t, n, r),
    ...S$(s),
    ...Object.values(a.rolls).flatMap(L$),
    ...w$(e, o),
    ...v$(e.resistance),
    ...O$(n)
  ];
}
function w$(e, t) {
  return C$(e) ? Va("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function C$(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function S$(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function I$(e, t, n) {
  const r = Ye(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function L$(e) {
  const n = [`${F$(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = D$(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${ek(e.damageType)}`), n;
}
function v$(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function D$(e) {
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
    const s = x$(o);
    s && (M$(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function x$(e) {
  const t = N$(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : P$(e);
}
function N$(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function P$(e) {
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
function M$(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function O$(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function F$(e) {
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
function B$(e, t, n, r) {
  return zc.map((a) => {
    const o = jc(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? Ga(a),
      enabled: s,
      details: o ? U$(o, n) : [],
      finalCostText: o ? z$(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function U$(e, t, n) {
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
function z$(e, t) {
  const n = Ye(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function q$(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Ha);
}
function G$(e, t) {
  return Ic({
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
function j$(e, t, n, r) {
  return jc(e, t, n, r) ?? ja;
}
function jc(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? H$(t, n) ? V$(n) : null : n === "base" ? ja : null);
}
function V$(e) {
  switch (e) {
    case "base":
      return ja;
    case "discente":
      return HE;
    case "verdadeiro":
      return WE;
  }
}
function H$(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return W$(foundry.utils.getProperty(e, n));
}
function W$(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function K$(e) {
  return e.steps.some(Ha);
}
function Ha(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Y$(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Vc = "itemUsePrompts", Hc = "chatCard", kn = "data-paranormal-toolkit-prompt-id", En = "data-paranormal-toolkit-pending-id", Wa = "data-paranormal-toolkit-executed-label", zr = "data-paranormal-toolkit-choice-group", Wc = "data-paranormal-toolkit-skipped-label", en = "data-paranormal-toolkit-action-section", Hi = "data-paranormal-toolkit-detail-key", Wi = "data-paranormal-toolkit-roll-card", Ka = "data-paranormal-toolkit-roll-detail-toggle", Kc = "data-paranormal-toolkit-roll-detail-id", Yc = "data-paranormal-toolkit-resistance-roll-button", Xc = "data-paranormal-toolkit-resistance-skill", Qc = "data-paranormal-toolkit-resistance-skill-label", Zc = "data-paranormal-toolkit-resistance-target-actor-id", Jc = "data-paranormal-toolkit-resistance-target-name", eu = "data-paranormal-toolkit-resistance-roll-result", Ki = "data-paranormal-toolkit-system-card-replaced", X$ = `[${En}]`, Q$ = `[${Ka}]`, Z$ = `[${Yc}]`, qr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, J$ = `${h}__actions`, Yi = `${h}__details`, tu = `${h}__summary`, ew = `${h}__title`, nu = `${h}__button--executed`, Dt = `${h}__roll-card`, tw = "data-paranormal-toolkit-roll-card-target-mode", nw = "data-paranormal-toolkit-roll-card-target-names", rw = "data-paranormal-toolkit-roll-card-resistance", aw = "data-paranormal-toolkit-roll-card-resistance-skill", ow = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let Xi = !1, Gr = null;
const X = /* @__PURE__ */ new Map(), iw = [0, 100, 500, 1500, 3e3], sw = 3e4, lw = [0, 100, 500, 1500, 3e3];
function cw(e) {
  if (Gr = e, Xi) {
    Zi(e);
    return;
  }
  const t = (n, r) => {
    au(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Xi = !0, Zi(e);
}
async function Qi(e) {
  const t = ru(e);
  X.set(e.pendingId, t), await Qa(t) || hu(t), ou(e.pendingId);
}
async function uw(e) {
  const t = ru({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", X.set(e.pendingId, t), await Qa(t) || hu(t), ou(e.pendingId);
}
async function Xn(e, t) {
  const n = X.get(e);
  X.delete(e), n && await pC(n, t);
}
function Ya(e) {
  const t = Ru();
  for (const n of t) {
    const r = re(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function dw(e, t) {
  const n = Ya(e);
  if (!n) return;
  const r = re(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Xe(n.message, r));
}
async function mw(e, t, n) {
  if (!t) return;
  const r = Ya(e);
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
function ru(e) {
  const t = de(e.context.message), n = e.context.targets.find((s) => Wr(s)), r = n ? Wr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Uw(e.context),
    executed: !1
  };
}
function au(e, t, n) {
  fC();
  const r = wn(t);
  if (!r) return;
  const a = uC(e, r);
  a.length > 0 && tn(r);
  for (const o of a)
    jr(r, o);
  uu(r, n), Vr(r), Hr(r);
}
function Zi(e) {
  for (const t of lw)
    globalThis.setTimeout(() => {
      fw(e);
    }, t);
}
function fw(e) {
  for (const t of pw()) {
    const n = $n(t);
    gw(n) && au(n, t, e);
  }
}
function pw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function gw(e) {
  return e ? Za(e) ? !0 : hC(e).length > 0 : !1;
}
function ou(e) {
  const t = X.get(e);
  if (!t) return;
  const n = t.messageId ? dC(t.messageId) : null;
  if (n) {
    rs(n, t), tn(n), jr(n, t), Ji(n), Vr(n), Hr(n);
    return;
  }
  if (t.messageId) {
    Yr(t);
    return;
  }
  const r = mC(t);
  if (r) {
    rs(r, t), tn(r), jr(r, t), Ji(r), Vr(r), Hr(r);
    return;
  }
  Yr(t);
}
function Ji(e) {
  Gr && uu(e, Gr);
}
function tn(e) {
  const t = hw();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = cu(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Ki) === "true") return;
  const r = n.querySelector(`.${qr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Ki, "true");
}
function hw() {
  try {
    return Os() === "replace";
  } catch {
    return !1;
  }
}
function jr(e, t) {
  if (tn(e), e.querySelector(`[${kn}="${Qe(t.pendingId)}"]`)) return;
  const n = yw(e, t);
  Aw(n, t);
  const r = Mw(t);
  if (bw(r)) return;
  Pw(n, r).append(Bw(t));
}
function bw(e) {
  return su(e.id) && !Ee();
}
function iu(e) {
  const n = e.closest(`[${en}]`)?.getAttribute(en) ?? null;
  return su(n) && !Ee();
}
function su(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function yw(e, t) {
  const n = e.querySelector(`.${qr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(qr, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(ew), s.textContent = _w(t);
  const l = document.createElement("span");
  return l.classList.add(tu), l.textContent = t.summary, a.append(o, s, l), r.append(a), qw(e).append(r), r;
}
function _w(e) {
  const t = O(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Aw(e, t) {
  const n = t.summaryLines ?? [], r = pu(n, t);
  if (r) {
    Tw(e, r, t);
    return;
  }
  Ow(e, n);
}
function Tw(e, t, n) {
  if (e.querySelector(`[${Wi}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(
    Dt,
    `${Dt}--${t.intent}`,
    `${Dt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && r.classList.add(`${Dt}--multi-target`), r.setAttribute(Wi, "true"), r.setAttribute(tw, t.targetMode), r.setAttribute(nw, JSON.stringify(t.targetNames)), Lw(r, t), t.castingCheck && es(r, kw(t.castingCheck), n.pendingId, "casting"), Rw(t) && es(r, Ew(t), n.pendingId, "effect"), Iw(r, t), vw(r, t, n), Nw(r, t), e.append(r);
}
function Rw(e) {
  return e.intent !== "casting";
}
function kw(e) {
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
function Ew(e) {
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
function es(e, t, n, r) {
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
  $w(a, t), xw(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function $w(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = ww(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function ww(e, t) {
  const n = Cw(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of Sw(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Cw(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Sw(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ts(e, "highest") : n.includes("kl") ? ts(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ts(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Iw(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(NC);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function Lw(e, t) {
  t.resistance && (e.setAttribute(rw, t.resistance), t.resistanceSkill && e.setAttribute(aw, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(ow, t.resistanceSkillLabel));
}
function vw(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = Dw(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(lu(t.resistanceRollResult)), e.append(r);
}
function Dw(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !Ce())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(kn, t.pendingId), n.setAttribute(Yc, "true"), n.setAttribute(Xc, e.resistanceSkill), n.setAttribute(Qc, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Zc, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Jc, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(eu, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function lu(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = mu(e), t;
}
function xw(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Ka, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Kc, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const g = document.createElement("dd");
    g.textContent = u.value, c.append(m, g);
  }
  e.append(l, c);
}
function Nw(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function Pw(e, t) {
  const n = `[${en}="${Qe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(J$), a.setAttribute(en, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function Mw(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = pu(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Ow(e, t) {
  if (t.length === 0) return;
  const n = Fw(e);
  for (const r of t) {
    const a = PC(r);
    if (n.querySelector(`[${Hi}="${Qe(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Hi, a), n.append(o);
  }
}
function Fw(e) {
  const t = e.querySelector(`.${Yi}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Yi), e.append(n), n;
}
function Bw(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(kn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(nu), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(En, e.pendingId), t.setAttribute(Wa, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(zr, e.choiceGroupId), t.setAttribute(Wc, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Uw(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = zw(e);
  return `${t} → ${n}`;
}
function zw(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function qw(e) {
  return cu(e) ?? e;
}
function cu(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function uu(e, t) {
  const n = wn(e);
  if (!n) return;
  const r = n.querySelectorAll(X$);
  for (const a of r) {
    if (iu(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      nC(a, t);
    }));
  }
}
function Vr(e) {
  const t = wn(e);
  if (!t) return;
  const n = t.querySelectorAll(Q$);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Gw(t, r);
    }));
}
function Hr(e) {
  const t = wn(e);
  if (!t) return;
  const n = t.querySelectorAll(Z$);
  for (const r of n) {
    if (!Ce()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      jw(t, r);
    }));
  }
}
function Gw(e, t) {
  const n = t.getAttribute(Ka);
  if (!n) return;
  const r = e.querySelector(`[${Kc}="${Qe(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function jw(e, t) {
  if (!Ce()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(kn), r = t.getAttribute(Xc), a = t.getAttribute(Qc) ?? (r ? ke(r) : "Resistência");
  if (!n || !r) return;
  const o = Ww(e, n), s = Kw(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Mp(s, r);
    await Jw(c.roll);
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
    Vw(t, u), Hw(t, u), eC(n, u), await tC(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function Vw(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(eu, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Hw(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? lu(t);
  if (r) {
    r.textContent = mu(t);
    return;
  }
  n.append(a);
}
function Ww(e, t) {
  const n = X.get(t);
  if (n) return n;
  const r = $n(e);
  return re(r)[t] ?? null;
}
function Kw(e, t) {
  const n = e?.resistanceTargetActor;
  if (ee(n)) return n;
  const a = e?.context?.targets.map(Wr).find(ee) ?? null;
  if (a) return a;
  const o = t.getAttribute(Zc) ?? e?.resistanceTargetActorId ?? null, s = o ? Xw(o) : null;
  return s || Qw(
    t.getAttribute(Jc) ?? e?.resistanceTargetName ?? Yw(t)
  );
}
function Yw(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${tu}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Wr(e) {
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
function Xw(e) {
  const n = game.actors?.get?.(e);
  return ee(n) ? n : du().map((o) => pt(o)).find((o) => o?.id === e) ?? null;
}
function Qw(e) {
  const t = Oe(e);
  if (!t) return null;
  const n = du().filter((o) => Oe(Zw(o)) === t).map((o) => pt(o)).find(ee) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => ee(o) && Oe(o.name) === t);
  return ee(a) ? a : null;
}
function du() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Zw(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : pt(e)?.name ?? null;
}
function Oe(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function mu(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Jw(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function eC(e, t) {
  const n = X.get(e);
  n && (n.resistanceRollResult = t);
}
async function tC(e, t, n) {
  const r = $n(e);
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
function $n(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return ne(r?.get?.(n));
}
async function nC(e, t) {
  if (iu(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(En);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    fu(e, e.getAttribute(Wa) ?? "✓ Automação aplicada"), rC(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function fu(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(nu), e.removeAttribute(En), e.removeAttribute(Wa);
}
function rC(e) {
  const t = e.getAttribute(zr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${zr}="${Qe(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Wc) ?? "✓ Outra opção escolhida";
    fu(a, o);
  }
}
function pu(e, t) {
  const n = e.map(Xa).filter(DC), r = n.find((E) => E.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = O(e, "Forma"), o = O(e, "Custo"), s = O(e, "Dados") ?? O(e, `Dados (${r.label})`), l = O(e, "Tipo"), c = O(e, "Resistência"), u = O(e, "Resistência Perícia"), m = O(e, "Resistência Rótulo") ?? (u ? ke(u) : null), g = gu(e, "Observação"), _ = e.filter((E) => cC(E, r)), k = sC(e), R = aC(t);
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
function aC(e) {
  const t = oC(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function oC(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && iC(n) !== "nenhum alvo") : [];
}
function iC(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function sC(e) {
  const t = e.map(Xa).find((o) => o?.intent === "casting") ?? null, n = O(e, "Conjuração DT"), r = O(e, "Conjuração Resultado");
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
function Xa(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: lC(n)
  } : null;
}
function lC(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function O(e, t) {
  return gu(e, t)[0] ?? null;
}
function gu(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function cC(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Xa(e) ? !1 : e.trim().length > 0;
}
function uC(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of X.values())
    Kr(r, e, t) && n.set(r.pendingId, r);
  for (const r of gC(e))
    Kr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Kr(e, t, n) {
  const r = de(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !ns(n, "itemId", e.itemId) ? !1 : !e.actorId || ns(n, "actorId", e.actorId);
}
function ns(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${MC(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function dC(e) {
  const t = Qe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function mC(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Kr(e, null, t))
      return t;
  return null;
}
function fC() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of X.entries())
    e - r.createdAt > t && X.delete(n);
}
async function rs(e, t) {
  const n = $n(e);
  if (!n) return !1;
  try {
    const r = re(n);
    return r[t.pendingId] = Ja(t, de(n)), await Xe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Qa(e) {
  const t = _u(e);
  if (!t) return !1;
  try {
    const n = re(t);
    return n[e.pendingId] = Ja(e, de(t)), await Xe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function hu(e) {
  for (const t of iw)
    globalThis.setTimeout(() => {
      Yr(e);
    }, t);
}
async function Yr(e) {
  const t = _u(e);
  if (Za(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await Qa(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function pC(e, t) {
  const n = yu(e.context.message);
  if (n)
    try {
      const r = re(n), a = r[e.pendingId] ?? Ja(e, de(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Xe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function gC(e) {
  return Object.values(re(ne(e))).filter(At);
}
function re(e) {
  if (!e) return {};
  const t = {}, n = Za(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(bu(e)))
    t[r] ??= a;
  return t;
}
function hC(e) {
  return Object.values(bu(ne(e))).filter(At);
}
function bu(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Vc);
  if (!je(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    At(a) && (n[r] = a);
  return n;
}
async function Xe(e, t) {
  typeof e.setFlag == "function" && (await yC(e, t), await bC(e, t));
}
async function bC(e, t) {
  await Promise.resolve(e.setFlag?.(d, Vc, t));
}
function Za(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Hc);
  return LC(t) ? t : null;
}
async function yC(e, t) {
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
      actorName: _C(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Hc, a));
}
function _C(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Ja(e, t) {
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
function yu(e) {
  const t = ne(e);
  if (t?.setFlag)
    return t;
  const n = AC(e);
  if (n?.setFlag)
    return n;
  const r = de(e);
  if (!r) return null;
  const a = game.messages;
  return ne(a?.get?.(r));
}
function AC(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(ne).find((n) => typeof n?.setFlag == "function") ?? null;
}
function _u(e) {
  const t = yu(e.context.message);
  if (t) return t;
  const n = e.messageId ? TC(e.messageId) : null;
  if (n) return n;
  const r = Ru().slice().reverse();
  return r.find((a) => RC(a, e)) ?? r.find((a) => kC(a, e)) ?? null;
}
function TC(e) {
  const t = game.messages;
  return ne(t?.get?.(e));
}
function RC(e, t) {
  const n = de(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Au(e, t)) return !1;
  const a = Tu(e);
  return !t.actorId || !a || a === t.actorId;
}
function kC(e, t) {
  if (!$C(e, t)) return !1;
  const n = Tu(e);
  return t.actorId && n === t.actorId ? !0 : Au(e, t);
}
function Au(e, t) {
  const n = Oe(EC(e));
  if (!n) return !1;
  const r = Oe(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Oe(t.itemId);
  return !!(a && n.includes(a));
}
function EC(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Tu(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function $C(e, t) {
  const n = wC(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= sw;
}
function wC(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function ne(e) {
  return e && typeof e == "object" ? e : null;
}
function At(e) {
  return je(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && q(e.messageId) && q(e.itemId) && q(e.actorId) && q(e.itemName) && be(e.resistanceTargetActorId) && be(e.resistanceTargetName) && vC(e.resistanceRollResult) && CC(e.actionPayload) && Qn(e.title) && Qn(e.buttonLabel) && Qn(e.executedLabel) && be(e.choiceGroupId) && be(e.skippedLabel) && be(e.actionSectionId) && be(e.actionSectionTitle) && xC(e.summaryLines) : !1;
}
function CC(e) {
  return e == null ? !0 : je(e) ? e.kind === "resource-operation" && q(e.actorId) && q(e.actorUuid) && typeof e.actorName == "string" && SC(e.resource) && IC(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function SC(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function IC(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function LC(e) {
  return je(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && q(e.messageId) && je(e.source) && q(e.source.actorId) && q(e.source.actorName) && q(e.source.itemId) && q(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(At) : !1;
}
function vC(e) {
  return e == null ? !0 : je(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && be(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function DC(e) {
  return e !== null;
}
function je(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function q(e) {
  return e === null || typeof e == "string";
}
function Qn(e) {
  return e === void 0 || typeof e == "string";
}
function be(e) {
  return e == null || typeof e == "string";
}
function xC(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function NC(e) {
  return typeof e == "string" && e.length > 0;
}
function Ru() {
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
function PC(e) {
  return e.trim().toLowerCase();
}
function MC(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Qe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const as = 1e3;
class OC {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new KE(
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
      settings: sr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = sr();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Jr(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && jC(t.item) && n.executionMode === "ask") {
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
    if (await Ci(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: er(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = BC(
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
      return this.pendingExecutions.delete(t), await Xn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Xn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Ya(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = WC(r);
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
    return o.ok ? (await dw(t), await mw(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (cw(
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
    if (await Ci(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: er(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      VC(t.item),
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
      if (!Ee())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (GC(n, a.value), await xl(a.value), {
        ok: !0,
        executedLabel: FC(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!Ee())
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
    const n = Zn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && Zn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await Xn(
        a,
        os(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = tr();
    await uw({
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
      const l = tr();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Qi({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Zn(s),
        skippedLabel: os(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: HC(s)
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
    const r = tr();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Qi({
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
    const n = Date.now(), r = is(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > as && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= as;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(is(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = er(
      t,
      n,
      r,
      a
    );
  }
}
function FC(e) {
  return Nl({ inputAmount: e.totalRawDamage });
}
function BC(e, t) {
  if (t.resistance || !UC(t))
    return t;
  const n = Pc(e);
  return n ? { ...t, resistance: n } : t;
}
function UC(e) {
  return zC(e) && !qC(e);
}
function zC(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function qC(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function Zn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function os(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function GC(e, t) {
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
function jC(e) {
  return e.type === "ritual";
}
function VC(e) {
  return UR(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function HC(e) {
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
function WC(e) {
  const t = e.actorUuid ? KC(e.actorUuid) : null;
  if (Ve(t)) return t;
  const n = e.actorId ? YC(e.actorId) : null;
  return n || XC(e.actorName);
}
function KC(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function YC(e) {
  const n = game.actors?.get?.(e);
  if (Ve(n)) return n;
  for (const r of ku()) {
    const a = eo(r);
    if (a?.id === e) return a;
  }
  return null;
}
function XC(e) {
  const t = Jn(e);
  if (!t) return null;
  for (const a of ku()) {
    const o = QC(a);
    if (Jn(o) === t) {
      const s = eo(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Ve(a) && Jn(a.name) === t
  );
  return Ve(r) ? r : null;
}
function ku() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function QC(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : eo(e)?.name ?? null;
}
function eo(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ve(t)) return t;
  const n = e.document?.actor;
  return Ve(n) ? n : null;
}
function Jn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ve(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function er(e, t, n, r) {
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
function is(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function tr() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class ZC {
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
class JC {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = bt(t).map((l) => this.analyzeRitual(l)), r = n.filter(xt("upToDate")), a = n.filter(xt("available")), o = n.filter(xt("outdated")), s = n.filter(xt("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = eS(t);
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
      reason: tS(r, n.preset)
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
function eS(e) {
  const t = e.getFlag(d, "automation");
  return ea(t) ? t : null;
}
function tS(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function xt(e) {
  return (t) => t.status === e;
}
class nS {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = na(t.transaction);
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
    const n = Nt(t.actorName), r = Nt(t.resource), a = Nt(rS(t)), o = Nt(aS(t));
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
function rS(e) {
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
function aS(e) {
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
function Nt(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function oS() {
  const e = new pT(), t = new cR(e), n = new cl(new ll()), r = new ul(new ha()), a = new uR(new Ec()), o = new bT(), s = new DT(o), l = new OT(e), c = new BT(), u = c.registerMany(
    Td()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new FT(), g = new PT(), _ = yl(), k = new fl(_), R = new JC(
    c
  ), E = new ZC(
    R,
    m,
    g
  ), b = new pR(), I = new nS(b), A = new fR(), F = new lR(), D = new iR(
    t,
    s,
    I,
    A
  ), V = new mR(D, A), L = new OC(
    V,
    t,
    s,
    n,
    k,
    b,
    F
  );
  return L.addStrategy(
    new Vs(
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
    ritualPresetApplications: E
  };
}
const { ApplicationV2: iS } = foundry.applications.api;
class nn extends iS {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${Z(_s)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${Z(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${nr("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${nr("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${nr("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function nr(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${Z(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? sS(n) : cS(t)}
    </section>
  `;
}
function sS(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(lS).join("")}</ol>`;
}
function lS(e) {
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
function cS(e) {
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
const rn = `${d}.manageRitualPresets`, ss = `__${d}_ritualPresetHeaderControlRegistered`, uS = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function dS(e) {
  const t = globalThis;
  if (!t[ss]) {
    for (const n of uS)
      Hooks.on(n, (r, a) => {
        mS(r, a, e);
      });
    t[ss] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function mS(e, t, n) {
  Array.isArray(t) && pS(e) && (fS(e, n), !t.some((r) => r.action === rn) && t.push({
    action: rn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Eu(e, n);
    }
  }));
}
function fS(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[rn] && (e.options.actions[rn] = (n) => {
    n.preventDefault(), n.stopPropagation(), Eu(e, t);
  }));
}
function pS(e) {
  if (!game.user?.isGM) return !1;
  const t = $u(e);
  return t ? t.type === "agent" && bt(t).length > 0 : !1;
}
function Eu(e, t) {
  const n = $u(e);
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
function $u(e) {
  return ls(e.actor) ? e.actor : ls(e.document) ? e.document : null;
}
function ls(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Xr = "data-paranormal-toolkit-stylesheet";
function gS(e) {
  const t = AS(e), n = hS(t), r = yS(n), a = bS(n, t);
  if (a)
    return a.href = r, a.setAttribute(Xr, t), a;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = r, o.setAttribute(Xr, t), document.head.append(o), o;
}
function hS(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, r = n.getRoute;
  return typeof r == "function" ? r.call(n, t) : t;
}
function bS(e, t) {
  const n = cs(e);
  for (const r of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (r.getAttribute(Xr) === t || cs(r.href) === n)
      return r;
  return null;
}
function yS(e) {
  const t = _S();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function _S() {
  const e = game.modules.get(d), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function cs(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function AS(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function _e(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const r = document.createElement("span");
  return r.textContent = e, n.append(r, t), n;
}
function Qr(e, t, n) {
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
function wu(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const r = document.createElement("i");
  return r.className = t, n.append(r), n;
}
function tt(e, t, n = !1) {
  const r = document.createElement("option");
  return r.value = e, r.textContent = t, r.selected = n, r;
}
function TS(e) {
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
  const g = wu("Remover rolagem", "fa-solid fa-trash");
  g.disabled = !r, g.addEventListener("click", o), l.append(c, g);
  const _ = document.createElement("div");
  _.classList.add(`${d}-ability-roll-config__fields`);
  const k = Qr(
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
        Um(C),
        t.intent === C
      )
    );
  R.addEventListener("change", () => {
    t.intent = $S(R.value), Rt(), a();
  }), _.append(_e("Tipo da rolagem", R));
  const E = document.createElement("div");
  E.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), _.append(E);
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
      steps: kS(
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
    E.replaceChildren();
    const C = t.intent === "damage";
    if (_.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), E.hidden = !C, !C) return;
    const $ = document.createElement("select");
    $.disabled = !r, $.append(tt("", "—", !t.damageType));
    for (const { value: S, label: B } of Ws)
      $.append(tt(S, B, t.damageType === S));
    $.addEventListener("change", () => {
      t.damageType = $.value || null, a();
    }), E.append(_e("Tipo de dano", $));
  }
  function me() {
    if (L.replaceChildren(), t.formula.mode === "fixed") {
      const H = Qr(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        r
      );
      H.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = H.value, a());
      }), L.append(_e("Expressão", H));
      return;
    }
    const C = t.formula, $ = document.createElement("select");
    $.disabled = !r, $.append(
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
    ), $.addEventListener("change", () => {
      C.resolution = wS($.value), a();
    }), L.append(_e("Comportamento", $));
    const S = document.createElement("div");
    S.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((H, kt) => {
      S.append(
        RS({
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
    B.disabled = !r || C.steps.length >= mr, B.addEventListener("click", () => {
      C.steps.length >= mr || (C.steps.push({
        minNex: ES(
          C.steps.map((H) => H.minNex)
        ),
        formula: ""
      }), me(), a());
    }), L.append(B);
  }
}
function RS(e) {
  const { step: t, editable: n, onChange: r, onRemove: a } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = CS(Number(s.value)), s.value = String(t.minNex), r();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(s, c);
  const u = Qr(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, r();
  });
  const m = wu("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", a), o.append(
    _e("NEX mínimo", l),
    _e("Fórmula", u),
    m
  ), o;
}
function kS(e) {
  const t = Dm(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function ES(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function $S(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function wS(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function CS(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function SS(e) {
  let t = rr(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const r = IS(t), a = document.createElement("p");
  a.classList.add(`${d}-ability-roll-config__hint`), a.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const s = zt(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= dr || (t.rolls.push(Ys(t.rolls.length + 1)), _(), I("Rolagem adicionada. Salve para confirmar."));
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
          TS({
            roll: A,
            index: F,
            editable: e.editable,
            onChange: () => {
              Zr(r, t), I("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(F, 1), _(), I("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    Zr(r, t), b(!1);
  }
  async function k() {
    E(!0), I("Salvando configuração...");
    try {
      const A = la(t);
      if (!A) throw new Error("Configuração inválida.");
      t = rr(await e.onSave(A)), _(), I("Configuração salva.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        A
      ), I("Não foi possível salvar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade."
      );
    } finally {
      E(!1);
    }
  }
  async function R() {
    E(!0), I("Limpando configuração...");
    try {
      t = rr(await e.onClear()), _(), I("Configuração removida.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        A
      ), I("Não foi possível limpar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade."
      );
    } finally {
      E(!1);
    }
  }
  function E(A) {
    n.classList.toggle(`${d}-ability-roll-config--busy`, A), b(A);
  }
  function b(A) {
    c.disabled = A || !e.editable, u.disabled = A || !e.editable, s.disabled = A || !e.editable || t.rolls.length >= dr;
  }
  function I(A) {
    g.textContent = A;
  }
}
function IS(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const r = document.createElement("strong");
  r.textContent = "Paranormal Toolkit";
  const a = document.createElement("span");
  a.textContent = "Fórmulas de rolagem", n.append(r, a);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), Zr(t, e), t;
}
function Zr(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = zm(t) ? "Configurada" : "Rascunho");
}
function rr(e) {
  return JSON.parse(JSON.stringify(e));
}
const LS = "[data-paranormal-toolkit-ability-roll-config]", us = `__${d}_abilityRollConfigBlockRegistered`, vS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function DS() {
  const e = globalThis;
  if (!e[us]) {
    gS("styles/ability-roll-config.css");
    for (const t of vS)
      Hooks.on(t, (...n) => {
        xS(n[0], n[1]);
      });
    e[us] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function xS(e, t) {
  const n = PS(e);
  if (!n || n.type !== "ability") return;
  const r = OS(t);
  if (!r) return;
  const a = r.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!a) return;
  for (const s of Array.from(
    a.querySelectorAll(LS)
  ))
    s.remove();
  const o = SS({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: Nm(n),
    editable: MS(n),
    onSave: async (s) => {
      const l = await Pm(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await Mm(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), Ks())
  });
  NS(a, o);
}
function NS(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function PS(e) {
  return ds(e.item) ? e.item : ds(e.document) ? e.document : null;
}
function MS(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function OS(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function ds(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const Cu = "data-paranormal-toolkit-ritual-roll-config", Tt = "data-paranormal-toolkit-ritual-roll-field", $e = "data-paranormal-toolkit-ritual-roll-action", ms = `__${d}_ritualRollConfigBlockRegistered`, FS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], BS = [
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
function US() {
  const e = globalThis;
  if (!e[ms]) {
    zS();
    for (const t of FS)
      Hooks.on(t, (...n) => {
        qS(n[0], n[1]);
      });
    e[ms] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function zS() {
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
function qS(e, t) {
  const n = nI(e);
  if (!n || n.type !== "ritual") return;
  const r = oI(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  jS(a);
  const o = Iu(n), s = Nc(n), l = rI(n), c = VS(n, s, o, l);
  QS(c, n, o, l), GS(a, c), to(c);
}
function GS(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function jS(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Cu}]`)))
    t.remove();
}
function VS(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(Cu, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(fs("strong", "Paranormal Toolkit")), s.append(fs("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = vu(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(HS(t, r)), u.append(WS(t, r)), u.append(KS(t, r)), a.append(u), a.append(YS(t, n, r)), a.append(XS(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function HS(e, t) {
  const n = Cn("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Tt, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = BR(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function WS(e, t) {
  const n = Cn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Tt, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of BS) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function KS(e, t) {
  const n = Cn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Tt, "utilityLabel"), n.append(r), n;
}
function YS(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(ar("base", "Padrão", e.forms.base.formula, !0, n)), o.append(ar("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(ar("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function ar(e, t, n, r, a) {
  const o = Cn(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(Tt, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function XS(e) {
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
function fs(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function QS(e, t, n, r) {
  Ze(e, "intent")?.addEventListener("change", () => to(e)), hs(e, "system.studentForm")?.addEventListener("change", () => ps(e, t)), hs(e, "system.trueForm")?.addEventListener("change", () => ps(e, t)), e.querySelector(`[${$e}="save"]`)?.addEventListener("click", () => {
    r && ZS(e, t, n);
  }), e.querySelector(`[${$e}="clear"]`)?.addEventListener("click", () => {
    r && JS(e, t);
  });
}
async function ZS(e, t, n) {
  const r = e.querySelector(`[${$e}="save"]`);
  r?.setAttribute("disabled", "true"), Fe(e, "Salvando configuração...");
  try {
    const a = eI(e, n);
    await OR(t, a), Su(e, a), Fe(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Fe(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function JS(e, t) {
  const n = e.querySelector(`[${$e}="clear"]`);
  n?.setAttribute("disabled", "true"), Fe(e, "Limpando configuração...");
  try {
    await FR(t);
    const r = Nc(t);
    tI(e, r), Su(e, r), Fe(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Fe(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Su(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = vu(t) ? "Configurada" : "Rascunho");
}
function eI(e, t) {
  return {
    schemaVersion: 1,
    intent: Lu(Ze(e, "intent")?.value),
    damageType: bs(e, "damageType"),
    utilityLabel: bs(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: qt(e, "formula.base") },
      discente: { formula: qt(e, "formula.discente") },
      verdadeiro: { formula: qt(e, "formula.verdadeiro") }
    }
  };
}
function tI(e, t) {
  ve(e, "intent", t.intent), ve(e, "damageType", t.damageType ?? ""), ve(e, "utilityLabel", t.utilityLabel ?? "Resultado"), ve(e, "formula.base", t.forms.base.formula), ve(e, "formula.discente", t.forms.discente.formula), ve(e, "formula.verdadeiro", t.forms.verdadeiro.formula), to(e);
}
function to(e) {
  const t = Lu(Ze(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function ps(e, t) {
  const n = Iu(t);
  gs(e, "discente", n.discente), gs(e, "verdadeiro", n.verdadeiro);
}
function gs(e, t, n) {
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
function Iu(e) {
  const t = aI(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function nI(e) {
  return ys(e.item) ? e.item : ys(e.document) ? e.document : null;
}
function rI(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function aI(e) {
  const t = e.system;
  return iI(t) ? t : {};
}
function hs(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ze(e, t) {
  return e.querySelector(`[${Tt}="${sI(t)}"]`);
}
function qt(e, t) {
  return Ze(e, t)?.value.trim() ?? "";
}
function bs(e, t) {
  const n = qt(e, t);
  return n.length > 0 ? n : null;
}
function ve(e, t, n) {
  const r = Ze(e, t);
  r && (r.value = n);
}
function Lu(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function vu(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function oI(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function ys(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function iI(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function sI(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let Q = null;
Hooks.once("init", () => {
  bd(), Yd(), Zf(), tT(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!po.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${po.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Q = oS(), Q.itemUseIntegration.registerStrategies(), qf(Q.resources, Q.resourceAdapter), Kf(Q.conditions), _m(Q), sT(), dS(Q), US(), DS(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function lI() {
  if (!Q)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Q;
}
export {
  lI as getToolkitServices
};
//# sourceMappingURL=main.js.map
