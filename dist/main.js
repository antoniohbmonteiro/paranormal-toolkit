const c = "paranormal-toolkit", rl = "Paranormal Toolkit", xd = "ordemparanormal";
class Et {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Rn(e) {
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
    console.log(`${c} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${c} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${c} | ${t}`, ...n);
  }
}
function y(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function kt(e) {
  const t = hr(e);
  return t.ok ? y(t.value.definition) : t;
}
function hr(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : br(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Nd(e) {
  return br(e.getFlag(c, "automation"));
}
function br(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Od(t.source) && Pd(t.definition);
}
function Pd(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Md) && (t.ritualForms === void 0 || jd(t.ritualForms)) && (t.conditionApplications === void 0 || Kd(t.conditionApplications));
}
function Od(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Md(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Fd(t);
    case "spendRitualCost":
      return Bd(t);
    case "rollFormula":
      return Ud(t);
    case "modifyResource":
      return qd(t);
    case "chatCard":
      return zd(t);
    default:
      return !1;
  }
}
function Fd(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ol(t);
}
function Bd(e) {
  return e.type === "spendRitualCost";
}
function Ud(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || tm(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function qd(e) {
  const t = e;
  return t.type === "modifyResource" && il(t.actor) && Jd(t.resource) && em(t.operation) && ol(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function zd(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function jd(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([a, r]) => n.has(a) && Gd(r)
  );
}
function Gd(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || am(t.extraCost)) && (t.rollFormulaOverrides === void 0 || om(t.rollFormulaOverrides)) && (t.notes === void 0 || rm(t.notes)) && (t.targeting === void 0 || Vd(t.targeting));
}
function Vd(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Wd(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Hd(t.template));
}
function Hd(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || Io(t.distance)) && (t.width === void 0 || t.width === null || Io(t.width));
}
function Wd(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Kd(e) {
  return Array.isArray(e) && e.every(Yd);
}
function Yd(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && il(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || Qd(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || Xd(t.applyOnResistance));
}
function Xd(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Qd(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || nm(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Zd(t.expiry));
}
function Zd(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ol(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function il(e) {
  return e === "self" || e === "target";
}
function Jd(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function em(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function tm(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function nm(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function am(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Io(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function rm(e) {
  return Array.isArray(e) && e.every(w);
}
function om(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function yr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Lo);
    if (lm(t))
      return Array.from(t).filter(Lo);
  }
  return [];
}
function im(e) {
  return yr(e)[0] ?? null;
}
function sm(e) {
  return yr(e).find(Nd) ?? null;
}
function lm(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Lo(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function $t(e) {
  return yr(e).filter((t) => t.type === "ritual");
}
function sl(e) {
  return $t(e)[0] ?? null;
}
function cm(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Rn);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ut("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = xt(t);
      if (!n) return [];
      const a = e.automationRegistry.findForItem(n).map(xo);
      return f.info(`Presets encontrados para ${n.name}.`, a), a;
    },
    async applyPresetToFirstRitual(t) {
      const n = ut("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const a = xt(n);
      if (!a) return;
      const r = e.automationRegistry.require(t);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      const o = await Ra(e, a, r.value);
      f.info(`Preset ${r.value.id} aplicado em ${a.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = ut("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = xt(t);
      if (!n) return;
      const a = e.automationRegistry.findForItem(n)[0];
      if (!a) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const r = await Ra(e, n, a.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: xo(a), itemPatch: r }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return vo(e);
    },
    async applyBestPresetsToActorRituals() {
      return vo(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ut("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = xt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function vo(e) {
  const t = ut("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = $t(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Do(t);
  const a = Do(t, n.length);
  for (const r of n) {
    const o = e.automationRegistry.findForItem(r)[0];
    if (!o) {
      a.skipped.push({
        itemId: r.id ?? null,
        itemName: r.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await Ra(e, r, o.preset);
    a.applied.push(um(r, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), dm(a), a;
}
async function Ra(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function um(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Rn(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Do(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function dm(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function xo(e) {
  return {
    preset: Rn(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function ut(e) {
  const t = Et.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function xt(e) {
  const t = sl(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Me(e) {
  return e ? {
    id: e.id,
    source: {
      ...mm(e.sourceActor),
      token: e.sourceToken
    },
    item: fm(e.item),
    targets: e.targets.map(pm),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: No(e.rollRequests, ll),
    rolls: No(e.rolls, gm),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(_r),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function _r(e) {
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
function mm(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function fm(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function pm(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function ll(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function gm(e) {
  return {
    ...ll(e),
    total: e.total
  };
}
function No(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, a]) => [n, t(a)]));
}
function hm(e) {
  return {
    getSelected() {
      return Et.getSelectedActor();
    },
    logResources() {
      const t = be(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await xe(
        e,
        "Gasto de PE",
        be("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await xe(
        e,
        "Gasto de PD",
        be("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await xe(
        e,
        "Dano em PV",
        be("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await xe(
        e,
        "Cura de PV",
        be("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await xe(
        e,
        "Dano em SAN",
        be("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await xe(
        e,
        "Recuperação de SAN",
        be("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function xe(e, t, n, a) {
  if (!n) return;
  const r = await a(n);
  if (!r.ok) {
    bm(r.error);
    return;
  }
  const o = r.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, _r(o));
}
function be(e) {
  const t = Et.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function bm(e) {
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
const ae = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function ym() {
  Nt(ae.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Nt(ae.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Nt(ae.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Nt(ae.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Ea() {
  return {
    enabled: Pt(ae.enabled),
    console: Pt(ae.console),
    ui: Pt(ae.ui),
    chat: Pt(ae.chat)
  };
}
async function le(e, t) {
  await game.settings.set(c, ae[e], t);
}
function Nt(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Pt(e) {
  return game.settings.get(c, e) === !0;
}
function _m() {
  return {
    status() {
      return Ea();
    },
    async enable() {
      await le("enabled", !0);
    },
    async disable() {
      await le("enabled", !1);
    },
    async enableConsole() {
      await le("console", !0);
    },
    async disableConsole() {
      await le("console", !1);
    },
    async enableUi() {
      await le("ui", !0);
    },
    async disableUi() {
      await le("ui", !1);
    },
    async enableChat() {
      await le("chat", !0);
    },
    async disableChat() {
      await le("chat", !1);
    }
  };
}
const cl = "ritual.costOnly", ul = "ritual.simpleHealing", Am = "ritual.eletrocussao", Tm = "ritual.definhar", dl = "ritual.simpleDamage", ml = "generic.simpleHealing", fl = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, Ar = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Rm() {
  return [
    Em(),
    km(),
    $m(),
    wm(),
    Cm(),
    Sm()
  ];
}
function Em() {
  return {
    id: cl,
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
function km() {
  return {
    id: ul,
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
    automation: pl(),
    itemPatch: Dm()
  };
}
function $m() {
  return {
    id: Am,
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
    automation: Lm(),
    itemPatch: Nm()
  };
}
function wm() {
  return {
    id: Tm,
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
    automation: vm(),
    itemPatch: xm()
  };
}
function Cm() {
  return {
    id: dl,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Tr()
  };
}
function Sm() {
  return {
    id: ml,
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
function pl(e = fl) {
  const t = Im(e);
  return gl(
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
function Im(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...fl,
    ...e
  };
}
function Lm() {
  return {
    ...Tr("3d6", {
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
function vm() {
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
function Tr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", r = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return gl(
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
          damageType: r
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
          title: a,
          message: o
        }
      ]
    },
    "damage",
    e
  );
}
function Dm() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Ar,
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
function xm() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: Ar,
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
function Nm() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Ar,
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
function gl(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: n
    })
  };
}
function Rr() {
  return Array.from(game.user?.targets ?? []).map(hl);
}
function hl(e) {
  return {
    tokenId: Fe(e.id),
    actorId: Fe(e.actor?.id),
    sceneId: Fe(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function bl() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Fe(e.id),
    actorId: Fe(t?.id),
    sceneId: Fe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Fe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Pm(e) {
  return {
    logFirstRitualCost() {
      const t = ye("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = _e(t);
      if (!n) return;
      const a = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      f.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: a.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${a.value.amount} ${a.value.resource} (${a.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const a = ye("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const r = _e(a);
      if (r) {
        if (!Fm(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await r.setFlag(c, "ritual.cost", {
          resource: n,
          amount: t
        }), f.info(`Custo customizado aplicado em ${r.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${r.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = ye("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = _e(t);
      n && (await n.unsetFlag(c, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = ye("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = _e(t);
      if (!n) return;
      const a = e.automationRegistry.require(cl);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = ye("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const a = _e(n);
      if (!a) return;
      if (!Po(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const r = e.automationRegistry.require(ul);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: pl(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = ye("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const a = _e(n);
      if (!a) return;
      if (!Po(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const r = e.automationRegistry.require(dl);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: Tr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = ye("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = _e(t);
      n && await Om(e, t, n);
    }
  };
}
async function Om(e, t, n) {
  const a = kt(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: bl(),
    item: n,
    targets: Rr()
  });
  if (!r.ok) {
    Mm(r.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", Me(r.value.context));
}
function Mm(e) {
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
function ye(e) {
  const t = Et.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function _e(e) {
  const t = sl(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Fm(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Po(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Bm = ["strict", "open"], yl = "strict";
function Um(e) {
  return Bm.includes(e) ? e : yl;
}
function qm(e) {
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
function En(e, t) {
  return e === "strict" && t.kind === "pending";
}
const zm = ["disabled", "ask", "automatic"], jm = ["buttons", "confirm"], _l = "ask";
function Gm(e) {
  return typeof e == "string" && zm.includes(e);
}
function Vm(e) {
  return typeof e == "string" && jm.includes(e);
}
function Hm(e) {
  return Gm(e) ? e : Vm(e) ? "ask" : _l;
}
const Wm = ["keep", "replace"], Km = ["manual", "assisted"], Al = "keep", Tl = "assisted", Ym = !0, F = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Xm() {
  game.settings.register(c, F.executionMode, {
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
    default: _l
  }), game.settings.register(c, F.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Al
  }), game.settings.register(c, F.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: Tl
  }), game.settings.register(c, F.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: yl
  }), game.settings.register(c, F.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ym
  }), game.settings.register(c, F.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function ka() {
  const e = Hm(game.settings.get(c, F.executionMode)), t = kl(game.settings.get(c, F.systemCardMode)), n = $l(game.settings.get(c, F.damageResolutionMode)), a = Er();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: a,
    ritualCastingCheckEnabled: El()
  };
}
function Rl() {
  return kl(game.settings.get(c, F.systemCardMode));
}
function Qm() {
  return $l(game.settings.get(c, F.damageResolutionMode));
}
function Er() {
  return Um(game.settings.get(c, F.resistanceGateMode));
}
function El() {
  return game.settings.get(c, F.ritualCastingCheckEnabled) === !0;
}
async function Ae(e) {
  await game.settings.set(c, F.executionMode, e);
}
function kl(e) {
  return Wm.includes(e) ? e : Al;
}
function $l(e) {
  return Km.includes(e) ? e : Tl;
}
function Zm(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await Ae("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await Ae("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await Ae(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await Ae("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await Ae("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await Ae("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await Ae("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Jm = [
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
function ef(e) {
  return {
    phases() {
      return Jm;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Hn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = sm(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Oo(e, t, n);
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
      if (!af(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = nf(n) ?? Hn("Nenhum ator encontrado para executar automação do item.");
      a && await Oo(e, a, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Hn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = im(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(ml);
        if (!a.ok) {
          f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, a.value), f.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (a) {
        f.error("Falha ao configurar automação de teste no item.", a), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Oo(e, t, n) {
  const a = kt(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: bl(),
    item: n,
    targets: Rr()
  });
  if (!r.ok) {
    tf(r.error);
    return;
  }
  f.info("Automação executada com sucesso.", Me(r.value.context));
}
function tf(e) {
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
function Hn(e) {
  const t = Et.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function nf(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function af(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function rf(e) {
  const t = hm(e), n = cm(e), a = Pm(e), r = ef(e), o = _m(), s = Zm(e);
  return {
    actor: t,
    automation: n,
    ritual: a,
    workflow: r,
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
const Gt = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function of(e) {
  return {
    list: () => e.listConditions(),
    get: (t) => {
      const n = e.getCondition(t);
      return n.ok ? n.value : null;
    },
    applyToActor: (t, n, a = {}) => e.applyCondition({
      actor: t,
      conditionId: n,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source ?? "api.applyToActor",
      refreshExisting: a.refreshExisting
    }),
    removeFromActor: (t, n) => e.removeCondition({
      actor: t,
      conditionId: n
    }),
    applyToSelectedTokens: async (t, n = {}) => {
      const a = Mo();
      if (a.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const r = await Promise.all(
        a.map(
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
      return sf(r), r;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Mo();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const a = await Promise.all(
        n.map(
          (r) => e.removeCondition({
            actor: r,
            conditionId: t
          })
        )
      );
      return lf(a), a;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Mo() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const a = n.actor ?? n.document?.actor ?? null;
    if (!a) continue;
    const o = a.uuid ?? null ?? a.id ?? a.name ?? `selected-${t.size}`;
    t.set(o, a);
  }
  return Array.from(t.values());
}
function sf(e) {
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
function lf(e) {
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
function C(e) {
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
function cf(e) {
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${e.tone ?? "accent"}">${C(e.label)}</span>`;
}
const uf = '<svg class="paranormal-toolkit-chat-card-header__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7a2 2 0 0 1-2-2V4.5Zm2 0V17a3 3 0 0 0-1 .17M9 8h6M9 11h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function df(e) {
  const t = e?.src?.trim();
  return t ? `<img class="paranormal-toolkit-chat-card-header__image-content" src="${C(t)}" alt="${C(e?.alt ?? "")}">` : uf;
}
function wl(e) {
  const t = e.subtitle ? `<span class="paranormal-toolkit-chat-card-header__subtitle">· ${C(e.subtitle)}</span>` : "", n = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(cf).join("")}</div>` : "", a = e.context ? `<div class="paranormal-toolkit-chat-card-header__context">${C(e.context)}</div>` : "";
  return `<header class="paranormal-toolkit-chat-card-header">
  <div class="paranormal-toolkit-chat-card-header__image">${df(e.image)}</div>
  <div class="paranormal-toolkit-chat-card-header__content">
    <div class="paranormal-toolkit-chat-card-header__heading">
      <div class="paranormal-toolkit-chat-card-header__title-group">
        <span class="paranormal-toolkit-chat-card-header__title">${C(e.title)}</span>${t}
      </div>${n}
    </div>${a}
  </div>
</header>`;
}
function B(e) {
  return `<article class="paranormal-toolkit-chat-card-shell">${e.content}</article>`;
}
const mf = '<i class="paranormal-toolkit-dice-action-button__icon fa-solid fa-dice-d20" aria-hidden="true"></i>';
function Cl(e) {
  const t = e.disabled ? " disabled" : "";
  return `<button class="paranormal-toolkit-dice-action-button" type="button" aria-label="${C(e.ariaLabel)}"${t}>${mf}</button>`;
}
function Sl(e) {
  const t = e.label.trim();
  return t ? `<button class="paranormal-toolkit-assisted-action-button" type="button"${e.disabled ? " disabled" : ""}>${C(t)}</button>` : "";
}
function ff(e) {
  const t = e.label.trim();
  return t ? `<span class="paranormal-toolkit-completion-indicator"><span class="paranormal-toolkit-completion-indicator__check" aria-hidden="true">✓</span><span class="paranormal-toolkit-completion-indicator__label">${C(t)}</span></span>` : "";
}
function Il(e) {
  const t = e.label.trim(), n = e.description.trim();
  if (!t || !n) return "";
  const a = e.control.state === "completed" ? ff(e.control.indicator) : Sl({ ...e.control.button, disabled: e.control.state === "disabled" });
  return a ? `<div class="paranormal-toolkit-assisted-action-row"><div class="paranormal-toolkit-assisted-action-row__content"><span class="paranormal-toolkit-assisted-action-row__label">${C(t)}</span><span class="paranormal-toolkit-assisted-action-row__description">${C(n)}</span></div><div class="paranormal-toolkit-assisted-action-row__control">${a}</div></div>` : "";
}
function Ll(e) {
  const t = e.label.trim(), n = e.detailHtml.trim();
  return !t || !n ? "" : `<div class="paranormal-toolkit-metadata-detail-row"><span class="paranormal-toolkit-metadata-detail-row__accent" aria-hidden="true"></span><div class="paranormal-toolkit-metadata-detail-row__content"><span class="paranormal-toolkit-metadata-detail-row__label">${C(t)}</span><span class="paranormal-toolkit-metadata-detail-row__detail">${n}</span></div></div>`;
}
const Fo = {
  section: "paranormal-toolkit-roll-row__result--section",
  success: "paranormal-toolkit-roll-row__result--success",
  failure: "paranormal-toolkit-roll-row__result--failure"
};
function pf(e) {
  return Fo[e ?? "section"] ?? Fo.section;
}
function gf(e) {
  const t = `<span class="paranormal-toolkit-roll-row__formula-text">${C(e.formula)}</span>`;
  if (!e.diceResults?.length)
    return `<div class="paranormal-toolkit-roll-row__formula paranormal-toolkit-roll-row__formula--static">${t}</div>`;
  const n = e.diceResults.map(
    (r) => `<span class="paranormal-toolkit-roll-row__die">${C(String(r))}</span>`
  ).join("");
  return `<details class="paranormal-toolkit-roll-row__details"${e.expanded ? " open" : ""}>
  <summary class="paranormal-toolkit-roll-row__formula">${t}<span class="paranormal-toolkit-roll-row__chevron" aria-hidden="true"></span></summary>
  <div class="paranormal-toolkit-roll-row__breakdown" aria-label="Resultados dos dados">${n}</div>
</details>`;
}
function kr(e) {
  const t = e.total !== void 0, n = t ? "with-result" : "without-result", a = t ? C(String(e.total)) : "", r = t ? `<output class="paranormal-toolkit-roll-row__result ${pf(e.resultTone)}" aria-label="Resultado: ${a}">${a}</output>` : "";
  return `<div class="paranormal-toolkit-roll-row paranormal-toolkit-roll-row--${n}">${gf(e)}${r}</div>`;
}
const Bo = {
  casting: "paranormal-toolkit-section-card--casting",
  damage: "paranormal-toolkit-section-card--damage",
  resistance: "paranormal-toolkit-section-card--resistance"
};
function hf(e) {
  return Bo[e] ?? Bo.casting;
}
function Ie(e) {
  return `<section class="paranormal-toolkit-section-card ${hf(e.tone)}">${e.content}</section>`;
}
function Je(e) {
  const t = e.trailing ? `<div class="paranormal-toolkit-section-header__trailing">${e.trailing}</div>` : "";
  return `<div class="paranormal-toolkit-section-header"><span class="paranormal-toolkit-section-header__title">${C(e.title)}</span>${t}</div>`;
}
const Uo = {
  success: "paranormal-toolkit-status-badge--success",
  failure: "paranormal-toolkit-status-badge--failure"
}, bf = {
  success: "✓ SUCESSO",
  failure: "✕ FALHA"
};
function kn(e) {
  const t = Uo[e.state] ? e.state : "failure";
  return `<span class="paranormal-toolkit-status-badge ${Uo[t]}">${bf[t]}</span>`;
}
function vl(e) {
  const t = C(String(e.difficultyClass)), n = `<p class="paranormal-toolkit-ritual-conjuration-section__result-description"><span class="paranormal-toolkit-ritual-conjuration-section__skill">${C(e.skillLabel)}</span> <span class="paranormal-toolkit-ritual-conjuration-section__comparison">contra</span> <strong class="paranormal-toolkit-ritual-conjuration-section__metric">DT ${t}</strong></p>`, a = e.consequence?.trim(), r = a ? `<p class="paranormal-toolkit-ritual-conjuration-section__consequence"><span class="paranormal-toolkit-ritual-conjuration-section__consequence-label">Consequência:</span> ${C(a)}</p>` : "", o = Je({
    title: "Conjuração",
    trailing: kn({ state: e.status })
  }) + n + kr({
    formula: e.formula,
    total: e.total,
    resultTone: e.status,
    diceResults: e.diceResults,
    expanded: e.expanded
  }) + r;
  return Ie({ tone: "casting", content: o });
}
function Dl(e) {
  const t = e.damageType.trim(), n = t ? `<span class="paranormal-toolkit-ritual-damage-section__damage-type">${C(t)}</span>` : void 0, a = Je({ title: "Dano", trailing: n }) + kr({
    formula: e.formula,
    total: e.total,
    resultTone: "section",
    diceResults: e.diceResults,
    expanded: e.expanded
  });
  return Ie({ tone: "damage", content: a });
}
function xl(e) {
  const n = `<div class="paranormal-toolkit-ritual-resistance-section"><div class="paranormal-toolkit-ritual-resistance-section__text"><div class="paranormal-toolkit-ritual-resistance-section__title">Resistência</div>${`<p class="paranormal-toolkit-ritual-resistance-section__summary"><strong class="paranormal-toolkit-ritual-resistance-section__metric">${C(e.skill)}</strong><span class="paranormal-toolkit-ritual-resistance-section__separator" aria-hidden="true"> · </span><strong class="paranormal-toolkit-ritual-resistance-section__metric">${C(e.difficultyLabel)}</strong><span class="paranormal-toolkit-ritual-resistance-section__separator" aria-hidden="true"> · </span><span class="paranormal-toolkit-ritual-resistance-section__outcome">${C(e.outcome)}</span></p>`}</div>${Cl(e.action)}</div>`;
  return Ie({ tone: "resistance", content: n });
}
function yf(e) {
  const t = e.text.trim();
  return t ? `<span class="paranormal-toolkit-metadata-pill">${C(t)}</span>` : "";
}
function Nl(e) {
  const t = e.items.map(yf).filter(Boolean);
  return t.length === 0 ? "" : `<div class="paranormal-toolkit-ritual-metadata">${t.join("")}</div>`;
}
function Pl(e) {
  const t = e.rows.map(Il).filter(Boolean);
  return t.length ? `<section class="paranormal-toolkit-ritual-assisted-actions-panel"><h4 class="paranormal-toolkit-ritual-assisted-actions-panel__title">AÇÕES ASSISTIDAS</h4><div class="paranormal-toolkit-ritual-assisted-actions-panel__rows">${t.join("")}</div></section>` : "";
}
function _f(e) {
  const t = [
    wl(e.header),
    e.metadata ? Nl(e.metadata) : "",
    ...e.detailRows?.map(Ll) ?? [],
    vl(e.conjuration),
    e.damage ? Dl(e.damage) : "",
    e.resistance ? xl(e.resistance) : "",
    e.assistedActions ? Pl(e.assistedActions) : ""
  ].filter(Boolean).join("");
  return B({
    content: `<div class="paranormal-toolkit-ritual-single-target-card">${t}</div>`
  });
}
const Ol = "devChatCardExample", Af = "devChatCardHeaderExample";
function P() {
  if (!game.user?.isGM)
    throw new Error("Apenas GMs podem gerenciar exemplos de chat card.");
}
function Tf() {
  const e = canvas?.tokens?.controlled?.[0], t = [...game.user?.targets ?? []], n = e?.name || e?.actor?.name || "Mercy", a = t.length > 1 ? `${t.length} alvos` : t[0]?.name || t[0]?.actor?.name || "Nenhum alvo", r = foundry.utils.getProperty(e, "document.texture.src") ?? foundry.utils.getProperty(e, "actor.img");
  return {
    image: typeof r == "string" ? { src: r, alt: `Imagem de ${n}` } : void 0,
    title: n,
    subtitle: "Runtime",
    badges: [{ label: "RUNTIME", tone: "neutral" }],
    context: `${n} → ${a}`
  };
}
function Rf(e) {
  return e === "runtime" ? Tf() : e === "ability" ? {
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
function Ef(e) {
  switch (e) {
    case "casting-title":
      return { tone: "casting", title: "Conjuração" };
    case "casting-badge":
      return {
        tone: "casting",
        title: "Conjuração",
        trailing: kn({ state: "success" })
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
function kf(e) {
  const t = Ef(e);
  return B({
    content: Ie({
      tone: t.tone,
      content: Je({
        title: t.title,
        trailing: t.trailing
      })
    })
  });
}
function $f(e) {
  return B({
    content: Ie({
      tone: "casting",
      content: Je({
        title: "Conjuração",
        trailing: kn({ state: e })
      })
    })
  });
}
function wf(e) {
  const t = e === "disabled";
  return B({
    content: Ie({
      tone: "resistance",
      content: Je({
        title: "Resistência",
        trailing: Cl({
          ariaLabel: t ? "Resistência indisponível" : "Rolar resistência",
          disabled: t
        })
      })
    })
  });
}
function Cf(e) {
  const t = e.startsWith("with-result"), n = e.startsWith("damage"), a = e === "with-result-failure", r = t ? {
    formula: "1d20 + 10 + 5",
    total: a ? 17 : 23,
    resultTone: a ? "failure" : "success",
    diceResults: [a ? 2 : 8]
  } : n ? {
    formula: "3d6",
    total: 9,
    resultTone: "section",
    diceResults: [2, 3, 4],
    expanded: e === "damage-expanded"
  } : {
    formula: "1d20 + 4",
    diceResults: [17],
    expanded: e === "without-result-expanded"
  }, o = n ? "damage" : t ? "casting" : "resistance", s = n ? "Dano" : t ? "Conjuração" : "Resistência", l = n ? '<span class="paranormal-toolkit-section-header__demo-text">Eletricidade</span>' : t ? kn({ state: a ? "failure" : "success" }) : void 0;
  return B({
    content: Ie({
      tone: o,
      content: Je({ title: s, trailing: l }) + kr(r)
    })
  });
}
function Sf(e) {
  const t = e === "failure" || e === "failure-consequence";
  return {
    status: t ? "failure" : "success",
    skillLabel: "Ocultismo",
    total: t ? 17 : 23,
    difficultyClass: 21,
    formula: "1d20 + 10 + 5",
    diceResults: [t ? 2 : 8],
    expanded: e === "expanded",
    consequence: e === "failure-consequence" ? "Dano de Sanidade" : void 0
  };
}
function If(e) {
  return B({
    content: vl(Sf(e))
  });
}
function Lf(e) {
  return e === "long-type" ? {
    damageType: "Eletricidade paranormal prolongada",
    formula: "3d6 + 2d8 + 5",
    total: 21,
    diceResults: [2, 3, 4, 5, 2]
  } : {
    damageType: "Eletricidade",
    formula: "3d6",
    total: e === "without-result" ? void 0 : 9,
    diceResults: [2, 3, 4],
    expanded: e === "expanded"
  };
}
function vf(e) {
  return B({
    content: Dl(Lf(e))
  });
}
function Df(e) {
  return e === "disabled" ? {
    skill: "Reflexos",
    difficultyLabel: "DT 18",
    outcome: "evita o efeito",
    action: { ariaLabel: "Resistência indisponível", disabled: !0 }
  } : {
    skill: "Fortitude",
    difficultyLabel: "DT 22",
    outcome: e === "long" ? "reduz o dano paranormal recebido à metade e evita efeitos adicionais prolongados" : "reduz dano à metade",
    action: { ariaLabel: "Rolar resistência de Fortitude" }
  };
}
function xf(e) {
  return B({
    content: xl(Df(e))
  });
}
function Nf(e) {
  return e === "partial" ? {
    items: [
      { text: "Alcance: Pessoal" },
      { text: "Duração: Cena" }
    ]
  } : e === "long" ? {
    items: [
      { text: "Execução: Uma ação completa cuidadosamente preparada" },
      { text: "Alcance: Uma distância paranormal excepcionalmente longa" },
      { text: "Duração: Enquanto a concentração do conjurador for mantida" }
    ]
  } : {
    items: [
      { text: "1 PE gasto" },
      { text: "Alvo: 1 Ser" },
      { text: "Duração: Instantânea" }
    ]
  };
}
function Pf(e) {
  return B({
    content: Nl(Nf(e))
  });
}
function Of(e) {
  return B({ content: Ll(e === "generic" ? { label: "Alcance:", detailHtml: "Médio · até 15 metros" } : e === "long" ? {
    label: "Resistência:",
    detailHtml: "Reflexos · <strong>DT 24</strong> · evita completamente os efeitos do ritual"
  } : {
    label: "Resistência:",
    detailHtml: "Fortitude · <strong>DT 22</strong> · reduz dano à metade"
  }) });
}
function Vt(e) {
  if (e === "completed") return { label: "Dano", description: "9 de dano aplicado em Malvadão.", control: { state: "completed", indicator: { label: "Aplicado" } } };
  const t = e === "disabled";
  return {
    label: "Dano",
    description: t ? "Aguardando a resistência do alvo." : "A resistência falhou. Aplique o dano completo.",
    control: { state: t ? "disabled" : "active", button: { label: t ? "Aguardando resistência" : "Aplicar 9 de dano" } }
  };
}
function Ml(e) {
  if (e === "completed") return { rows: [
    Vt("completed"),
    { label: "Efeito", description: "Vulnerável aplicado em Malvadão.", control: { state: "completed", indicator: { label: "Aplicado" } } }
  ] };
  if (e === "damage-only") return { rows: [Vt("active")] };
  const t = e === "pending";
  return { rows: [
    Vt(t ? "disabled" : "active"),
    {
      label: "Efeito",
      description: t ? "Aguardando resistência antes da aplicação." : "Vulnerável · 1 rodada",
      control: { state: t ? "disabled" : "active", button: { label: t ? "Aguardando resistência" : "Aplicar efeito" } }
    }
  ] };
}
function Mf(e) {
  const t = e === "disabled";
  return B({ content: Sl({ label: t ? "Aguardando resistência" : "Aplicar 9 de dano", disabled: t }) });
}
function Ff(e) {
  return B({ content: Il(Vt(e)) });
}
function Bf(e) {
  return B({ content: Pl(Ml(e)) });
}
function Uf(e) {
  const t = e === "failure", n = e === "long";
  return {
    header: {
      title: n ? "Eletrocussão Extraordinariamente Prolongada para Validar Quebras Naturais" : "Eletrocussão",
      subtitle: "Padrão",
      badges: [{ label: "ENERGIA 1" }],
      context: n ? "Mercy → Criatura paranormal com um nome excepcionalmente longo para validar o contexto" : "Mercy → Malvadão"
    },
    metadata: {
      items: n ? [
        { text: "1 PE gasto em uma conjuração cuidadosamente preparada" },
        { text: "Alvo: Uma criatura paranormal excepcionalmente distante" },
        { text: "Alcance: Uma distância paranormal excepcionalmente longa para validar a quebra defensiva" },
        { text: "Duração: Enquanto a concentração do conjurador for mantida" }
      ] : [
        { text: "1 PE gasto" },
        { text: "Alvo: 1 Ser" },
        { text: t ? "Alcance: Pessoal" : "Alcance: Curto" },
        { text: "Duração: Instantânea" }
      ]
    },
    conjuration: {
      status: t ? "failure" : "success",
      skillLabel: "Ocultismo",
      total: t ? 17 : 23,
      difficultyClass: 21,
      formula: "1d20 + 10 + 5",
      diceResults: [t ? 2 : 8],
      consequence: t ? "Dano de Sanidade" : void 0
    },
    damage: t ? void 0 : {
      damageType: n ? "Eletricidade paranormal prolongada e intensamente concentrada" : "Eletricidade",
      formula: n ? "3d6 + 2d8 + 5" : "3d6",
      total: n ? 21 : 9,
      diceResults: n ? [2, 3, 4, 5, 2] : [2, 3, 4]
    },
    resistance: t ? void 0 : {
      skill: "Fortitude",
      difficultyLabel: "DT 22",
      outcome: n ? "reduz o dano paranormal recebido à metade e evita efeitos adicionais prolongados" : "reduz dano à metade",
      action: { ariaLabel: "Rolar resistência de Fortitude" }
    },
    assistedActions: !t && !n ? Ml("pending") : void 0
  };
}
function O(e, t) {
  return ChatMessage.create({
    content: e,
    flags: { [c]: { [Ol]: t } }
  });
}
function qf() {
  const e = async () => {
    P();
    const n = (game.messages.contents ?? []).filter(
      (a) => typeof a.getFlag?.(c, Ol) == "string" || a.getFlag?.(c, Af) === !0
    );
    await Promise.all(
      n.map(
        (a) => a.delete?.()
      )
    );
  };
  return {
    async postChatCardHeaderExample(t) {
      return P(), O(
        B({
          content: wl(Rf(t))
        }),
        "header"
      );
    },
    async postSectionCardExample(t) {
      P();
      const n = t === "all" ? [
        "casting-title",
        "casting-badge",
        "damage-text",
        "resistance-button"
      ] : [t];
      return Promise.all(
        n.map(
          (a) => O(kf(a), "section")
        )
      );
    },
    async postStatusBadgeExample(t) {
      P();
      const n = t === "both" ? ["success", "failure"] : [t];
      return Promise.all(
        n.map(
          (a) => O($f(a), "status")
        )
      );
    },
    async postDiceActionButtonExample(t) {
      P();
      const n = t === "all" ? ["enabled", "disabled"] : [t];
      return Promise.all(
        n.map(
          (a) => O(
            wf(a),
            "dice-action-button"
          )
        )
      );
    },
    async postRollRowExample(t) {
      P();
      const n = t === "all" ? [
        "with-result-success",
        "with-result-failure",
        "damage-collapsed",
        "damage-expanded",
        "without-result-collapsed",
        "without-result-expanded"
      ] : [t];
      return Promise.all(
        n.map(
          (a) => O(Cf(a), "roll-row")
        )
      );
    },
    async postRitualConjurationSectionExample(t) {
      P();
      const n = t === "all" ? ["success", "failure", "failure-consequence", "expanded"] : [t];
      return Promise.all(
        n.map(
          (a) => O(
            If(a),
            "ritual-conjuration"
          )
        )
      );
    },
    async postRitualDamageSectionExample(t) {
      P();
      const n = t === "all" ? ["collapsed", "expanded", "without-result", "long-type"] : [t];
      return Promise.all(
        n.map(
          (a) => O(
            vf(a),
            "ritual-damage"
          )
        )
      );
    },
    async postRitualResistanceSectionExample(t) {
      P();
      const n = t === "all" ? ["enabled", "disabled", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => O(
            xf(a),
            "ritual-resistance"
          )
        )
      );
    },
    async postRitualMetadataExample(t) {
      P();
      const n = t === "all" ? ["default", "partial", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => O(
            Pf(a),
            "ritual-metadata"
          )
        )
      );
    },
    async postMetadataDetailRowExample(t) {
      P();
      const n = t === "all" ? ["short", "long", "generic"] : [t];
      return Promise.all(
        n.map(
          (a) => O(
            Of(a),
            "metadata-detail-row"
          )
        )
      );
    },
    async postRitualSingleTargetCardExample(t) {
      P();
      const n = t === "all" ? ["success", "failure", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => O(
            _f(Uf(a)),
            "ritual-single-target-card"
          )
        )
      );
    },
    async postAssistedActionButtonExample(t) {
      P();
      const n = t === "all" ? ["active", "disabled"] : [t];
      return Promise.all(n.map((a) => O(Mf(a), "assisted-action-button")));
    },
    async postAssistedActionRowExample(t) {
      P();
      const n = t === "all" ? ["active", "disabled", "completed"] : [t];
      return Promise.all(n.map((a) => O(Ff(a), "assisted-action-row")));
    },
    async postRitualAssistedActionsPanelExample(t) {
      P();
      const n = t === "all" ? ["pending", "available", "completed", "damage-only"] : [t];
      return Promise.all(n.map((a) => O(Bf(a), "ritual-assisted-actions-panel")));
    },
    clearChatCardExamples: e,
    clearChatCardHeaderExamples: e
  };
}
function zf(e) {
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
    conditions: of(e.conditions),
    debug: rf(e),
    dev: qf(),
    hooks: Gt
  }, n = globalThis;
  n[c] = t, n.ParanormalToolkit = t;
  const a = game.modules.get(c);
  return a && (a.api = t), t;
}
class qo {
  static isSupportedSystem() {
    return game.system.id === xd;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const Wn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function jf(e) {
  if (!Yf(e.item)) return null;
  const t = $a(e.actor) ? e.actor : Gf(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Hf(e.token) ?? Vf(t),
    targets: Rr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Gf(e) {
  const t = e;
  return $a(t.actor) ? t.actor : $a(e.parent) ? e.parent : null;
}
function Vf(e) {
  const t = Wf(e) ?? Kf(e);
  return t ? Fl(t) : null;
}
function Hf(e) {
  return wa(e) ? Fl(e) : null;
}
function Wf(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return wa(n) ? n : (t.getActiveTokens?.() ?? []).find(wa) ?? null;
}
function Kf(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Fl(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Kn(e.id),
    actorId: Kn(t?.id),
    sceneId: Kn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Yf(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function $a(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function wa(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Kn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Bl {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Wn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${Wn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = jf(Xf(t));
    if (!n) {
      f.warn(`${Wn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Xf(e) {
  return e && typeof e == "object" ? e : {};
}
function en(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function $r() {
  const e = globalThis.game;
  return $n(e) ? e : null;
}
function Q(e, t) {
  const n = Qf(e, t);
  return Ht(n);
}
function Qf(e, t) {
  return t.split(".").reduce((n, a) => $n(n) ? n[a] : null, e);
}
function Zf(e, t) {
  const n = e.indexOf(":");
  return n < 0 || yt(e.slice(0, n)) !== yt(t) ? null : et(e.slice(n + 1));
}
function Ht(e) {
  return typeof e == "string" ? et(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function $n(e) {
  return !!e && typeof e == "object";
}
function Jf(e) {
  return typeof e == "string";
}
function wn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function et(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function yt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Ca(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function fe(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Ul(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const tn = "abilityRollConfig", ql = [
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
], Sa = 20, Ia = 20, ep = [10, 40, 65, 99];
function zl() {
  return {
    schemaVersion: 1,
    rolls: [jl(1)]
  };
}
function jl(e) {
  return {
    id: np(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function tp() {
  return ep.map((e) => ({ minNex: e, formula: "" }));
}
function np() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function Gl(e) {
  return wr(
    e.getFlag(c, tn)
  );
}
function ap(e) {
  return Gl(e) ?? zl();
}
async function rp(e, t) {
  const n = wr(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(c, tn, n), n;
}
async function op(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, c, tn)
    );
    return;
  }
  await e.setFlag(c, tn, null);
}
function wr(e) {
  if (!Ve(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, Sa).map((a, r) => dp(a, r, t)).filter((a) => a !== null)
  };
}
function ip(e, t) {
  const n = Gl(t);
  return n ? sp(n, lp(e)) : [];
}
function sp(e, t) {
  const n = [];
  for (const a of e.rolls) {
    if (a.formula.mode === "fixed") {
      const l = a.formula.formula.trim();
      if (!l) continue;
      n.push({
        id: a.id,
        sourceRollId: a.id,
        label: a.label,
        intent: a.intent,
        damageType: a.intent === "damage" ? a.damageType : null,
        formula: l,
        nexThreshold: null
      });
      continue;
    }
    const r = a.formula.steps.filter(
      (l) => l.formula.trim().length > 0 && l.minNex <= t
    );
    if (r.length === 0) continue;
    const o = r.at(-1);
    if (!o) continue;
    const s = a.formula.resolution === "choose-unlocked" ? r : [o];
    for (const l of s)
      n.push({
        id: a.formula.resolution === "choose-unlocked" ? `${a.id}--nex-${l.minNex}` : a.id,
        sourceRollId: a.id,
        label: a.label,
        intent: a.intent,
        damageType: a.intent === "damage" ? a.damageType : null,
        formula: l.formula.trim(),
        nexThreshold: l.minNex
      });
  }
  return n;
}
function lp(e) {
  const t = Ve(e.system) ? e.system : {}, n = t.NEX ?? t.nex, a = Ve(n) ? n.value : n, r = typeof a == "number" ? a : Number(a);
  return Number.isFinite(r) ? Hl(r) : 0;
}
function Vl(e) {
  return ql.find((t) => t.value === e)?.label ?? e;
}
function cp(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function up(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function dp(e, t, n) {
  if (!Ve(e)) return null;
  const a = `roll-${t + 1}`, r = bp(hp(e.id, a), n), o = pp(e.intent), s = mp(e.formula);
  return !o || !s ? null : {
    id: r,
    label: Cn(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? yp(e.damageType) : null,
    formula: s
  };
}
function mp(e) {
  if (!Ve(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: Cn(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, Ia).map(fp).filter((a) => a !== null) : [];
  t.sort((a, r) => a.minNex - r.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const a of t) n.set(a.minNex, a);
  return {
    mode: "nex",
    resolution: gp(e.resolution),
    steps: [...n.values()]
  };
}
function fp(e) {
  if (!Ve(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: Hl(t),
    formula: Cn(e.formula)
  } : null;
}
function pp(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function gp(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function hp(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function bp(e, t) {
  let n = e, a = 2;
  for (; t.has(n); )
    n = `${e}-${a}`, a += 1;
  return t.add(n), n;
}
function Hl(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function Cn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function yp(e) {
  const t = Cn(e);
  return t.length > 0 ? t : null;
}
function Ve(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Cr = "data-paranormal-toolkit-ability-roll-id";
function _p(e) {
  if (!Wl(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = de(e.actorUuid), n = de(e.itemUuid), a = de(e.abilityName);
  if (!t) return null;
  const r = e.rolls.map(Ap).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: a || "Habilidade",
    rolls: r,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: Yn(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: Yn(e.resourceBefore),
    resourceAfter: Yn(e.resourceAfter)
  };
}
function Ap(e) {
  if (!Wl(e)) return null;
  const t = de(e.id), n = de(e.sourceRollId), a = de(e.label), r = de(e.formula), o = Tp(e.intent);
  if (!t || !n || !a || !r || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: a,
    formula: r,
    intent: o,
    damageType: o === "damage" ? Rp(e.damageType) : null,
    nexThreshold: s
  };
}
function Tp(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function de(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Rp(e) {
  const t = de(e);
  return t.length > 0 ? t : null;
}
function Yn(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function Wl(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const zo = "paranormalToolkitAbilityRollBound";
let jo = !1;
function Ep() {
  if (jo) return;
  jo = !0;
  const e = (t, n) => {
    kp(t, en(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function kp(e, t) {
  if (!t) return 0;
  const n = `[${Cr}]`, a = xp(t, n);
  let r = 0;
  for (const o of a)
    o.dataset[zo] !== "true" && (o.dataset[zo] = "true", o.addEventListener("click", () => {
      $p(e, o);
    }), r += 1);
  return r;
}
async function $p(e, t) {
  const n = t.getAttribute(Cr)?.trim();
  if (!n) return;
  const a = wp(e), r = a?.rolls.find((l) => l.id === n);
  if (!a || !r) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await Cp(a.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!Lp(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const s = Sp();
  if (!s) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível."
    );
    return;
  }
  Go(t, !0);
  try {
    const l = new s(
      r.formula,
      Ip(o)
    ), u = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      u.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: vp(a.abilityName, r)
      })
    );
  } catch (l) {
    console.warn(
      "Paranormal Toolkit: não foi possível executar a rolagem da habilidade.",
      l
    ), ui.notifications?.warn(
      `Paranormal Toolkit: não foi possível rolar ${r.label}. Revise a fórmula configurada.`
    );
  } finally {
    Go(t, !1);
  }
}
function wp(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : _p(
    t.getFlag(c, "abilityUse")
  );
}
async function Cp(e) {
  const t = globalThis;
  if (typeof t.fromUuid == "function")
    try {
      const o = await t.fromUuid(e);
      if (Vo(o)) return o;
    } catch (o) {
      f.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${e}.`,
        o
      );
    }
  const n = e.startsWith("Actor.") ? e.slice(6) : e, r = game.actors?.get?.(n);
  return Vo(r) ? r : null;
}
function Sp() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function Ip(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function Lp(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function vp(e, t) {
  const n = [Dp(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${Xn(e)}</strong>
      <span>${Xn(t.label)}</span>
      <small>${Xn(n.join(" · "))}</small>
    </div>
  `;
}
function Dp(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Vl(e.damageType)}` : "Dano";
  }
}
function xp(e, t) {
  const n = [];
  return e instanceof HTMLButtonElement && e.matches(t) && n.push(e), "querySelectorAll" in e && n.push(
    ...Array.from(e.querySelectorAll(t))
  ), n;
}
function Go(e, t) {
  e.disabled = t, e.classList.toggle(
    "paranormal-toolkit-ability-card__roll--busy",
    t
  );
  const n = e.querySelector("i");
  n && (n.classList.toggle("fa-dice-d20", !t), n.classList.toggle("fa-spinner", t), n.classList.toggle("fa-spin", t));
}
function Vo(e) {
  return !!(e && typeof e == "object" && "system" in e && ("uuid" in e || "id" in e));
}
function Xn(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const Np = "paranormal-toolkit-chat-message--full-width-card", Ho = ".paranormal-toolkit-ability-card", Wo = "li.chat-message";
let Ko = !1;
function Pp() {
  if (Ko) return;
  Ko = !0;
  const e = Hooks, t = (n, a) => {
    Yo(en(a));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), Yo(document);
}
function Yo(e) {
  if (!e) return 0;
  const t = Sr(e), n = Op(t), a = /* @__PURE__ */ new Set();
  for (const r of n) {
    const o = Mp(t, r);
    o?.classList && a.add(o);
  }
  for (const r of a)
    r.classList?.add(Np);
  return a.size;
}
function Op(e) {
  const t = [];
  e.matches?.(Ho) && t.push(e);
  const n = e.querySelectorAll?.(Ho);
  if (!n) return t;
  for (const a of Array.from(n)) {
    const r = Sr(a);
    t.includes(r) || t.push(r);
  }
  return t;
}
function Mp(e, t) {
  if (e.matches?.(Wo)) return e;
  const n = t.closest?.(Wo);
  return n ? Sr(n) : null;
}
function Sr(e) {
  return e && typeof e == "object" ? e : {};
}
function Fp(e) {
  const t = Bp(e.cost), n = Up(e.currentResource), a = t > 0 && !e.passive, r = n >= t;
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
      hasCost: a,
      canSpend: r,
      spendResourceChecked: a,
      toggleLabel: `Gastar ${t} ${e.resource} automaticamente`,
      costText: a ? `${t} ${e.resource}` : "Nenhum",
      currentText: `${n} ${e.resource}`,
      afterText: `${Math.max(0, n - t)} ${e.resource}`
    },
    passive: e.passive,
    primaryActionLabel: e.passive ? "Enviar ao chat" : "Usar habilidade"
  };
}
function Bp(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function Up(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: qp } = foundry.applications.api;
class gt extends qp {
  constructor(t, n) {
    super({
      id: `${c}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = Fp(t), this.spendResource = this.model.cost.spendResourceChecked;
  }
  resolveRequest;
  model;
  spendResource;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${c}-ability-use`,
    classes: [
      c,
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
      useAbility: gt.onUseAbility,
      cancel: gt.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new gt(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const a = document.createElement("div");
    return a.className = "paranormal-toolkit-ritual-cast paranormal-toolkit-ability-use", a.innerHTML = this.renderContent(), a;
  }
  _replaceHTML(t, n, a) {
    n.replaceChildren(t);
    const r = n.querySelector(".paranormal-toolkit-ability-use") ?? n;
    this.bindSpendResourceToggle(r), this.updateInteractiveState(r);
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
          src="${zp(this.model.header.image)}"
          alt=""
        >
        <div>
          <p class="paranormal-toolkit-ritual-cast__eyebrow">${G(this.model.header.eyebrow)}</p>
          <h2>${G(this.model.header.title)}</h2>
          <p>${G(this.model.header.subtitle)}</p>
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
          <span data-paranormal-toolkit-ability-submit-label>${G(this.model.primaryActionLabel)}</span>
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
            <span>${G(this.model.cost.toggleLabel)}</span>
          </label>
        </div>

        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>${G(this.model.cost.costText)}</dd></div>
          <div><dt>Recurso atual</dt><dd>${G(this.model.cost.currentText)}</dd></div>
          <div>
            <dt>Após o uso</dt>
            <dd data-paranormal-toolkit-ability-after>${G(this.model.cost.afterText)}</dd>
          </div>
        </dl>

        <div
          class="paranormal-toolkit-ability-use__warning"
          data-paranormal-toolkit-ability-warning
          aria-live="polite"
          ${t}
        >
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Você não possui ${G(this.model.cost.resource)} suficiente para pagar este custo.</span>
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
          <div><dt>Personagem</dt><dd>${G(this.model.header.actorName)}</dd></div>
        </dl>
        <p class="paranormal-toolkit-ability-use__note">${G(t)}</p>
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
    ), a = t.querySelector(
      "[data-paranormal-toolkit-ability-submit-label]"
    ), r = t.querySelector(
      "[data-paranormal-toolkit-ability-after]"
    ), o = t.querySelector(
      "[data-paranormal-toolkit-ability-warning]"
    ), s = this.model.cost.hasCost && this.spendResource && !this.model.cost.canSpend;
    n && (n.disabled = s), o && (o.hidden = !s), r && (r.textContent = this.spendResource ? this.model.cost.afterText : "Não será alterado"), a && !this.model.passive && (a.textContent = this.model.cost.hasCost ? this.spendResource ? "Usar habilidade" : "Usar sem gastar" : this.model.primaryActionLabel);
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
function G(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function zp(e) {
  return G(e);
}
function jp(e, t) {
  const n = Yp(t.system), a = nn(n.activation), r = Wp(a), o = Vp();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Xp(t),
    activation: a,
    activationLabel: Hp(a),
    description: nn(n.description),
    chatDescription: Gp(
      n.chatDescription,
      n.description
    ),
    cost: r ? 0 : Kp(n.cost),
    resource: o,
    passive: r,
    rolls: ip(e, t)
  };
}
function Gp(e, t) {
  const n = nn(e);
  return n.trim().length > 0 ? n : nn(t);
}
function Vp() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function Hp(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, a = Qp()?.(t) ?? t;
  return a === t ? e : a;
}
function Wp(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function Kp(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function Yp(e) {
  return e && typeof e == "object" ? e : {};
}
function nn(e) {
  return typeof e == "string" ? e : "";
}
function Xp(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function Qp() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class Zp {
  async publish(t, n, a) {
    const r = await rg(n), o = Jp({
      abilityName: n.name,
      abilityImage: n.image,
      actorName: n.actor.name ?? "Personagem sem nome",
      activationLabel: n.activationLabel,
      description: r,
      resource: n.resource,
      cost: n.cost,
      passive: n.passive,
      spentResource: a.spentResource,
      resourceBefore: a.resourceBefore,
      resourceAfter: a.resourceAfter,
      rolls: n.rolls
    }), s = {
      version: 2,
      actorUuid: n.actor.uuid ?? n.actor.id ?? "",
      itemUuid: n.item.uuid ?? n.item.id ?? "",
      abilityName: n.name,
      rolls: n.rolls,
      resource: n.resource,
      cost: n.cost,
      spentResource: a.spentResource,
      resourceBefore: a.resourceBefore,
      resourceAfter: a.resourceAfter
    }, l = {
      speaker: ChatMessage.getSpeaker({ actor: n.actor }),
      content: o,
      flags: {
        [c]: {
          abilityUse: s
        }
      }
    }, u = ag(t.message);
    if (Rl() === "replace" && u) {
      await u.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function Jp(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, a = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", r = eg(e.rolls), o = ng(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${La(e.abilityImage)}" alt="">
        <div>
          <span>Habilidade</span>
          <h3>${ue(e.abilityName)}</h3>
          <p>${ue(e.actorName)}</p>
        </div>
      </header>

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${ue(e.activationLabel)}</span>
        <span><strong>Custo</strong>${ue(t)}</span>
      </div>

      ${r}
      ${o}

      <footer class="paranormal-toolkit-ability-card__status ${a}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${ue(n)}</span>
      </footer>
    </article>
  `;
}
function eg(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const a = `paranormal-toolkit-ability-card__roll--${n.intent}`, r = tg(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${a}"
          ${Cr}="${La(n.id)}"
          title="${La(n.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${ue(n.label)}</strong>
            <small>${ue(r)}</small>
          </span>
          ${o}
        </button>
      `;
  }).join("")}
      </div>
    </section>
  `;
}
function tg(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Vl(e.damageType)}` : "Dano";
  }
}
function ng(e) {
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
function ag(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function ue(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function La(e) {
  return ue(e);
}
async function rg(e) {
  const t = e.chatDescription || e.description, n = og();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: ig(e.actor)
  });
}
function og() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function ig(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class sg {
  constructor(t, n, a = new Zp()) {
    this.resources = t, this.resourceAdapter = n, this.chatCards = a;
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
    if (!lg(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const a = jp(n, t.item), r = this.readCurrentResource(a);
    if (!r.ok)
      return this.fail(
        "resource-unavailable",
        r.message
      );
    const o = await gt.request({
      abilityName: a.name,
      abilityImage: a.image,
      actorName: n.name ?? "Personagem sem nome",
      activationLabel: a.activationLabel,
      resource: a.resource,
      cost: a.cost,
      currentResource: r.value,
      passive: a.passive
    });
    if (!o) return { status: "cancelled" };
    let s = r.value, l = s, u = !1;
    if (o.spendResource && a.cost > 0) {
      const d = await this.resources.spend(
        n,
        a.resource,
        a.cost
      );
      if (!d.ok) {
        const m = d.error.reason === "insufficient-resource" ? "insufficient-resource" : "resource-update-failed";
        return this.fail(m, d.error.message);
      }
      s = d.value.before.value, l = d.value.after.value, u = !0;
    }
    try {
      await this.chatCards.publish(t, a, {
        spentResource: u,
        resourceBefore: s,
        resourceAfter: l
      });
    } catch (d) {
      const m = await this.restoreSpentResource(
        a,
        u,
        s
      );
      return console.error(`${c} | Falha ao criar card de habilidade.`, d), this.fail(
        "chat-message-failed",
        m ? "Não foi possível registrar o uso da habilidade no chat. O recurso gasto foi restaurado." : "Não foi possível registrar o uso da habilidade nem restaurar o recurso. Verifique a ficha manualmente."
      );
    }
    return {
      status: "completed",
      spentResource: u,
      resource: a.resource,
      cost: a.cost
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
  async restoreSpentResource(t, n, a) {
    if (!n) return !0;
    try {
      return await this.resourceAdapter.updateResourceValue(
        t.actor,
        t.resource,
        a
      ), !0;
    } catch (r) {
      return console.error(
        `${c} | Falha ao restaurar recurso após erro no card de habilidade.`,
        r
      ), !1;
    }
  }
  fail(t, n) {
    return ui.notifications?.warn(n), { status: "failed", reason: t, message: n };
  }
}
function lg(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const Xo = 1e3;
class cg {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new sg(t, n), this.strategy = new Bl(
      (a) => this.handleItemUsed(a)
    );
  }
  register() {
    this.strategy.register(), Pp(), Ep(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (ka().executionMode === "disabled" || !dg(t.item)) return;
    const n = mg(t);
    if (!this.isDuplicate(n)) {
      this.inFlight.add(n);
      try {
        const a = await this.workflow.run(t);
        a.status === "completed" && this.recentExecutions.set(n, Date.now()), a.status === "failed" && f.warn(
          `Uso genérico de habilidade falhou: ${a.reason}.`,
          a
        );
      } finally {
        this.inFlight.delete(n), this.pruneRecentExecutions();
      }
    }
  }
  isDuplicate(t) {
    if (this.inFlight.has(t)) return !0;
    const n = this.recentExecutions.get(t);
    return n !== void 0 && Date.now() - n < Xo;
  }
  pruneRecentExecutions() {
    const t = Date.now() - Xo;
    for (const [n, a] of this.recentExecutions)
      a < t && this.recentExecutions.delete(n);
  }
}
function ug(e, t) {
  const n = new cg(e, t);
  return n.register(), n;
}
function dg(e) {
  if (e.type !== "ability") return !1;
  const t = hr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function mg(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let Qo = !1, Qn = !1, Zn = !1, Ot = null;
const fg = 1e3, pg = 750, gg = 1e3;
function hg(e) {
  Qo || (Hooks.on("combatTurnChange", (t) => {
    yg(e, Zo(t));
  }), Hooks.on("deleteCombat", (t) => {
    _g(e, Zo(t));
  }), Qo = !0, bg(e));
}
function bg(e) {
  Sn() && (Qn || (Qn = !0, globalThis.setTimeout(() => {
    Qn = !1, Ir(e, "ready");
  }, fg)));
}
function yg(e, t) {
  Sn() && t && (Ot && globalThis.clearTimeout(Ot), Ot = globalThis.setTimeout(() => {
    Ot = null, Ir(e, "combat-turn-change", t);
  }, pg));
}
function _g(e, t) {
  Sn() && t && (Zn || (Zn = !0, globalThis.setTimeout(() => {
    Zn = !1, Ir(e, "combat-deleted", t);
  }, gg)));
}
async function Ir(e, t, n) {
  if (Sn())
    try {
      const a = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      a.removedEffects > 0 && f.info(
        `Condition Engine removeu ${a.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const r of a.failures)
        f.warn(r.message);
    } catch (a) {
      f.warn("Condition Engine não conseguiu limpar condições expiradas.", a);
    }
}
function Sn() {
  return game.user?.isGM === !0;
}
function Zo(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Kl = {
  enabled: "dice.animations.enabled"
};
function Ag() {
  game.settings.register(c, Kl.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Tg() {
  return {
    enabled: game.settings.get(c, Kl.enabled) === !0
  };
}
const In = "chatCard", Jo = "data-paranormal-toolkit-prompt-id", i = `${c}-item-use-prompt`, Rg = `.${i}__title`, Yl = `.${i}__header`, Eg = `.${i}__roll-card`, kg = `.${i}__roll-meta`, $g = `.${i}__roll-meta-pill`, Lr = `.${i}__resistance`, wg = `.${i}__resistance-header`, Xl = `.${i}__resistance-description`, Ln = `.${i}__resistance-roll-button`, Ql = `.${i}__resistance-roll-result`, ei = `${i}__resistance-content`, Zl = `.${i}__workflow-section`, Jl = `.${i}__workflow-roll`, vr = `${i}__workflow-roll--dice-open`, Dr = `.${i}__workflow-roll-formula`, xr = `${i}__workflow-roll-formula--toggle`, vn = `.${i}__workflow-dice-tray`, Cg = `.${i}__roll-detail-toggle`, Sg = `.${i}__roll-detail-list`, Ig = `.${i}__ritual-element-badge`, Lg = `.${i}__ritual-metadata`, vg = "casting-backlash", Dg = "data-paranormal-toolkit-action-section", xg = "data-paranormal-toolkit-prompt-id", Ng = "data-paranormal-toolkit-pending-id", ti = "data-paranormal-toolkit-casting-backlash-enhanced", ni = `.${i}`, Pg = `.${i}__workflow-section--casting`, Og = `.${i}__workflow-section-header`, Mg = `.${i}__workflow-notes`, Fg = `[${Dg}="${vg}"]`, ai = `${i}__workflow-section-title-row`, Bg = `${i}__workflow-section-header--casting-backlash`, ec = `${i}__casting-backlash-button`;
function Ug(e) {
  for (const t of qg(e))
    zg(t), Wg(t);
}
function qg(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(ni) && t.add(e);
  for (const n of e.querySelectorAll(ni))
    t.add(n);
  return Array.from(t);
}
function zg(e) {
  const t = e.querySelector(Fg);
  if (!t) return;
  const n = jg(t);
  if (!n) return;
  const a = e.querySelector(`${Pg} ${Og}`);
  a && (a.classList.add(Bg), Gg(a), Vg(n), a.append(n), t.remove());
}
function jg(e) {
  return e.querySelector(
    `button[${Ng}], button[${xg}]`
  );
}
function Gg(e) {
  const t = e.querySelector(`:scope > .${ai}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(ai);
  const a = Array.from(e.childNodes);
  e.prepend(n);
  for (const r of a)
    r !== n && (r instanceof HTMLButtonElement && r.classList.contains(ec) || n.append(r));
  return n;
}
function Vg(e) {
  if (e.getAttribute(ti) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Hg(t, e.disabled);
  e.classList.add(ec), e.setAttribute(ti, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Hg(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Wg(e) {
  for (const t of e.querySelectorAll(Mg)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Kg(e) {
  for (const t of Array.from(e.querySelectorAll(Zl)))
    for (const n of Array.from(t.querySelectorAll(`${Cg}, ${Sg}`)))
      n.remove();
}
const Yg = {
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
}, Xg = new Set(
  Object.values(Yg)
), Qg = {
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
function Zg(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Jg(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Qg[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Xg.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function tc(e) {
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
function Jg(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class nc {
  async applyDamage(t) {
    const n = t.actor, a = n.name ?? "Ator sem nome", r = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return p({
        actor: n,
        actorId: r,
        actorName: a,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const o = n.applyDamage;
    if (typeof o != "function")
      return p({
        actor: n,
        actorId: r,
        actorName: a,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let u = null;
    for (const [d, m] of t.instances.entries()) {
      const g = eh(m, d);
      if (!g.ok)
        return p({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const _ = Zg(m.damageType);
      if (!_.ok)
        return p({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (g.amount === 0) {
        s.push(
          th(g.id, m, _.value)
        );
        continue;
      }
      try {
        const E = await Promise.resolve(
          o.call(n, g.amount, {
            damageType: _.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const k of ah(E.conditions))
          l.add(k);
        const R = nh(E.newPV);
        R !== null && (u = R), s.push({
          id: g.id,
          label: m.label ?? tc(_.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: g.amount,
          finalDamage: ri(E.finalDamage, g.amount),
          blocked: ri(E.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: _.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch (E) {
        return p({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${a}.`,
          instance: m,
          cause: E
        });
      }
    }
    return y({
      actor: n,
      actorId: r,
      actorName: a,
      totalRawDamage: s.reduce(
        (d, m) => d + m.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (d, m) => d + m.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (d, m) => d + m.blocked,
        0
      ),
      newPV: u,
      conditions: Array.from(l),
      instances: s,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function eh(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function th(e, t, n) {
  return {
    id: e,
    label: t.label ?? tc(n),
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
function ri(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function nh(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ah(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Nr {
  async rollResistance(t) {
    const n = await oh(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? we(t.skill),
      roll: n,
      formula: sh(n),
      total: lh(n),
      diceBreakdown: ch(n)
    };
  }
  getSkillLabel(t) {
    return we(t);
  }
}
async function rh(e, t) {
  return new Nr().rollResistance({ actor: e, skill: t });
}
function we(e) {
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
async function oh(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const a = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return ih(a);
}
function ih(e) {
  return oi(e) ? e : Array.isArray(e) ? e.find(oi) ?? null : null;
}
function oi(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function sh(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function lh(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function ch(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(uh);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function uh(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class ac {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class rc {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async rollResistance(t) {
    const n = t.skillLabel ?? this.adapter.getSkillLabel?.(t.skill) ?? t.skill, a = await this.adapter.rollResistance({ ...t, skillLabel: n });
    return {
      ...a,
      skill: a.skill || t.skill,
      skillLabel: a.skillLabel || n
    };
  }
  getSkillLabel(t) {
    return this.adapter.getSkillLabel?.(t) ?? t;
  }
}
function dh(e, t) {
  const n = yh(e?.rounds);
  if (!n)
    return ii(null);
  const a = e?.anchor ?? oc(t);
  if (!a)
    return {
      ...ii(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const r = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: mh(),
    start: {
      combat: a.combatId,
      combatant: a.combatantId,
      initiative: a.initiative,
      round: a.round,
      turn: a.turn,
      time: a.time
    },
    requestedRounds: n,
    combatDurationApplied: !0,
    combatId: a.combatId,
    startCombatantId: a.combatantId,
    startInitiative: a.initiative,
    startRound: a.round,
    startTurn: a.turn,
    expiryEvent: r,
    durationMode: "combatantTurn",
    warning: null
  };
}
function oc(e) {
  const t = _h();
  if (!t?.id || !ic(t.round)) return null;
  const n = hh(t), a = fh(e, n) ?? gh(t), r = ce(a?.id), o = Th(a?.initiative), s = ph(t, a, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: r,
    round: t.round,
    turn: s,
    initiative: o,
    time: Ah()
  };
}
function mh() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function ii(e) {
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
function fh(e, t) {
  return e?.id ? t.find((n) => bh(n) === e.id) ?? null : null;
}
function ph(e, t, n) {
  const a = ce(t?.id);
  if (a) {
    const r = n.findIndex((o) => o.id === a);
    if (r >= 0) return r;
  }
  return Rh(e.turn) ? e.turn : null;
}
function gh(e) {
  return Wt(e.combatant) ? e.combatant : null;
}
function hh(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Wt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Wt);
    const a = t.values;
    if (typeof a == "function")
      return Array.from(a.call(t)).filter(Wt);
  }
  return [];
}
function bh(e) {
  return ce(e.actor?.id) ?? ce(e.actorId) ?? ce(e.token?.actor?.id) ?? ce(e.token?.actorId) ?? ce(e.document?.actor?.id) ?? ce(e.document?.actorId);
}
function yh(e) {
  return ic(e) ? Math.trunc(e) : null;
}
function _h() {
  return game.combat ?? null;
}
function Ah() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Wt(e) {
  return !!(e && typeof e == "object");
}
function ce(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Th(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ic(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Rh(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class sc {
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
    const a = t.actor;
    if (!Dh(a))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const r = n.value, o = dh(t.duration, a), s = Eh(r, t, o), u = t.refreshExisting ?? !0 ? xh(a, r.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), y(si(a, r, u.id ?? null, !1, !0, o));
      } catch (d) {
        return p({
          actor: a,
          actorId: a.id ?? null,
          actorName: a.name ?? "Ator sem nome",
          conditionId: r.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${r.label} em ${a.name ?? "ator sem nome"}.`,
          cause: d
        });
      }
    try {
      const m = (await a.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return y(si(a, r, m, !0, !1, o));
    } catch (d) {
      return p({
        actor: a,
        actorId: a.id ?? null,
        actorName: a.name ?? "Ator sem nome",
        conditionId: r.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${r.label} em ${a.name ?? "ator sem nome"}.`,
        cause: d
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
    const a = this.resolveCanonicalConditionId(t.conditionId), r = cc(n, a);
    let o = 0;
    try {
      for (const s of r)
        await li(n, s) === "deleted" && (o += 1);
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
      conditionId: a,
      removed: o
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = Oh(), a = [];
    let r = 0, o = 0;
    for (const s of n) {
      const l = Pr(s);
      r += l.length;
      for (const u of l) {
        if (!wh(u, t)) continue;
        const d = lc(u);
        try {
          await li(s, u) === "deleted" && (o += 1);
        } catch (m) {
          a.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: u.id ?? null,
            conditionId: d.conditionId,
            message: `Falha ao remover condição expirada ${d.conditionId ?? u.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: m
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: r,
      removedEffects: o,
      failures: a
    };
  }
}
function Eh(e, t, n) {
  const a = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Hh(),
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
    changes: e.changes.map((r) => ({ ...r })),
    duration: kh(n.duration),
    start: $h(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: a
    }
  };
}
function kh(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function $h(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Vh(),
    ...e
  };
}
function si(e, t, n, a, r, o) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: a,
    refreshed: r,
    requestedRounds: o.requestedRounds,
    combatDurationApplied: o.combatDurationApplied,
    warning: o.warning
  };
}
function wh(e, t) {
  const n = lc(e);
  if (!n.conditionId || !Ch(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const a = Gh();
  return n.durationMode === "combatantTurn" || Sh(n) ? Lh(n, a) : Ih(e) || !a?.id || n.combatId && n.combatId !== a.id ? !0 : !Z(n.startRound) || !Z(n.requestedRounds) || !Z(a.round) ? !1 : a.round >= n.startRound + n.requestedRounds;
}
function Ch(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && Z(e.requestedRounds);
}
function Sh(e) {
  return !!(e.combatDurationApplied && Z(e.requestedRounds) && Z(e.startRound) && (e.startCombatantId || an(e.startTurn)));
}
function Ih(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Lh(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !Z(e.startRound) || !Z(e.requestedRounds) || !Z(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const a = vh(t);
  return e.startCombatantId ? a === e.startCombatantId : an(e.startTurn) && an(t.turn) ? t.turn === e.startTurn : !1;
}
function vh(e) {
  return Be(e.combatant?.id);
}
function lc(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Kt(e, "conditionId"),
    requestedRounds: ci(e, "requestedRounds") ?? dt(t.value) ?? dt(t.rounds),
    combatDurationApplied: Jn(e, "combatDurationApplied"),
    combatId: Kt(e, "combatId") ?? Be(n.combat) ?? Be(t.combat),
    startCombatantId: Kt(e, "startCombatantId") ?? Be(n.combatant),
    startInitiative: Uh(e, "startInitiative") ?? uc(n.initiative),
    startRound: ci(e, "startRound") ?? dt(n.round) ?? dt(t.startRound),
    startTurn: Bh(e, "startTurn") ?? va(n.turn) ?? va(t.startTurn),
    expiryEvent: qh(e, "expiryEvent") ?? dc(t.expiry),
    durationMode: zh(e, "durationMode"),
    deleteOnExpire: Jn(e, "deleteOnExpire"),
    expiresWithCombat: Jn(e, "expiresWithCombat")
  };
}
function Dh(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function xh(e, t) {
  return cc(e, t)[0] ?? null;
}
function cc(e, t) {
  return Pr(e).filter((n) => Fh(n) === t);
}
async function li(e, t) {
  const n = t.id ?? null, a = n ? Nh(e, n) : t;
  if (!a) return "missing";
  try {
    return await Promise.resolve(a.delete?.()), "deleted";
  } catch (r) {
    if (Ph(r)) return "missing";
    throw r;
  }
}
function Nh(e, t) {
  return Pr(e).find((n) => n.id === t) ?? null;
}
function Ph(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Oh() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Mt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Mt(e, n);
  });
  for (const n of Mh())
    Mt(e, n.actor), Mt(e, n.document?.actor);
  return Array.from(e.values());
}
function Mt(e, t) {
  if (!jh(t)) return;
  const a = Be(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(a, t);
}
function Mh() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Pr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Fh(e) {
  return Kt(e, "conditionId");
}
function Kt(e, t) {
  return Be(Le(e, t));
}
function ci(e, t) {
  return dt(Le(e, t));
}
function Bh(e, t) {
  return va(Le(e, t));
}
function Uh(e, t) {
  return uc(Le(e, t));
}
function qh(e, t) {
  return dc(Le(e, t));
}
function zh(e, t) {
  const n = Le(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Jn(e, t) {
  return Le(e, t) === !0;
}
function Le(e, t) {
  const n = e.getFlag?.(c, t);
  if (n !== void 0) return n;
  const a = e.flags;
  if (!a || typeof a != "object") return;
  const r = a[c];
  if (!(!r || typeof r != "object"))
    return r[t];
}
function Be(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function dt(e) {
  return Z(e) ? Math.trunc(e) : null;
}
function va(e) {
  return an(e) ? Math.trunc(e) : null;
}
function uc(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function dc(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function jh(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Gh() {
  return game.combat ?? null;
}
function Vh() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Z(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function an(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Hh() {
  return game.user?.id ?? null;
}
const Wh = "icons/svg/downgrade.svg", Kh = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function T(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Wh,
    description: Kh,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Yh = T({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Xh = T({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Qh = T({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Zh = T({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Jh = T({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), eb = T({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), tb = T({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), nb = T({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), ab = T({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), rb = T({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), ob = T({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), ib = T({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), sb = T({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), lb = T({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), cb = T({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), ub = T({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), db = T({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), mb = T({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), fb = T({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), pb = T({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), gb = T({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), hb = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), bb = T({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), yb = T({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), _b = T({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Ab = T({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Tb = T({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Rb = T({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Eb = T({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), kb = T({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), $b = T({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), wb = T({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Cb = T({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Sb = T({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Or = [
  Yh,
  Xh,
  Qh,
  Zh,
  Jh,
  eb,
  tb,
  nb,
  ab,
  rb,
  ob,
  ib,
  sb,
  lb,
  cb,
  ub,
  db,
  mb,
  fb,
  pb,
  gb,
  hb,
  bb,
  yb,
  _b,
  Ab,
  Tb,
  Rb,
  Eb,
  kb,
  $b,
  wb,
  Cb,
  Sb
];
class Ib {
  definitions = /* @__PURE__ */ new Map();
  lookup = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const n of t) {
      this.definitions.set(n.id, n), this.registerLookup(n.id, n.id), this.registerLookup(n.label, n.id);
      for (const a of n.aliases ?? [])
        this.registerLookup(a, n.id);
    }
  }
  list() {
    return Array.from(this.definitions.values()).map(di);
  }
  get(t) {
    const n = this.lookup.get(mi(t)), a = n ? this.definitions.get(n) : null;
    return a ? y(di(a)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const a = mi(t);
    a && this.lookup.set(a, n);
  }
}
function mc() {
  return new Ib(Or);
}
function di(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function mi(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function He(e) {
  return e.applyOnResistance ?? "failure";
}
function fc(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function pc(e, t) {
  const n = He(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function gc(e) {
  const t = He(e);
  return t === "failure" || t === "success";
}
function Lb(e, t, n, a) {
  const r = e.filter((u) => pc(u, t));
  if (r.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? r.filter((u) => He(u) === t) : [], s = o.length > 0 ? o : r;
  if (s.length === 1) return s[0] ?? null;
  const l = a(n);
  return l ? s.find((u) => [u.label, u.conditionId].some((d) => a(d) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const vb = {
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
}, Db = {
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
function xb(e) {
  return bc(e, vb, !1);
}
function Nb(e) {
  return bc(e, Db, !e.allowsSuccessfulResistance);
}
function tt(e) {
  return e.kind === "waiting-resistance";
}
function hc(e) {
  return e.kind === "resisted";
}
function bc(e, t, n) {
  const a = { ...t, ...e.labels };
  return e.alreadyApplied ? Ne("applied", !1, a.applied, a.appliedCompact, null) : e.unavailable ? Ne("unavailable", !1, a.unavailable, a.unavailableCompact, a.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || En(e.resistanceGateMode, e.resistanceState) ? Ne(
    "waiting-resistance",
    !1,
    a.waitingResistance,
    a.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Ne("resisted", !1, a.resisted, a.resistedCompact, a.resisted) : Ne("available", !0, a.available, a.availableCompact, null);
}
function Ne(e, t, n, a, r) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: a,
    reason: r
  };
}
const mt = "data-paranormal-toolkit-prompt-id", Pb = "data-paranormal-toolkit-resistance-roll-result", Ob = "Conjuração DT";
function Mb(e) {
  const t = e.querySelector(Ln)?.getAttribute(Pb), n = _t(t);
  if (n !== null) return n;
  const a = e.querySelector(Ql)?.textContent ?? null, r = a ? /=\s*(-?\d+)\s*$/u.exec(a) : null;
  return _t(r?.[1] ?? null);
}
function Mr(e) {
  const t = yc(e), n = qb(t);
  if (n !== null) return n;
  const a = Ub(t);
  return a !== null ? a : zb(e);
}
function Fb(e) {
  const t = yc(e);
  return t ? {
    actorId: ea(t.actorId),
    itemId: ea(t.itemId),
    itemName: ea(t.itemName)
  } : null;
}
function Bb(e) {
  const t = e.getAttribute(mt);
  if (!t) return null;
  const n = _c(e), a = Ac(n), s = (Array.isArray(a?.prompts) ? a.prompts : []).find((l) => Dn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function pe(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Da(e) {
  return pe(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Ub(e) {
  const t = Gb(e);
  return t.length === 0 ? null : _t(Vb(t, Ob));
}
function qb(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const a = game.actors?.get?.(t);
  return !a || typeof a != "object" ? null : fi(a, ["system", "ritual", "DT"]) ?? fi(a, ["system", "ritual", "dt"]);
}
function zb(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((a) => a.textContent).find((a) => typeof a == "string" && a.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return _t(n?.[1] ?? null);
}
function yc(e) {
  const t = jb(e);
  if (!t) return null;
  const n = _c(e), a = Ac(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => Dn(o) ? o.pendingId === t : !1) ?? null;
}
function jb(e) {
  return (e.closest(`[${mt}]`) ?? e.querySelector(`[${mt}]`) ?? e.parentElement?.querySelector(`[${mt}]`) ?? null)?.getAttribute(mt) ?? null;
}
function _c(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return Hb(r) ? r : null;
}
function Ac(e) {
  const t = e?.getFlag?.(c, In);
  return Dn(t) ? t : null;
}
function Gb(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Vb(e, t) {
  const n = `${t}:`;
  for (const a of e) {
    if (!a.startsWith(n)) continue;
    const r = a.slice(n.length).trim();
    if (r.length > 0) return r;
  }
  return null;
}
function fi(e, t) {
  let n = e;
  for (const a of t) {
    if (!Dn(n)) return null;
    n = n[a];
  }
  return typeof n == "number" ? Math.trunc(n) : _t(typeof n == "string" ? n : null);
}
function _t(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Hb(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Dn(e) {
  return !!(e && typeof e == "object");
}
function ea(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function xn(e) {
  return Tc({
    hasResistance: !!e.querySelector(Lr),
    difficulty: Mr(e),
    resistanceTotal: Mb(e)
  });
}
function Wb(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Tc({
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
function Tc(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: qm(e)
  };
}
function ve() {
  return game.user?.isGM === !0;
}
function Ce() {
  return ve();
}
function Kb(e) {
  const t = En(e.resistanceGateMode, e.resistanceState), n = Yb(e.resistanceState, e.hasDamage), a = Xb(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), r = xb({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Nb({
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
    damageActionState: r,
    effectActionState: o,
    damageMode: n,
    effectMode: a,
    blocksPendingResistance: t
  };
}
function Yb(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Xb(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Fr(e) {
  const t = e.isGM ?? Ce();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Kb({
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
function Qb(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const a = document.createElement("strong");
  a.classList.add(`${i}__workflow-roll-total`), a.textContent = e.total === null ? "—" : String(e.total), t.append(n, a);
  const r = Jb(e.formula, e.diceBreakdown ?? null);
  return r && t.append(r), t;
}
function Zb(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Jb(e, t) {
  const n = ey(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${i}__workflow-dice-tray`);
  for (const r of ty(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), r.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function ey(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function ty(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? pi(e, "highest") : n.includes("kl") ? pi(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function pi(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
const ny = "data-paranormal-toolkit-resistance-skill", ay = "data-paranormal-toolkit-resistance-skill-label", ry = "data-paranormal-toolkit-roll-card-target-names", oy = "data-paranormal-toolkit-roll-card-resistance", iy = "data-paranormal-toolkit-roll-card-resistance-skill", sy = "data-paranormal-toolkit-roll-card-resistance-skill-label", Rc = "pending", Br = "success", Ur = "failure", Ec = "rolled";
function ly(e) {
  const t = fy(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? dy(e.damageSection) : null, a = gi(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), r = cy(e.rollCard).map((o, s) => {
    const l = uy(o, s), u = e.resistanceResults.get(l) ?? null, d = _y(u, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, _ = Wb({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: u?.total ?? null,
      status: ky(d)
    }).state, E = gi(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      fc(_)
    ) ?? a;
    return {
      id: l,
      name: o,
      state: d,
      resistanceResult: u,
      damageApplication: m,
      effectApplication: g,
      effect: E,
      assistedActions: Fr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: _,
        damage: n,
        effect: E,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!g,
        effectCanApplyOnSuccessfulResistance: E?.applyOnResistance === "success" || E?.applyOnResistance === "always",
        effectRequiresResolvedResistance: E ? gc(E) : !1
      })
    };
  });
  return r.length <= 1 || !n && !a && !t ? null : {
    rollCard: e.rollCard,
    targets: r,
    damage: n,
    effect: a,
    resistance: t
  };
}
function cy(e) {
  const t = e.getAttribute(ry), n = t ? Ey(t) : [];
  if (n.length > 0) return n;
  const r = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = r.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && kc(s) !== "nenhum alvo") : [];
}
function uy(e, t) {
  return `${kc(e)}:${t}`;
}
function dy(e) {
  const t = Ay(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Ry(e),
    formula: Ty(e) ?? "—",
    total: t,
    diceBreakdown: Zb(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function gi(e, t, n, a) {
  const r = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, r ?? null, a);
  return o ? {
    label: r && r.length > 0 ? r : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: my(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: He(o)
  } : null;
}
function my(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function fy(e, t) {
  const n = gy(t), a = py(e), r = a.description ?? hy(n)?.textContent?.trim(), o = by(n), s = a.skill ?? o?.getAttribute(ny) ?? null, l = a.skillLabel ?? o?.getAttribute(ay) ?? (s ? we(s) : null);
  return !r && !s ? null : {
    description: r ?? "Resistência do alvo.",
    formula: yy(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: Mr(e)
  };
}
function py(e) {
  return {
    description: ta(e, oy),
    skill: ta(e, iy),
    skillLabel: ta(e, sy)
  };
}
function gy(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function hy(e) {
  return qr(e, `.${i}__resistance-description`);
}
function by(e) {
  return qr(e, Ln);
}
function yy(e) {
  return qr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function qr(e, t) {
  for (const n of e) {
    const a = n.querySelector(t);
    if (a) return a;
  }
  return null;
}
function _y(e, t) {
  return e ? t === null ? Ec : e.total >= t ? Br : Ur : Rc;
}
function Ay(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Ty(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Ry(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Ey(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function ta(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function kc(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function ky(e) {
  return e === Br ? "succeeded" : e === Ur ? "failed" : "pending";
}
function $c(e) {
  if (!e) return null;
  const t = e.actorId ? Cy(e.actorId) : null, n = t ? $y(t, e.itemId, e.itemName) : null;
  return n || wy(e.itemId, e.itemName);
}
function $y(e, t, n) {
  const a = e.items;
  if (t) {
    const o = a?.get?.(t);
    if (Ue(o)) return o;
  }
  const r = rn(n);
  if (r) {
    const o = a?.find?.((s) => Ue(s) ? rn(s.name) === r : !1);
    if (Ue(o)) return o;
  }
  return null;
}
function wy(e, t) {
  const n = game.items;
  if (e) {
    const r = n?.get?.(e);
    if (Ue(r)) return r;
  }
  const a = rn(t);
  if (a) {
    const r = n?.find?.((o) => Ue(o) ? rn(o.name) === a : !1);
    if (Ue(r)) return r;
  }
  return null;
}
function Cy(e) {
  const n = game.actors?.get?.(e);
  return Sy(n) ? n : null;
}
function Sy(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ue(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function rn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function zr(e) {
  const t = na(e);
  if (!t) return null;
  const n = Iy().filter((o) => na(Ly(o)) === t).map((o) => wc(o)).find(ht) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => ht(o) && na(o.name) === t);
  return ht(r) ? r : null;
}
function Iy() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Ly(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : wc(e)?.name ?? null;
}
function wc(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ht(t)) return t;
  const n = e.document?.actor;
  return ht(n) ? n : null;
}
function ht(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function na(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Cc(e) {
  const t = Ny();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: vy(e)
  });
}
function vy(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Yt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", a = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", r = Dy(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Yt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Yt(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${a}
        ${r}
        ${o}
      </ul>
    </div>
  `;
}
function Dy(e) {
  const t = xy(e.actor), n = e.newPV ?? t?.value ?? null, a = t?.max ?? null;
  if (n === null) return "";
  const r = a === null ? `${n}` : `${n}/${a}`;
  return `<li><strong>PV atual</strong>: ${Yt(r)}</li>`;
}
function xy(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, a = hi(n?.value);
  return a === null ? null : {
    value: a,
    max: hi(n?.max)
  };
}
function hi(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ny() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Yt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function Py(e) {
  await Cc(Oy(e));
}
function Oy(e) {
  if (My(e)) return e;
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
function My(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Sc(e) {
  return e.mode, `✓ ${Ic(e.inputAmount)} PV`;
}
function Fy(e) {
  const t = Ic(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ic(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class By {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? Ce()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : En(t.resistanceGateMode, t.resistanceState) ? {
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
class Uy {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? Ce()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : En(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
  block(t, n, a) {
    return {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: n,
        message: a
      }
    };
  }
}
class qy {
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
const zy = `.${i}__actions`, jr = `.${i}__actions-title`, We = `.${i}__button`, jy = "data-paranormal-toolkit-action-section", Gy = `${i}__button--executed`, Vy = "data-paranormal-toolkit-executed-label";
function Lc(e) {
  return pe(e.querySelector(jr)?.textContent);
}
function Hy(e, t) {
  const n = e.querySelector(jr);
  n && (n.textContent = t);
}
function wt(e, t) {
  const n = pe(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((a) => {
    const r = a.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return pe(r) === n;
  }) ?? null;
}
function Gr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function De(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function vc(e) {
  const t = Wy(e.difficulty);
  if (t === null) return null;
  const n = bi(e.skillLabel) ?? "Resistência", a = bi(e.description), r = Ky(a, n), o = Yy(r, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Wy(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function bi(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Ky(e, t) {
  if (!e) return null;
  const n = yi(e), a = yi(t);
  if (!n.startsWith(a)) return e;
  const r = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return r.length > 0 ? r : null;
}
function Yy(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const a = Number(n[1]);
  if (!Number.isFinite(a) || a !== t) return e;
  const r = e.slice(n[0].length).trim();
  return r.length > 0 ? r : null;
}
function yi(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const Ft = "data-paranormal-toolkit-prompt-id", Dc = "multiTargetResistanceResults", xc = "multiTargetDamageApplications", Nc = "multiTargetEffectApplications";
function Xy(e) {
  const t = /* @__PURE__ */ new Map(), a = Nn(e)?.[Dc];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    a_(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function Qy(e, t) {
  await Vr(e, Dc, t.targetId, t);
}
function Zy(e) {
  const t = /* @__PURE__ */ new Map(), a = Nn(e)?.[xc];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    r_(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function Jy(e, t) {
  await Vr(
    e,
    xc,
    t.targetId,
    t
  );
}
function e_(e) {
  const t = /* @__PURE__ */ new Map(), a = Nn(e)?.[Nc];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    i_(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function t_(e, t) {
  await Vr(
    e,
    Nc,
    t.targetId,
    t
  );
}
function n_(e) {
  const t = Nn(e);
  return t ? {
    actorId: aa(t.actorId),
    itemId: aa(t.itemId),
    itemName: aa(t.itemName)
  } : null;
}
async function Vr(e, t, n, a) {
  const r = Pc(e);
  if (!r) return;
  const o = Oc(e), s = Mc(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const u = s.prompts.map((d) => {
    if (!J(d) || d.pendingId !== r) return d;
    const m = J(d[t]) ? d[t] : {};
    return l = !0, {
      ...d,
      [t]: {
        ...m,
        [n]: a
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(c, In, {
    ...s,
    prompts: u
  }));
}
function Nn(e) {
  const t = Pc(e);
  if (!t) return null;
  const n = Oc(e), a = Mc(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => J(o) ? o.pendingId === t : !1) ?? null;
}
function Pc(e) {
  return (e.closest(`[${Ft}]`) ?? e.querySelector(`[${Ft}]`) ?? e.parentElement?.querySelector(`[${Ft}]`) ?? null)?.getAttribute(Ft) ?? null;
}
function Oc(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return s_(r) ? r : null;
}
function Mc(e) {
  const t = e?.getFlag?.(c, In);
  return J(t) ? t : null;
}
function a_(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function r_(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && o_(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function o_(e) {
  return e === "normal" || e === "half";
}
function i_(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function aa(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function s_(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function J(e) {
  return !!(e && typeof e == "object");
}
const l_ = "data-paranormal-toolkit-resistance-skill", c_ = "data-paranormal-toolkit-resistance-skill-label", xa = "data-paranormal-toolkit-multi-target-section", Hr = "data-paranormal-toolkit-multi-target-damage-info", Fc = "data-paranormal-toolkit-multi-target-effect-info", Bc = "data-paranormal-toolkit-multi-target-toggle", Uc = "data-paranormal-toolkit-multi-target-details", K = "data-paranormal-toolkit-multi-target-target", u_ = "data-paranormal-toolkit-multi-target-state", Na = "data-paranormal-toolkit-multi-target-roll-total", Pa = "data-paranormal-toolkit-multi-target-roll-formula", Xt = "data-paranormal-toolkit-multi-target-roll-dice", Oa = "data-paranormal-toolkit-multi-target-roll-skill", Ma = "data-paranormal-toolkit-multi-target-roll-skill-label", Fa = "data-paranormal-toolkit-multi-target-roll-target-name", Ba = "data-paranormal-toolkit-multi-target-roll-rolled-at", Ua = "data-paranormal-toolkit-multi-target-damage-mode", qa = "data-paranormal-toolkit-multi-target-damage-input-amount", _i = "data-paranormal-toolkit-multi-target-damage-final-amount", Ai = "data-paranormal-toolkit-multi-target-damage-blocked", za = "data-paranormal-toolkit-multi-target-damage-target-name", ja = "data-paranormal-toolkit-multi-target-damage-applied-at", Ga = "data-paranormal-toolkit-multi-target-effect-condition-id", Va = "data-paranormal-toolkit-multi-target-effect-condition-label", Ha = "data-paranormal-toolkit-multi-target-effect-effect-id", Wa = "data-paranormal-toolkit-multi-target-effect-created", Ka = "data-paranormal-toolkit-multi-target-effect-refreshed", Ya = "data-paranormal-toolkit-multi-target-effect-target-name", Xa = "data-paranormal-toolkit-multi-target-effect-applied-at", d_ = new sc(mc()), m_ = new ac(new nc()), f_ = new rc(new Nr()), p_ = new qy(f_), g_ = new By(m_), h_ = new Uy(d_), b_ = Rc, nt = Br, Ct = Ur, y_ = Ec;
function __(e) {
  const t = qc(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), S_(e);
  const n = I_(e.rollCard, t), a = L_(e.rollCard, t);
  !n && a && mA(e.rollCard, a, e.effectSection);
  const r = O_(e.rollCard);
  return Gc(r, t), cA(
    e.rollCard,
    r,
    v_(e.rollCard, {
      damageInfo: n,
      effectInfo: a,
      effectSection: e.effectSection
    })
  ), n && a && fA(e.rollCard, a, r), !0;
}
function qc(e) {
  return ly({
    ...e,
    resistanceResults: R_(e.rollCard),
    damageApplications: E_(e.rollCard),
    effectApplications: k_(e.rollCard),
    resolveTargetConditionApplication: A_,
    resistanceGateMode: Kr()
  });
}
function A_(e, t, n) {
  const a = n_(e), r = $c(a);
  if (!r) return null;
  const o = kt(r);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((u) => u.actor === "target");
  if (s.length === 0) return null;
  const l = T_(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function T_(e, t, n) {
  const a = Lb(
    e,
    n,
    t,
    ra
  );
  if (a) return a;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const r = ra(t);
  return r ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => ra(s) === r)) ?? null : null;
}
function R_(e) {
  const t = Xy(e);
  for (const [n, a] of C_(e))
    t.set(n, a);
  return t;
}
function E_(e) {
  const t = Zy(e);
  for (const [n, a] of w_(e))
    t.set(n, a);
  return t;
}
function k_(e) {
  const t = e_(e);
  for (const [n, a] of $_(e))
    t.set(n, a);
  return t;
}
function $_(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${K}]`)) {
    const a = n.getAttribute(K), r = n.getAttribute(Ga), o = n.getAttribute(Va), s = n.getAttribute(Ha), l = Ei(n.getAttribute(Wa)), u = Ei(n.getAttribute(Ka)), d = n.getAttribute(Ya), m = n.getAttribute(Xa);
    !a || !r || !o || l === null || u === null || !d || !m || t.set(a, {
      targetId: a,
      targetName: d,
      conditionId: r,
      conditionLabel: o,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: u,
      appliedAt: m
    });
  }
  return t;
}
function w_(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${K}]`)) {
    const a = n.getAttribute(K), r = n.getAttribute(Ua), o = eu(n.getAttribute(qa)), s = n.getAttribute(za), l = n.getAttribute(ja);
    !a || !hA(r) || o === null || !s || !l || t.set(a, {
      targetId: a,
      targetName: s,
      mode: r,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function C_(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${K}]`)) {
    const a = n.getAttribute(K), r = eu(n.getAttribute(Na)), o = n.getAttribute(Pa), s = n.getAttribute(Oa), l = n.getAttribute(Ma), u = n.getAttribute(Fa), d = n.getAttribute(Ba);
    !a || r === null || !o || !s || !l || !u || !d || t.set(a, {
      targetId: a,
      targetName: u,
      skill: s,
      skillLabel: l,
      formula: o,
      total: r,
      diceBreakdown: n.getAttribute(Xt),
      rolledAt: d
    });
  }
  return t;
}
function S_(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function I_(e, t) {
  if (!t.damage)
    return zc(e)?.remove(), null;
  const n = D_(e);
  return x_(n, t.damage), P_(e, n), n;
}
function L_(e, t) {
  if (!t.effect)
    return Jc(e)?.remove(), null;
  const n = uA(e);
  return dA(n, t.effect), n;
}
function v_(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : wt(e, "Conjuração");
}
function D_(e) {
  const t = zc(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Hr, "true"), n;
}
function zc(e) {
  return e.querySelector(`[${Hr}="true"]`);
}
function x_(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const a = document.createElement("strong");
  if (a.textContent = "Dano", n.append(a), e.append(n), t.typeLabel) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-section-description`), r.textContent = t.typeLabel, e.append(r);
  }
  e.append(jc(t.formula, t.total, t.diceBreakdown));
}
function jc(e, t, n, a = !1) {
  const r = Qb({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return N_(r, a), r;
}
function N_(e, t) {
  const n = e.querySelector(vn), a = e.querySelector(Dr);
  if (!n || !a) return;
  e.classList.toggle(vr, t), n.hidden = !t, a.classList.add(xr), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-expanded", t ? "true" : "false"), a.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", a.setAttribute("aria-label", a.title);
  const r = a.querySelector("i") ?? document.createElement("i");
  r.classList.add("fa-solid"), r.classList.toggle("fa-chevron-down", !t), r.classList.toggle("fa-chevron-up", t), r.setAttribute("aria-hidden", "true"), r.parentElement || a.append(r);
}
function P_(e, t) {
  const n = wt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function O_(e) {
  const t = e.querySelector(`[${xa}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(xa, "true"), n;
}
function Gc(e, t) {
  const n = M_(e), a = B_(t.resistance), r = [F_(t)];
  a && r.push(a), r.push(z_(t, n)), e.replaceChildren(...r);
}
function M_(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${K}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(K)).filter(gA)
  );
}
function F_(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const a = document.createElement("span");
  return a.classList.add(`${i}__targets-status`), a.textContent = q_(e.targets), t.append(n, a), t;
}
function B_(e) {
  const t = vc({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), U_(n, t), n;
}
function U_(e, t) {
  const n = document.createElement("span");
  n.classList.add(`${i}__resistance-label-skill`), n.textContent = t.skillLabel;
  const a = document.createElement("strong");
  a.classList.add(`${i}__resistance-label-difficulty`), a.textContent = t.difficultyLabel;
  const r = [n, document.createTextNode(" · "), a];
  if (t.description) {
    const o = document.createElement("span");
    o.classList.add(`${i}__resistance-label-effect`), o.textContent = t.description, r.push(document.createTextNode(" · "), o);
  }
  e.replaceChildren(...r);
}
function q_(e) {
  const t = e.length, n = e.filter((l) => l.state === Ct).length, a = e.filter((l) => l.state === nt).length, r = e.filter((l) => l.state === b_).length, o = e.filter((l) => l.state === y_).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), a > 0 && s.push(`${a} ${a === 1 ? "sucesso" : "sucessos"}`), r > 0 && s.push(`${r} ${r === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function z_(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const a of e.targets)
    n.append(j_(a, e, t.has(a.id)));
  return n;
}
function j_(e, t, n) {
  const a = document.createElement("article");
  a.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && a.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && a.classList.add(`${i}__target-row--effect-applied`), a.setAttribute(K, e.id), a.setAttribute(u_, e.state), a.setAttribute("aria-expanded", n ? "true" : "false"), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Vc(a, e.resistanceResult), Hc(a, e.damageApplication), Wc(a, e.effectApplication);
  const r = G_(e, t, a), o = oA(e, t);
  return o.hidden = !n, a.addEventListener("click", (s) => {
    Ri(s.target) || Ti(a);
  }), a.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || Ri(s.target) || (s.preventDefault(), Ti(a));
  }), a.append(r, o), a;
}
function Vc(e, t) {
  if (!t) {
    e.removeAttribute(Na), e.removeAttribute(Pa), e.removeAttribute(Xt), e.removeAttribute(Oa), e.removeAttribute(Ma), e.removeAttribute(Fa), e.removeAttribute(Ba);
    return;
  }
  e.setAttribute(Na, String(t.total)), e.setAttribute(Pa, t.formula), e.setAttribute(Oa, t.skill), e.setAttribute(Ma, t.skillLabel), e.setAttribute(Fa, t.targetName), e.setAttribute(Ba, t.rolledAt), t.diceBreakdown ? e.setAttribute(Xt, t.diceBreakdown) : e.removeAttribute(Xt);
}
function Hc(e, t) {
  if (!t) {
    e.removeAttribute(Ua), e.removeAttribute(qa), e.removeAttribute(_i), e.removeAttribute(Ai), e.removeAttribute(za), e.removeAttribute(ja);
    return;
  }
  e.setAttribute(Ua, t.mode), e.setAttribute(qa, String(t.inputAmount)), e.removeAttribute(_i), e.removeAttribute(Ai), e.setAttribute(za, t.targetName), e.setAttribute(ja, t.appliedAt);
}
function Wc(e, t) {
  if (!t) {
    e.removeAttribute(Ga), e.removeAttribute(Va), e.removeAttribute(Ha), e.removeAttribute(Wa), e.removeAttribute(Ka), e.removeAttribute(Ya), e.removeAttribute(Xa);
    return;
  }
  e.setAttribute(Ga, t.conditionId), e.setAttribute(Va, t.conditionLabel), e.setAttribute(Ha, t.effectId ?? ""), e.setAttribute(Wa, String(t.created)), e.setAttribute(Ka, String(t.refreshed)), e.setAttribute(Ya, t.targetName), e.setAttribute(Xa, t.appliedAt);
}
function G_(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary`);
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary-main`);
  const o = V_(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = H_(e, t.resistance);
  X_(l, n, e, t);
  const u = rA(n);
  r.append(o, s, l, u);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), Qc(d, [
    Kc(e, t, "compact"),
    Xc(e, t, "compact")
  ]), a.append(r, d), a;
}
function V_(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function H_(e, t) {
  if (!ve())
    return W_(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Y_(e, t)), t?.skill && (n.setAttribute(l_, t.skill), n.setAttribute(c_, t.skillLabel ?? we(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const o = document.createElement("i");
    o.classList.add("fa-solid", "fa-dice-d20"), o.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${i}__target-resistance-fallback`), s.textContent = "d20", n.append(o, s), n;
  }
  const a = document.createElement("span");
  a.classList.add(`${i}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${i}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === nt ? "✓" : e.state === Ct ? "✕" : "", n.append(a, r), n;
}
function W_(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", K_(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const a = document.createElement("span");
  a.classList.add(`${i}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${i}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === nt ? "✓" : e.state === Ct ? "✕" : "", n.append(a, r), n;
}
function K_(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const a = e.state === nt ? "sucesso" : e.state === Ct ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}.`;
}
function Y_(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const a = e.state === nt ? "sucesso" : e.state === Ct ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}. Rolar novamente`;
}
function X_(e, t, n, a) {
  !(e instanceof HTMLButtonElement) || !ve() || e.addEventListener("click", (r) => {
    r.stopPropagation(), Q_(t, e, n, a);
  });
}
async function Q_(e, t, n, a) {
  if (!ve()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const r = a.resistance, o = r?.skill, s = r?.skillLabel ?? (o ? we(o) : "Resistência");
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
  const u = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await p_.execute({ actor: l, skill: o, skillLabel: s });
    await pA(d.roll);
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: o,
      skillLabel: s,
      formula: d.formula,
      total: d.total,
      diceBreakdown: d.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Vc(e, m);
    try {
      await Qy(a.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", g);
    }
    Wr(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = u;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Wr(e) {
  const t = e.closest(`[${xa}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const a = qc({
    rollCard: n,
    damageSection: Z_(n) ?? wt(n, "Dano"),
    effectSection: J_(n)
  });
  a && Gc(t, a);
}
function Z_(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Hr) !== "true") ?? null;
}
function J_(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function eA(e) {
  return tt(e.assistedActions.policy.damageActionState);
}
function tA(e) {
  return tt(e.assistedActions.policy.effectActionState);
}
function Kr() {
  try {
    return Er();
  } catch {
    return "strict";
  }
}
function Kc(e, t, n) {
  if (e.damageApplication)
    return me(
      "✓",
      Sc({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const a = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (tt(a))
    return me(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const r = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = Yc(r, t.damage);
  if (o === null)
    return me(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Fy({ inputAmount: o, mode: r, compact: n === "compact" }), l = r === "half" ? "🛡️" : "⚡", u = r === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, d = me(
    l,
    s,
    [`${i}__target-action--damage`, u],
    !1
  );
  return d.title = `Aplicar ${s} em ${e.name}`, d.setAttribute("aria-label", d.title), d.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = d.closest(`[${K}]`);
    g && nA(g, d, e, t);
  }), d;
}
function Yc(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function nA(e, t, n, a) {
  if (n.damageApplication) return;
  if (eA(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const r = a.damage;
  if (!r) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = Yc(o, r);
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
  const u = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const d = await g_.execute({
      actor: l,
      amount: s,
      damageType: r.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Kr(),
      resistanceState: n.assistedActions.resistanceState
    });
    if (!d.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${d.error.message}`), t.innerHTML = u;
      return;
    }
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      mode: o,
      inputAmount: s,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Hc(e, m);
    try {
      await Jy(a.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await Py(d.value);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", g);
    }
    Wr(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = u;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function Xc(e, t, n) {
  const a = e.assistedActions.policy.effectActionState, r = e.effect ?? t.effect;
  if (e.effectApplication)
    return me(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!r) return null;
  if (tt(a))
    return me(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (hc(a))
    return me(
      "✓",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = me(
    "✦",
    n === "full" ? `Aplicar ${r.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${r.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${K}]`);
    l && aA(l, o, e, t);
  }), o;
}
async function aA(e, t, n, a) {
  if (n.effectApplication) return;
  if (tA(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }
  if (n.assistedActions.policy.effectMode === "resisted") {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }
  const r = n.effect ?? a.effect;
  if (!r) {
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
    const l = await h_.execute({
      actor: o,
      conditionId: r.conditionId,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source,
      resistanceGateMode: Kr(),
      resistanceState: n.assistedActions.resistanceState,
      allowSuccessfulResistance: r.applyOnResistance === "success" || r.applyOnResistance === "always",
      requiredResistanceOutcome: r.applyOnResistance === "success" ? "succeeded" : r.applyOnResistance === "failure" ? "failed" : null
    });
    if (!l.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${l.error.message}`), t.innerHTML = s;
      return;
    }
    const u = {
      targetId: n.id,
      targetName: l.value.actorName,
      conditionId: l.value.conditionId,
      conditionLabel: l.value.conditionLabel,
      effectId: l.value.effectId,
      created: l.value.created,
      refreshed: l.value.refreshed,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Wc(e, u);
    try {
      await t_(a.rollCard, u);
    } catch (d) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", d);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Wr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function Qc(e, t) {
  for (const n of t)
    n && e.append(n);
}
function me(e, t, n, a) {
  const r = document.createElement("button");
  r.type = "button", r.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), r.disabled = a;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, r.append(o, s), r;
}
function rA(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Bc, "true"), t.setAttribute("aria-hidden", "true"), Zc(e, t), t;
}
function Ti(e) {
  const t = e.querySelector(`[${Uc}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const a = e.querySelector(`[${Bc}="true"]`);
  a && Zc(e, a);
}
function Zc(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function Ri(e) {
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
function oA(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Uc, "true");
  const a = document.createElement("div");
  a.classList.add(`${i}__target-resistance-details`);
  const r = document.createElement("strong");
  r.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", a.append(r, o);
  const s = iA(e, t.resistance);
  s && a.append(s);
  const l = sA(e, t.resistance), u = lA(e, t);
  return n.append(a, l, u), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function iA(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const a = e.state === nt ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${a}`, n;
}
function sA(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const a = e.resistanceResult?.formula ?? t?.formula ?? "—", r = e.resistanceResult?.total ?? null, o = jc(
    a,
    r,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function lA(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), Qc(n, [
    Kc(e, t, "full"),
    Xc(e, t, "full")
  ]), n;
}
function cA(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function uA(e) {
  const t = Jc(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Fc, "true"), n;
}
function Jc(e) {
  return e.querySelector(`[${Fc}="true"]`);
}
function dA(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const a = document.createElement("strong");
  a.textContent = "Efeito", n.append(a);
  const r = document.createElement("div");
  r.classList.add(`${i}__effect-info-body`);
  const o = document.createElement("span");
  o.classList.add(`${i}__effect-info-label`), o.textContent = t.label;
  const s = document.createElement("span");
  s.classList.add(`${i}__effect-info-hint`), s.textContent = "Aplicação por alvo", r.append(o, s), e.append(n, r);
}
function mA(e, t, n) {
  const a = n?.parentElement === e ? n : wt(e, "Conjuração");
  if (!a) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === a || e.insertBefore(t, a.nextElementSibling);
}
function fA(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ra(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function pA(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function gA(e) {
  return typeof e == "string" && e.length > 0;
}
function hA(e) {
  return e === "normal" || e === "half";
}
function Ei(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function eu(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const ki = "data-paranormal-toolkit-card-layout-refresh-bound";
function bA(e) {
  const t = e.rollCard.querySelector(Ln);
  t && t.getAttribute(ki) !== "true" && (t.setAttribute(ki, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const qe = "data-paranormal-toolkit-prompt-id", yA = "apply-damage", _A = "data-paranormal-toolkit-multi-target-damage-info";
function AA(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(_A) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function TA(e) {
  const t = EA(e);
  return t.find((n) => n.getAttribute(jy) === yA) ?? t.find((n) => Lc(n) === "aplicar danos") ?? null;
}
function RA(e) {
  const t = tu(e), n = $i(t);
  return n || $i(kA(e));
}
function $i(e) {
  return e.find((t) => {
    const n = Lc(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function EA(e) {
  const t = tu(e);
  return t.length > 0 ? t : Yr(e);
}
function tu(e) {
  const t = CA(e);
  return t ? Yr(e).filter((n) => wA(n, t)) : [];
}
function kA(e) {
  const t = nu(e);
  if (!t) return [];
  const n = $A(e, t);
  return Yr(e).filter((a) => !a.closest(`.${i}__roll-card`)).filter((a) => au(e, a)).filter((a) => !n || SA(a, n));
}
function Yr(e) {
  const t = nu(e);
  return t ? Array.from(t.querySelectorAll(zy)) : [];
}
function nu(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function $A(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && au(e, n)) ?? null;
}
function wA(e, t) {
  return e.getAttribute(qe) === t ? !0 : Array.from(e.querySelectorAll(`[${qe}]`)).some((n) => n.getAttribute(qe) === t);
}
function CA(e) {
  return e.getAttribute(qe) ?? e.querySelector(`[${qe}]`)?.getAttribute(qe) ?? null;
}
function au(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function SA(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function IA(e) {
  const t = ru(), n = xn(e.rollCard).state, a = Fr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), r = a.policy.effectActionState, o = tt(r), s = hc(r);
  return e.applied ? st({
    kind: "applied",
    visible: !0,
    enabled: !1,
    applied: !0,
    waitingForResistance: o,
    resisted: s,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: r,
    resistanceState: n
  }) : a.policy.canShowApplyEffect ? st(o ? {
    kind: "waiting-resistance",
    visible: !0,
    enabled: !1,
    applied: !1,
    waitingForResistance: !0,
    resisted: !1,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: r,
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
    actionState: r,
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
    actionState: r,
    resistanceState: n
  }) : st({
    kind: "hidden",
    visible: !1,
    enabled: !1,
    applied: !1,
    waitingForResistance: o,
    resisted: s,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: r,
    resistanceState: n
  });
}
function st(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function LA(e) {
  const { rollCard: t } = e, n = xA(), a = ru(), r = xn(t).state, o = Fr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: a,
    resistanceState: r,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = tt(s), u = DA(e);
  if (u)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: s,
      normalButton: M(
        "normal",
        u === "normal",
        !1,
        u === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: M(
        "half",
        u === "half",
        !1,
        u === "half",
        !!e.halfButtonSkipped
      ),
      summary: vA(r)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: r,
      actionState: s,
      normalButton: M("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: M("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      resistanceState: r,
      actionState: s,
      normalButton: M("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: M("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      resistanceState: r,
      actionState: s,
      normalButton: M("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: M("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
      summary: {
        state: l ? "pending" : "manual",
        message: l ? s.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  if (r.kind === "none")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: s,
      normalButton: M("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: M("half", !0, !0, !1, !!e.halfButtonSkipped),
      summary: {
        state: "manual",
        message: "Sem DT confiável: escolha manualmente."
      }
    };
  if (r.kind === "pending")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: s,
      normalButton: M("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: M("half", !1, !1, !1, !!e.halfButtonSkipped),
      summary: {
        state: "pending",
        message: l ? s.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  const d = r.kind === "succeeded";
  return {
    mode: n,
    canShowApplyDamage: !0,
    waitingForResistance: l,
    resistanceState: r,
    actionState: s,
    normalButton: M("normal", !d, !d, !1, !!e.normalButtonSkipped),
    halfButton: M("half", d, d, !1, !!e.halfButtonSkipped),
    summary: {
      state: d ? "resisted" : "failed",
      message: d ? `Resistiu: ${r.total} vs DT ${r.difficulty}.` : `Falhou: ${r.total} vs DT ${r.difficulty}.`
    }
  };
}
function vA(e) {
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
function M(e, t, n, a, r, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: a,
    skipped: r,
    waitingLabel: o
  };
}
function DA(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function xA() {
  try {
    return Qm();
  } catch {
    return "assisted";
  }
}
function ru() {
  try {
    return Er();
  } catch {
    return "strict";
  }
}
const NA = "data-paranormal-toolkit-damage-resolution-state", wi = "data-paranormal-toolkit-damage-icon-enhanced", Xr = "data-paranormal-toolkit-damage-original-label", PA = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, ou = "Outra opção escolhida";
function OA(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Hy(t, "Aplicar dano"), MA(e, t);
}
function MA(e, t) {
  const n = Array.from(t.querySelectorAll(We)), a = Si(n, "normal"), r = Si(n, "half");
  if (!a || !r) {
    FA(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  Ii(a, "normal"), Ii(r, "half");
  const o = LA({
    rollCard: e,
    normalButtonApplied: on(a),
    halfButtonApplied: on(r),
    normalButtonSkipped: Qa(a),
    halfButtonSkipped: Qa(r)
  });
  if (!o.canShowApplyDamage) {
    Li(a), Li(r), vi(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), Ci(a, o.normalButton), Ci(r, o.halfButton), vi(t, o.summary.state, o.summary.message);
}
function Ci(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    UA(e, t.visible), qA(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function FA(e) {
  for (const t of e)
    Qa(t) && t.remove();
}
function on(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(ou);
}
function Qa(e) {
  return e.textContent?.includes(ou) ?? !1;
}
function Si(e, t) {
  const n = PA[t];
  return e.find((a) => n.test(BA(a))) ?? null;
}
function BA(e) {
  return [
    e.getAttribute(Xr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Ii(e, t) {
  if (e.getAttribute(wi) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const a = document.createElement("i");
  a.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), a.setAttribute("aria-hidden", "true"), e.classList.add(
    `${i}__button--damage-resolution-action`,
    `${i}__button--damage-resolution-${t}`
  ), e.setAttribute(wi, "true"), e.setAttribute(Xr, n), e.setAttribute("aria-label", n), e.replaceChildren(a, De(n));
}
function Li(e) {
  on(e) || e.remove();
}
function UA(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function qA(e, t, n, a = "Role resistência") {
  if (!on(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", a), e.replaceChildren(De(a));
      return;
    }
    e.removeAttribute("aria-disabled"), zA(e, n);
  }
}
function zA(e, t) {
  const n = e.getAttribute(Xr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(jA(t), De(n)));
}
function jA(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function vi(e, t, n) {
  e.setAttribute(NA, t);
  const a = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    a?.remove();
    return;
  }
  const r = a ?? document.createElement("span");
  r.classList.add(`${i}__damage-resolution-summary`), r.textContent = n, a || e.querySelector(jr)?.after(r);
}
const At = "data-paranormal-toolkit-effect-icon-enhanced", Ke = "data-paranormal-toolkit-effect-action-compacted", Pn = "data-paranormal-toolkit-effect-resistance-gate", Qr = "data-paranormal-toolkit-effect-section", Zr = "data-paranormal-toolkit-effect-label";
function GA(e) {
  return e.querySelector(`[${Qr}="true"]`);
}
function VA(e) {
  const t = WA(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? YA(), a = rT(n, e.sourceActions, t);
  return a && n.setAttribute(Zr, a), XA(n, t, a), nT(e.rollCard, n, e.after ?? e.fallbackAfter), aT(e.sourceActions, n), n;
}
function HA(e, t) {
  const n = t.querySelector(We);
  if (!n) return;
  const a = n.textContent?.trim() ?? "", r = cu(t, n, a), o = iu(e, n), s = IA({
    rollCard: e,
    effectLabel: r,
    applied: eo(n, a),
    effectCanApplyOnSuccessfulResistance: o ? He(o) === "success" || He(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? gc(o) : !1
  });
  if (s.applied) {
    iT(n);
    return;
  }
  if (!s.visible) {
    sT(n);
    return;
  }
  if (s.waitingForResistance) {
    lT(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    cT(n, s.compactLabel);
    return;
  }
  uT(n), lu(n, s.displayLabel);
}
function WA(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(We) ?? []), n = Array.from(e.existingSection?.querySelectorAll(We) ?? []), a = [...t, ...n];
  return a.length === 0 ? null : KA(e.rollCard, a) ?? a[0] ?? null;
}
function KA(e, t) {
  const n = xn(e).state, a = fc(n), r = su(e);
  if (r.length === 0) return null;
  for (const o of t) {
    const s = iu(e, o, r);
    if (s && pc(s, a)) return o;
  }
  return null;
}
function iu(e, t, n = su(e)) {
  const a = Jr(t, t.textContent?.trim() ?? ""), r = Da(a);
  return r ? n.find((o) => [o.label, o.conditionId].some((s) => Da(s) === r)) ?? null : null;
}
function su(e) {
  const t = $c(Fb(e));
  if (!t) return [];
  const n = kt(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((a) => a.actor === "target") : [];
}
function YA() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Qr, "true"), e;
}
function XA(e, t, n) {
  e.setAttribute(Qr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const a = QA(e), r = ZA(a);
  r.textContent = "Efeito";
  const o = JA(e, a), s = eT(o);
  s.textContent = dT(n ?? cu(e, t, t.textContent?.trim() ?? ""));
  const l = tT(o);
  t.parentElement !== l && l.append(t);
  for (const d of Array.from(l.querySelectorAll(We)))
    d.hidden = d !== t;
  t.hidden = !1;
  const u = t.textContent?.trim() ?? "";
  !eo(t, u) && !oT(t, u) && lu(t, n ?? u);
}
function QA(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function ZA(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function JA(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(`${i}__effect-section-body`), t.after(a), a;
}
function eT(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function tT(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function nT(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function aT(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(We)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function rT(e, t, n) {
  const a = e.getAttribute(Zr);
  if (a && a.trim().length > 0) return a.trim();
  const r = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return r || Jr(n, n.textContent?.trim() ?? "");
}
function Jr(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && pe(n) !== "efeito aplicado") return n;
  const a = Bb(e);
  if (a) return a;
  const r = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return r.length > 0 && pe(r) !== "aplicado" ? r : null;
}
function eo(e, t) {
  return e.classList.contains(Gy) || pe(t).includes("aplicado");
}
function oT(e, t) {
  const n = e.getAttribute(Pn);
  if (n === "pending" || n === "resisted") return !0;
  const a = Da(t);
  return a.includes("resistiu") || a.includes("role resistencia");
}
function lu(e, t) {
  e.getAttribute(Ke) === "true" && e.getAttribute(At) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ke, "true"), e.setAttribute(At, "true"), e.setAttribute(Vy, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Gr("✦", `${i}__button-icon--effect`),
    De("Aplicar")
  ));
}
function iT(e) {
  e.getAttribute(Ke) === "true" && pe(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ke, "true"), e.setAttribute(At, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Gr("✓", `${i}__button-icon--effect-applied`),
    De("Aplicado")
  ));
}
function cu(e, t, n) {
  const a = e.getAttribute(Zr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return a && a.trim().length > 0 ? a.trim() : Jr(t, n) ?? n;
}
function sT(e) {
  eo(e, e.textContent?.trim() ?? "") || e.remove();
}
function lT(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Ke), e.removeAttribute(At), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Pn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(De(t));
}
function cT(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Ke), e.removeAttribute(At), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Pn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Gr("✓", `${i}__button-icon--effect-resisted`),
    De(t)
  );
}
function uT(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Pn), e.removeAttribute("aria-disabled");
}
function dT(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const mT = "data-paranormal-toolkit-card-layout-normalized";
function fT(e) {
  const t = pT(e.rollCard), n = gT(t);
  return bA({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function pT(e) {
  return {
    rollCard: e,
    damageSection: AA(e),
    resistance: e.querySelector(Lr),
    damageActions: TA(e),
    effectActionSource: RA(e),
    effectSection: GA(e)
  };
}
function gT(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: a,
    damageActions: r,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(mT, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = wt(t, "Conjuração"), u = hT({
    rollCard: t,
    damageSection: n,
    resistance: a,
    fallbackAfter: l
  });
  n && r && (r.parentElement !== n && n.append(r), OA(t, r));
  const d = VA({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: bT(n, u),
    fallbackAfter: l
  });
  return d && HA(t, d), d;
}
function hT(e) {
  const { rollCard: t, damageSection: n, resistance: a, fallbackAfter: r } = e;
  return a ? n ? (a.parentElement !== n && n.append(a), n) : r ? (a.parentElement === t && a.previousElementSibling === r || t.insertBefore(a, r.nextElementSibling), a) : ((a.parentElement !== t || a.previousElementSibling !== null) && t.prepend(a), a) : null;
}
function bT(e, t) {
  return e ?? t;
}
const uu = [0, 80, 180, 400, 900, 1600, 3e3], Di = /* @__PURE__ */ new WeakSet();
function yT(e) {
  du(e), _T(e);
}
function du(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    mu(t);
}
function _T(e) {
  if (!Di.has(e)) {
    Di.add(e);
    for (const t of uu)
      globalThis.setTimeout(() => {
        du(e);
      }, t);
  }
}
function mu(e) {
  const t = fT({
    rollCard: e,
    refreshDelaysMs: uu,
    onRefresh: () => mu(e)
  });
  __({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const AT = "data-paranormal-toolkit-resistance-roll-result-enhanced", xi = "data-paranormal-toolkit-resistance-original-description", TT = "data-paranormal-toolkit-resistance-skill", RT = "data-paranormal-toolkit-resistance-skill-label", ET = `${i}__resistance--without-roll-button`, kT = ["Fortitude", "Reflexos", "Vontade"];
function $T(e) {
  for (const t of Array.from(e.querySelectorAll(Lr)))
    wT(t);
  yT(e);
}
function wT(e) {
  const t = e.querySelector(wg), n = e.querySelector(Xl), a = e.querySelector(Ln), r = vT(a) ? a : null, o = e.querySelector(Ql);
  if (!t && !n && !o && !a) return;
  e.classList.toggle(ET, !r);
  const s = LT(e, a);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!a || !a.contains(o)) && e.append(o), NT(o)), CT(e, a, n), r && (BT(r), r.parentElement !== e && e.append(r));
}
function CT(e, t, n) {
  if (!n) return;
  const a = e.closest(`.${i}__roll-card`);
  if (!a) return;
  const r = IT(n), o = vc({
    description: r,
    skillLabel: DT(t, r),
    difficulty: Mr(a)
  });
  if (!o) {
    n.textContent = r, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  ST(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function ST(e, t) {
  const n = document.createElement("span");
  n.classList.add(`${i}__resistance-label-skill`), n.textContent = t.skillLabel;
  const a = document.createElement("strong");
  a.classList.add(`${i}__resistance-label-difficulty`), a.textContent = t.difficultyLabel;
  const r = [n, document.createTextNode(" · "), a];
  if (t.description) {
    const o = document.createElement("span");
    o.classList.add(`${i}__resistance-label-effect`), o.textContent = t.description, r.push(document.createTextNode(" · "), o);
  }
  e.replaceChildren(...r);
}
function IT(e) {
  const t = e.getAttribute(xi);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(xi, n), n;
}
function LT(e, t) {
  const n = e.querySelector(`.${ei}`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(ei), e.insertBefore(a, t?.parentElement === e ? t : e.firstChild), a;
}
function vT(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function DT(e, t) {
  const n = e?.getAttribute(RT) ?? e?.getAttribute(TT) ?? null;
  return n || xT(t);
}
function xT(e) {
  const t = Ni(e);
  return kT.find((n) => t.startsWith(Ni(n))) ?? null;
}
function Ni(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function NT(e) {
  const t = PT(e.textContent ?? "");
  t && (e.setAttribute(AT, "true"), e.replaceChildren(FT(t)));
}
function PT(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, a, r] = t, o = n?.trim() ?? "Resistência", s = Number(r);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: u } = OT(a ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function OT(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: MT(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function MT(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function FT(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const a = UT(e);
  return a && t.append(a), t;
}
function BT(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = xn(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const a = n.kind === "succeeded" ? "succeeded" : "failed", r = a === "succeeded" ? "✓" : "✕", o = a === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${a}`), e.textContent = `${n.total} ${r}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function UT(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of qT(e.diceValues, e.formula)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), n.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(n.value), t.append(a);
  }
  return t;
}
function qT(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Pi(e, "highest") : n.includes("kl") ? Pi(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function Pi(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function zT(e) {
  for (const t of Array.from(e.querySelectorAll(Eg))) {
    const n = YT(t);
    jT(t), n && (GT(t, n), VT(t, n));
  }
}
function jT(e) {
  for (const t of Array.from(e.querySelectorAll(kg)))
    t.remove();
}
function GT(e, t) {
  const a = e.closest(`.${i}`)?.querySelector(Yl) ?? null, r = a?.querySelector(Rg) ?? null, o = a ?? e, s = o.querySelector(Ig);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = mR(t.elementTone), l.textContent = dR(t), !s) {
    if (r?.parentElement === o) {
      r.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function VT(e, t) {
  const n = HT(e);
  WT(e, n);
  const a = KT(t);
  if (a.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${i}__ritual-metadata`);
  for (const s of a) {
    const l = document.createElement("span");
    l.classList.add(`${i}__ritual-metadata-chip`), l.textContent = s, r.append(l);
  }
  if (n) {
    const s = n.querySelector(`.${i}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", r);
      return;
    }
    n.append(r);
    return;
  }
  const o = e.querySelector(Zl);
  if (o) {
    e.insertBefore(r, o);
    return;
  }
  e.prepend(r);
}
function HT(e) {
  return e.closest(`.${i}`)?.querySelector(Yl) ?? null;
}
function WT(e, t) {
  const n = [e, t].filter((a) => a !== null);
  for (const a of n)
    for (const r of Array.from(a.querySelectorAll(Lg)))
      r.remove();
}
function KT(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Ca(e.target)}` : null,
    e.duration ? `Duração: ${Ca(e.duration)}` : null,
    e.resistance ? `Resistência: ${Ul(e.resistance)}` : null
  ].filter(wn);
}
function YT(e) {
  const t = XT(e), n = nR(e), r = (t ? tR(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = to(Q(r, "element")), l = oe("op.elementChoices", s) ?? Oi(Re(o, "Elemento")) ?? Oi(n.damageType), u = s ?? fR(l), d = Q(r, "circle") ?? Re(o, "Círculo"), m = oR(r) ?? Re(o, "Alvo"), g = cR(r, "duration", "op.durationChoices") ?? Re(o, "Duração"), _ = aR(e) ?? sR(r) ?? Re(o, "Resistência"), E = rR(o) ?? n.cost, R = {
    elementLabel: l,
    elementTone: u,
    circle: d,
    cost: E,
    target: m,
    duration: g,
    resistance: _
  };
  return uR(R) ? R : null;
}
function XT(e) {
  const t = QT(e);
  if (!t) return null;
  const n = t.getFlag?.(c, In), a = JT(n);
  if (a.length === 0) return null;
  const r = ZT(e);
  if (r.size > 0) {
    const o = a.find((s) => s.pendingId && r.has(s.pendingId));
    if (o) return o;
  }
  return a.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function QT(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? $r()?.messages?.get?.(n) ?? null : null;
}
function ZT(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const a of Array.from(t.querySelectorAll(`[${Jo}]`))) {
    const r = a.getAttribute(Jo)?.trim();
    r && n.add(r);
  }
  return n;
}
function JT(e) {
  if (!$n(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(eR).filter((n) => n !== null) : [];
}
function eR(e) {
  return $n(e) ? {
    pendingId: Ht(e.pendingId),
    actorId: Ht(e.actorId),
    itemId: Ht(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Jf) : []
  } : null;
}
function tR(e) {
  if (!e.itemId) return null;
  const t = $r(), a = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return a || (t?.items?.get?.(e.itemId) ?? null);
}
function nR(e) {
  let t = null, n = null;
  for (const a of Array.from(e.querySelectorAll($g))) {
    const r = et(a.textContent);
    if (!r) continue;
    const o = Zf(r, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(r) && (t = r);
  }
  return { cost: t, damageType: n };
}
function aR(e) {
  const t = et(e.querySelector(Xl)?.textContent);
  return t ? Ul(t) : null;
}
function Re(e, t) {
  const n = yt(t);
  for (const a of e) {
    const r = a.indexOf(":");
    if (!(r < 0 || yt(a.slice(0, r)) !== n))
      return et(a.slice(r + 1));
  }
  return null;
}
function rR(e) {
  const t = Re(e, "Custo") ?? Re(e, "PE");
  return t || (e.map(et).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function oR(e) {
  const t = Q(e, "target");
  if (!t) return null;
  if (t === "area")
    return iR(e) ?? oe("op.targetChoices", t) ?? "Área";
  const n = oe("op.targetChoices", t) ?? fe(t);
  return [t === "people" || t === "creatures" ? Q(e, "targetQtd") : null, n].filter(wn).join(" ");
}
function iR(e) {
  const t = Q(e, "area.name"), n = Q(e, "area.size"), a = Q(e, "area.type"), r = t ? oe("op.areaChoices", t) ?? fe(t) : null, o = a ? oe("op.areaTypeChoices", a) ?? fe(a) : null;
  return r ? n ? o ? `${r} ${n}m ${Ca(o)}` : `${r} ${n}m` : r : null;
}
function sR(e) {
  const t = Q(e, "skillResis"), n = Q(e, "resistance");
  if (!t || !n) return null;
  const a = oe("op.skill", t) ?? fe(t), r = lR(n);
  return [a, r].filter(wn).join(" ");
}
function lR(e) {
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
      return oe("op.resistanceChoices", e) ?? fe(e);
  }
}
function cR(e, t, n) {
  const a = Q(e, t);
  return a ? oe(n, a) ?? fe(a) : null;
}
function uR(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function dR(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function mR(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(wn).join(" ");
}
function to(e) {
  const t = yt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Oi(e) {
  const t = to(e);
  return t ? oe("op.elementChoices", t) ?? fe(t) : e ? fe(e) : null;
}
function fR(e) {
  return to(e);
}
function oe(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, a = $r()?.i18n?.localize?.(n);
  return !a || a === n ? null : a;
}
const Mi = "data-paranormal-toolkit-dice-toggle-enhanced";
function pR(e) {
  for (const t of Array.from(e.querySelectorAll(Jl)))
    fu(t);
}
function gR(e) {
  const t = gu(e.target);
  if (!t) return;
  const n = no(t);
  n && (e.preventDefault(), pu(n, t));
}
function hR(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = gu(e.target);
  if (!t) return;
  const n = no(t);
  n && (e.preventDefault(), pu(n, t));
}
function fu(e) {
  const t = e.querySelector(vn);
  if (!t) return;
  const n = e.querySelector(Dr);
  if (n && n.getAttribute(Mi) !== "true" && (n.setAttribute(Mi, "true"), n.classList.add(xr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-chevron-down"), a.setAttribute("aria-hidden", "true"), n.append(a);
  }
}
function pu(e, t) {
  const n = e.querySelector(vn);
  if (!n) return;
  const a = !e.classList.contains(vr);
  bR(e, t, n, a);
}
function bR(e, t, n, a) {
  e.classList.toggle(vr, a), n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.title = a ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const r = t.querySelector("i");
  r && (r.classList.toggle("fa-chevron-down", !a), r.classList.toggle("fa-chevron-up", a));
}
function gu(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Dr);
  if (!t) return null;
  const n = no(t);
  return n ? (fu(n), t.classList.contains(xr) ? t : null) : null;
}
function no(e) {
  const t = e.closest(Jl);
  return t && t.querySelector(vn) ? t : null;
}
const Fi = `${c}-workflow-dice-toggle-styles`;
function yR() {
  if (document.getElementById(Fi)) return;
  const e = document.createElement("style");
  e.id = Fi, e.textContent = `
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
const _R = [0, 100, 500, 1500, 3e3];
let Bi = !1, oa = null;
function AR() {
  if (!Bi) {
    Bi = !0, yR(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ft(en(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ft(en(t));
    }), Hooks.once("ready", () => {
      ft(document), TR();
    }), document.addEventListener("click", gR), document.addEventListener("keydown", hR);
    for (const e of _R)
      globalThis.setTimeout(() => ft(document), e);
  }
}
function TR() {
  oa || !document.body || (oa = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ft(n);
  }), oa.observe(document.body, { childList: !0, subtree: !0 }));
}
function ft(e) {
  e && (Kg(e), zT(e), $T(e), pR(e), Ug(e));
}
function RR() {
  AR();
}
const ER = "data-paranormal-toolkit-action-section", kR = "ritual-log", $R = ".paranormal-toolkit-item-use-prompt__actions", wR = ".paranormal-toolkit-item-use-prompt__actions-title", CR = [0, 100, 500, 1500];
let Ui = !1;
function SR() {
  if (Ui) return;
  const e = (t, n) => {
    qi(DR(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), qi(document), Ui = !0;
}
function qi(e) {
  for (const t of CR)
    globalThis.setTimeout(() => IR(e), t);
}
function IR(e) {
  LR(e), vR(e);
}
function LR(e) {
  for (const t of e.querySelectorAll(
    `[${ER}="${kR}"]`
  ))
    t.remove();
}
function vR(e) {
  for (const t of e.querySelectorAll($R)) {
    if (zi(t.querySelector(wR)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => zi(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function DR(e) {
  if (e instanceof HTMLElement || xR(e))
    return e;
  if (NR(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function xR(e) {
  return e instanceof HTMLElement;
}
function NR(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function zi(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const pt = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, hu = {
  PV: "system.attributes.hp"
}, Za = {
  PV: [pt.PV, hu.PV],
  SAN: [pt.SAN],
  PE: [pt.PE],
  PD: [pt.PD]
}, Ja = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class PR {
  getResource(t, n) {
    const a = ji(t, n);
    if (!a.ok)
      return p(a.error);
    const r = a.value, o = `${r}.value`, s = `${r}.max`, l = foundry.utils.getProperty(t, o), u = foundry.utils.getProperty(t, s), d = Vi(t, n, o, l, "valor atual");
    if (d) return p(d);
    const m = Vi(t, n, s, u, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, a) {
    const r = ji(t, n);
    if (!r.ok)
      throw new Error(r.error.message);
    await t.update({ [`${r.value}.value`]: a });
  }
}
function ji(e, t) {
  const n = OR(e.type, t);
  if (n && Gi(e, n))
    return y(n);
  const a = Za[t].find(
    (r) => Gi(e, r)
  );
  return a ? y(a) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: MR(e, t),
    path: Za[t].join(" | ")
  });
}
function OR(e, t) {
  return e === "threat" ? hu[t] ?? null : e === "agent" ? pt[t] : null;
}
function Gi(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof a == "number" && Number.isFinite(a);
}
function MR(e, t) {
  const n = e.type ?? "unknown", a = Za[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${a}.`;
}
function Vi(e, t, n, a, r) {
  return a == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${r} de ${t} não encontrado: ${n}.`,
    path: n,
    value: a
  } : typeof a != "number" || !Number.isFinite(a) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${r} de ${t} em ${n}.`,
    path: n,
    value: a
  } : null;
}
class FR {
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
      const s = Ja.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: a, value: r } = n, o = BR(r);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: r
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Ja.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, n);
      if (a != null)
        return { path: n, value: a };
    }
    return null;
  }
}
function BR(e) {
  if (Hi(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Hi(n))
      return n;
  }
  return null;
}
function Hi(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const UR = "dice-so-nice";
async function bu(e) {
  if (!qR() || !zR()) return;
  const t = jR();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function qR() {
  try {
    return Tg().enabled;
  } catch {
    return !1;
  }
}
function zR() {
  return game.modules?.get?.(UR)?.active === !0;
}
function jR() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Wi = "occultism";
class yu {
  getDifficulty(t) {
    return GR(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const a = await HR(t, Wi);
    if (!a)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await bu(a);
    const r = YR(a);
    return {
      skill: Wi,
      skillLabel: "Ocultismo",
      roll: a,
      formula: KR(a),
      total: r,
      difficulty: n,
      success: r >= n,
      diceBreakdown: XR(a)
    };
  }
}
function GR(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function VR(e) {
  return new yu().rollCastingCheck(e);
}
async function HR(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const a = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return WR(a);
}
function WR(e) {
  return Ki(e) ? e : Array.isArray(e) ? e.find(Ki) ?? null : null;
}
function Ki(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function KR(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function YR(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function XR(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(QR);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function QR(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const ZR = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class JR {
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
    const a = n.value, r = eE(t.ritual, a);
    return r.ok ? r.value ? y(r.value) : y({
      resource: "PE",
      amount: ZR[a],
      source: "default-by-circle",
      circle: a
    }) : p(r.error);
  }
}
function eE(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : tE(n) ? {
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
function tE(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class nE {
  async applyPresetItemPatch(t, n) {
    const a = n.itemPatch;
    if (!a) return ia("missing-item-patch");
    if (t.type !== "ritual") return ia("unsupported-item-type");
    const r = aE(a);
    return Object.keys(r).length === 0 ? ia("empty-update") : (await t.update(r), {
      applied: !0,
      updateData: r
    });
  }
}
function aE(e) {
  const t = {};
  U(t, "name", e.name), U(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (U(t, "system.circle", n.circle), U(t, "system.element", n.element), U(t, "system.target", n.target), U(t, "system.targetQtd", n.targetQuantity), U(t, "system.execution", n.execution), U(t, "system.range", n.range), U(t, "system.duration", n.duration), U(t, "system.skillResis", n.resistanceSkill), U(t, "system.resistance", n.resistance), U(t, "system.studentForm", n.studentForm), U(t, "system.trueForm", n.trueForm)), t;
}
function U(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function ia(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class rE {
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
    return this.getNumber(t, Ja.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, a = [];
    for (const r of ["PV", "SAN", "PE", "PD"]) {
      const o = this.resourceAdapter.getResource(t, r);
      o.ok ? n[r] = o.value : a.push(o.error);
    }
    return { values: n, errors: a };
  }
  getNumber(t, n, a) {
    const r = foundry.utils.getProperty(t, n);
    return typeof r == "number" && Number.isFinite(r) ? r : a;
  }
}
class oE {
  async applyPreset(t, n, a = {}) {
    const r = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: n.id,
        presetVersion: n.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: a.definition ?? n.automation
    };
    return await this.writeAutomationFlag(t, r), r;
  }
  async applyManualDefinition(t, n, a = n.label) {
    const r = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: a,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n
    };
    return await this.writeAutomationFlag(t, r), r;
  }
  async clear(t) {
    await t.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(c, "automation", n);
  }
}
class iE {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = sE(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, sa(t)), y(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const a of t) {
      const r = this.register(a);
      if (!r.ok)
        return r;
      n.push(r.value);
    }
    return y(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? sa(n) : null;
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
    return Array.from(this.presets.values()).map(sa);
  }
  findForItem(t) {
    return this.list().map((n) => lE(n, t)).filter((n) => n !== null).sort((n, a) => a.score - n.score || n.preset.id.localeCompare(a.preset.id));
  }
}
function sE(e) {
  return !la(e.id) || !la(e.version) || !la(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function lE(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, n.push(`itemType:${t.type}`);
  }
  for (const r of e.matchers) {
    const o = cE(r, t);
    if (!o.matches)
      return null;
    a += o.score, n.push(o.reason);
  }
  return {
    preset: e,
    score: a,
    reasons: n
  };
}
function cE(e, t) {
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
      const n = Yi(t.name), a = e.names.map(Yi).includes(n);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = uE(t), a = n !== null && e.circles.includes(n);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Yi(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function uE(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function sa(e) {
  return structuredClone(e);
}
function la(e) {
  return typeof e == "string" && e.length > 0;
}
function sn(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = On(e.amountFrom);
    if (!n)
      return p({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const a = t.rolls[n];
    if (!a)
      return p({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const r = Math.trunc(a.total);
    return !Number.isInteger(r) || r <= 0 ? p({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : y(r);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function On(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function dE(e, t, n) {
  if (!Xi(e.id) || !Xi(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const a = new Roll(e.formula), r = await Promise.resolve(a.evaluate()), o = r.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await bu(r);
    const l = {
      ...n.rollRequests[e.id] ?? _u(e, t),
      total: o,
      roll: r
    };
    return n.rolls[e.id] = l, y(l);
  } catch (a) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: a
    });
  }
}
function _u(e, t) {
  const n = e.intent ?? mE(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function mE(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Xi(e) {
  return typeof e == "string" && e.length > 0;
}
async function ln(e, t, n, a, r) {
  switch (a) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Bt(t, n, a, r) : e.spend(t, n, r);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Bt(t, n, a, r) : e.damage(t, n, r);
    case "heal":
      return n !== "PV" ? Bt(t, n, a, r) : e.heal(t, n, r);
    case "recover":
      return n !== "SAN" ? Bt(t, n, a, r) : e.recover(t, n, r);
  }
}
function Bt(e, t, n, a) {
  return p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: n,
    reason: "invalid-resource-operation",
    message: `Operação ${n} não é válida para ${t}.`,
    requestedAmount: a
  });
}
function fE(e) {
  const { step: t, context: n, transaction: a, stepIndex: r, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = pE(t, n, a, r);
    n.damageInstances.push(s), o.emit("afterDamageResolution", n, {
      stepIndex: r,
      step: t,
      damage: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), o.emit("afterApplyDamage", n, {
      stepIndex: r,
      step: t,
      damage: s,
      resourceTransaction: a,
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
    const s = gE(t, n, a, r);
    n.healingInstances.push(s), o.emit("afterApplyHealing", n, {
      stepIndex: r,
      step: t,
      healing: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function pE(e, t, n, a) {
  const r = On(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    id: Au(t.id, "damage", a, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: r ?? void 0,
    damageType: o?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function gE(e, t, n, a) {
  const r = On(e.amountFrom);
  return {
    id: Au(t.id, "healing", a, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: r ?? void 0,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Au(e, t, n, a) {
  return `${e}.${t}.${n}.${a}`;
}
function hE(e, t, n) {
  const a = On(e.amountFrom), r = a ? t.rolls[a] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    amountFrom: e.amountFrom,
    rollId: a,
    rollIntent: r?.intent,
    damageType: r?.damageType
  };
}
function bE(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: a, step: t, metadata: r }), Tu("before", e), Qi("before", e), Qi("resolve", e);
}
function yE(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: a, step: t, metadata: r }), Tu("apply", e);
}
function _E(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: a, step: t, metadata: r });
}
function Tu(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: s } = t, l = AE(e, n.operation);
  l && s.emit(l, a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function Qi(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function AE(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function TE(e, t, n) {
  return y(void 0);
}
async function RE(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return EE(e, t);
    case "spendRitualCost":
      return kE(e, t);
  }
}
async function EE(e, t) {
  const { context: n, resources: a } = e, r = sn(t, n);
  return r.ok ? Ru(await a.spend(n.sourceActor, t.resource, r.value), n) : p(r.error);
}
async function kE(e, t) {
  const { context: n, resources: a, ritualCosts: r } = e, o = r.getCost({
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
  }), Ru(await a.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Ru(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function $E(e) {
  const { step: t, context: n, stepIndex: a, lifecycle: r, execute: o } = e, s = wE(t);
  for (const u of s.before)
    r.emit(u, n, { stepIndex: a, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const u of s.after)
    r.emit(u, n, { stepIndex: a, step: t });
  return l;
}
function wE(e) {
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
class CE {
  constructor(t, n, a, r) {
    this.resources = t, this.ritualCosts = n, this.messages = a, this.lifecycle = r;
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
    for (const [a, r] of t.steps.entries()) {
      const o = await this.runStep(r, n, a);
      if (!o.ok)
        return o;
    }
    return y({ definition: t, context: n });
  }
  async runStep(t, n, a) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, a);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, a);
      default:
        return $E({
          step: t,
          context: n,
          stepIndex: a,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, n, a)
        });
    }
  }
  async executeStep(t, n, a) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, n, a);
      case "rollFormula":
        return this.runRollFormulaStep(t, n, a);
      case "modifyResource":
        return this.runModifyResourceStep(t, n, a);
      case "chatCard":
        return this.runChatCardStep(t, n, a);
      default:
        return p({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: a,
          step: t,
          context: n
        });
    }
  }
  async runCostStep(t, n, a) {
    const r = await RE({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, a) {
    const r = _u(t, a);
    n.rollRequests[r.id] = r, this.lifecycle.emit("beforeRoll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("before", r, n, a, t), this.lifecycle.emit("roll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("roll", r, n, a, t);
    const o = await this.runRollFormulaStep(t, n, a);
    if (!o.ok)
      return o;
    const s = n.rolls[r.id];
    return this.emitSpecificRollPhase("after", r, n, a, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: a, step: t, rollRequest: r, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, a) {
    const r = await dE(t, a, n);
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, a) {
    const r = sn(t, n);
    if (!r.ok)
      return p({ ...r.error, stepIndex: a, step: t, context: n });
    const o = hE(t, n, r.value);
    bE({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), yE({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, n);
    if (s.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: n
      });
    for (const l of s) {
      const u = await ln(this.resources, l, t.resource, t.operation, r.value), d = this.handleResourceOperationResult(u, n, a, t);
      if (!d.ok)
        return d;
      fE({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return _E({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, a) {
    const r = sn(t, n);
    if (!r.ok)
      return p({ ...r.error, stepIndex: a, step: t, context: n });
    const o = this.resolveActors(t.actor, n);
    if (o.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: n
      });
    for (const s of o) {
      const l = await ln(this.resources, s, t.resource, t.operation, r.value), u = this.handleResourceOperationResult(l, n, a, t);
      if (!u.ok)
        return u;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, a) {
    const r = await TE(this.messages);
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  handleResourceOperationResult(t, n, a, r) {
    return t.ok ? (n.resourceTransactions.push(t.value), y(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: a,
      step: r,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, a, r, o, s) {
    const l = SE(t, n.intent);
    l && this.lifecycle.emit(l, a, {
      stepIndex: r,
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
        return n.targets.flatMap((a) => a.actor ? [a.actor] : []);
    }
  }
}
function SE(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class IE {
  emitCastStarted(t) {
    Hooks.callAll(Gt.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(Gt.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(Gt.ritual.castFinished, t);
  }
}
class LE {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, n, a) {
    return this.execute(t, n, "spend", a);
  }
  async damage(t, n, a) {
    return this.execute(t, n, "damage", a);
  }
  async heal(t, n, a) {
    return this.execute(t, n, "heal", a);
  }
  async recover(t, n, a) {
    return this.execute(t, n, "recover", a);
  }
  async execute(t, n, a, r) {
    if (!Number.isInteger(r) || r <= 0)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: r
      });
    const o = this.adapter.getResource(t, n);
    if (!o.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: o.error.reason,
        message: o.error.message,
        requestedAmount: r,
        path: o.error.path,
        value: o.error.value
      });
    const s = o.value, l = this.calculate(a, s, r);
    if (!l.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: r,
        current: s.value,
        required: r
      });
    const { afterValue: u, appliedAmount: d } = l.value, m = {
      value: u,
      max: s.max
    };
    try {
      u !== s.value && await this.adapter.updateResourceValue(t, n, u);
    } catch (g) {
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: r,
        current: s.value,
        required: r,
        cause: g
      });
    }
    return y({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: a,
      requestedAmount: r,
      appliedAmount: d,
      before: s,
      after: m
    });
  }
  calculate(t, n, a) {
    switch (t) {
      case "spend":
        return n.value < a ? p({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${a}.`
        }) : y({
          afterValue: n.value - a,
          appliedAmount: a
        });
      case "damage": {
        const r = Math.max(0, n.value - a);
        return y({
          afterValue: r,
          appliedAmount: n.value - r
        });
      }
      case "heal":
      case "recover": {
        const r = Math.min(n.max, n.value + a);
        return y({
          afterValue: r,
          appliedAmount: r - n.value
        });
      }
    }
  }
}
class vE {
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
function Eu(e) {
  return {
    id: DE(),
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
function DE() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class xE {
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
    return Me(this.lastContext);
  }
  async runAutomation(t, n) {
    const a = Eu(n);
    this.lastContext = a, this.hooks.emit("created", a, {
      metadata: {
        definitionLabel: t.label,
        itemId: a.item.id ?? null,
        itemName: a.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", a), this.hooks.emit("resolveTargets", a, {
      metadata: {
        targetCount: a.targets.length
      }
    });
    const r = await this.automation.run(t, a);
    return r.ok ? (this.hooks.emit("completed", a), r) : (this.emitFailed(a, r.error), r);
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
class NE {
  emit(t, n, a = {}) {
    const r = {
      phase: t,
      context: n,
      stepIndex: a.stepIndex,
      step: a.step,
      rollRequest: a.rollRequest,
      rollResult: a.rollResult,
      damage: a.damage,
      healing: a.healing,
      resourceTransaction: a.resourceTransaction,
      metadata: a.metadata
    };
    return n.phases.push(t), n.lifecycleEvents.push({
      phase: t,
      stepIndex: a.stepIndex,
      stepType: a.step?.type,
      rollId: a.rollRequest?.id ?? a.rollResult?.id,
      rollIntent: a.rollRequest?.intent ?? a.rollResult?.intent,
      damageId: a.damage?.id,
      healingId: a.healing?.id,
      resourceOperation: a.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${c}.workflow.${t}`, r), Hooks.callAll(`${c}.workflow.phase`, r), r;
  }
}
class PE {
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
    const n = Ea();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: OE(),
      flags: {
        ...t.flags,
        [c]: {
          ...ME(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const a = Ea();
    if (!a.enabled)
      return;
    const r = n.notification ?? Zi(n);
    a.console && this.emitConsole(t, n), a.ui && this.emitUi(t, r);
  }
  emitConsole(t, n) {
    const a = Zi(n);
    switch (t) {
      case "info":
        f.info(a, n.data ?? "");
        return;
      case "warn":
        f.warn(a, n.data ?? "");
        return;
      case "error":
        f.error(a, n.data ?? "");
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
function Zi(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function OE() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function ME(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const FE = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", ku = `${c}-inline-roll-neutralized`, BE = `${c}-inline-roll-notice`, ao = `data-${c}-inline-roll-neutralized`, Ji = `data-${c}-inline-roll-notice`, UE = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function es(e) {
  const t = ek(e.message), n = await qE(e.message), a = zE(t);
  return n.replacementCount + a.replacementCount > 0 && f.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: a.replacementCount
  }), {
    messageId: t,
    contentUpdated: n.updated,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: a.replacementCount
  };
}
async function qE(e) {
  const t = QE(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = jE(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await ZE(t, n.content), replacementCount: n.replacementCount };
}
function zE(e) {
  const t = e ? JE(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = $u(t);
  return n > 0 && wu(KE(t)), { replacementCount: n };
}
function jE(e) {
  const t = GE(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const a = $u(n.content), r = t.replacementCount + a;
  return r === 0 ? { content: e, replacementCount: 0 } : (wu(n.content), { content: n.innerHTML, replacementCount: r });
}
function GE(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, r) => (t += 1, HE(r.trim()))), replacementCount: t };
}
function $u(e) {
  const t = VE(e);
  for (const n of t)
    n.replaceWith(WE(YE(n)));
  return t.length;
}
function VE(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(FE))
    n.getAttribute(ao) !== "true" && t.add(n);
  return Array.from(t);
}
function HE(e) {
  return `<span class="${ku}" ${ao}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${tk(e)}</span>`;
}
function WE(e) {
  const t = document.createElement("span");
  return t.classList.add(ku), t.setAttribute(ao, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function wu(e) {
  if (e.querySelector?.(`[${Ji}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(BE), t.setAttribute(Ji, "true"), t.textContent = UE, e.append(t);
}
function KE(e) {
  return e.querySelector(".message-content") ?? e;
}
function YE(e) {
  const n = e.getAttribute("data-formula") ?? XE(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function XE(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function QE(e) {
  return e && typeof e == "object" ? e : null;
}
async function ZE(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function JE(e) {
  const t = nk(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function ek(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function tk(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function nk(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ye = "ritualRollConfig", cn = "ritual-roll", ak = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function St() {
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
function Cu(e) {
  const t = e.getFlag(c, Ye);
  return un(t);
}
function Su(e) {
  return Cu(e) ?? St();
}
async function rk(e, t) {
  const n = un(t) ?? un({
    ...St(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, Ye, n), n;
}
async function ok(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, Ye));
    return;
  }
  await e.setFlag(c, Ye, null);
}
function un(e) {
  if (!Mn(e)) return null;
  const t = gk(e.intent);
  if (!t) return null;
  const n = St();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: er(e.damageType),
    utilityLabel: er(e.utilityLabel) ?? n.utilityLabel,
    note: oo(e.note),
    forms: bk(e.forms)
  };
}
function ik(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function sk(e) {
  const t = Cu(e), n = ro(e);
  if (!t)
    return ts(e, n);
  const a = fk(e, t);
  if (!a)
    return ts(e, n);
  const r = lk(t, a), o = [
    { type: "spendRitualCost" },
    r,
    ...ck(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: dk(e, t),
    resistance: n
  };
}
function ts(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: mk(e),
    resistance: t
  } : null;
}
function lk(e, t) {
  const n = {
    type: "rollFormula",
    id: cn,
    formula: t,
    intent: pk(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function ck(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${cn}.total`,
          ...uk(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${cn}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function uk(e) {
  return e ? { damageType: e } : {};
}
function dk(e, t) {
  const n = {
    base: ca("Padrão", t.forms.base.formula)
  };
  return Xe(e, "discente") && (n.discente = ca("Discente", t.forms.discente.formula, 2)), Xe(e, "verdadeiro") && (n.verdadeiro = ca("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function ca(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [cn]: t.trim()
    }
  };
}
function mk(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Xe(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Xe(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function fk(e, t) {
  return [
    t.forms.base.formula.trim(),
    Xe(e, "discente") ? t.forms.discente.formula.trim() : "",
    Xe(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((a) => a.length > 0) ?? null;
}
function ro(e) {
  const t = Iu(e), n = er(t.skillResis), a = hk(t.resistance);
  if (!n || !a) return;
  const r = yk(n), o = ak[a];
  return {
    skill: n,
    label: r,
    effect: a,
    summary: `${r} ${o}`
  };
}
function pk(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function gk(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function hk(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function bk(e) {
  const t = St();
  return Mn(e) ? {
    base: ua(e.base),
    discente: ua(e.discente),
    verdadeiro: ua(e.verdadeiro)
  } : t.forms;
}
function ua(e) {
  return Mn(e) ? { formula: oo(e.formula) } : { formula: "" };
}
function Xe(e, t) {
  const n = Iu(e), a = t === "discente" ? n.studentForm : n.trueForm;
  return _k(a);
}
function Iu(e) {
  const t = e.system;
  return Mn(t) ? t : {};
}
function yk(e) {
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
function _k(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function oo(e) {
  return typeof e == "string" ? e.trim() : "";
}
function er(e) {
  const t = oo(e);
  return t.length > 0 ? t : null;
}
function Mn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Ak(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function Tk(e) {
  switch (Rk(e)) {
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
      return Ek(String(e ?? ""));
  }
}
function Rk(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function Ek(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function kk() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function $k(e) {
  return {
    ...io(e),
    type: "ritual.cast.started"
  };
}
function wk(e) {
  return {
    ...io(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function Ck(e) {
  return {
    ...io(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function Sk(e) {
  if (e.type === "preset") {
    const t = $e(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: $e(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: $e(e.label),
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
function Ik(e, t = {}) {
  const n = Gk(e), a = [
    ...Hk(t.candidates ?? []),
    ...Wk(e)
  ], r = Yk(a) ?? { x: 0, y: 0, width: 0, height: 0 }, o = Vk(t) ?? Xk(a) ?? Zk(r), s = e$(canvas?.grid?.size), l = Lk(o, r, a), u = Fk(a), d = Mk(l);
  return {
    type: "rectangleRay",
    sceneId: Jk(e, n),
    regionId: ls(n?.id) ?? ls(e.id),
    gridSize: s,
    bounds: {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height
    },
    shape: l,
    center: {
      x: r.x + r.width / 2,
      y: r.y + r.height / 2
    },
    ray: u ?? d ?? {
      start: null,
      end: null
    },
    source: "lineArea",
    targetingMode: "lineArea"
  };
}
function Lk(e, t, n) {
  const a = {
    x: N(e, "x") ?? 0,
    y: N(e, "y") ?? 0,
    width: N(e, "width") ?? t.width,
    height: N(e, "height") ?? t.height,
    direction: N(e, "direction") ?? 0,
    elevation: N(e, "elevation")
  };
  return {
    ...a,
    direction: vk(a, t, n)
  };
}
function vk(e, t, n) {
  const a = Dk(n);
  return a !== null ? a : Nk(e, t) ?? e.direction;
}
function Dk(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const a = ns(n, t);
    if (a !== null) return a;
    const r = Fn(n), o = ns(r, t);
    if (o !== null) return o;
  }
  return null;
}
function ns(e, t) {
  for (const n of t) {
    const a = xk(W(e, n));
    if (a !== null) return a;
  }
  return null;
}
function xk(e) {
  const t = Tt(e);
  if (t === null) return null;
  const n = lo(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function Nk(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = rs(as(e, e.direction), t), a = Pk(e, t);
  if (a === null) return null;
  const o = Ok([
    a,
    -a,
    180 - a,
    180 + a,
    0,
    90,
    180,
    270
  ]).map((l) => ({
    direction: l,
    error: rs(as(e, l), t)
  })).sort((l, u) => l.error - u.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? lo(o.direction) : null;
}
function Pk(e, t) {
  const n = e.width, a = e.height, r = n ** 2 - a ** 2;
  if (Math.abs(r) < 1e-3) return null;
  const o = (n * t.width - a * t.height) / r, s = (n * t.height - a * t.width) / r, l = cs(o, 0, 1), u = cs(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(u) ? null : t$(Math.atan2(u, l));
}
function as(e, t) {
  const n = vu(t), a = {
    x: Math.cos(n),
    y: Math.sin(n)
  }, r = {
    x: -Math.sin(n),
    y: Math.cos(n)
  }, o = [
    { x: e.x, y: e.y },
    {
      x: e.x + a.x * e.width,
      y: e.y + a.y * e.width
    },
    {
      x: e.x + r.x * e.height,
      y: e.y + r.y * e.height
    },
    {
      x: e.x + a.x * e.width + r.x * e.height,
      y: e.y + a.y * e.width + r.y * e.height
    }
  ], s = o.map((_) => _.x), l = o.map((_) => _.y), u = Math.min(...s), d = Math.max(...s), m = Math.min(...l), g = Math.max(...l);
  return {
    x: u,
    y: m,
    width: d - u,
    height: g - m
  };
}
function rs(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function Ok(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const a = lo(n);
    t.add(Math.round(a * 1e3) / 1e3);
  }
  return [...t];
}
function Mk(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = vu(e.direction), n = {
    x: Math.cos(t),
    y: Math.sin(t)
  }, a = {
    x: -Math.sin(t),
    y: Math.cos(t)
  }, r = e.height / 2, o = {
    x: e.x + a.x * r,
    y: e.y + a.y * r
  };
  return {
    start: o,
    end: {
      x: o.x + n.x * e.width,
      y: o.y + n.y * e.width
    }
  };
}
function Fk(e) {
  for (const t of e) {
    const n = os(t, "ray.start"), a = os(t, "ray.end");
    if (n && a) return { start: n, end: a };
  }
  return null;
}
function os(e, t) {
  const n = W(e, t), a = Tt(W(n, "x")), r = Tt(W(n, "y"));
  return a === null || r === null ? null : { x: a, y: r };
}
function io(e) {
  const t = Sk(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: qk(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: Bk(e.context.item, e.form, e.formLabel, t),
    targets: n.map(zk),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function Bk(e, t, n, a) {
  return {
    name: e.name,
    slug: da(e, "system.slug") ?? da(e, "slug"),
    presetId: a.presetId,
    presetVersion: a.presetVersion,
    element: da(e, "system.element"),
    circle: jk(e),
    form: Uk(t),
    formLabel: n
  };
}
function Uk(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function qk(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function zk(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function jk(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : $e(t);
}
function da(e, t) {
  return $e(foundry.utils.getProperty(e, t));
}
function $e(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function Gk(e) {
  return "document" in e && e.document ? e.document : e;
}
function Vk(e) {
  return Lu(e.shape);
}
function Hk(e) {
  return e.filter(so);
}
function Wk(e) {
  return [
    e,
    Kk(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(so);
}
function Kk(e) {
  return "object" in e && so(e.object) ? e.object : null;
}
function so(e) {
  return !!(e && typeof e == "object");
}
function Yk(e) {
  for (const t of e) {
    const n = is(W(Fn(t), "bounds"));
    if (n) return n;
    const a = is(W(t, "bounds"));
    if (a) return a;
  }
  return null;
}
function is(e) {
  const t = N(e, "x"), n = N(e, "y"), a = N(e, "width"), r = N(e, "height");
  return t === null || n === null || a === null || r === null ? null : { x: t, y: n, width: a, height: r };
}
function N(e, t) {
  return Tt(W(e, t));
}
function Xk(e) {
  for (const t of e) {
    const n = Qk(t).find((a) => a.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function Qk(e) {
  if (!e || typeof e != "object") return [];
  const t = ss(Fn(e));
  return t.length > 0 ? t : ss(e);
}
function ss(e) {
  const t = W(e, "shapes");
  return Array.isArray(t) ? t.map(Lu).filter((n) => n !== null) : [];
}
function Lu(e) {
  const t = Fn(e) ?? e, n = W(t, "type");
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
function Zk(e) {
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
function Jk(e, t) {
  return ma(e, "parent.id") ?? ma(e, "document.parent.id") ?? ma(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function ma(e, t) {
  return $e(W(e, t));
}
function W(e, t) {
  if (!e || typeof e != "object") return;
  let n = e;
  for (const a of t.split(".")) {
    if (!n || typeof n != "object") return;
    try {
      n = n[a];
    } catch {
      return;
    }
  }
  return n;
}
function Fn(e) {
  if (!e || typeof e != "object") return null;
  const t = W(e, "toObject");
  if (typeof t != "function") return null;
  try {
    const n = t.call(e);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function ls(e) {
  return $e(e);
}
function Tt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function e$(e) {
  const t = Tt(e);
  return t !== null && t > 0 ? t : null;
}
function vu(e) {
  return e * Math.PI / 180;
}
function t$(e) {
  return e * 180 / Math.PI;
}
function lo(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function cs(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class n$ {
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
class Bn {
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
    for (const a of this.getSceneTokens()) {
      if (typeof a.setTarget != "function") continue;
      const r = a.id ?? a.document?.id ?? null;
      a.setTarget(!!(r && n.has(r)), {
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
const a$ = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class r$ {
  constructor(t = new Bn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = o$(t, this.foundryAdapter);
    for (const a of n)
      try {
        await a.run(), a.method;
        return;
      } catch {
        a.method;
      }
    this.foundryAdapter.warn(a$);
  }
}
function o$(e, t) {
  const n = [], a = i$(e), r = us(a), o = us(e);
  if (typeof a?.delete == "function") {
    const s = a.delete.bind(a);
    n.push({ method: "document.delete", run: s });
  }
  if (typeof e.delete == "function") {
    const s = e.delete.bind(e);
    n.push({ method: "region.delete", run: s });
  }
  return r && n.push({
    method: "scene.deleteEmbeddedDocuments(document.id)",
    run: () => t.deleteRegionDocumentById(r)
  }), o && o !== r && n.push({
    method: "scene.deleteEmbeddedDocuments(region.id)",
    run: () => t.deleteRegionDocumentById(o)
  }), n;
}
function i$(e) {
  return s$(e) ? e.document ?? null : e;
}
function s$(e) {
  return "bounds" in e;
}
function us(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const l$ = 100, c$ = 12;
class u$ {
  constructor(t = new Bn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async placeLine(t = { shape: "rectangleRay" }, n = {}) {
    const a = this.foundryAdapter.canPlaceRegions();
    if (!a.ok)
      return {
        status: "failed",
        reason: a.reason,
        message: a.message
      };
    try {
      const r = this.foundryAdapter.getGridSize() ?? l$, o = g$(n), s = await this.foundryAdapter.placeRegion(
        d$(t, this.foundryAdapter.getUserColor(), r),
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
    } catch (r) {
      return {
        status: "failed",
        reason: "region-placement-failed",
        message: p$(r)
      };
    }
  }
}
function d$(e, t, n) {
  return {
    name: "Ritual: Linha de efeito",
    color: t ?? void 0,
    displayMeasurements: !0,
    highlightMode: "coverage",
    flags: {
      [c]: {
        temporary: !0,
        purpose: "ritual-line-targeting"
      }
    },
    shapes: [m$(e, n)]
  };
}
function m$(e, t) {
  const n = f$(e, t);
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
function f$(e, t) {
  return {
    length: ds(e.length, c$, t),
    width: ds(e.width, 1, t)
  };
}
function ds(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function p$(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function g$(e) {
  const t = (n) => {
    const a = h$(n);
    a && e.onChange?.(a);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function h$(e) {
  return b$(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function b$(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class y$ {
  constructor(t = new Bn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(ms(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(ms(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = _$(t);
    A$(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function ms(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function _$(e) {
  return Array.from(new Set(e));
}
function A$(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, a) => n === t[a]);
}
class T$ {
  constructor(t = new Bn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(hl)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(R$(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(E$(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((a) => ({
      source: a.source,
      hasBounds: tr(a.region)
    }));
    for (const a of t) {
      if (!tr(a.region)) continue;
      const r = this.resolveRegionObjectTargetTokens(a.region);
      return a.source, r.tokens.length, r;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), a = $$(
      n.filter((r) => !r.actor || typeof r.document?.testInsideRegion != "function" ? !1 : r.document.testInsideRegion(t))
    );
    return n.length, a.length, { tokens: a, source: "regionObject" };
  }
}
function R$(e) {
  return [
    { source: "document", region: ke(e.document) },
    { source: "document.object", region: ke(e.document.object) },
    { source: "preview", region: ke(e.preview) },
    { source: "preview.document.object", region: ke(e.preview?.document?.object) }
  ];
}
function E$(e) {
  return [
    { source: "input", region: ke(e) },
    { source: "input.object", region: k$(e) ? ke(e.object) : null },
    { source: "input.document.object", region: Du(e) ? ke(e.document?.object) : null }
  ];
}
function ke(e) {
  return tr(e) ? e : null;
}
function tr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Ut(n.x) && Ut(n.y) && Ut(n.width) && Ut(n.height);
}
function Du(e) {
  return "document" in e && "bounds" in e;
}
function k$(e) {
  return !Du(e);
}
function $$(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return a ? t.has(a) ? !1 : (t.add(a), !0) : !0;
  });
}
function Ut(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class w$ {
  async minimizeForPlacement() {
    const t = [];
    for (const n of I$())
      await C$(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await S$(n);
      }
    };
  }
}
async function C$(e) {
  if (xu(e) || !M$(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function S$(e) {
  if (xu(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function I$() {
  const e = /* @__PURE__ */ new Set();
  for (const t of L$())
    x$(t) && N$(t) && e.add(t);
  return [...e];
}
function L$() {
  return [
    ...fs(v$()),
    ...fs(D$())
  ];
}
function fs(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function v$() {
  return globalThis.ui?.windows ?? null;
}
function D$() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function x$(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function N$(e) {
  const t = P$(e), n = O$(t);
  return n === "Actor" || n === "Item";
}
function P$(e) {
  return e.document ?? e.object ?? null;
}
function O$(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function M$(e) {
  const t = F$(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function F$(e) {
  const t = e.element;
  if (ps(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (ps(n)) return n;
  }
  return null;
}
function ps(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function xu(e) {
  return e.minimized === !0;
}
const B$ = "Nenhum alvo encontrado na linha.";
class U$ {
  constructor(t = new u$(), n = new T$(), a = new r$(), r = new y$(), o = new n$(), s = new w$()) {
    this.regionLinePlacement = t, this.regionTargetResolver = n, this.regionCleanup = a, this.regionTargetPreview = r, this.foundryAdapter = o, this.placementWindowManager = s;
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
      const a = [], r = this.regionTargetPreview.captureCurrentTargets(), o = () => {
        this.regionTargetPreview.restorePreviousTargets(r);
      }, s = await this.placementWindowManager.minimizeForPlacement(), l = await (async () => {
        try {
          return await this.regionLinePlacement.placeLine(
            {
              shape: "rectangleRay",
              length: t.formTargeting?.template?.distance,
              width: t.formTargeting?.template?.width
            },
            {
              onChange: (u) => {
                a.push(u);
                try {
                  const d = this.regionTargetResolver.resolvePreviewTargetTokens(u);
                  this.regionTargetPreview.previewTargets(d.tokens);
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
        const u = this.regionTargetResolver.resolveTargets(l.region), d = z$(a), m = Ik(l.region, {
          candidates: [d?.preview, d?.document],
          shape: d?.shape
        });
        return u.targets.length === 0 ? (o(), this.foundryAdapter.warn(B$), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(u.tokens), {
          status: "confirmed",
          targets: u.targets,
          areaSnapshot: m
        });
      } catch (u) {
        o();
        const d = q$(u);
        return this.foundryAdapter.warn(d), {
          status: "failed",
          reason: "region-resolution-failed",
          message: d
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
function q$(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function z$(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function j$(e) {
  return {
    header: {
      eyebrow: rl,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Q$(e.ritual)
    },
    forms: e.variantOptions.map((t) => G$(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: W$(e.targetNames, e.variantOptions, e.ritual),
    automation: X$(e.automationStatus ?? "assisted")
  };
}
function G$(e, t) {
  const n = V$(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? H$(t) : "—",
    details: n
  };
}
function V$(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function H$(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function W$(e, t, n) {
  const a = e.map((r) => r.trim()).filter((r) => r.length > 0);
  return {
    targetNames: a,
    targetText: a.length > 0 ? a.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: a.length > 0,
    forms: t.map((r) => K$(r, n))
  };
}
function K$(e, t) {
  const n = e.targeting ?? Y$(t, e.variant), a = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
  return {
    variant: e.variant,
    mode: a,
    modeLabel: n?.label ?? "Alvos selecionados",
    lineOptionLabel: a === "lineArea" && n?.optional === !0 ? n.optionLabel ?? "Usar linha na cena" : null,
    helperText: a === "lineArea" && n?.optional === !0 ? "Desmarque para usar os alvos selecionados manualmente." : null,
    showLineToggle: a === "lineArea" && n?.optional === !0,
    lineEnabledByDefault: n?.defaultEnabled === !0,
    checked: e.variant === "base"
  };
}
function Y$(e, t) {
  const n = kt(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function X$(e) {
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
function Q$(e) {
  const t = e.system, n = [J$(t?.element), Z$(t?.circle)].filter(nw);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Z$(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function J$(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (ew(e)) {
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
      return tw(e);
  }
}
function ew(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function tw(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function nw(e) {
  return typeof e == "string" && e.length > 0;
}
const Nu = ["base", "discente", "verdadeiro"];
function co(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function dn(e) {
  return typeof e == "string" && Nu.includes(e);
}
const { ApplicationV2: aw } = foundry.applications.api;
class bt extends aw {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = j$(t), this.selectedVariant = this.model.forms.find((a) => a.checked && a.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  resolveRequest;
  model;
  selectedVariant = "base";
  spendResource = !0;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${c}-ritual-cast`,
    classes: [c, "paranormal-toolkit-ritual-cast-app"],
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
      cast: bt.onCast,
      cancel: bt.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new bt(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const a = document.createElement("div");
    return a.className = "paranormal-toolkit-ritual-cast", a.innerHTML = this.renderContent(), a;
  }
  _replaceHTML(t, n, a) {
    n.replaceChildren(t);
    const r = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    iw(r, (o) => {
      this.selectedVariant = o, nr(r, o);
    }), nr(r, this.selectedVariant), sw(r, (o) => {
      this.spendResource = o;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${D(this.model.header.eyebrow)}</p>
        <div>
          <h2>${D(this.model.header.title)}</h2>
          <p>${D(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(rw).join("")}
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
          <div><dt>Custo base</dt><dd>${D(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${D(this.model.cost.casterName)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--targets">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Alvos</h3>
          <span class="paranormal-toolkit-ritual-cast__automation-note paranormal-toolkit-ritual-cast__automation-note--${this.model.automation.status}">
            ${D(this.model.automation.title)}
          </span>
        </div>
        <div class="paranormal-toolkit-ritual-cast__targeting-forms">
          ${this.model.targets.forms.map(ow).join("")}
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targets">
          <div class="paranormal-toolkit-ritual-cast__summary-targets"><dt>Alvos atuais</dt><dd>${D(this.model.targets.targetText)}</dd></div>
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
    const n = dw(t), a = lw(n, this.spendResource, this.selectedVariant);
    this.settle(a), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function rw(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", a = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", r = e.details.map((o) => `<span>${D(o)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${a}"
      data-paranormal-toolkit-ritual-cast-form="${D(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${D(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${D(e.label)}</strong>
        <em>${D(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${r}</span>
    </label>
  `;
}
function ow(e) {
  const t = e.checked ? "" : "hidden", n = e.showLineToggle && e.lineOptionLabel ? `
        <label class="paranormal-toolkit-ritual-cast__targeting-line-toggle">
            <input
              type="checkbox"
              name="areaTargeting-${D(e.variant)}"
              ${e.lineEnabledByDefault ? "checked" : ""}
              data-paranormal-toolkit-area-targeting-line-toggle
            >
            <span>
              <strong>${D(e.lineOptionLabel)}</strong>
              ${e.helperText ? `<em>${D(e.helperText)}</em>` : ""}
            </span>
        </label>
      ` : "";
  return `
    <div
      class="paranormal-toolkit-ritual-cast__targeting-form"
      data-paranormal-toolkit-targeting-form="${D(e.variant)}"
      data-paranormal-toolkit-targeting-mode="${D(e.mode)}"
      ${t}
    >
      <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targeting-mode">
        <div><dt>Modo</dt><dd>${D(e.modeLabel)}</dd></div>
      </dl>
      ${n}
    </div>
  `;
}
function iw(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const r of n)
    r.addEventListener("click", () => gs(e, r, t)), r.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), gs(e, r, t));
    });
  const a = Pu(e);
  a && t(a);
}
function gs(e, t, n) {
  const a = t.querySelector('input[name="variant"]');
  !a || a.disabled || !dn(a.value) || (a.checked = !0, e.dataset.paranormalToolkitSelectedVariant = a.value, n(a.value), a.dispatchEvent(new Event("change", { bubbles: !0 })), Pu(e), nr(e, a.value));
}
function Pu(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const a of t) {
    const r = a.querySelector('input[name="variant"]'), o = r?.checked === !0;
    a.setAttribute("aria-checked", o ? "true" : "false"), o && dn(r.value) && (n = r.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function nr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const a of n) {
    const r = a.dataset.paranormalToolkitTargetingForm === t;
    a.hidden = !r;
  }
}
function sw(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function lw(e, t, n) {
  const a = uw(e) ?? n, r = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = cw(e, a);
  return {
    variant: a,
    spendResource: r,
    areaTargeting: o
  };
}
function cw(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function uw(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (dn(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return dn(n) ? n : null;
}
function dw(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function D(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function mw(e) {
  return bt.request(e);
}
const uo = {
  label: "Padrão"
}, fw = {
  label: "Discente",
  extraCost: 2
}, pw = {
  label: "Verdadeiro",
  extraCost: 5
};
class gw {
  constructor(t, n, a, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = a, this.ritualEvents = r;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new U$();
  canHandle(t, n) {
    return t.item.type === "ritual" || n.steps.some((a) => a.type === "spendRitualCost");
  }
  async run(t, n, a) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const r = this.resolveCostPreview(t), o = cC(n), s = iC(
      n,
      t.item,
      r,
      o
    ), l = await mw({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map(($) => $.name),
      cost: r,
      defaultSpendResource: gC(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const u = hw(l), d = dC(
      n,
      t.item,
      u.variant,
      o
    ), m = kk(), g = d.label ?? co(u.variant), _ = Rw(d), E = ($ = t.targets) => ({
      castId: m,
      context: t,
      automationSource: a,
      form: u.variant,
      formLabel: g,
      targets: $
    }), R = ($, I = t.targets, j = {}) => {
      this.ritualEvents.emitCastFinished(
        Ck({
          ...E(I),
          status: $,
          ...j
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      $k(E())
    );
    const k = await this.areaTargeting.resolvePreCastTargets({
      castOptions: u,
      formTargeting: d.targeting,
      currentTargets: t.targets
    });
    if (k.status === "cancelled")
      return R("cancelled", t.targets, { reason: k.reason }), { status: "cancelled" };
    if (k.status === "failed")
      return R("failed", t.targets, {
        reason: k.reason,
        message: k.message
      }), {
        status: "failed",
        reason: k.reason,
        message: k.message
      };
    const b = bw(
      t,
      k.targets
    );
    k.areaSnapshot && this.ritualEvents.emitAreaResolved(
      wk({
        ...E(k.targets),
        area: k.areaSnapshot
      })
    );
    const L = El();
    let A = null;
    if (L) {
      const $ = await _w(
        this.resources,
        b.actor,
        u,
        d,
        r
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
        const I = await VR(
          b.actor
        );
        A = Ew(
          I,
          d,
          r
        );
      } catch (I) {
        const j = I instanceof Error ? I.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return R("failed", b.targets, {
          reason: "ritual-casting-check-failed",
          message: j
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: j,
          cause: I
        };
      }
    }
    const z = yw(
      n,
      u,
      d,
      r,
      {
        includeCostSteps: !L
      }
    );
    if (z.steps.length === 0) {
      const $ = uC(
        b,
        u
      ), I = bs(
        n,
        b
      ), j = hs(
        b.actor,
        A,
        d,
        r
      ), X = ys(
        n,
        u,
        d,
        r,
        $,
        b,
        A
      );
      if (!I.ok)
        return R("failed", b.targets, {
          reason: I.reason,
          message: I.message
        }), {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      const Dt = [
        ...j,
        ...I.actions
      ];
      return Dt.length > 0 ? (R("ready", b.targets), {
        status: "ready",
        workflowContext: $,
        itemUseContext: b,
        actions: Dt,
        summaryLines: X
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: $,
        itemUseContext: b,
        summaryLines: X
      });
    }
    const x = await this.workflow.runAutomation(z, {
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
          variant: u.variant,
          spendResource: u.spendResource
        }
      }
    });
    if (!x.ok)
      return R("failed", b.targets, {
        reason: x.error.reason,
        message: x.error.message
      }), {
        status: "failed",
        reason: x.error.reason,
        message: x.error.message,
        cause: x.error
      };
    const Y = x.value.context, v = Iw(
      n,
      b,
      Y,
      _
    ), V = bs(
      n,
      b
    ), vt = hs(
      b.actor,
      A,
      d,
      r
    ), he = ys(
      n,
      u,
      d,
      r,
      Y,
      b,
      A
    );
    if (!v.ok)
      return R("failed", b.targets, {
        reason: v.reason,
        message: v.message
      }), {
        status: "failed",
        reason: v.reason,
        message: v.message
      };
    if (!V.ok)
      return R("failed", b.targets, {
        reason: V.reason,
        message: V.message
      }), {
        status: "failed",
        reason: V.reason,
        message: V.message
      };
    const S = [
      ...vt,
      ...v.actions,
      ...V.actions
    ];
    return S.length === 0 ? (R("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: Y,
      itemUseContext: b,
      summaryLines: he
    }) : (R("ready", b.targets), {
      status: "ready",
      workflowContext: Y,
      itemUseContext: b,
      actions: S,
      summaryLines: he
    });
  }
  async applyAction(t) {
    return ln(
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
function hw(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function bw(e, t) {
  return {
    ...e,
    targets: t
  };
}
function yw(e, t, n, a, r) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || fo(l) && (!r.includeCostSteps || !s))
      continue;
    const u = Aw(l, n);
    u && o.push(u);
  }
  return r.includeCostSteps && s && a && hC(n.extraCost) && o.push({
    type: "spendResource",
    actor: "self",
    resource: a.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: o
  };
}
async function _w(e, t, n, a, r) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = at(r, a);
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
function Aw(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = Tw(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function Tw(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const a = n[t];
  return typeof a == "string" ? a.trim() : "";
}
function Rw(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function Ew(e, t, n) {
  const r = kw(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: r,
    success: e.total >= r
  };
}
function kw(e, t) {
  const n = at(e, t);
  return n ? Ak(n.amount) : null;
}
function hs(e, t, n, a) {
  if (!t || t.success) return [];
  const r = at(a, n);
  if (!r || r.amount <= 0) return [];
  const o = e.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: e,
      actorName: o,
      resource: "SAN",
      operation: "damage",
      amount: r.amount,
      label: `Aplicar ${r.amount} SAN`,
      executedLabel: "✓ Dano na SAN aplicado",
      actionSectionId: "casting-backlash",
      actionSectionTitle: "Dano na sanidade"
    }
  ];
}
function bs(e, t) {
  const n = [];
  for (const a of e.conditionApplications ?? []) {
    const r = mo(a.actor, t);
    if (r.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${a.label ?? a.conditionId}.`
      };
    }
    for (const o of r) {
      const s = oc(o);
      n.push(
        $w(
          a,
          o,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function $w(e, t, n, a) {
  const r = t.name ?? "Ator sem nome", o = e.label ?? Sw(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: r,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: ww(
      e.duration ?? null,
      a
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Cw(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function ww(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Cw(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const a = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${a}`;
  }
  return e;
}
function Sw(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Iw(e, t, n, a = /* @__PURE__ */ new Set()) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || Lw(s, a)) continue;
    const l = sn(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const u = mo(s.actor, t);
    if (u.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const d of u) {
      if (vw(s)) {
        Dw(
          o,
          d,
          xw(s, n, l.value)
        );
        continue;
      }
      r.push(Pw(s, d, l.value));
    }
  }
  for (const s of o.values())
    r.push(
      ...Nw(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: r };
}
function Lw(e, t) {
  const n = Ou(e.amountFrom);
  return n !== null && t.has(n);
}
function vw(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Dw(e, t, n) {
  const a = Bw(t), r = e.get(a);
  if (r) {
    r.entries.push(n);
    return;
  }
  e.set(a, {
    actor: t,
    entries: [n]
  });
}
function xw(e, t, n) {
  const a = Ou(e.amountFrom), r = a ? t.rolls[a]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? r ?? null,
    sourceRollId: a
  };
}
function Nw(e, t, n, a) {
  const r = jw(e), o = r.length > 1 ? Hw() : void 0;
  return r.map((s) => {
    const l = a.map(
      (d, m) => {
        const g = Gw(d.amount, s);
        return {
          id: Ow(d, s, m),
          amount: g,
          damageType: d.damageType,
          sourceRollId: d.sourceRollId,
          ignoreResistance: d.step.ignoreResistance === !0
        };
      }
    ), u = l.reduce(
      (d, m) => d + m.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: Mw(u, s, r.length > 1),
      executedLabel: Fw(
        n.name ?? "Ator sem nome",
        s,
        r.length > 1
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
function Pw(e, t, n) {
  const a = t.name ?? "Ator sem nome", r = zw(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Uw(e, a, n),
    executedLabel: qw(e, a),
    actionSectionId: r.id,
    actionSectionTitle: r.title
  };
}
function Ow(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Mw(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Fw(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Bw(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Ou(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Uw(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function qw(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function zw(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function jw(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Gw(e, t) {
  const n = e * t.multiplier, a = Vw(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, a);
}
function Vw(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Hw() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function mo(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function ys(e, t, n, a, r, o, s = null) {
  return [
    `Forma: ${co(t.variant)}`,
    Xw(t, n, a),
    ...Yw(s),
    ...Object.values(r.rolls).flatMap(Qw),
    ...Ww(e, o),
    ...Zw(e.resistance),
    ...rC(n)
  ];
}
function Ww(e, t) {
  return Kw(e) ? mo("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Kw(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Yw(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Xw(e, t, n) {
  const a = at(n, t);
  return a ? e.spendResource ? `Custo: ${a.amount} ${a.resource} gasto` : `Custo: ${a.amount} ${a.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Qw(e) {
  const n = [`${oC(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = Jw(e.roll);
  return a && n.push(`Dados: ${a}`), e.damageType && n.push(`Tipo: ${Tk(e.damageType)}`), n;
}
function Zw(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Jw(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let a = "+";
  for (const r of t) {
    if (!r || typeof r != "object") continue;
    const o = r;
    if (o.operator === "+" || o.operator === "-") {
      a = o.operator;
      continue;
    }
    const s = eC(o);
    s && (aC(
      n,
      s.operator ?? a,
      s.value
    ), a = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function eC(e) {
  const t = tC(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : nC(e);
}
function tC(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function nC(e) {
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
function aC(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function rC(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function oC(e) {
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
function iC(e, t, n, a) {
  return Nu.map((r) => {
    const o = Mu(
      e,
      t,
      r,
      a
    ), s = o !== null;
    return {
      variant: r,
      label: o?.label ?? co(r),
      enabled: s,
      details: o ? sC(o, n) : [],
      finalCostText: o ? lC(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function sC(e, t, n) {
  const a = [], r = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  r.length > 0 ? a.push(r.join(", ")) : a.push("efeito manual");
  const o = at(t, e);
  return a.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), a;
}
function at(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function lC(e, t) {
  const n = at(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function cC(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(fo);
}
function uC(e, t) {
  return Eu({
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
function dC(e, t, n, a) {
  return Mu(e, t, n, a) ?? uo;
}
function Mu(e, t, n, a) {
  const r = e.ritualForms?.[n] ?? null;
  return r || (a ? fC(t, n) ? mC(n) : null : n === "base" ? uo : null);
}
function mC(e) {
  switch (e) {
    case "base":
      return uo;
    case "discente":
      return fw;
    case "verdadeiro":
      return pw;
  }
}
function fC(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return pC(foundry.utils.getProperty(e, n));
}
function pC(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function gC(e) {
  return e.steps.some(fo);
}
function fo(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function hC(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Fu = "itemUsePrompts", Bu = "chatCard", Un = "data-paranormal-toolkit-prompt-id", qn = "data-paranormal-toolkit-pending-id", po = "data-paranormal-toolkit-executed-label", ar = "data-paranormal-toolkit-choice-group", Uu = "data-paranormal-toolkit-skipped-label", mn = "data-paranormal-toolkit-action-section", _s = "data-paranormal-toolkit-detail-key", As = "data-paranormal-toolkit-roll-card", go = "data-paranormal-toolkit-roll-detail-toggle", qu = "data-paranormal-toolkit-roll-detail-id", zu = "data-paranormal-toolkit-resistance-roll-button", ju = "data-paranormal-toolkit-resistance-skill", Gu = "data-paranormal-toolkit-resistance-skill-label", Vu = "data-paranormal-toolkit-resistance-target-actor-id", Hu = "data-paranormal-toolkit-resistance-target-name", Wu = "data-paranormal-toolkit-resistance-roll-result", Ts = "data-paranormal-toolkit-system-card-replaced", bC = `[${qn}]`, yC = `[${go}]`, _C = `[${zu}]`, rr = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, AC = `${h}__actions`, Rs = `${h}__details`, Ku = `${h}__summary`, TC = `${h}__title`, Yu = `${h}__button--executed`, qt = `${h}__roll-card`, RC = "data-paranormal-toolkit-roll-card-target-mode", EC = "data-paranormal-toolkit-roll-card-target-names", kC = "data-paranormal-toolkit-roll-card-resistance", $C = "data-paranormal-toolkit-roll-card-resistance-skill", wC = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let Es = !1, or = null;
const ee = /* @__PURE__ */ new Map(), CC = [0, 100, 500, 1500, 3e3], SC = 3e4, IC = [0, 100, 500, 1500, 3e3];
function LC(e) {
  if (or = e, Es) {
    $s(e);
    return;
  }
  const t = (n, a) => {
    Qu(n, a, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Es = !0, $s(e);
}
async function ks(e) {
  const t = Xu(e);
  ee.set(e.pendingId, t), await yo(t) || cd(t), Zu(e.pendingId);
}
async function vC(e) {
  const t = Xu({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", ee.set(e.pendingId, t), await yo(t) || cd(t), Zu(e.pendingId);
}
async function fa(e, t) {
  const n = ee.get(e);
  ee.delete(e), n && await PS(n, t);
}
function ho(e) {
  const t = gd();
  for (const n of t) {
    const a = se(n)[e];
    if (a) return { message: n, prompt: a };
  }
  return null;
}
async function DC(e, t) {
  const n = ho(e);
  if (!n) return;
  const a = se(n.message), r = a[e];
  r && (a[e] = {
    ...r,
    executedLabel: r.executedLabel,
    executed: !0
  }, await rt(n.message, a));
}
async function xC(e, t, n) {
  if (!t) return;
  const a = ho(e);
  if (!a) return;
  const r = se(a.message);
  let o = !1;
  for (const [s, l] of Object.entries(r))
    s !== e && l.choiceGroupId === t && (r[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await rt(a.message, r);
}
function Xu(e) {
  const t = ge(e.context.message), n = e.context.targets.find((s) => cr(s)), a = n ? cr(n) : null, r = e.resistanceTargetActor ?? a, o = e.resistanceTargetName ?? n?.name ?? r?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? r?.id ?? null,
    resistanceTargetName: o,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: sS(e.context),
    executed: !1
  };
}
function Qu(e, t, n) {
  NS();
  const a = jn(t);
  if (!a) return;
  const r = vS(e, a);
  r.length > 0 && fn(a);
  for (const o of r)
    ir(a, o);
  ad(a, n), sr(a), lr(a);
}
function $s(e) {
  for (const t of IC)
    globalThis.setTimeout(() => {
      NC(e);
    }, t);
}
function NC(e) {
  for (const t of PC()) {
    const n = zn(t);
    OC(n) && Qu(n, t, e);
  }
}
function PC() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function OC(e) {
  return e ? _o(e) ? !0 : MS(e).length > 0 : !1;
}
function Zu(e) {
  const t = ee.get(e);
  if (!t) return;
  const n = t.messageId ? DS(t.messageId) : null;
  if (n) {
    Ls(n, t), fn(n), ir(n, t), ws(n), sr(n), lr(n);
    return;
  }
  if (t.messageId) {
    dr(t);
    return;
  }
  const a = xS(t);
  if (a) {
    Ls(a, t), fn(a), ir(a, t), ws(a), sr(a), lr(a);
    return;
  }
  dr(t);
}
function ws(e) {
  or && ad(e, or);
}
function fn(e) {
  const t = MC();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = nd(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Ts) === "true") return;
  const a = n.querySelector(`.${rr}`);
  a ? n.replaceChildren(a) : n.replaceChildren(), n.setAttribute(Ts, "true");
}
function MC() {
  try {
    return Rl() === "replace";
  } catch {
    return !1;
  }
}
function ir(e, t) {
  if (fn(e), e.querySelector(`[${Un}="${ot(t.pendingId)}"]`)) return;
  const n = BC(e, t);
  qC(n, t);
  const a = aS(t);
  if (FC(a)) return;
  nS(n, a).append(iS(t));
}
function FC(e) {
  return ed(e.id) && !Ce();
}
function Ju(e) {
  const n = e.closest(`[${mn}]`)?.getAttribute(mn) ?? null;
  return ed(n) && !Ce();
}
function ed(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function BC(e, t) {
  const n = e.querySelector(`.${rr}`);
  if (n)
    return n;
  const a = document.createElement("section");
  a.classList.add(rr, h);
  const r = document.createElement("header");
  r.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(TC), s.textContent = UC(t);
  const l = document.createElement("span");
  return l.classList.add(Ku), l.textContent = t.summary, r.append(o, s, l), a.append(r), cS(e).append(a), a;
}
function UC(e) {
  const t = q(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function qC(e, t) {
  const n = t.summaryLines ?? [], a = sd(n, t);
  if (a) {
    zC(e, a, t);
    return;
  }
  rS(e, n);
}
function zC(e, t, n) {
  if (e.querySelector(`[${As}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(
    qt,
    `${qt}--${t.intent}`,
    `${qt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && a.classList.add(`${qt}--multi-target`), a.setAttribute(As, "true"), a.setAttribute(RC, t.targetMode), a.setAttribute(EC, JSON.stringify(t.targetNames)), QC(a, t), t.castingCheck && Cs(a, GC(t.castingCheck), n.pendingId, "casting"), jC(t) && Cs(a, VC(t), n.pendingId, "effect"), XC(a, t), ZC(a, t, n), tS(a, t), e.append(a);
}
function jC(e) {
  return e.intent !== "casting";
}
function GC(e) {
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
function VC(e) {
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
function Cs(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && r.classList.add(`${h}__workflow-section--${t.status}`);
  const o = document.createElement("div");
  o.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, o.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, o.append(l);
  }
  if (r.append(o), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, r.append(l);
  }
  HC(r, t), eS(r, t.detailRows, n, a, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(r);
}
function HC(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const a = document.createElement("span");
  a.classList.add(`${h}__workflow-roll-formula`), a.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${h}__workflow-roll-total`), r.textContent = String(t.total), n.append(a, r);
  const o = WC(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function WC(e, t) {
  const n = KC(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-dice-tray`);
  for (const r of YC(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), r.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function KC(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function YC(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ss(e, "highest") : n.includes("kl") ? Ss(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function Ss(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function XC(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(tI);
  if (n.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${h}__roll-meta`);
  for (const r of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = r, a.append(o);
  }
  e.append(a);
}
function QC(e, t) {
  t.resistance && (e.setAttribute(kC, t.resistance), t.resistanceSkill && e.setAttribute($C, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(wC, t.resistanceSkillLabel));
}
function ZC(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance`);
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = JC(t, n);
  r.append(o), s && r.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, a.append(r, l), t.resistanceRollResult && a.append(td(t.resistanceRollResult)), e.append(a);
}
function JC(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !ve())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Un, t.pendingId), n.setAttribute(zu, "true"), n.setAttribute(ju, e.resistanceSkill), n.setAttribute(Gu, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Vu, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Hu, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Wu, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
  const r = document.createElement("span");
  return r.classList.add(`${h}__resistance-roll-fallback`), r.textContent = "d20", n.append(a, r), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function td(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = od(e), t;
}
function eS(e, t, n, a, r) {
  const o = t.filter((d) => d.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${a}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(go, s), l.setAttribute("aria-expanded", "false"), l.textContent = r;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(qu, s), u.hidden = !0;
  for (const d of o) {
    const m = document.createElement("dt");
    m.textContent = d.label;
    const g = document.createElement("dd");
    g.textContent = d.value, u.append(m, g);
  }
  e.append(l, u);
}
function tS(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const a of [...t.notes, ...t.details]) {
    const r = document.createElement("span");
    r.textContent = a, n.append(r);
  }
  e.append(n);
}
function nS(e, t) {
  const n = `[${mn}="${ot(t.id)}"]`, a = e.querySelector(n);
  if (a)
    return a;
  const r = document.createElement("div");
  r.classList.add(AC), r.setAttribute(mn, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, r.append(o), e.append(r), r;
}
function aS(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const a = sd(e.summaryLines ?? [], e);
  return a?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : a?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function rS(e, t) {
  if (t.length === 0) return;
  const n = oS(e);
  for (const a of t) {
    const r = nI(a);
    if (n.querySelector(`[${_s}="${ot(r)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(_s, r), n.append(o);
  }
}
function oS(e) {
  const t = e.querySelector(`.${Rs}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Rs), e.append(n), n;
}
function iS(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Un, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Yu), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(qn, e.pendingId), t.setAttribute(po, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(ar, e.choiceGroupId), t.setAttribute(Uu, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function sS(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = lS(e);
  return `${t} → ${n}`;
}
function lS(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function cS(e) {
  return nd(e) ?? e;
}
function nd(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function ad(e, t) {
  const n = jn(e);
  if (!n) return;
  const a = n.querySelectorAll(bC);
  for (const r of a) {
    if (Ju(r)) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitBound !== "true" && (r.dataset.paranormalToolkitBound = "true", r.addEventListener("click", () => {
      ES(r, t);
    }));
  }
}
function sr(e) {
  const t = jn(e);
  if (!t) return;
  const n = t.querySelectorAll(yC);
  for (const a of n)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      uS(t, a);
    }));
}
function lr(e) {
  const t = jn(e);
  if (!t) return;
  const n = t.querySelectorAll(_C);
  for (const a of n) {
    if (!ve()) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitResistanceRollBound !== "true" && (a.dataset.paranormalToolkitResistanceRollBound = "true", a.addEventListener("click", () => {
      dS(t, a);
    }));
  }
}
function uS(e, t) {
  const n = t.getAttribute(go);
  if (!n) return;
  const a = e.querySelector(`[${qu}="${ot(n)}"]`);
  if (!a) return;
  const r = a.hidden;
  a.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.textContent = r ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function dS(e, t) {
  if (!ve()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(Un), a = t.getAttribute(ju), r = t.getAttribute(Gu) ?? (a ? we(a) : "Resistência");
  if (!n || !a) return;
  const o = pS(e, n), s = gS(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await rh(s, a);
    await AS(u.roll);
    const d = {
      skill: a,
      skillLabel: r,
      formula: u.formula,
      total: u.total,
      targetName: s.name ?? o?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    mS(t, d), fS(t, d), TS(n, d), await RS(e, n, d);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${r}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function mS(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Wu, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function fS(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const a = n.querySelector(`.${h}__resistance-roll-result`), r = a ?? td(t);
  if (a) {
    a.textContent = od(t);
    return;
  }
  n.append(r);
}
function pS(e, t) {
  const n = ee.get(t);
  if (n) return n;
  const a = zn(e);
  return se(a)[t] ?? null;
}
function gS(e, t) {
  const n = e?.resistanceTargetActor;
  if (re(n)) return n;
  const r = e?.context?.targets.map(cr).find(re) ?? null;
  if (r) return r;
  const o = t.getAttribute(Vu) ?? e?.resistanceTargetActorId ?? null, s = o ? bS(o) : null;
  return s || yS(
    t.getAttribute(Hu) ?? e?.resistanceTargetName ?? hS(t)
  );
}
function hS(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Ku}`)?.textContent ?? null;
  if (!n) return null;
  const a = "→";
  if (!n.includes(a)) return null;
  const r = n.split(a), o = r[r.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function cr(e) {
  const t = e.actor;
  if (re(t)) return t;
  const n = e.token, a = Rt(n);
  if (a) return a;
  const r = e.document;
  return Rt(r);
}
function Rt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (re(t)) return t;
  const n = e.document?.actor;
  return re(n) ? n : null;
}
function bS(e) {
  const n = game.actors?.get?.(e);
  return re(n) ? n : rd().map((o) => Rt(o)).find((o) => o?.id === e) ?? null;
}
function yS(e) {
  const t = ze(e);
  if (!t) return null;
  const n = rd().filter((o) => ze(_S(o)) === t).map((o) => Rt(o)).find(re) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => re(o) && ze(o.name) === t);
  return re(r) ? r : null;
}
function rd() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function _S(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Rt(e)?.name ?? null;
}
function ze(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function re(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function od(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function AS(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function TS(e, t) {
  const n = ee.get(e);
  n && (n.resistanceRollResult = t);
}
async function RS(e, t, n) {
  const a = zn(e);
  if (a)
    try {
      const r = se(a), o = r[t];
      if (!o) return;
      r[t] = {
        ...o,
        resistanceRollResult: n
      }, await rt(a, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", r);
    }
}
function zn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages;
  return ie(a?.get?.(n));
}
async function ES(e, t) {
  if (Ju(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(qn);
  if (!n) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    id(e, e.getAttribute(po) ?? "✓ Automação aplicada"), kS(e);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function id(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Yu), e.removeAttribute(qn), e.removeAttribute(po);
}
function kS(e) {
  const t = e.getAttribute(ar);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const a = `[${ar}="${ot(t)}"]`;
  for (const r of n.querySelectorAll(a)) {
    if (r === e) continue;
    const o = r.getAttribute(Uu) ?? "✓ Outra opção escolhida";
    id(r, o);
  }
}
function sd(e, t) {
  const n = e.map(bo).filter(JS), a = n.find((k) => k.intent !== "casting") ?? n[0] ?? null;
  if (!a) return null;
  const r = q(e, "Forma"), o = q(e, "Custo"), s = q(e, "Dados") ?? q(e, `Dados (${a.label})`), l = q(e, "Tipo"), u = q(e, "Resistência"), d = q(e, "Resistência Perícia"), m = q(e, "Resistência Rótulo") ?? (d ? we(d) : null), g = ld(e, "Observação"), _ = e.filter((k) => LS(k, a)), E = SS(e), R = $S(t);
  return {
    ...a,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: r,
    cost: o,
    diceBreakdown: s,
    damageType: l,
    resistance: u,
    resistanceSkill: d,
    resistanceSkillLabel: m,
    targetMode: R.mode,
    targetNames: R.names,
    notes: g,
    details: _,
    castingCheck: E,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function $S(e) {
  const t = wS(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function wS(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && CS(n) !== "nenhum alvo") : [];
}
function CS(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function SS(e) {
  const t = e.map(bo).find((o) => o?.intent === "casting") ?? null, n = q(e, "Conjuração DT"), a = q(e, "Conjuração Resultado");
  if (!t || !n || !a) return null;
  const r = Number(n);
  return Number.isFinite(r) ? {
    label: t.formula,
    formula: q(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(r),
    success: a.toLowerCase() === "sucesso",
    diceBreakdown: q(e, "Dados (Conjuração)")
  } : null;
}
function bo(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, a, r] = t, o = Number(r);
  return Number.isFinite(o) ? {
    label: n,
    formula: a,
    total: o,
    intent: IS(n)
  } : null;
}
function IS(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function q(e, t) {
  return ld(e, t)[0] ?? null;
}
function ld(e, t) {
  const n = `${t}:`;
  return e.flatMap((a) => {
    if (!a.startsWith(n)) return [];
    const r = a.slice(n.length).trim();
    return r.length > 0 ? [r] : [];
  });
}
function LS(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || bo(e) ? !1 : e.trim().length > 0;
}
function vS(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of ee.values())
    ur(a, e, t) && n.set(a.pendingId, a);
  for (const a of OS(e))
    ur(a, e, t) && !n.has(a.pendingId) && n.set(a.pendingId, a);
  return Array.from(n.values()).sort((a, r) => a.createdAt - r.createdAt);
}
function ur(e, t, n) {
  const a = ge(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !Is(n, "itemId", e.itemId) ? !1 : !e.actorId || Is(n, "actorId", e.actorId);
}
function Is(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const a = `data-${aI(t)}`;
  for (const r of e.querySelectorAll(`[${a}]`))
    if (r.getAttribute(a) === n)
      return !0;
  return !1;
}
function DS(e) {
  const t = ot(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function xS(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (ur(e, null, t))
      return t;
  return null;
}
function NS() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, a] of ee.entries())
    e - a.createdAt > t && ee.delete(n);
}
async function Ls(e, t) {
  const n = zn(e);
  if (!n) return !1;
  try {
    const a = se(n);
    return a[t.pendingId] = Ao(t, ge(n)), await rt(n, a), !0;
  } catch (a) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", a), !1;
  }
}
async function yo(e) {
  const t = md(e);
  if (!t) return !1;
  try {
    const n = se(t);
    return n[e.pendingId] = Ao(e, ge(t)), await rt(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function cd(e) {
  for (const t of CC)
    globalThis.setTimeout(() => {
      dr(e);
    }, t);
}
async function dr(e) {
  const t = md(e);
  if (_o(t)?.prompts.some((r) => r.pendingId === e.pendingId))
    return !0;
  const a = await yo(e);
  return a || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), a;
}
async function PS(e, t) {
  const n = dd(e.context.message);
  if (n)
    try {
      const a = se(n), r = a[e.pendingId] ?? Ao(e, ge(n));
      a[e.pendingId] = {
        ...r,
        executedLabel: t ?? r.executedLabel,
        executed: !0
      }, await rt(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function OS(e) {
  return Object.values(se(ie(e))).filter(It);
}
function se(e) {
  if (!e) return {};
  const t = {}, n = _o(e);
  for (const a of n?.prompts ?? [])
    t[a.pendingId] = a;
  for (const [a, r] of Object.entries(ud(e)))
    t[a] ??= r;
  return t;
}
function MS(e) {
  return Object.values(ud(ie(e))).filter(It);
}
function ud(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Fu);
  if (!Qe(t))
    return {};
  const n = {};
  for (const [a, r] of Object.entries(t))
    It(r) && (n[a] = r);
  return n;
}
async function rt(e, t) {
  typeof e.setFlag == "function" && (await BS(e, t), await FS(e, t));
}
async function FS(e, t) {
  await Promise.resolve(e.setFlag?.(c, Fu, t));
}
function _o(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, Bu);
  return QS(t) ? t : null;
}
async function BS(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(It).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const a = n[0];
  if (!a) return;
  const r = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: a.messageId ?? ge(e) ?? null,
    source: {
      actorId: a.actorId,
      actorName: US(a.summary),
      itemId: a.itemId,
      itemName: a.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, Bu, r));
}
function US(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Ao(e, t) {
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
function dd(e) {
  const t = ie(e);
  if (t?.setFlag)
    return t;
  const n = qS(e);
  if (n?.setFlag)
    return n;
  const a = ge(e);
  if (!a) return null;
  const r = game.messages;
  return ie(r?.get?.(a));
}
function qS(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(ie).find((n) => typeof n?.setFlag == "function") ?? null;
}
function md(e) {
  const t = dd(e.context.message);
  if (t) return t;
  const n = e.messageId ? zS(e.messageId) : null;
  if (n) return n;
  const a = gd().slice().reverse();
  return a.find((r) => jS(r, e)) ?? a.find((r) => GS(r, e)) ?? null;
}
function zS(e) {
  const t = game.messages;
  return ie(t?.get?.(e));
}
function jS(e, t) {
  const n = ge(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!fd(e, t)) return !1;
  const r = pd(e);
  return !t.actorId || !r || r === t.actorId;
}
function GS(e, t) {
  if (!HS(e, t)) return !1;
  const n = pd(e);
  return t.actorId && n === t.actorId ? !0 : fd(e, t);
}
function fd(e, t) {
  const n = ze(VS(e));
  if (!n) return !1;
  const a = ze(t.itemName);
  if (a && n.includes(a)) return !0;
  const r = ze(t.itemId);
  return !!(r && n.includes(r));
}
function VS(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function pd(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function HS(e, t) {
  const n = WS(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= SC;
}
function WS(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function ie(e) {
  return e && typeof e == "object" ? e : null;
}
function It(e) {
  return Qe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && H(e.messageId) && H(e.itemId) && H(e.actorId) && H(e.itemName) && Te(e.resistanceTargetActorId) && Te(e.resistanceTargetName) && ZS(e.resistanceRollResult) && KS(e.actionPayload) && pa(e.title) && pa(e.buttonLabel) && pa(e.executedLabel) && Te(e.choiceGroupId) && Te(e.skippedLabel) && Te(e.actionSectionId) && Te(e.actionSectionTitle) && eI(e.summaryLines) : !1;
}
function KS(e) {
  return e == null ? !0 : Qe(e) ? e.kind === "resource-operation" && H(e.actorId) && H(e.actorUuid) && typeof e.actorName == "string" && YS(e.resource) && XS(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function YS(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function XS(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function QS(e) {
  return Qe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && H(e.messageId) && Qe(e.source) && H(e.source.actorId) && H(e.source.actorName) && H(e.source.itemId) && H(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(It) : !1;
}
function ZS(e) {
  return e == null ? !0 : Qe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Te(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function JS(e) {
  return e !== null;
}
function Qe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function H(e) {
  return e === null || typeof e == "string";
}
function pa(e) {
  return e === void 0 || typeof e == "string";
}
function Te(e) {
  return e == null || typeof e == "string";
}
function eI(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function tI(e) {
  return typeof e == "string" && e.length > 0;
}
function gd() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(ie).filter((a) => a !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(ie).filter((a) => a !== null) : [];
}
function jn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ge(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function nI(e) {
  return e.trim().toLowerCase();
}
function aI(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ot(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const vs = 1e3;
class rI {
  constructor(t, n, a, r, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = r, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new gw(
      t,
      n,
      a,
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
      settings: ka(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = ka();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = hr(t.item);
    if (!a.ok) {
      if (a.error.reason === "missing-automation" && dI(t.item) && n.executionMode === "ask") {
        await this.handleGenericRitual(t);
        return;
      }
      const o = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, o, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: a.error.message,
        data: a.error
      });
      return;
    }
    if (await es(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: ba(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const r = iI(
      t.item,
      a.value.definition
    );
    switch (n.executionMode) {
      case "ask":
        await this.handleAskMode(t, r, a.value.source);
        return;
      case "automatic":
        await this.executeAutomation(t, r, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const n = this.pendingExecutions.get(t);
    if (!n)
      return this.executePersistedPendingAutomation(t);
    if (n.kind === "workflow")
      return this.pendingExecutions.delete(t), await fa(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const a = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return a.ok ? (this.pendingExecutions.delete(t), await fa(
      t,
      a.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = ho(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const a = n.prompt.actionPayload, r = pI(a);
    if (!r)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${a.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await ln(
      this.resources,
      r,
      a.resource,
      a.operation,
      a.amount
    );
    return o.ok ? (await DC(t), await xC(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (LC(
      (t) => this.executePendingAutomation(t)
    ), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n, a) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n, a);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await es(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: ba(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      mI(t.item),
      { type: "generic" }
    );
  }
  async handleAssistedRitual(t, n, a) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const r = await this.ritualAssistant.run(t, n, a);
    switch (r.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", r.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: r.message,
          data: r.cause ?? r
        }), ui.notifications?.warn(`Paranormal Toolkit: ${r.message}`);
        return;
      case "completed-without-actions":
        await this.registerCompletedRitualCard(
          r.itemUseContext,
          r.summaryLines
        ), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), f.info(
          "Ritual assistido concluído sem ações pendentes.",
          Me(r.workflowContext)
        );
        return;
      case "ready":
        await this.registerAssistedActions(
          r.itemUseContext,
          r.workflowContext,
          r.actions,
          r.summaryLines
        );
        return;
    }
  }
  async executeAssistedAction(t, n) {
    if (t.kind === "resource-operation") {
      const r = await this.ritualAssistant.applyAction(t);
      return r.ok ? (n.resourceTransactions.push(r.value), { ok: !0 }) : (this.handleResourceActionFailure(r), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      if (!Ce())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const r = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return r.ok ? (uI(n, r.value), await Cc(r.value), {
        ok: !0,
        executedLabel: oI(r.value)
      }) : (this.handleDamageActionFailure(r.error), { ok: !1 });
    }
    if (!Ce())
      return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar efeito assistido."), { ok: !1 };
    const a = await this.conditions.applyCondition({
      actor: t.actor,
      conditionId: t.conditionId,
      duration: t.duration,
      originUuid: t.originUuid,
      source: t.source ?? "item-use.condition-action"
    });
    return a.ok ? (a.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${a.value.warning}`), { ok: !0 }) : (this.handleConditionActionFailure(a), { ok: !1 });
  }
  async resolveAlternativeActions(t) {
    const n = ga(t.action);
    if (!n) return;
    const a = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, r]) => r.kind === "assisted-action" && ga(r.action) === n);
    for (const [r, o] of a)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(r), await fa(
        r,
        Ds(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const a = ya();
    await vC({
      pendingId: a,
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
  async registerAssistedActions(t, n, a, r) {
    let o;
    for (const s of a) {
      const l = ya();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await ks({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: ga(s),
        skippedLabel: Ds(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: r,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: fI(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      Me(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const a = ya();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await ks({
      pendingId: a,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", a);
  }
  async executeAutomation(t, n, a) {
    this.setAttempt(t, "running");
    const r = await this.workflow.runAutomation(n, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: a
        }
      }
    });
    if (!r.ok) {
      this.setAttempt(t, "failed", r.error.reason), this.handleAutomationFailure(r.error);
      return;
    }
    this.setAttempt(t, "completed"), f.info(
      "Automação executada por uso normal de item.",
      Me(r.value.context)
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
    const n = Date.now(), a = xs(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > vs && this.recentExecutionKeys.delete(o);
    const r = this.recentExecutionKeys.get(a);
    return r !== void 0 && n - r <= vs;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(xs(t), Date.now());
  }
  setAttempt(t, n, a, r) {
    this.lastAttempt = ba(
      t,
      n,
      a,
      r
    );
  }
}
function oI(e) {
  return Sc({ inputAmount: e.totalRawDamage });
}
function iI(e, t) {
  if (t.resistance || !sI(t))
    return t;
  const n = ro(e);
  return n ? { ...t, resistance: n } : t;
}
function sI(e) {
  return lI(e) && !cI(e);
}
function lI(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function cI(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function ga(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Ds(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function uI(e, t) {
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
function dI(e) {
  return e.type === "ritual";
}
function mI(e) {
  return sk(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function fI(e) {
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
function pI(e) {
  const t = e.actorUuid ? gI(e.actorUuid) : null;
  if (Ze(t)) return t;
  const n = e.actorId ? hI(e.actorId) : null;
  return n || bI(e.actorName);
}
function gI(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function hI(e) {
  const n = game.actors?.get?.(e);
  if (Ze(n)) return n;
  for (const a of hd()) {
    const r = To(a);
    if (r?.id === e) return r;
  }
  return null;
}
function bI(e) {
  const t = ha(e);
  if (!t) return null;
  for (const r of hd()) {
    const o = yI(r);
    if (ha(o) === t) {
      const s = To(r);
      if (s) return s;
    }
  }
  const a = game.actors?.find?.(
    (r) => Ze(r) && ha(r.name) === t
  );
  return Ze(a) ? a : null;
}
function hd() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function yI(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : To(e)?.name ?? null;
}
function To(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ze(t)) return t;
  const n = e.document?.actor;
  return Ze(n) ? n : null;
}
function ha(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ze(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ba(e, t, n, a) {
  return {
    source: e.source,
    status: t,
    reason: n,
    pendingId: a,
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
function xs(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function ya() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class _I {
  constructor(t, n, a) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = a;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), a = [], r = [], o = $t(t);
    for (const s of n) {
      const l = s.itemId ? o.find((m) => m.id === s.itemId) ?? null : null, u = s.match?.preset ?? null;
      if (!l || !u) {
        r.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(l, u);
      const d = await this.itemPatches.applyPresetItemPatch(l, u);
      a.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: u.id,
        presetLabel: u.label,
        previousStatus: s.status,
        itemPatch: d
      });
    }
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      applied: a,
      skipped: r
    };
  }
}
class AI {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = $t(t).map((l) => this.analyzeRitual(l)), a = n.filter(zt("upToDate")), r = n.filter(zt("available")), o = n.filter(zt("outdated")), s = n.filter(zt("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: a,
      available: r,
      outdated: o,
      unsupported: s,
      canApply: r.length > 0 || o.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, a = TI(t);
    return n ? a ? a.source.type !== "preset" ? lt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : a.source.presetId === n.preset.id && a.source.presetVersion === n.preset.version ? lt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : lt({
      ritual: t,
      status: "outdated",
      match: n,
      flag: a,
      reason: RI(a, n.preset)
    }) : lt({
      ritual: t,
      status: "available",
      match: n,
      flag: a,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : lt({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: a,
      reason: a ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function lt(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Rn(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function TI(e) {
  const t = e.getFlag(c, "automation");
  return br(t) ? t : null;
}
function RI(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function zt(e) {
  return (t) => t.status === e;
}
class EI {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), a = _r(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: n,
      data: a,
      flags: {
        [c]: {
          resourceTransaction: a
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = jt(t.actorName), a = jt(t.resource), r = jt(kI(t)), o = jt($I(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${r}</strong>
          <span>${n}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${o}:</strong> ${t.appliedAmount}</p>
          <p><strong>${a}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
}
function kI(e) {
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
function $I(e) {
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
function jt(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function wI() {
  const e = new PR(), t = new LE(e), n = new ac(new nc()), a = new rc(new Nr()), r = new vE(new yu()), o = new FR(), s = new JR(o), l = new rE(e), u = new iE(), d = u.registerMany(
    Rm()
  );
  if (!d.ok)
    throw new Error(d.error.message);
  const m = new oE(), g = new nE(), _ = mc(), E = new sc(_), R = new AI(
    u
  ), k = new _I(
    R,
    m,
    g
  ), b = new PE(), L = new EI(b), A = new NE(), z = new IE(), x = new CE(
    t,
    s,
    L,
    A
  ), Y = new xE(x, A), v = new rI(
    Y,
    t,
    s,
    n,
    E,
    b,
    z
  );
  return v.addStrategy(
    new Bl(
      (V) => v.handleItemUsed(V)
    )
  ), {
    ordem: l,
    resourceAdapter: e,
    ritualAdapter: o,
    ritualCosts: s,
    resources: t,
    damage: n,
    resistance: a,
    ritualCasting: r,
    automationRegistry: u,
    automationBinder: m,
    itemPatches: g,
    conditionRegistry: _,
    conditions: E,
    debugOutput: b,
    chatMessages: L,
    workflowHooks: A,
    ritualEvents: z,
    automation: x,
    workflow: Y,
    itemUseIntegration: v,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: k
  };
}
const { ApplicationV2: CI } = foundry.applications.api;
class pn extends CI {
  constructor(t, n) {
    super({
      id: `${c}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
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
    id: `${c}-ritual-preset-manager`,
    classes: [c, "paranormal-toolkit-ritual-preset-manager"],
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
      apply: pn.onApply,
      cancel: pn.onCancel
    }
  };
  async _renderHTML(t, n) {
    const a = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), r = document.createElement("div");
    return r.className = "paranormal-toolkit-preset-manager", r.innerHTML = this.renderContent(a), r;
  }
  _replaceHTML(t, n, a) {
    n.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${ne(rl)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${ne(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${_a("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${_a("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${_a("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
    const t = this.lastApplicationResult.applied.length, n = this.lastApplicationResult.skipped.length, a = n > 0 ? ` ${n} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${t} preset(s) aplicado(s).${a}</span>
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
        const a = this.lastApplicationResult.applied.length;
        ui.notifications?.info(`Paranormal Toolkit: ${a} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
      } finally {
        this.isApplying = !1, await this.render({ force: !0 });
      }
    }
  }
  static async onCancel(t) {
    t.preventDefault(), await this.close();
  }
}
function _a(e, t, n, a) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${a}"></i>
        <span>${ne(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? SI(n) : LI(t)}
    </section>
  `;
}
function SI(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(II).join("")}</ol>`;
}
function II(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", a = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${ne(e.appliedPresetId)} v${ne(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${ne(e.itemName)}</strong>
        <span>${ne(e.reason)}</span>
        ${a}
      </div>
      <em>${ne(n)}</em>
    </li>
  `;
}
function LI(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${ne({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function ne(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const gn = `${c}.manageRitualPresets`, Ns = `__${c}_ritualPresetHeaderControlRegistered`, vI = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function DI(e) {
  const t = globalThis;
  if (!t[Ns]) {
    for (const n of vI)
      Hooks.on(n, (a, r) => {
        xI(a, r, e);
      });
    t[Ns] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function xI(e, t, n) {
  Array.isArray(t) && PI(e) && (NI(e, n), !t.some((a) => a.action === gn) && t.push({
    action: gn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), bd(e, n);
    }
  }));
}
function NI(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[gn] && (e.options.actions[gn] = (n) => {
    n.preventDefault(), n.stopPropagation(), bd(e, t);
  }));
}
function PI(e) {
  if (!game.user?.isGM) return !1;
  const t = yd(e);
  return t ? t.type === "agent" && $t(t).length > 0 : !1;
}
function bd(e, t) {
  const n = yd(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new pn(n, t).render({ force: !0 });
}
function yd(e) {
  return Ps(e.actor) ? e.actor : Ps(e.document) ? e.document : null;
}
function Ps(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const mr = "data-paranormal-toolkit-stylesheet";
function OI(e) {
  const t = qI(e), n = MI(t), a = BI(n), r = FI(n, t);
  if (r)
    return r.href = a, r.setAttribute(mr, t), r;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = a, o.setAttribute(mr, t), document.head.append(o), o;
}
function MI(e) {
  const t = `modules/${c}/${e}`, n = foundry.utils, a = n.getRoute;
  return typeof a == "function" ? a.call(n, t) : t;
}
function FI(e, t) {
  const n = Os(e);
  for (const a of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (a.getAttribute(mr) === t || Os(a.href) === n)
      return a;
  return null;
}
function BI(e) {
  const t = UI();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function UI() {
  const e = game.modules.get(c), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function Os(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function qI(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function Ee(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${c}-ability-roll-config__field`);
  const a = document.createElement("span");
  return a.textContent = e, n.append(a, t), n;
}
function fr(e, t, n) {
  const a = document.createElement("input");
  return a.type = "text", a.value = e, a.placeholder = t, a.disabled = !n, a;
}
function Qt(e, t, n) {
  const a = document.createElement("button");
  a.type = "button", n && a.classList.add(n);
  const r = document.createElement("i");
  r.className = t;
  const o = document.createElement("span");
  return o.textContent = e, a.append(r, o), a;
}
function _d(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${c}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const a = document.createElement("i");
  return a.className = t, n.append(a), n;
}
function ct(e, t, n = !1) {
  const a = document.createElement("option");
  return a.value = e, a.textContent = t, a.selected = n, a;
}
function zI(e) {
  const { roll: t, index: n, editable: a, onChange: r, onRemove: o } = e, s = document.createElement("article");
  s.classList.add(`${c}-ability-roll-config__card`), s.dataset.abilityRollId = t.id;
  const l = document.createElement("header");
  l.classList.add(`${c}-ability-roll-config__card-header`);
  const u = document.createElement("div");
  u.classList.add(`${c}-ability-roll-config__card-title`);
  const d = document.createElement("strong");
  d.textContent = `Rolagem ${n + 1}`;
  const m = document.createElement("span");
  u.append(d, m);
  const g = _d("Remover rolagem", "fa-solid fa-trash");
  g.disabled = !a, g.addEventListener("click", o), l.append(u, g);
  const _ = document.createElement("div");
  _.classList.add(`${c}-ability-roll-config__fields`);
  const E = fr(
    t.label,
    "Ex.: Dano adicional",
    a
  );
  E.addEventListener("input", () => {
    t.label = E.value, r();
  }), _.append(Ee("Nome da rolagem", E));
  const R = document.createElement("select");
  R.disabled = !a;
  for (const S of [
    "generic",
    "damage",
    "healing"
  ])
    R.append(
      ct(
        S,
        cp(S),
        t.intent === S
      )
    );
  R.addEventListener("change", () => {
    t.intent = HI(R.value), vt(), r();
  }), _.append(Ee("Tipo da rolagem", R));
  const k = document.createElement("div");
  k.classList.add(
    `${c}-ability-roll-config__damage-field`
  ), _.append(k);
  const b = document.createElement("section");
  b.classList.add(
    `${c}-ability-roll-config__formula-section`
  );
  const L = document.createElement("div");
  L.classList.add(
    `${c}-ability-roll-config__formula-header`
  );
  const A = document.createElement("strong");
  A.textContent = "Fórmula";
  const z = document.createElement("label");
  z.classList.add(`${c}-ability-roll-config__scaling-toggle`);
  const x = document.createElement("input");
  x.type = "checkbox", x.checked = t.formula.mode === "nex", x.disabled = !a;
  const Y = document.createElement("span");
  Y.textContent = "Varia conforme o NEX", z.append(x, Y), L.append(A, z);
  const v = document.createElement("div");
  return v.classList.add(`${c}-ability-roll-config__formula`), b.append(L, v), x.addEventListener("change", () => {
    t.formula = x.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: GI(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((S) => S.formula.trim())?.formula ?? "" : t.formula.formula
    }, V(), he(), r();
  }), s.append(l, _, b), V(), vt(), he(), s;
  function V() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function vt() {
    k.replaceChildren();
    const S = t.intent === "damage";
    if (_.classList.toggle(
      `${c}-ability-roll-config__fields--without-damage`,
      !S
    ), k.hidden = !S, !S) return;
    const $ = document.createElement("select");
    $.disabled = !a, $.append(ct("", "—", !t.damageType));
    for (const { value: I, label: j } of ql)
      $.append(ct(I, j, t.damageType === I));
    $.addEventListener("change", () => {
      t.damageType = $.value || null, r();
    }), k.append(Ee("Tipo de dano", $));
  }
  function he() {
    if (v.replaceChildren(), t.formula.mode === "fixed") {
      const X = fr(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        a
      );
      X.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = X.value, r());
      }), v.append(Ee("Expressão", X));
      return;
    }
    const S = t.formula, $ = document.createElement("select");
    $.disabled = !a, $.append(
      ct(
        "highest-unlocked",
        "Usar a maior fórmula liberada",
        S.resolution === "highest-unlocked"
      ),
      ct(
        "choose-unlocked",
        "Escolher entre as fórmulas liberadas",
        S.resolution === "choose-unlocked"
      )
    ), $.addEventListener("change", () => {
      S.resolution = WI($.value), r();
    }), v.append(Ee("Comportamento", $));
    const I = document.createElement("div");
    I.classList.add(`${c}-ability-roll-config__steps`), S.steps.forEach((X, Dt) => {
      I.append(
        jI({
          step: X,
          editable: a,
          onChange: r,
          onRemove: () => {
            S.steps.splice(Dt, 1), he(), r();
          }
        })
      );
    }), v.append(I);
    const j = Qt(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${c}-ability-roll-config__add-step`
    );
    j.disabled = !a || S.steps.length >= Ia, j.addEventListener("click", () => {
      S.steps.length >= Ia || (S.steps.push({
        minNex: VI(
          S.steps.map((X) => X.minNex)
        ),
        formula: ""
      }), he(), r());
    }), v.append(j);
  }
}
function jI(e) {
  const { step: t, editable: n, onChange: a, onRemove: r } = e, o = document.createElement("div");
  o.classList.add(`${c}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = KI(Number(s.value)), s.value = String(t.minNex), a();
  });
  const l = document.createElement("div");
  l.classList.add(`${c}-ability-roll-config__nex-control`);
  const u = document.createElement("span");
  u.textContent = "%", l.append(s, u);
  const d = fr(t.formula, "Ex.: 2d6", n);
  d.setAttribute("aria-label", "Fórmula da etapa"), d.addEventListener("input", () => {
    t.formula = d.value, a();
  });
  const m = _d("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", r), o.append(
    Ee("NEX mínimo", l),
    Ee("Fórmula", d),
    m
  ), o;
}
function GI(e) {
  const t = tp(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function VI(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function HI(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function WI(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function KI(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function YI(e) {
  let t = Aa(e.config);
  const n = document.createElement("section");
  n.classList.add(`${c}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const a = XI(t), r = document.createElement("p");
  r.classList.add(`${c}-ability-roll-config__hint`), r.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${c}-ability-roll-config__list`);
  const s = Qt(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${c}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= Sa || (t.rolls.push(jl(t.rolls.length + 1)), _(), L("Rolagem adicionada. Salve para confirmar."));
  });
  const l = document.createElement("div");
  l.classList.add(`${c}-ability-roll-config__actions`);
  const u = Qt("Salvar fórmulas", "fa-solid fa-floppy-disk"), d = Qt("Limpar", "fa-solid fa-eraser");
  l.append(u, d);
  const m = document.createElement("footer");
  m.classList.add(`${c}-ability-roll-config__footer`), m.append(s, l);
  const g = document.createElement("p");
  return g.classList.add(`${c}-ability-roll-config__status`), g.textContent = e.editable ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", n.append(a, r, o, m, g), u.addEventListener("click", () => {
    e.editable && E();
  }), d.addEventListener("click", () => {
    e.editable && R();
  }), _(), n;
  function _() {
    if (o.replaceChildren(), t.rolls.length === 0) {
      const A = document.createElement("p");
      A.classList.add(`${c}-ability-roll-config__empty`), A.textContent = "Nenhuma rolagem configurada.", o.append(A);
    } else
      t.rolls.forEach((A, z) => {
        o.append(
          zI({
            roll: A,
            index: z,
            editable: e.editable,
            onChange: () => {
              pr(a, t), L("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(z, 1), _(), L("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    pr(a, t), b(!1);
  }
  async function E() {
    k(!0), L("Salvando configuração...");
    try {
      const A = wr(t);
      if (!A) throw new Error("Configuração inválida.");
      t = Aa(await e.onSave(A)), _(), L("Configuração salva.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        A
      ), L("Não foi possível salvar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade."
      );
    } finally {
      k(!1);
    }
  }
  async function R() {
    k(!0), L("Limpando configuração...");
    try {
      t = Aa(await e.onClear()), _(), L("Configuração removida.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        A
      ), L("Não foi possível limpar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade."
      );
    } finally {
      k(!1);
    }
  }
  function k(A) {
    n.classList.toggle(`${c}-ability-roll-config--busy`, A), b(A);
  }
  function b(A) {
    u.disabled = A || !e.editable, d.disabled = A || !e.editable, s.disabled = A || !e.editable || t.rolls.length >= Sa;
  }
  function L(A) {
    g.textContent = A;
  }
}
function XI(e) {
  const t = document.createElement("header");
  t.classList.add(`${c}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${c}-ability-roll-config__title`);
  const a = document.createElement("strong");
  a.textContent = "Paranormal Toolkit";
  const r = document.createElement("span");
  r.textContent = "Fórmulas de rolagem", n.append(a, r);
  const o = document.createElement("span");
  return o.classList.add(`${c}-ability-roll-config__badge`), t.append(n, o), pr(t, e), t;
}
function pr(e, t) {
  const n = e.querySelector(
    `.${c}-ability-roll-config__badge`
  );
  n && (n.textContent = up(t) ? "Configurada" : "Rascunho");
}
function Aa(e) {
  return JSON.parse(JSON.stringify(e));
}
const QI = "[data-paranormal-toolkit-ability-roll-config]", Ms = `__${c}_abilityRollConfigBlockRegistered`, ZI = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function JI() {
  const e = globalThis;
  if (!e[Ms]) {
    OI("styles/ability-roll-config.css");
    for (const t of ZI)
      Hooks.on(t, (...n) => {
        eL(n[0], n[1]);
      });
    e[Ms] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function eL(e, t) {
  const n = nL(e);
  if (!n || n.type !== "ability") return;
  const a = rL(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!r) return;
  for (const s of Array.from(
    r.querySelectorAll(QI)
  ))
    s.remove();
  const o = YI({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: ap(n),
    editable: aL(n),
    onSave: async (s) => {
      const l = await rp(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await op(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), zl())
  });
  tL(r, o);
}
function tL(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function nL(e) {
  return Fs(e.item) ? e.item : Fs(e.document) ? e.document : null;
}
function aL(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function rL(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Fs(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const Ro = "ritualResistanceOutcomes";
function Ad() {
  return {
    schemaVersion: 1,
    outcomes: {
      success: { conditions: [] },
      failure: { conditions: [] }
    }
  };
}
function oL(e) {
  const t = e.getFlag(
    c,
    Ro
  );
  return Td(t);
}
function iL(e) {
  return oL(e) ?? Ad();
}
function Td(e) {
  if (!hn(e)) return null;
  const t = hn(e.outcomes) ? e.outcomes : {};
  return {
    schemaVersion: 1,
    outcomes: {
      success: Bs(t.success),
      failure: Bs(t.failure)
    }
  };
}
function sL() {
  return Or.map((e) => ({
    value: e.id,
    label: e.label
  })).sort((e, t) => e.label.localeCompare(t.label, "pt-BR"));
}
function lL(e) {
  return Object.values(e.outcomes).some(
    (t) => t.conditions.length > 0
  );
}
function Bs(e) {
  if (!hn(e) || !Array.isArray(e.conditions))
    return { conditions: [] };
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e.conditions) {
    const r = cL(a);
    !r || n.has(r.conditionId) || (n.add(r.conditionId), t.push(r));
  }
  return { conditions: t };
}
function cL(e) {
  if (!hn(e)) return null;
  const t = uL(mL(e.conditionId));
  return t ? {
    conditionId: t.id,
    rounds: dL(e.rounds)
  } : null;
}
function uL(e) {
  const t = Us(e);
  return t ? Or.find((n) => [
    n.id,
    n.label,
    ...n.aliases ?? []
  ].some((r) => Us(r) === t)) ?? null : null;
}
function dL(e) {
  if (e == null || e === "") return null;
  const t = typeof e == "number" ? e : typeof e == "string" ? Number(e.trim()) : Number.NaN;
  if (!Number.isFinite(t)) return null;
  const n = Math.trunc(t);
  return n > 0 ? n : null;
}
function Us(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLocaleLowerCase();
}
function mL(e) {
  return typeof e == "string" ? e.trim() : "";
}
function hn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const gr = "data-paranormal-toolkit-ritual-resistance-outcome-editor", bn = "data-paranormal-toolkit-ritual-resistance-outcome", yn = "data-paranormal-toolkit-ritual-resistance-outcome-row", _n = "data-paranormal-toolkit-ritual-resistance-outcome-field", An = "data-paranormal-toolkit-ritual-resistance-outcome-editor-action", fL = {
  success: "Sucesso na resistência",
  failure: "Falha na resistência"
}, pL = sL();
function gL(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${c}-ritual-resistance-outcomes__grid`), n.setAttribute(gr, "true"), n.append(
    qs(
      "success",
      e.outcomes.success.conditions,
      t
    ),
    qs(
      "failure",
      e.outcomes.failure.conditions,
      t
    )
  ), n.addEventListener("click", (a) => {
    const r = a.target;
    if (!(r instanceof Element)) return;
    const o = r.closest(
      `button[${An}]`
    );
    if (!(!o || !n.contains(o) || !t))
      switch (o.getAttribute(An)) {
        case "add":
          bL(n, o);
          return;
        case "remove":
          yL(o);
          return;
      }
  }), n;
}
function hL(e) {
  return {
    schemaVersion: 1,
    outcomes: {
      success: { conditions: zs(e, "success") },
      failure: { conditions: zs(e, "failure") }
    }
  };
}
function Rd(e, t, n) {
  for (const a of ["success", "failure"]) {
    const r = Eo(e, a);
    r && r.replaceChildren(
      ...Ed(t.outcomes[a].conditions).map(
        (o) => Gn(a, o, n)
      )
    );
  }
}
function qs(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${c}-ritual-resistance-outcomes__card`), a.setAttribute(bn, e);
  const r = document.createElement("strong");
  r.classList.add(`${c}-ritual-resistance-outcomes__card-title`), r.textContent = fL[e], a.append(r);
  const o = document.createElement("div");
  o.classList.add(`${c}-ritual-resistance-outcomes__rows`), o.append(
    ...Ed(t).map(
      (l) => Gn(e, l, n)
    )
  ), a.append(o);
  const s = document.createElement("button");
  return s.type = "button", s.textContent = "+ Adicionar condição", s.disabled = !n, s.classList.add(`${c}-ritual-resistance-outcomes__add`), s.setAttribute(An, "add"), s.setAttribute(bn, e), a.append(s), a;
}
function Gn(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${c}-ritual-resistance-outcomes__row`), a.setAttribute(yn, e);
  const r = js("Condição");
  r.classList.add(
    `${c}-ritual-resistance-outcomes__condition-field`
  );
  const o = document.createElement("select");
  o.disabled = !n, o.setAttribute(_n, "conditionId");
  const s = document.createElement("option");
  s.value = "", s.textContent = "Nenhuma condição", s.selected = t.conditionId.length === 0, o.append(s);
  for (const m of pL) {
    const g = document.createElement("option");
    g.value = m.value, g.textContent = m.label, g.selected = t.conditionId === m.value, o.append(g);
  }
  r.append(o);
  const l = js("Rodadas");
  l.classList.add(
    `${c}-ritual-resistance-outcomes__rounds-field`
  );
  const u = document.createElement("input");
  u.type = "number", u.min = "1", u.step = "1", u.placeholder = "Sem limite", u.value = t.rounds === null ? "" : String(t.rounds), u.disabled = !n, u.setAttribute(_n, "rounds"), l.append(u);
  const d = document.createElement("button");
  return d.type = "button", d.textContent = "×", d.title = "Remover condição", d.setAttribute("aria-label", d.title), d.disabled = !n, d.classList.add(`${c}-ritual-resistance-outcomes__remove`), d.setAttribute(An, "remove"), a.append(r, l, d), a;
}
function zs(e, t) {
  const n = Eo(e, t);
  return n ? Array.from(
    n.querySelectorAll(`[${yn}]`)
  ).flatMap((a) => {
    const r = a.querySelector(
      `[${_n}="conditionId"]`
    )?.value.trim();
    if (!r) return [];
    const o = a.querySelector(`[${_n}="rounds"]`)?.value.trim();
    return [{ conditionId: r, rounds: _L(o) }];
  }) : [];
}
function bL(e, t) {
  const n = kd(
    t.getAttribute(bn)
  );
  if (!n) return;
  Eo(e, n)?.append(Gn(n, ko(), !0));
}
function yL(e) {
  const t = e.closest(`[${yn}]`), n = kd(t?.getAttribute(yn)), a = t?.parentElement;
  !t || !n || !a || (t.remove(), a.childElementCount === 0 && a.append(Gn(n, ko(), !0)));
}
function Eo(e, t) {
  return (e.matches(`[${gr}]`) ? e : e.querySelector(`[${gr}]`))?.querySelector(
    `.${c}-ritual-resistance-outcomes__card[${bn}="${t}"]`
  )?.querySelector(
    `.${c}-ritual-resistance-outcomes__rows`
  ) ?? null;
}
function Ed(e) {
  return e.length > 0 ? e : [ko()];
}
function ko() {
  return { conditionId: "", rounds: null };
}
function js(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-resistance-outcomes__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function _L(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = Number(e);
  if (!Number.isFinite(t)) return null;
  const n = Math.trunc(t);
  return n > 0 ? n : null;
}
function kd(e) {
  return e === "success" || e === "failure" ? e : null;
}
const $o = "data-paranormal-toolkit-ritual-resistance-outcomes", Gs = "data-paranormal-toolkit-ritual-roll-section-title", AL = "data-paranormal-toolkit-ritual-roll-field", Vs = "data-paranormal-toolkit-ritual-roll-action", Hs = "data-paranormal-toolkit-ritual-unified-actions-bound", Ws = `__${c}_ritualResistanceOutcomeBlockRegistered`, TL = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function RL() {
  const e = globalThis;
  if (!e[Ws]) {
    for (const t of TL)
      Hooks.on(t, (...n) => {
        EL(
          n[0],
          n[1]
        );
      });
    e[Ws] = !0, f.info(
      "Seção de efeitos por resistência registrada na configuração genérica de ritual."
    );
  }
}
function EL(e, t) {
  const n = NL(e);
  if (!n || n.type !== "ritual") return;
  const a = OL(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="ritualAttr"]'
  );
  if (!r) return;
  const o = r.querySelector(
    "[data-paranormal-toolkit-ritual-roll-config]"
  );
  if (!o) return;
  wL(o), kL(o);
  const s = iL(n), l = PL(n), u = ro(n), d = CL(
    s,
    l,
    u?.summary ?? null
  );
  $L(o, d), SL(o, n, l), wo(o, s);
}
function kL(e) {
  const t = e.querySelector(
    `.${c}-ritual-roll-config__title span`
  );
  t && (t.textContent = "Configuração genérica do ritual");
  const n = e.querySelector(
    `.${c}-ritual-roll-config__hint`
  );
  n && (n.textContent = "Configure as rolagens e os efeitos de resistência usados pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.");
  const a = e.querySelector(
    `.${c}-ritual-roll-config__fields`
  );
  if (!a) return;
  e.querySelector(`[${Gs}]`)?.remove();
  const r = document.createElement("strong");
  r.classList.add(
    `${c}-ritual-resistance-outcomes__formula-title`
  ), r.setAttribute(Gs, "true"), r.textContent = "Fórmula de rolagem", a.insertAdjacentElement("beforebegin", r);
}
function $L(e, t) {
  const n = e.querySelector(
    `.${c}-ritual-roll-config__actions`
  );
  if (n) {
    n.insertAdjacentElement("beforebegin", t);
    return;
  }
  e.append(t);
}
function wL(e) {
  for (const t of Array.from(
    e.querySelectorAll(`[${$o}]`)
  ))
    t.remove();
}
function CL(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${c}-ritual-resistance-outcomes`), a.setAttribute($o, "true");
  const r = document.createElement("strong");
  r.classList.add(`${c}-ritual-resistance-outcomes__section-title`), r.textContent = "Efeitos da resistência", a.append(r);
  const o = document.createElement("p");
  return o.classList.add(`${c}-ritual-resistance-outcomes__hint`), o.textContent = n ? `${n}. Configure quais condições ficam disponíveis em cada resultado.` : "Configure uma perícia e um resultado de resistência nos campos do sistema antes de usar estes efeitos.", a.append(o), a.append(gL(e, t)), a;
}
function SL(e, t, n) {
  const a = e.querySelector(
    `button[${Vs}="save"]`
  ), r = e.querySelector(
    `button[${Vs}="clear"]`
  );
  a && (a.textContent = "Salvar configuração"), r && (r.textContent = "Limpar configuração"), !e.hasAttribute(Hs) && (e.setAttribute(Hs, "true"), a?.addEventListener(
    "click",
    (o) => {
      if (o.preventDefault(), o.stopImmediatePropagation(), !n) return;
      const s = Ks(e);
      s && IL(e, s, t, a, r);
    },
    { capture: !0 }
  ), r?.addEventListener(
    "click",
    (o) => {
      if (o.preventDefault(), o.stopImmediatePropagation(), !n) return;
      const s = Ks(e);
      s && LL(e, s, t, a, r);
    },
    { capture: !0 }
  ));
}
function Ks(e) {
  return e.querySelector(`[${$o}]`);
}
async function IL(e, t, n, a, r) {
  Tn(a, r, !0), je(e, "Salvando configuração...");
  try {
    const o = $d(e), s = Td(
      hL(t)
    );
    if (!o || !s)
      throw new Error("Configuração genérica do ritual inválida.");
    await Cd(n).update({
      [`flags.${c}.${Ye}`]: o,
      [`flags.${c}.${Ro}`]: s
    }), wd(e, o), Rd(
      t,
      s,
      !0
    ), wo(e, s), je(e, "Configuração salva."), ui.notifications?.info(
      "Paranormal Toolkit: configuração genérica do ritual salva."
    );
  } catch (o) {
    console.warn(
      "Paranormal Toolkit: não foi possível salvar a configuração genérica do ritual.",
      o
    ), je(e, "Não foi possível salvar a configuração."), ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível salvar a configuração genérica do ritual."
    );
  } finally {
    Tn(a, r, !1);
  }
}
async function LL(e, t, n, a, r) {
  Tn(a, r, !0), je(e, "Limpando configuração...");
  try {
    await Cd(n).update({
      [`flags.${c}.-=${Ye}`]: null,
      [`flags.${c}.-=${Ro}`]: null
    });
    const o = St(), s = Ad();
    wd(e, o), Rd(
      t,
      s,
      !0
    ), wo(e, s), je(e, "Configuração removida."), ui.notifications?.info(
      "Paranormal Toolkit: configuração genérica do ritual removida."
    );
  } catch (o) {
    console.warn(
      "Paranormal Toolkit: não foi possível limpar a configuração genérica do ritual.",
      o
    ), je(e, "Não foi possível limpar a configuração."), ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível limpar a configuração genérica do ritual."
    );
  } finally {
    Tn(a, r, !1);
  }
}
function $d(e) {
  const t = xL(
    Co(e, "intent")?.value
  );
  return t ? un({
    schemaVersion: 1,
    intent: t,
    damageType: Ys(e, "damageType"),
    utilityLabel: Ys(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: {
        formula: Zt(e, "formula.base")
      },
      discente: {
        formula: Zt(e, "formula.discente")
      },
      verdadeiro: {
        formula: Zt(e, "formula.verdadeiro")
      }
    }
  }) : null;
}
function wd(e, t) {
  Pe(e, "intent", t.intent), Pe(
    e,
    "damageType",
    t.damageType ?? ""
  ), Pe(
    e,
    "utilityLabel",
    t.utilityLabel ?? "Resultado"
  ), Pe(
    e,
    "formula.base",
    t.forms.base.formula
  ), Pe(
    e,
    "formula.discente",
    t.forms.discente.formula
  ), Pe(
    e,
    "formula.verdadeiro",
    t.forms.verdadeiro.formula
  ), vL(e, t.intent);
}
function vL(e, t) {
  for (const n of Array.from(
    e.querySelectorAll(
      '[data-paranormal-toolkit-ritual-roll-damage-row="true"]'
    )
  ))
    n.hidden = t !== "damage";
  for (const n of Array.from(
    e.querySelectorAll(
      '[data-paranormal-toolkit-ritual-roll-utility-row="true"]'
    )
  ))
    n.hidden = t !== "utility";
}
function wo(e, t) {
  const n = e.querySelector(
    `.${c}-ritual-roll-config__badge`
  );
  if (!n) return;
  const a = $d(e);
  n.textContent = a && DL(a) || lL(t) ? "Configurada" : "Rascunho";
}
function DL(e) {
  return Object.values(e.forms).some(
    (t) => t.formula.trim().length > 0
  );
}
function Co(e, t) {
  return e.querySelector(
    `[${AL}="${t}"]`
  );
}
function Zt(e, t) {
  return Co(
    e,
    t
  )?.value.trim() ?? "";
}
function Ys(e, t) {
  const n = Zt(e, t);
  return n.length > 0 ? n : null;
}
function Pe(e, t, n) {
  const a = Co(
    e,
    t
  );
  a && (a.value = n);
}
function xL(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Tn(e, t, n) {
  e && (e.disabled = n), t && (t.disabled = n);
}
function je(e, t) {
  const n = e.querySelector(
    `.${c}-ritual-roll-config__status`
  );
  n && (n.textContent = t);
}
function Cd(e) {
  if (typeof e.update != "function")
    throw new Error("O item não suporta atualização de configuração.");
  return e;
}
function NL(e) {
  return Xs(e.item) ? e.item : Xs(e.document) ? e.document : null;
}
function PL(e) {
  return !!(game.user?.isGM || e.isOwner);
}
function OL(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Xs(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const Sd = "data-paranormal-toolkit-ritual-roll-config", Lt = "data-paranormal-toolkit-ritual-roll-field", Se = "data-paranormal-toolkit-ritual-roll-action", Qs = `__${c}_ritualRollConfigBlockRegistered`, ML = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], FL = [
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
function BL() {
  const e = globalThis;
  if (!e[Qs]) {
    UL();
    for (const t of ML)
      Hooks.on(t, (...n) => {
        qL(n[0], n[1]);
      });
    e[Qs] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function UL() {
  const e = `${c}-ritual-roll-config-inline-style`;
  if (document.getElementById(e)) return;
  const t = document.createElement("style");
  t.id = e, t.textContent = `
.${c}-ritual-roll-config {
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
.${c}-ritual-roll-config__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.${c}-ritual-roll-config__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.${c}-ritual-roll-config__title strong {
  color: rgba(89, 36, 42, 0.96);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}
.${c}-ritual-roll-config__title span {
  font-size: 0.9rem;
  font-weight: 800;
}
.${c}-ritual-roll-config__badge {
  border: 1px solid rgba(89, 36, 42, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(89, 36, 42, 0.9);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
}
.${c}-ritual-roll-config__hint,
.${c}-ritual-roll-config__status {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  opacity: 0.8;
}
.${c}-ritual-roll-config__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.${c}-ritual-roll-config__forms-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.${c}-ritual-roll-config__forms-title {
  color: rgba(24, 19, 18, 0.9);
  font-size: 0.8rem;
  font-weight: 900;
}
.${c}-ritual-roll-config__forms-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.${c}-ritual-roll-config__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
}
.${c}-ritual-roll-config__field input,
.${c}-ritual-roll-config__field select,
.${c}-ritual-roll-config__field textarea {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
}
.${c}-ritual-roll-config__field textarea {
  resize: vertical;
}
.${c}-ritual-roll-config__field small {
  color: rgba(89, 36, 42, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
}
.${c}-ritual-roll-config__form-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.28);
}
.${c}-ritual-roll-config__form-card:has(input:disabled) {
  opacity: 0.72;
}
.${c}-ritual-roll-config__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${c}-ritual-roll-config__actions button {
  width: auto;
  margin: 0;
}
.${c}-ritual-roll-config [hidden] {
  display: none !important;
}
@media (max-width: 620px) {
  .${c}-ritual-roll-config__fields,
  .${c}-ritual-roll-config__forms-grid {
    grid-template-columns: 1fr;
  }
}
`, document.head.append(t);
}
function qL(e, t) {
  const n = tv(e);
  if (!n || n.type !== "ritual") return;
  const a = rv(t);
  if (!a) return;
  const r = a.querySelector('section[data-tab="ritualAttr"]');
  if (!r) return;
  jL(r);
  const o = Ld(n), s = Su(n), l = nv(n), u = GL(n, s, o, l);
  XL(u, n, o, l), zL(r, u), So(u);
}
function zL(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function jL(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Sd}]`)))
    t.remove();
}
function GL(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config`), r.setAttribute(Sd, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${c}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${c}-ritual-roll-config__title`), s.append(Zs("strong", "Paranormal Toolkit")), s.append(Zs("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = Dd(t) ? "Configurada" : "Rascunho", o.append(s, l), r.append(o);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", r.append(u);
  const d = document.createElement("div");
  d.classList.add(`${c}-ritual-roll-config__fields`), d.append(VL(t, a)), d.append(HL(t, a)), d.append(WL(t, a)), r.append(d), r.append(KL(t, n, a)), r.append(YL(a));
  const m = document.createElement("p");
  return m.classList.add(`${c}-ritual-roll-config__status`), m.textContent = a ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", r.append(m), r;
}
function VL(e, t) {
  const n = Vn("Tipo da rolagem"), a = document.createElement("select");
  a.setAttribute(Lt, "intent"), a.disabled = !t;
  for (const r of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = r, o.textContent = ik(r), o.selected = e.intent === r, a.append(o);
  }
  return n.append(a), n;
}
function HL(e, t) {
  const n = Vn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const a = document.createElement("select");
  a.setAttribute(Lt, "damageType"), a.disabled = !t;
  const r = document.createElement("option");
  r.value = "", r.textContent = "—", r.selected = !e.damageType, a.append(r);
  for (const o of FL) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, a.append(s);
  }
  return n.append(a), n;
}
function WL(e, t) {
  const n = Vn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const a = document.createElement("input");
  return a.type = "text", a.placeholder = "Resultado", a.value = e.utilityLabel ?? "Resultado", a.disabled = !t, a.setAttribute(Lt, "utilityLabel"), n.append(a), n;
}
function KL(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${c}-ritual-roll-config__forms-section`);
  const r = document.createElement("strong");
  r.classList.add(`${c}-ritual-roll-config__forms-title`), r.textContent = "Fórmulas por forma", a.append(r);
  const o = document.createElement("div");
  return o.classList.add(`${c}-ritual-roll-config__forms-grid`), o.append(Ta("base", "Padrão", e.forms.base.formula, !0, n)), o.append(Ta("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(Ta("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), a.append(o), a;
}
function Ta(e, t, n, a, r) {
  const o = Vn(t);
  o.classList.add(`${c}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !r || !a, s.setAttribute(Lt, `formula.${e}`), o.append(s), !a) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function YL(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(Se, "save");
  const a = document.createElement("button");
  return a.type = "button", a.textContent = "Limpar", a.disabled = !e, a.setAttribute(Se, "clear"), t.append(n, a), t;
}
function Vn(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Zs(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function XL(e, t, n, a) {
  it(e, "intent")?.addEventListener("change", () => So(e)), tl(e, "system.studentForm")?.addEventListener("change", () => Js(e, t)), tl(e, "system.trueForm")?.addEventListener("change", () => Js(e, t)), e.querySelector(`[${Se}="save"]`)?.addEventListener("click", () => {
    a && QL(e, t, n);
  }), e.querySelector(`[${Se}="clear"]`)?.addEventListener("click", () => {
    a && ZL(e, t);
  });
}
async function QL(e, t, n) {
  const a = e.querySelector(`[${Se}="save"]`);
  a?.setAttribute("disabled", "true"), Ge(e, "Salvando configuração...");
  try {
    const r = JL(e, n);
    await rk(t, r), Id(e, r), Ge(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", r), Ge(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    a?.removeAttribute("disabled");
  }
}
async function ZL(e, t) {
  const n = e.querySelector(`[${Se}="clear"]`);
  n?.setAttribute("disabled", "true"), Ge(e, "Limpando configuração...");
  try {
    await ok(t);
    const a = Su(t);
    ev(e, a), Id(e, a), Ge(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", a), Ge(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Id(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = Dd(t) ? "Configurada" : "Rascunho");
}
function JL(e, t) {
  return {
    schemaVersion: 1,
    intent: vd(it(e, "intent")?.value),
    damageType: nl(e, "damageType"),
    utilityLabel: nl(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Jt(e, "formula.base") },
      discente: { formula: Jt(e, "formula.discente") },
      verdadeiro: { formula: Jt(e, "formula.verdadeiro") }
    }
  };
}
function ev(e, t) {
  Oe(e, "intent", t.intent), Oe(e, "damageType", t.damageType ?? ""), Oe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), Oe(e, "formula.base", t.forms.base.formula), Oe(e, "formula.discente", t.forms.discente.formula), Oe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), So(e);
}
function So(e) {
  const t = vd(it(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), a = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const r of Array.from(n))
    r.hidden = t !== "damage";
  for (const r of Array.from(a))
    r.hidden = t !== "utility";
}
function Js(e, t) {
  const n = Ld(t);
  el(e, "discente", n.discente), el(e, "verdadeiro", n.verdadeiro);
}
function el(e, t, n) {
  const a = it(e, `formula.${t}`);
  if (!a) return;
  const r = !e.querySelector(`[${Se}="save"]`)?.disabled;
  a.disabled = !r || !n;
  const o = a.closest(`.${c}-ritual-roll-config__field`), s = o?.querySelector("small");
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
function Ge(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Ld(e) {
  const t = av(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function tv(e) {
  return al(e.item) ? e.item : al(e.document) ? e.document : null;
}
function nv(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function av(e) {
  const t = e.system;
  return ov(t) ? t : {};
}
function tl(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function it(e, t) {
  return e.querySelector(`[${Lt}="${iv(t)}"]`);
}
function Jt(e, t) {
  return it(e, t)?.value.trim() ?? "";
}
function nl(e, t) {
  const n = Jt(e, t);
  return n.length > 0 ? n : null;
}
function Oe(e, t, n) {
  const a = it(e, t);
  a && (a.value = n);
}
function vd(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Dd(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function rv(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function al(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function ov(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function iv(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let te = null;
Hooks.once("init", () => {
  ym(), Xm(), Ag(), RR(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!qo.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${qo.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  te = wI(), te.itemUseIntegration.registerStrategies(), ug(te.resources, te.resourceAdapter), hg(te.conditions), zf(te), SR(), DI(te), BL(), RL(), JI(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  );
});
function sv() {
  if (!te)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return te;
}
export {
  sv as getToolkitServices
};
//# sourceMappingURL=main.js.map
