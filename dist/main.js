const u = "paranormal-toolkit", er = "Paranormal Toolkit", gl = "ordemparanormal";
class Ve {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function wt(e) {
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
    console.log(`${u} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${u} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${u} | ${t}`, ...n);
  }
}
function b(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function kt(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : tr(t) ? b(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function hl(e) {
  return tr(e.getFlag(u, "automation"));
}
function tr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && _l(t.source) && bl(t.definition);
}
function bl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(yl) && (t.conditionApplications === void 0 || kl(t.conditionApplications));
}
function _l(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function yl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Al(t);
    case "spendRitualCost":
      return Tl(t);
    case "rollFormula":
      return $l(t);
    case "modifyResource":
      return Rl(t);
    case "chatCard":
      return wl(t);
    default:
      return !1;
  }
}
function Al(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ka(t);
}
function Tl(e) {
  return e.type === "spendRitualCost";
}
function $l(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || Dl(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function Rl(e) {
  const t = e;
  return t.type === "modifyResource" && Ea(t.actor) && Sl(t.resource) && Ll(t.operation) && ka(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function wl(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function kl(e) {
  return Array.isArray(e) && e.every(El);
}
function El(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Ea(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Il(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function Il(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || vl(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Cl(t.expiry));
}
function Cl(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ka(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Ea(e) {
  return e === "self" || e === "target";
}
function Sl(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ll(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Dl(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function vl(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function nr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Br);
    if (xl(t))
      return Array.from(t).filter(Br);
  }
  return [];
}
function Pl(e) {
  return nr(e)[0] ?? null;
}
function Nl(e) {
  return nr(e).find(hl) ?? null;
}
function xl(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Br(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function He(e) {
  return nr(e).filter((t) => t.type === "ritual");
}
function Ia(e) {
  return He(e)[0] ?? null;
}
function Ol(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(wt);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = xe("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Xe(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(zr);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = xe("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Xe(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        f.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await gn(e, r, o.value);
      f.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = xe("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Xe(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await gn(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: zr(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return qr(e);
    },
    async applyBestPresetsToActorRituals() {
      return qr(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = xe("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Xe(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function qr(e) {
  const t = xe("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = He(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Gr(t);
  const r = Gr(t, n.length);
  for (const o of n) {
    const a = e.automationRegistry.findForItem(o)[0];
    if (!a) {
      r.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await gn(e, o, a.preset);
    r.applied.push(Ml(o, a, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Fl(r), r;
}
async function gn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Ml(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: wt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Gr(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Fl(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function zr(e) {
  return {
    preset: wt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function xe(e) {
  const t = Ve.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Xe(e) {
  const t = Ia(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ie(e) {
  return e ? {
    id: e.id,
    source: {
      ...Ul(e.sourceActor),
      token: e.sourceToken
    },
    item: Bl(e.item),
    targets: e.targets.map(ql),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: jr(e.rollRequests, Ca),
    rolls: jr(e.rolls, Gl),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(rr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function rr(e) {
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
function Ul(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Bl(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ql(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ca(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Gl(e) {
  return {
    ...Ca(e),
    total: e.total
  };
}
function jr(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function zl(e) {
  return {
    getSelected() {
      return Ve.getSelectedActor();
    },
    logResources() {
      const t = X(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await fe(
        e,
        "Gasto de PE",
        X("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await fe(
        e,
        "Gasto de PD",
        X("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await fe(
        e,
        "Dano em PV",
        X("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await fe(
        e,
        "Cura de PV",
        X("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await fe(
        e,
        "Dano em SAN",
        X("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await fe(
        e,
        "Recuperação de SAN",
        X("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function fe(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    jl(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, rr(a));
}
function X(e) {
  const t = Ve.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function jl(e) {
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
const F = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Vl() {
  Je(F.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Je(F.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Je(F.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Je(F.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function hn() {
  return {
    enabled: et(F.enabled),
    console: et(F.console),
    ui: et(F.ui),
    chat: et(F.chat)
  };
}
async function V(e, t) {
  await game.settings.set(u, F[e], t);
}
function Je(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function et(e) {
  return game.settings.get(u, e) === !0;
}
function Hl() {
  return {
    status() {
      return hn();
    },
    async enable() {
      await V("enabled", !0);
    },
    async disable() {
      await V("enabled", !1);
    },
    async enableConsole() {
      await V("console", !0);
    },
    async disableConsole() {
      await V("console", !1);
    },
    async enableUi() {
      await V("ui", !0);
    },
    async disableUi() {
      await V("ui", !1);
    },
    async enableChat() {
      await V("chat", !0);
    },
    async disableChat() {
      await V("chat", !1);
    }
  };
}
const Sa = "ritual.costOnly", La = "ritual.simpleHealing", Wl = "ritual.eletrocussao", Da = "ritual.simpleDamage", va = "generic.simpleHealing", Pa = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Kl() {
  return [
    Yl(),
    Ql(),
    Zl(),
    Xl(),
    Jl()
  ];
}
function Yl() {
  return {
    id: Sa,
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
function Ql() {
  return {
    id: La,
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
    automation: Na(),
    itemPatch: tc()
  };
}
function Zl() {
  return {
    id: Wl,
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
    automation: ec(),
    itemPatch: nc()
  };
}
function Xl() {
  return {
    id: Da,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: or()
  };
}
function Jl() {
  return {
    id: va,
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
function Na(e = "2d8+2") {
  return xa(
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
function ec() {
  return {
    ...or("3d6", {
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
function or(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return xa(
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
          damageType: o
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
          message: a
        }
      ]
    },
    "damage",
    e
  );
}
function tc() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Pa,
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
function nc() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Pa,
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
function xa(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function ar() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ge(t.id),
    actorId: ge(t.actor?.id),
    sceneId: ge(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Oa() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: ge(e.id),
    actorId: ge(t?.id),
    sceneId: ge(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ge(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function rc(e) {
  return {
    logFirstRitualCost() {
      const t = J("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = ee(t);
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
      const r = J("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = ee(r);
      if (o) {
        if (!ic(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(u, "ritual.cost", {
          resource: n,
          amount: t
        }), f.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = J("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = ee(t);
      n && (await n.unsetFlag(u, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = J("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = ee(t);
      if (!n) return;
      const r = e.automationRegistry.require(Sa);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = J("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = ee(n);
      if (!r) return;
      if (!Vr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(La);
      if (!o.ok) {
        f.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Na(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = J("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ee(n);
      if (!r) return;
      if (!Vr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Da);
      if (!o.ok) {
        f.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: or(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = J("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = ee(t);
      n && await oc(e, t, n);
    }
  };
}
async function oc(e, t, n) {
  const r = kt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Oa(),
    item: n,
    targets: ar()
  });
  if (!o.ok) {
    ac(o.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", ie(o.value.context));
}
function ac(e) {
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
function J(e) {
  const t = Ve.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ee(e) {
  const t = Ia(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ic(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Vr(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const sc = ["strict", "open"], Ma = "strict";
function lc(e) {
  return sc.includes(e) ? e : Ma;
}
function Fa(e) {
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
function ir(e, t) {
  return e === "strict" && t.kind === "pending";
}
const cc = ["disabled", "ask", "automatic"], uc = ["buttons", "confirm"], Ua = "ask";
function dc(e) {
  return typeof e == "string" && cc.includes(e);
}
function mc(e) {
  return typeof e == "string" && uc.includes(e);
}
function fc(e) {
  return dc(e) ? e : mc(e) ? "ask" : Ua;
}
const pc = ["keep", "replace"], gc = ["manual", "assisted"], Ba = "keep", qa = "assisted", hc = !0, w = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function bc() {
  game.settings.register(u, w.executionMode, {
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
    default: Ua
  }), game.settings.register(u, w.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Ba
  }), game.settings.register(u, w.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: qa
  }), game.settings.register(u, w.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Ma
  }), game.settings.register(u, w.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: hc
  }), game.settings.register(u, w.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Hr() {
  const e = fc(game.settings.get(u, w.executionMode)), t = za(game.settings.get(u, w.systemCardMode)), n = ja(game.settings.get(u, w.damageResolutionMode)), r = Et();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Ga()
  };
}
function _c() {
  return za(game.settings.get(u, w.systemCardMode));
}
function yc() {
  return ja(game.settings.get(u, w.damageResolutionMode));
}
function Et() {
  return lc(game.settings.get(u, w.resistanceGateMode));
}
function Ga() {
  return game.settings.get(u, w.ritualCastingCheckEnabled) === !0;
}
async function te(e) {
  await game.settings.set(u, w.executionMode, e);
}
function za(e) {
  return pc.includes(e) ? e : Ba;
}
function ja(e) {
  return gc.includes(e) ? e : qa;
}
function Ac(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await te("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await te(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await te("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Tc = [
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
function $c(e) {
  return {
    phases() {
      return Tc;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Kt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Nl(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Wr(e, t, n);
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
      if (!kc(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = wc(n) ?? Kt("Nenhum ator encontrado para executar automação do item.");
      r && await Wr(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Kt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Pl(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(va);
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
async function Wr(e, t, n) {
  const r = kt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Oa(),
    item: n,
    targets: ar()
  });
  if (!o.ok) {
    Rc(o.error);
    return;
  }
  f.info("Automação executada com sucesso.", ie(o.value.context));
}
function Rc(e) {
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
function Kt(e) {
  const t = Ve.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function wc(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function kc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ec(e) {
  const t = zl(e), n = Ol(e), r = rc(e), o = $c(e), a = Hl(), s = Ac(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: o,
    output: a,
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
function Ic(e) {
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
      const r = Kr();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const o = await Promise.all(
        r.map(
          (a) => e.applyCondition({
            actor: a,
            conditionId: t,
            duration: n.duration,
            originUuid: n.originUuid,
            source: n.source ?? "api.applyToSelectedTokens",
            refreshExisting: n.refreshExisting
          })
        )
      );
      return Cc(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Kr();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const r = await Promise.all(
        n.map(
          (o) => e.removeCondition({
            actor: o,
            conditionId: t
          })
        )
      );
      return Sc(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Kr() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function Cc(e) {
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
function Sc(e) {
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
function Lc(e) {
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
    conditions: Ic(e.conditions),
    debug: Ec(e)
  }, n = globalThis;
  return n[u] = t, n.ParanormalToolkit = t, t;
}
class Yr {
  static isSupportedSystem() {
    return game.system.id === gl;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Dc() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: he(t.id),
    actorId: he(t.actor?.id),
    sceneId: he(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Va() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: he(e.id),
    actorId: he(t?.id),
    sceneId: he(e.scene?.id),
    name: n
  };
}
function vc(e, t = Va()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Pc(e) {
  if (!Oc(e)) return null;
  const t = e.getFlag(u, "workflow");
  return xc(t) ? t : null;
}
function Nc() {
  return `flags.${u}.workflow`;
}
function Qr(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), n = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || n !== void 0;
}
function Zr(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return bn(t) || bn(n);
}
function xc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Oc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function he(e) {
  return bn(e) ? e : null;
}
function bn(e) {
  return typeof e == "string" && e.length > 0;
}
function Mc() {
  const e = (t, n) => {
    Fc(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Fc(e, t) {
  const n = Pc(e);
  if (!n || n.targets.length === 0) return;
  const r = Bc(t);
  if (!r || r.querySelector(`.${u}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Uc(n));
}
function Uc(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Xr("Origem", e.source.name)), t.append(Xr("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Xr(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${u}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function Bc(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function qc() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Gc(r) || !zc(e) || Qr(e) || Qr(t)) return;
    const o = Dc();
    if (o.length === 0 || !Zr(e) && !Zr(t)) return;
    const a = Va();
    e.updateSource({
      [Nc()]: vc(o, a)
    }), f.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Gc(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function zc(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Jr = !1, Yt = !1, Qt = !1, tt = null;
const jc = 1e3, Vc = 750, Hc = 1e3;
function Wc(e) {
  Jr || (Hooks.on("combatTurnChange", (t) => {
    Yc(e, eo(t));
  }), Hooks.on("deleteCombat", (t) => {
    Qc(e, eo(t));
  }), Jr = !0, Kc(e));
}
function Kc(e) {
  It() && (Yt || (Yt = !0, globalThis.setTimeout(() => {
    Yt = !1, sr(e, "ready");
  }, jc)));
}
function Yc(e, t) {
  It() && t && (tt && globalThis.clearTimeout(tt), tt = globalThis.setTimeout(() => {
    tt = null, sr(e, "combat-turn-change", t);
  }, Vc));
}
function Qc(e, t) {
  It() && t && (Qt || (Qt = !0, globalThis.setTimeout(() => {
    Qt = !1, sr(e, "combat-deleted", t);
  }, Hc)));
}
async function sr(e, t, n) {
  if (It())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && f.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        f.warn(o.message);
    } catch (r) {
      f.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function It() {
  return game.user?.isGM === !0;
}
function eo(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Ha = {
  enabled: "dice.animations.enabled"
};
function Zc() {
  game.settings.register(u, Ha.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Xc() {
  return {
    enabled: game.settings.get(u, Ha.enabled) === !0
  };
}
const Ct = "chatCard", to = "data-paranormal-toolkit-prompt-id", i = `${u}-item-use-prompt`, Jc = `.${i}__title`, Wa = `.${i}__header`, eu = `.${i}__roll-card`, tu = `.${i}__roll-meta`, nu = `.${i}__roll-meta-pill`, St = `.${i}__resistance`, ru = `.${i}__resistance-header`, Ka = `.${i}__resistance-description`, Lt = `.${i}__resistance-roll-button`, Ya = `.${i}__resistance-roll-result`, no = `${i}__resistance-content`, Qa = `.${i}__workflow-section`, Za = `.${i}__workflow-roll`, lr = `${i}__workflow-roll--dice-open`, cr = `.${i}__workflow-roll-formula`, ur = `${i}__workflow-roll-formula--toggle`, Dt = `.${i}__workflow-dice-tray`, ou = `.${i}__roll-detail-toggle`, au = `.${i}__roll-detail-list`, iu = `.${i}__ritual-element-badge`, su = `.${i}__ritual-metadata`, lu = "casting-backlash", cu = "data-paranormal-toolkit-action-section", uu = "data-paranormal-toolkit-prompt-id", du = "data-paranormal-toolkit-pending-id", ro = "data-paranormal-toolkit-casting-backlash-enhanced", oo = `.${i}`, mu = `.${i}__workflow-section--casting`, fu = `.${i}__workflow-section-header`, pu = `.${i}__workflow-notes`, gu = `[${cu}="${lu}"]`, ao = `${i}__workflow-section-title-row`, hu = `${i}__workflow-section-header--casting-backlash`, Xa = `${i}__casting-backlash-button`;
function bu(e) {
  for (const t of _u(e))
    yu(t), wu(t);
}
function _u(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(oo) && t.add(e);
  for (const n of e.querySelectorAll(oo))
    t.add(n);
  return Array.from(t);
}
function yu(e) {
  const t = e.querySelector(gu);
  if (!t) return;
  const n = Au(t);
  if (!n) return;
  const r = e.querySelector(`${mu} ${fu}`);
  r && (r.classList.add(hu), Tu(r), $u(n), r.append(n), t.remove());
}
function Au(e) {
  return e.querySelector(
    `button[${du}], button[${uu}]`
  );
}
function Tu(e) {
  const t = e.querySelector(`:scope > .${ao}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(ao);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Xa) || n.append(o));
  return n;
}
function $u(e) {
  if (e.getAttribute(ro) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Ru(t, e.disabled);
  e.classList.add(Xa), e.setAttribute(ro, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Ru(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function wu(e) {
  for (const t of e.querySelectorAll(pu)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function ku(e) {
  for (const t of Array.from(e.querySelectorAll(Qa)))
    for (const n of Array.from(t.querySelectorAll(`${ou}, ${au}`)))
      n.remove();
}
const Oe = "data-paranormal-toolkit-prompt-id", Eu = "data-paranormal-toolkit-resistance-roll-result", Iu = "Conjuração DT";
function Ja(e) {
  const t = e.querySelector(Lt)?.getAttribute(Eu), n = qe(t);
  if (n !== null) return n;
  const r = e.querySelector(Ya)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return qe(o?.[1] ?? null);
}
function dr(e) {
  const t = Pu(e), n = Lu(t);
  if (n !== null) return n;
  const r = Du(t);
  return r !== null ? r : vu(e);
}
function Cu(e) {
  const t = e.getAttribute(Oe);
  if (!t) return null;
  const n = ei(e), r = ti(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => vt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function K(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Su(e) {
  return K(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Lu(e) {
  const t = xu(e);
  return t.length === 0 ? null : qe(Ou(t, Iu));
}
function Du(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : io(r, ["system", "ritual", "DT"]) ?? io(r, ["system", "ritual", "dt"]);
}
function vu(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return qe(n?.[1] ?? null);
}
function Pu(e) {
  const t = Nu(e);
  if (!t) return null;
  const n = ei(e), r = ti(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => vt(a) ? a.pendingId === t : !1) ?? null;
}
function Nu(e) {
  return (e.closest(`[${Oe}]`) ?? e.querySelector(`[${Oe}]`) ?? e.parentElement?.querySelector(`[${Oe}]`) ?? null)?.getAttribute(Oe) ?? null;
}
function ei(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Mu(o) ? o : null;
}
function ti(e) {
  const t = e?.getFlag?.(u, Ct);
  return vt(t) ? t : null;
}
function xu(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Ou(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function io(e, t) {
  let n = e;
  for (const r of t) {
    if (!vt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : qe(typeof n == "string" ? n : null);
}
function qe(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Mu(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function vt(e) {
  return !!(e && typeof e == "object");
}
const Fu = `.${i}__actions`, mr = `.${i}__actions-title`, pt = `.${i}__button`, Uu = "data-paranormal-toolkit-action-section", Bu = `${i}__button--executed`, qu = "data-paranormal-toolkit-executed-label";
function ni(e) {
  return K(e.querySelector(mr)?.textContent);
}
function Gu(e, t) {
  const n = e.querySelector(mr);
  n && (n.textContent = t);
}
function Pt(e, t) {
  const n = K(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return K(o) === n;
  }) ?? null;
}
function fr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ce(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const zu = {
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
}, ju = {
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
function ri(e) {
  return ii(e, zu, !1);
}
function oi(e) {
  return ii(e, ju, !0);
}
function We(e) {
  return e.kind === "waiting-resistance";
}
function ai(e) {
  return e.kind === "resisted";
}
function ii(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Pe("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Pe("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : ir(e.resistanceGateMode, e.resistanceState) ? Pe(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Pe("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : Pe("available", !0, r.available, r.availableCompact, null);
}
function Pe(e, t, n, r, o) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: o
  };
}
const Vu = "data-paranormal-toolkit-damage-resolution-state", so = "data-paranormal-toolkit-damage-icon-enhanced", si = "data-paranormal-toolkit-damage-original-label", Hu = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Wu(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Gu(t, "Aplicar dano"), Ku(e, t);
}
function Ku(e, t) {
  const n = Array.from(t.querySelectorAll(pt)), r = lo(n, "normal"), o = lo(n, "half");
  if (!r || !o) {
    t.classList.add(`${i}__actions--compact`);
    return;
  }
  co(r, "normal"), co(o, "half");
  const a = Xu(), s = Ju(), l = Yu(e), c = ri({
    resistanceGateMode: s,
    resistanceState: l
  }), d = We(c);
  if (t.classList.toggle(`${i}__actions--assisted`, a === "assisted"), t.classList.toggle(`${i}__actions--manual`, a !== "assisted"), a !== "assisted") {
    H(r, !0), H(o, !0), ne(r, !d, "normal", c.label), ne(o, !d, "half", c.label), nt(
      t,
      d ? "pending" : "manual",
      d ? c.reason ?? "Role resistência para aplicar dano." : null
    );
    return;
  }
  if (l.kind === "none") {
    H(r, !0), H(o, !0), ne(r, !0, "normal"), ne(o, !0, "half"), nt(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (l.kind === "pending") {
    H(r, !0), H(o, !1), ne(r, !d, "normal", c.label), nt(
      t,
      "pending",
      d ? c.reason ?? "Role resistência para aplicar dano." : null
    );
    return;
  }
  const m = l.kind === "succeeded";
  H(r, !m), H(o, m), ne(r, !m, "normal"), ne(o, m, "half"), nt(
    t,
    m ? "resisted" : "failed",
    m ? `Resistiu: ${l.total} vs DT ${l.difficulty}.` : `Falhou: ${l.total} vs DT ${l.difficulty}.`
  );
}
function Yu(e) {
  return Fa({
    hasResistance: !!e.querySelector(St),
    difficulty: dr(e),
    resistanceTotal: Ja(e)
  });
}
function lo(e, t) {
  const n = Hu[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function co(e, t) {
  if (e.getAttribute(so) === "true") return;
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
  ), e.setAttribute(so, "true"), e.setAttribute(si, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ce(n));
}
function H(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function ne(e, t, n, r = "Role resistência") {
  if (!e.textContent?.trim().startsWith("✓")) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ce(r));
      return;
    }
    e.removeAttribute("aria-disabled"), Qu(e, n);
  }
}
function Qu(e, t) {
  const n = e.getAttribute(si) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Zu(t), ce(n)));
}
function Zu(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function nt(e, t, n) {
  e.setAttribute(Vu, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${i}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(mr)?.after(o);
}
function Xu() {
  try {
    return yc();
  } catch {
    return "assisted";
  }
}
function Ju() {
  try {
    return Et();
  } catch {
    return "strict";
  }
}
const Ge = "data-paranormal-toolkit-effect-icon-enhanced", we = "data-paranormal-toolkit-effect-action-compacted", Nt = "data-paranormal-toolkit-effect-resistance-gate", pr = "data-paranormal-toolkit-effect-section", gr = "data-paranormal-toolkit-effect-label";
function ed(e) {
  return e.querySelector(`[${pr}="true"]`);
}
function td(e) {
  const t = rd(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? od(), r = fd(n, e.sourceActions, t);
  return r && n.setAttribute(gr, r), ad(n, t, r), dd(e.rollCard, n, e.after ?? e.fallbackAfter), md(e.sourceActions, n), n;
}
function nd(e, t) {
  const n = t.querySelector(pt);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (ci(n, r)) {
    gd(n);
    return;
  }
  const o = mi(t, n, r), a = hd(e), s = oi({
    resistanceGateMode: Ad(),
    resistanceState: a
  });
  if (We(s)) {
    bd(n, s.label);
    return;
  }
  if (ai(s)) {
    _d(n, s.compactLabel);
    return;
  }
  yd(n), di(n, o);
}
function rd(e) {
  return e.sourceActions?.querySelector(pt) ?? e.existingSection?.querySelector(pt) ?? null;
}
function od() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(pr, "true"), e;
}
function ad(e, t, n) {
  e.setAttribute(pr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = id(e), o = sd(r);
  o.textContent = "Efeito";
  const a = ld(e, r), s = cd(a);
  s.textContent = Td(n ?? mi(e, t, t.textContent?.trim() ?? ""));
  const l = ud(a);
  t.parentElement !== l && l.append(t);
  const c = t.textContent?.trim() ?? "";
  !ci(t, c) && !pd(t, c) && di(t, n ?? c);
}
function id(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function sd(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function ld(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function cd(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function ud(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function dd(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function md(e, t) {
  !e || e === t || e.remove();
}
function fd(e, t, n) {
  const r = e.getAttribute(gr);
  if (r && r.trim().length > 0) return r.trim();
  const o = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return o || li(n, n.textContent?.trim() ?? "");
}
function li(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && K(n) !== "efeito aplicado") return n;
  const r = Cu(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && K(o) !== "aplicado" ? o : null;
}
function ci(e, t) {
  return e.classList.contains(Bu) || K(t).includes("aplicado");
}
function pd(e, t) {
  const n = e.getAttribute(Nt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Su(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function di(e, t) {
  e.getAttribute(we) === "true" && e.getAttribute(Ge) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(we, "true"), e.setAttribute(Ge, "true"), e.setAttribute(qu, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    fr("✦", `${i}__button-icon--effect`),
    ce("Aplicar")
  ));
}
function gd(e) {
  e.getAttribute(we) === "true" && K(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(we, "true"), e.setAttribute(Ge, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    fr("✓", `${i}__button-icon--effect-applied`),
    ce("Aplicado")
  ));
}
function mi(e, t, n) {
  const r = e.getAttribute(gr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : li(t, n) ?? n;
}
function hd(e) {
  return Fa({
    hasResistance: !!e.querySelector(St),
    difficulty: dr(e),
    resistanceTotal: Ja(e)
  });
}
function bd(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(we), e.removeAttribute(Ge), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Nt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ce(t));
}
function _d(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(we), e.removeAttribute(Ge), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Nt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    fr("✓", `${i}__button-icon--effect-resisted`),
    ce(t)
  );
}
function yd(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Nt), e.removeAttribute("aria-disabled");
}
function Ad() {
  try {
    return Et();
  } catch {
    return "strict";
  }
}
function Td(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const $d = {
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
}, Rd = new Set(
  Object.values($d)
), wd = {
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
function kd(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Ed(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = wd[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Rd.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function fi(e) {
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
function Ed(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class pi {
  async applyDamage(t) {
    const n = t.actor, r = n.name ?? "Ator sem nome", o = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const a = n.applyDamage;
    if (typeof a != "function")
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let c = null;
    for (const [d, m] of t.instances.entries()) {
      const y = Id(m, d);
      if (!y.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const T = kd(m.damageType);
      if (!T.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (y.amount === 0) {
        s.push(
          Cd(y.id, m, T.value)
        );
        continue;
      }
      try {
        const $ = await Promise.resolve(
          a.call(n, y.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const j of Ld($.conditions))
          l.add(j);
        const g = Sd($.newPV);
        g !== null && (c = g), s.push({
          id: y.id,
          label: m.label ?? fi(T.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: uo($.finalDamage, y.amount),
          blocked: uo($.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch ($) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: m,
          cause: $
        });
      }
    }
    return b({
      actor: n,
      actorId: o,
      actorName: r,
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
      newPV: c,
      conditions: Array.from(l),
      instances: s,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function Id(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Cd(e, t, n) {
  return {
    id: e,
    label: t.label ?? fi(n),
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
function uo(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Sd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ld(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class hr {
  async rollResistance(t) {
    const n = await vd(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? se(t.skill),
      roll: n,
      formula: Nd(n),
      total: xd(n),
      diceBreakdown: Od(n)
    };
  }
  getSkillLabel(t) {
    return se(t);
  }
}
async function Dd(e, t) {
  return new hr().rollResistance({ actor: e, skill: t });
}
function se(e) {
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
async function vd(e, t) {
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
  return Pd(r);
}
function Pd(e) {
  return mo(e) ? e : Array.isArray(e) ? e.find(mo) ?? null : null;
}
function mo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Nd(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function xd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Od(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Md);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Md(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class gi {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class hi {
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
function Fd(e, t) {
  const n = Vd(e?.rounds);
  if (!n)
    return fo(null);
  const r = e?.anchor ?? bi(t);
  if (!r)
    return {
      ...fo(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Ud(),
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
    expiryEvent: o,
    durationMode: "combatantTurn",
    warning: null
  };
}
function bi(e) {
  const t = Hd();
  if (!t?.id || !_i(t.round)) return null;
  const n = zd(t), r = Bd(e, n) ?? Gd(t), o = W(r?.id), a = Kd(r?.initiative), s = qd(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: a,
    time: Wd()
  };
}
function Ud() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function fo(e) {
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
function Bd(e, t) {
  return e?.id ? t.find((n) => jd(n) === e.id) ?? null : null;
}
function qd(e, t, n) {
  const r = W(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return Yd(e.turn) ? e.turn : null;
}
function Gd(e) {
  return st(e.combatant) ? e.combatant : null;
}
function zd(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(st);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(st);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(st);
  }
  return [];
}
function jd(e) {
  return W(e.actor?.id) ?? W(e.actorId) ?? W(e.token?.actor?.id) ?? W(e.token?.actorId) ?? W(e.document?.actor?.id) ?? W(e.document?.actorId);
}
function Vd(e) {
  return _i(e) ? Math.trunc(e) : null;
}
function Hd() {
  return game.combat ?? null;
}
function Wd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function st(e) {
  return !!(e && typeof e == "object");
}
function W(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Kd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function _i(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Yd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class yi {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? b(n.value) : p({
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
    if (!am(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = Fd(t.duration, r), s = Qd(o, t, a), c = t.refreshExisting ?? !0 ? im(r, o.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), b(po(r, o, c.id ?? null, !1, !0, a));
      } catch (d) {
        return p({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
          cause: d
        });
      }
    try {
      const m = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return b(po(r, o, m, !0, !1, a));
    } catch (d) {
      return p({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Ti(n, r);
    let a = 0;
    try {
      for (const s of o)
        await go(n, s) === "deleted" && (a += 1);
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
    return b({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: r,
      removed: a
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = cm(), r = [];
    let o = 0, a = 0;
    for (const s of n) {
      const l = br(s);
      o += l.length;
      for (const c of l) {
        if (!Jd(c, t)) continue;
        const d = Ai(c);
        try {
          await go(s, c) === "deleted" && (a += 1);
        } catch (m) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: c.id ?? null,
            conditionId: d.conditionId,
            message: `Falha ao remover condição expirada ${d.conditionId ?? c.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: m
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: o,
      removedEffects: a,
      failures: r
    };
  }
}
function Qd(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: ym(),
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
    changes: e.changes.map((o) => ({ ...o })),
    duration: Zd(n.duration),
    start: Xd(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [u]: r
    }
  };
}
function Zd(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Xd(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: _m(),
    ...e
  };
}
function po(e, t, n, r, o, a) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: r,
    refreshed: o,
    requestedRounds: a.requestedRounds,
    combatDurationApplied: a.combatDurationApplied,
    warning: a.warning
  };
}
function Jd(e, t) {
  const n = Ai(e);
  if (!n.conditionId || !em(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = bm();
  return n.durationMode === "combatantTurn" || tm(n) ? rm(n, r) : nm(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function em(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function tm(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || gt(e.startTurn)));
}
function nm(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function rm(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = om(t);
  return e.startCombatantId ? r === e.startCombatantId : gt(e.startTurn) && gt(t.turn) ? t.turn === e.startTurn : !1;
}
function om(e) {
  return be(e.combatant?.id);
}
function Ai(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: lt(e, "conditionId"),
    requestedRounds: ho(e, "requestedRounds") ?? Me(t.value) ?? Me(t.rounds),
    combatDurationApplied: Zt(e, "combatDurationApplied"),
    combatId: lt(e, "combatId") ?? be(n.combat) ?? be(t.combat),
    startCombatantId: lt(e, "startCombatantId") ?? be(n.combatant),
    startInitiative: fm(e, "startInitiative") ?? $i(n.initiative),
    startRound: ho(e, "startRound") ?? Me(n.round) ?? Me(t.startRound),
    startTurn: mm(e, "startTurn") ?? _n(n.turn) ?? _n(t.startTurn),
    expiryEvent: pm(e, "expiryEvent") ?? Ri(t.expiry),
    durationMode: gm(e, "durationMode"),
    deleteOnExpire: Zt(e, "deleteOnExpire"),
    expiresWithCombat: Zt(e, "expiresWithCombat")
  };
}
function am(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function im(e, t) {
  return Ti(e, t)[0] ?? null;
}
function Ti(e, t) {
  return br(e).filter((n) => dm(n) === t);
}
async function go(e, t) {
  const n = t.id ?? null, r = n ? sm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (lm(o)) return "missing";
    throw o;
  }
}
function sm(e, t) {
  return br(e).find((n) => n.id === t) ?? null;
}
function lm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function cm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      rt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    rt(e, n);
  });
  for (const n of um())
    rt(e, n.actor), rt(e, n.document?.actor);
  return Array.from(e.values());
}
function rt(e, t) {
  if (!hm(t)) return;
  const r = be(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function um() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function br(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function dm(e) {
  return lt(e, "conditionId");
}
function lt(e, t) {
  return be(ue(e, t));
}
function ho(e, t) {
  return Me(ue(e, t));
}
function mm(e, t) {
  return _n(ue(e, t));
}
function fm(e, t) {
  return $i(ue(e, t));
}
function pm(e, t) {
  return Ri(ue(e, t));
}
function gm(e, t) {
  const n = ue(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Zt(e, t) {
  return ue(e, t) === !0;
}
function ue(e, t) {
  const n = e.getFlag?.(u, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[u];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function be(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Me(e) {
  return D(e) ? Math.trunc(e) : null;
}
function _n(e) {
  return gt(e) ? Math.trunc(e) : null;
}
function $i(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ri(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function hm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function bm() {
  return game.combat ?? null;
}
function _m() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function gt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function ym() {
  return game.user?.id ?? null;
}
const Am = "icons/svg/downgrade.svg", Tm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Am,
    description: Tm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const $m = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Rm = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), wm = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), km = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Em = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Im = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Cm = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Sm = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Lm = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Dm = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), vm = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Pm = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Nm = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), xm = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Om = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Mm = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Fm = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Um = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Bm = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), qm = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Gm = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), zm = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), jm = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Vm = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Hm = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Wm = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Km = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Ym = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Qm = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Zm = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Xm = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Jm = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), ef = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), tf = _({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), nf = [
  $m,
  Rm,
  wm,
  km,
  Em,
  Im,
  Cm,
  Sm,
  Lm,
  Dm,
  vm,
  Pm,
  Nm,
  xm,
  Om,
  Mm,
  Fm,
  Um,
  Bm,
  qm,
  Gm,
  zm,
  jm,
  Vm,
  Hm,
  Wm,
  Km,
  Ym,
  Qm,
  Zm,
  Xm,
  Jm,
  ef,
  tf
];
class rf {
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
    return Array.from(this.definitions.values()).map(bo);
  }
  get(t) {
    const n = this.lookup.get(_o(t)), r = n ? this.definitions.get(n) : null;
    return r ? b(bo(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = _o(t);
    r && this.lookup.set(r, n);
  }
}
function wi() {
  return new rf(nf);
}
function bo(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function _o(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
class of {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return ir(t.resistanceGateMode, t.resistanceState) ? {
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
class af {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return ir(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.resistanceState.kind === "succeeded" ? this.block(t, "resistance-succeeded", "Este alvo resistiu ao efeito.") : this.conditions.applyCondition({
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
class sf {
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
function lf(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const o = uf(e.formula, e.diceBreakdown ?? null);
  return o && t.append(o), t;
}
function cf(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function uf(e, t) {
  const n = df(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const o of mf(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), o.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function df(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function mf(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? yo(e, "highest") : n.includes("kl") ? yo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function yo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
const ot = "data-paranormal-toolkit-prompt-id", ki = "multiTargetResistanceResults", Ei = "multiTargetDamageApplications", Ii = "multiTargetEffectApplications";
function ff(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[ki];
  if (!P(r)) return t;
  for (const [o, a] of Object.entries(r))
    Af(a) && a.targetId === o && t.set(o, a);
  return t;
}
async function pf(e, t) {
  await _r(e, ki, t.targetId, t);
}
function gf(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Ei];
  if (!P(r)) return t;
  for (const [o, a] of Object.entries(r))
    Tf(a) && a.targetId === o && t.set(o, a);
  return t;
}
async function hf(e, t) {
  await _r(
    e,
    Ei,
    t.targetId,
    t
  );
}
function bf(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Ii];
  if (!P(r)) return t;
  for (const [o, a] of Object.entries(r))
    Rf(a) && a.targetId === o && t.set(o, a);
  return t;
}
async function _f(e, t) {
  await _r(
    e,
    Ii,
    t.targetId,
    t
  );
}
function yf(e) {
  const t = xt(e);
  return t ? {
    actorId: Xt(t.actorId),
    itemId: Xt(t.itemId),
    itemName: Xt(t.itemName)
  } : null;
}
async function _r(e, t, n, r) {
  const o = Ci(e);
  if (!o) return;
  const a = Si(e), s = Li(a);
  if (!a || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((d) => {
    if (!P(d) || d.pendingId !== o) return d;
    const m = P(d[t]) ? d[t] : {};
    return l = !0, {
      ...d,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(a.setFlag?.(u, Ct, {
    ...s,
    prompts: c
  }));
}
function xt(e) {
  const t = Ci(e);
  if (!t) return null;
  const n = Si(e), r = Li(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => P(a) ? a.pendingId === t : !1) ?? null;
}
function Ci(e) {
  return (e.closest(`[${ot}]`) ?? e.querySelector(`[${ot}]`) ?? e.parentElement?.querySelector(`[${ot}]`) ?? null)?.getAttribute(ot) ?? null;
}
function Si(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return wf(o) ? o : null;
}
function Li(e) {
  const t = e?.getFlag?.(u, Ct);
  return P(t) ? t : null;
}
function Af(e) {
  return P(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Tf(e) {
  return P(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && $f(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.finalDamage == "number" && Number.isFinite(e.finalDamage) && typeof e.blocked == "number" && Number.isFinite(e.blocked) && typeof e.appliedAt == "string" : !1;
}
function $f(e) {
  return e === "normal" || e === "half";
}
function Rf(e) {
  return P(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Xt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function wf(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function P(e) {
  return !!(e && typeof e == "object");
}
const Di = "data-paranormal-toolkit-resistance-skill", vi = "data-paranormal-toolkit-resistance-skill-label", yn = "data-paranormal-toolkit-multi-target-section", yr = "data-paranormal-toolkit-multi-target-damage-info", Pi = "data-paranormal-toolkit-multi-target-effect-info", Ni = "data-paranormal-toolkit-multi-target-toggle", xi = "data-paranormal-toolkit-multi-target-details", L = "data-paranormal-toolkit-multi-target-target", kf = "data-paranormal-toolkit-multi-target-state", An = "data-paranormal-toolkit-multi-target-roll-total", Tn = "data-paranormal-toolkit-multi-target-roll-formula", ct = "data-paranormal-toolkit-multi-target-roll-dice", $n = "data-paranormal-toolkit-multi-target-roll-skill", Rn = "data-paranormal-toolkit-multi-target-roll-skill-label", wn = "data-paranormal-toolkit-multi-target-roll-target-name", kn = "data-paranormal-toolkit-multi-target-roll-rolled-at", En = "data-paranormal-toolkit-multi-target-damage-mode", In = "data-paranormal-toolkit-multi-target-damage-input-amount", Cn = "data-paranormal-toolkit-multi-target-damage-final-amount", Sn = "data-paranormal-toolkit-multi-target-damage-blocked", Ln = "data-paranormal-toolkit-multi-target-damage-target-name", Dn = "data-paranormal-toolkit-multi-target-damage-applied-at", vn = "data-paranormal-toolkit-multi-target-effect-condition-id", Pn = "data-paranormal-toolkit-multi-target-effect-condition-label", Nn = "data-paranormal-toolkit-multi-target-effect-effect-id", xn = "data-paranormal-toolkit-multi-target-effect-created", On = "data-paranormal-toolkit-multi-target-effect-refreshed", Mn = "data-paranormal-toolkit-multi-target-effect-target-name", Fn = "data-paranormal-toolkit-multi-target-effect-applied-at", Ef = new yi(wi()), If = new gi(new pi()), Cf = new hi(new hr()), Sf = new sf(Cf), Lf = new of(If), Df = new af(Ef), Oi = "pending", Q = "success", Ke = "failure", Mi = "rolled";
function vf(e) {
  const t = Fi(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Jf(e);
  const n = ep(e.rollCard);
  np(n, t.damage), op(e.rollCard, n);
  const r = ap(e.rollCard);
  if (Bi(r, t), Cp(e.rollCard, r, n), t.effect) {
    const o = Sp(e.rollCard);
    Lp(o, t.effect), Dp(e.rollCard, o, r);
  } else
    Zi(e.rollCard)?.remove();
  return !0;
}
function Fi(e) {
  const t = Gf(e.rollCard, e.damageSection), n = zf(e.rollCard), r = jf(e.rollCard), o = Vf(e.rollCard), a = Pf(e.rollCard).map((s, l) => {
    const c = Op(s, l), d = n.get(c) ?? null;
    return {
      id: c,
      name: s,
      state: Yf(d, t?.difficulty ?? null),
      resistanceResult: d,
      damageApplication: r.get(c) ?? null,
      effectApplication: o.get(c) ?? null
    };
  });
  return a.length <= 1 || !e.damageSection ? null : {
    rollCard: e.rollCard,
    targets: a,
    damage: Nf(e.damageSection),
    effect: xf(e.rollCard, e.effectSection),
    resistance: t
  };
}
function Pf(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && Ji(o) !== "nenhum alvo") : [];
}
function Nf(e) {
  const t = Qf(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Xf(e),
    formula: Zf(e) ?? "—",
    total: t,
    diceBreakdown: cf(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function xf(e, t) {
  const n = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), r = Of(e, n ?? null);
  return r ? {
    label: n && n.length > 0 ? n : r.conditionLabel,
    conditionId: r.conditionId,
    conditionLabel: r.conditionLabel,
    duration: Ff(r.duration),
    source: r.source,
    originUuid: r.originUuid
  } : null;
}
function Of(e, t) {
  const n = yf(e), r = Uf(n);
  if (!r) return null;
  const o = kt(r);
  if (!o.ok) return null;
  const a = (o.value.conditionApplications ?? []).filter((l) => l.actor === "target");
  if (a.length === 0) return null;
  const s = Mf(a, t);
  return s ? {
    conditionId: s.conditionId,
    conditionLabel: s.label ?? s.conditionId,
    duration: s.duration ?? null,
    source: s.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null
  } : null;
}
function Mf(e, t) {
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const n = U(t);
  return n ? e.find((r) => [
    r.label,
    r.conditionId
  ].some((o) => U(o) === n)) ?? null : null;
}
function Ff(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function Uf(e) {
  if (!e) return null;
  const t = e.actorId ? Np(e.actorId) : null, n = t ? Bf(t, e.itemId, e.itemName) : null;
  return n || qf(e.itemId, e.itemName);
}
function Bf(e, t, n) {
  const r = e.items;
  if (t) {
    const a = r?.get?.(t);
    if (ye(a)) return a;
  }
  const o = U(n);
  if (o) {
    const a = r?.find?.((s) => ye(s) ? U(s.name) === o : !1);
    if (ye(a)) return a;
  }
  return null;
}
function qf(e, t) {
  const n = game.items;
  if (e) {
    const o = n?.get?.(e);
    if (ye(o)) return o;
  }
  const r = U(t);
  if (r) {
    const o = n?.find?.((a) => ye(a) ? U(a.name) === r : !1);
    if (ye(o)) return o;
  }
  return null;
}
function Gf(e, t) {
  const n = t?.querySelector(`.${i}__resistance-description`)?.textContent?.trim(), r = t?.querySelector(Lt) ?? null, o = r?.getAttribute(Di) ?? null, a = r?.getAttribute(vi) ?? (o ? se(o) : null);
  return !n && !o ? null : {
    description: n ?? "Resistência do alvo.",
    formula: t?.querySelector(`.${i}__resistance .${i}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: a,
    difficulty: dr(e)
  };
}
function zf(e) {
  const t = ff(e);
  for (const [n, r] of Kf(e))
    t.set(n, r);
  return t;
}
function jf(e) {
  const t = gf(e);
  for (const [n, r] of Wf(e))
    t.set(n, r);
  return t;
}
function Vf(e) {
  const t = bf(e);
  for (const [n, r] of Hf(e))
    t.set(n, r);
  return t;
}
function Hf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(vn), a = n.getAttribute(Pn), s = n.getAttribute(Nn), l = $o(n.getAttribute(xn)), c = $o(n.getAttribute(On)), d = n.getAttribute(Mn), m = n.getAttribute(Fn);
    !r || !o || !a || l === null || c === null || !d || !m || t.set(r, {
      targetId: r,
      targetName: d,
      conditionId: o,
      conditionLabel: a,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: c,
      appliedAt: m
    });
  }
  return t;
}
function Wf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(En), a = ut(n.getAttribute(In)), s = ut(n.getAttribute(Cn)), l = ut(n.getAttribute(Sn)), c = n.getAttribute(Ln), d = n.getAttribute(Dn);
    !r || !Fp(o) || a === null || s === null || l === null || !c || !d || t.set(r, {
      targetId: r,
      targetName: c,
      mode: o,
      inputAmount: a,
      finalDamage: s,
      blocked: l,
      appliedAt: d
    });
  }
  return t;
}
function Kf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = ut(n.getAttribute(An)), a = n.getAttribute(Tn), s = n.getAttribute($n), l = n.getAttribute(Rn), c = n.getAttribute(wn), d = n.getAttribute(kn);
    !r || o === null || !a || !s || !l || !c || !d || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: a,
      total: o,
      diceBreakdown: n.getAttribute(ct),
      rolledAt: d
    });
  }
  return t;
}
function Yf(e, t) {
  return e ? t === null ? Mi : e.total >= t ? Q : Ke : Oi;
}
function Qf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Zf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Xf(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Jf(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function ep(e) {
  const t = tp(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(yr, "true"), n;
}
function tp(e) {
  return e.querySelector(`[${yr}="true"]`);
}
function np(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-section-description`), o.textContent = t.typeLabel, e.append(o);
  }
  e.append(Ui(t.formula, t.total, t.diceBreakdown));
}
function Ui(e, t, n, r = !1) {
  const o = lf({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return rp(o, r), o;
}
function rp(e, t) {
  const n = e.querySelector(Dt), r = e.querySelector(cr);
  if (!n || !r) return;
  e.classList.toggle(lr, t), n.hidden = !t, r.classList.add(ur), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const o = r.querySelector("i") ?? document.createElement("i");
  o.classList.add("fa-solid"), o.classList.toggle("fa-chevron-down", !t), o.classList.toggle("fa-chevron-up", t), o.setAttribute("aria-hidden", "true"), o.parentElement || r.append(o);
}
function op(e, t) {
  const n = Pt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ap(e) {
  const t = e.querySelector(`[${yn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(yn, "true"), n;
}
function Bi(e, t) {
  const n = ip(e);
  e.replaceChildren(sp(t), cp(t, n));
}
function ip(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${L}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(L)).filter(Mp)
  );
}
function sp(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = lp(e.targets), t.append(n, r), t;
}
function lp(e) {
  const t = e.length, n = e.filter((l) => l.state === Ke).length, r = e.filter((l) => l.state === Q).length, o = e.filter((l) => l.state === Oi).length, a = e.filter((l) => l.state === Mi).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), o > 0 && s.push(`${o} ${o === 1 ? "pendente" : "pendentes"}`), a > 0 && s.push(`${a} ${a === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function cp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(up(r, e, t.has(r.id)));
  return n;
}
function up(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(L, e.id), r.setAttribute(kf, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), qi(r, e.resistanceResult), Gi(r, e.damageApplication), zi(r, e.effectApplication);
  const o = dp(e, t, r), a = wp(e, t);
  return a.hidden = !n, r.addEventListener("click", (s) => {
    To(s.target) || Ao(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || To(s.target) || (s.preventDefault(), Ao(r));
  }), r.append(o, a), r;
}
function qi(e, t) {
  if (!t) {
    e.removeAttribute(An), e.removeAttribute(Tn), e.removeAttribute(ct), e.removeAttribute($n), e.removeAttribute(Rn), e.removeAttribute(wn), e.removeAttribute(kn);
    return;
  }
  e.setAttribute(An, String(t.total)), e.setAttribute(Tn, t.formula), e.setAttribute($n, t.skill), e.setAttribute(Rn, t.skillLabel), e.setAttribute(wn, t.targetName), e.setAttribute(kn, t.rolledAt), t.diceBreakdown ? e.setAttribute(ct, t.diceBreakdown) : e.removeAttribute(ct);
}
function Gi(e, t) {
  if (!t) {
    e.removeAttribute(En), e.removeAttribute(In), e.removeAttribute(Cn), e.removeAttribute(Sn), e.removeAttribute(Ln), e.removeAttribute(Dn);
    return;
  }
  e.setAttribute(En, t.mode), e.setAttribute(In, String(t.inputAmount)), e.setAttribute(Cn, String(t.finalDamage)), e.setAttribute(Sn, String(t.blocked)), e.setAttribute(Ln, t.targetName), e.setAttribute(Dn, t.appliedAt);
}
function zi(e, t) {
  if (!t) {
    e.removeAttribute(vn), e.removeAttribute(Pn), e.removeAttribute(Nn), e.removeAttribute(xn), e.removeAttribute(On), e.removeAttribute(Mn), e.removeAttribute(Fn);
    return;
  }
  e.setAttribute(vn, t.conditionId), e.setAttribute(Pn, t.conditionLabel), e.setAttribute(Nn, t.effectId ?? ""), e.setAttribute(xn, String(t.created)), e.setAttribute(On, String(t.refreshed)), e.setAttribute(Mn, t.targetName), e.setAttribute(Fn, t.appliedAt);
}
function dp(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${i}__target-summary-main`);
  const a = mp(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = fp(e, t.resistance);
  gp(l, n, e, t);
  const c = Rp(n);
  o.append(a, s, l, c);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), d.append(
    Hi(e, t, "compact"),
    Yi(e, t, "compact")
  ), r.append(o, d), r;
}
function mp(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function fp(e, t) {
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", pp(e, t)), t?.skill && (n.setAttribute(Di, t.skill), n.setAttribute(vi, t.skillLabel ?? se(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${i}__target-resistance-fallback`), s.textContent = "d20", n.append(a, s), n;
  }
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const o = document.createElement("span");
  return o.classList.add(`${i}__target-resistance-mark`), o.setAttribute("aria-hidden", "true"), o.textContent = e.state === Q ? "✓" : e.state === Ke ? "✕" : "", n.append(r, o), n;
}
function pp(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Q ? "sucesso" : e.state === Ke ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function gp(e, t, n, r) {
  e.addEventListener("click", (o) => {
    o.stopPropagation(), hp(t, e, n, r);
  });
}
async function hp(e, t, n, r) {
  const o = r.resistance, a = o?.skill, s = o?.skillLabel ?? (a ? se(a) : "Resistência");
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Tr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Sf.execute({ actor: l, skill: a, skillLabel: s });
    await xp(d.roll);
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: a,
      skillLabel: s,
      formula: d.formula,
      total: d.total,
      diceBreakdown: d.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    qi(e, m);
    try {
      await pf(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    Ar(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Ar(e) {
  const t = e.closest(`[${yn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Fi({
    rollCard: n,
    damageSection: bp(n) ?? Pt(n, "Dano"),
    effectSection: _p(n)
  });
  r && Bi(t, r);
}
function bp(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(yr) !== "true") ?? null;
}
function _p(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function ji(e, t) {
  return We(Vi(e, t));
}
function Vi(e, t) {
  return ri({
    resistanceGateMode: Mt(),
    resistanceState: Ot(e, t),
    alreadyApplied: !!e.damageApplication,
    unavailable: !t.damage
  });
}
function yp(e, t) {
  return oi({
    resistanceGateMode: Mt(),
    resistanceState: Ot(e, t),
    alreadyApplied: !!e.effectApplication,
    unavailable: !t.effect
  });
}
function Ot(e, t) {
  if (!t.resistance) return { kind: "none" };
  const n = t.resistance.difficulty ?? 0, r = e.resistanceResult?.total ?? 0;
  return e.state === Q ? { kind: "succeeded", difficulty: n, total: r } : e.state === Ke ? { kind: "failed", difficulty: n, total: r } : { kind: "pending", difficulty: n };
}
function Mt() {
  try {
    return Et();
  } catch {
    return "strict";
  }
}
function Hi(e, t, n) {
  if (e.damageApplication)
    return O(
      "✓",
      Ap(e.damageApplication, n),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = Vi(e, t);
  if (We(r))
    return O(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const o = Wi(e), a = Ki(o, t.damage);
  if (a === null)
    return O(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = o === "half" ? n === "full" ? t.damage.halfLabel ?? `Metade: ${a} PV` : t.damage.halfCompactLabel ?? `½ ${a} PV` : n === "full" ? t.damage.normalLabel : t.damage.normalCompactLabel, l = o === "half" ? "🛡️" : "⚡", c = o === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, d = O(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return d.title = `Aplicar ${s} em ${e.name}`, d.setAttribute("aria-label", d.title), d.addEventListener("click", (m) => {
    m.stopPropagation();
    const y = d.closest(`[${L}]`);
    y && Tp(y, d, e, t);
  }), d;
}
function Ap(e, t) {
  const n = e.blocked > 0 ? ` (RD ${e.blocked})` : "";
  return t === "compact" ? `${e.finalDamage} PV` : `Dano aplicado: ${e.finalDamage} PV${n}`;
}
function Wi(e) {
  return e.state === Q ? "half" : "normal";
}
function Ki(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Tp(e, t, n, r) {
  if (n.damageApplication) return;
  if (ji(n, r)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const o = Wi(n), a = Ki(o, r.damage);
  if (a === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const s = Tr(n.name);
  if (!s) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const l = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const c = await Lf.execute({
      actor: s,
      amount: a,
      damageType: r.damage.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Mt(),
      resistanceState: Ot(n, r)
    });
    if (!c.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${c.error.message}`), t.innerHTML = l;
      return;
    }
    const d = {
      targetId: n.id,
      targetName: s.name ?? n.name,
      mode: o,
      inputAmount: a,
      finalDamage: c.value.totalFinalDamage,
      blocked: c.value.totalBlocked,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Gi(e, d);
    try {
      await hf(r.rollCard, d);
    } catch (m) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", m);
    }
    ui.notifications?.info?.(`Paranormal Toolkit: ${d.finalDamage} PV aplicado em ${d.targetName}.`), Ar(e);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", c), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function Yi(e, t, n) {
  const r = yp(e, t);
  if (!t.effect)
    return O(
      "✦",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (e.effectApplication)
    return O(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (We(r))
    return O(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (ai(r))
    return O(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  const o = O(
    "✦",
    n === "full" ? `Aplicar ${t.effect.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${t.effect.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (a) => {
    a.stopPropagation();
    const s = o.closest(`[${L}]`);
    s && $p(s, o, e, t);
  }), o;
}
async function $p(e, t, n, r) {
  if (n.effectApplication) return;
  if (ji(n, r)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }
  if (n.state === Q) {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }
  const o = r.effect;
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui efeito estruturado para aplicar.");
    return;
  }
  const a = Tr(n.name);
  if (!a) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await Df.execute({
      actor: a,
      conditionId: o.conditionId,
      duration: o.duration,
      originUuid: o.originUuid,
      source: o.source,
      resistanceGateMode: Mt(),
      resistanceState: Ot(n, r)
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
    zi(e, c);
    try {
      await _f(r.rollCard, c);
    } catch (d) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", d);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), ui.notifications?.info?.(`Paranormal Toolkit: ${c.conditionLabel} aplicado em ${c.targetName}.`), Ar(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function O(e, t, n, r) {
  const o = document.createElement("button");
  o.type = "button", o.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), o.disabled = r;
  const a = document.createElement("span");
  a.classList.add(`${i}__target-action-icon`), a.setAttribute("aria-hidden", "true"), a.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, o.append(a, s), o;
}
function Rp(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Ni, "true"), t.setAttribute("aria-hidden", "true"), Qi(e, t), t;
}
function Ao(e) {
  const t = e.querySelector(`[${xi}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Ni}="true"]`);
  r && Qi(e, r);
}
function Qi(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function To(e) {
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
function wp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(xi, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const a = document.createElement("span");
  a.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(o, a);
  const s = kp(e, t.resistance);
  s && r.append(s);
  const l = Ep(e, t.resistance), c = Ip(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function kp(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Q ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Ep(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", o = e.resistanceResult?.total ?? null, a = Ui(
    r,
    o,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(a), n;
}
function Ip(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), n.append(
    Hi(e, t, "full"),
    Yi(e, t, "full")
  ), n;
}
function Cp(e, t, n) {
  const r = n.parentElement === e ? n : Pt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Sp(e) {
  const t = Zi(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Pi, "true"), n;
}
function Zi(e) {
  return e.querySelector(`[${Pi}="true"]`);
}
function Lp(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  r.textContent = "Efeito", n.append(r);
  const o = document.createElement("div");
  o.classList.add(`${i}__effect-info-body`);
  const a = document.createElement("span");
  a.classList.add(`${i}__effect-info-label`), a.textContent = t.label;
  const s = document.createElement("span");
  s.classList.add(`${i}__effect-info-hint`), s.textContent = "Aplicação por alvo", o.append(a, s), e.append(n, o);
}
function Dp(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Tr(e) {
  const t = U(e);
  if (!t) return null;
  const n = vp().filter((a) => U(Pp(a)) === t).map((a) => Xi(a)).find(_e) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => _e(a) && U(a.name) === t);
  return _e(o) ? o : null;
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
  return typeof n == "string" ? n : Xi(e)?.name ?? null;
}
function Xi(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (_e(t)) return t;
  const n = e.document?.actor;
  return _e(n) ? n : null;
}
function _e(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Np(e) {
  const n = game.actors?.get?.(e);
  return _e(n) ? n : null;
}
function ye(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function U(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function xp(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Op(e, t) {
  return `${t}-${Ji(e).replace(/[^a-z0-9]+/gu, "-")}`;
}
function Ji(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Mp(e) {
  return typeof e == "string" && e.length > 0;
}
function Fp(e) {
  return e === "normal" || e === "half";
}
function $o(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function ut(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Ae = "data-paranormal-toolkit-prompt-id", Up = "data-paranormal-toolkit-card-layout-normalized", Ro = "data-paranormal-toolkit-card-layout-refresh-bound", Bp = "apply-damage", qp = "data-paranormal-toolkit-multi-target-damage-info", es = [0, 80, 180, 400, 900, 1600, 3e3], wo = /* @__PURE__ */ new WeakSet();
function Gp(e) {
  ts(e), zp(e);
}
function ts(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    rs(ns(t));
}
function zp(e) {
  if (!wo.has(e)) {
    wo.add(e);
    for (const t of es)
      globalThis.setTimeout(() => {
        ts(e);
      }, t);
  }
}
function ns(e) {
  return {
    rollCard: e,
    damageSection: jp(e),
    resistance: e.querySelector(St),
    damageActions: Vp(e),
    effectActionSource: Hp(e),
    effectSection: ed(e)
  };
}
function rs(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: a,
    effectSection: s
  } = e;
  t.setAttribute(Up, "true"), t.classList.add(`${i}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), Wu(t, o));
  const l = td({
    rollCard: t,
    existingSection: s,
    sourceActions: a,
    after: n,
    fallbackAfter: Pt(t, "Conjuração")
  });
  l && nd(t, l), vf({
    rollCard: t,
    damageSection: n,
    effectSection: l ?? s
  }), Jp(t);
}
function jp(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(qp) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function Vp(e) {
  const t = Wp(e);
  return t.find((n) => n.getAttribute(Uu) === Bp) ?? t.find((n) => ni(n) === "aplicar danos") ?? null;
}
function Hp(e) {
  const t = os(e), n = ko(t);
  return n || ko(Kp(e));
}
function ko(e) {
  return e.find((t) => {
    const n = ni(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function Wp(e) {
  const t = os(e);
  return t.length > 0 ? t : $r(e);
}
function os(e) {
  const t = Zp(e);
  return t ? $r(e).filter((n) => Qp(n, t)) : [];
}
function Kp(e) {
  const t = as(e);
  if (!t) return [];
  const n = Yp(e, t);
  return $r(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => is(e, r)).filter((r) => !n || Xp(r, n));
}
function $r(e) {
  const t = as(e);
  return t ? Array.from(t.querySelectorAll(Fu)) : [];
}
function as(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function Yp(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && is(e, n)) ?? null;
}
function Qp(e, t) {
  return e.getAttribute(Ae) === t ? !0 : Array.from(e.querySelectorAll(`[${Ae}]`)).some((n) => n.getAttribute(Ae) === t);
}
function Zp(e) {
  return e.getAttribute(Ae) ?? e.querySelector(`[${Ae}]`)?.getAttribute(Ae) ?? null;
}
function is(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Xp(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Jp(e) {
  const t = e.querySelector(Lt);
  t && t.getAttribute(Ro) !== "true" && (t.setAttribute(Ro, "true"), t.addEventListener("click", () => {
    for (const n of es)
      globalThis.setTimeout(() => {
        rs(ns(e));
      }, n);
  }));
}
const eg = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function tg(e) {
  for (const t of Array.from(e.querySelectorAll(St)))
    ng(t);
  Gp(e);
}
function ng(e) {
  const t = e.querySelector(ru), n = e.querySelector(Ka), r = e.querySelector(Lt), o = e.querySelector(Ya);
  if (!r || !t && !n && !o) return;
  const a = rg(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), og(o)), r.parentElement !== e && e.append(r);
}
function rg(e, t) {
  const n = e.querySelector(`.${no}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(no), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function og(e) {
  const t = ag(e.textContent ?? "");
  t && (e.setAttribute(eg, "true"), e.replaceChildren(lg(t)));
}
function ag(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = ig(r ?? "");
  return l ? {
    skillLabel: a,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function ig(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: sg(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function sg(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function lg(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = cg(e);
  return r && t.append(r), t;
}
function cg(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of ug(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function ug(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Eo(e, "highest") : n.includes("kl") ? Eo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Eo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Io(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Rr() {
  const e = globalThis.game;
  return Ft(e) ? e : null;
}
function v(e, t) {
  const n = dg(e, t);
  return dt(n);
}
function dg(e, t) {
  return t.split(".").reduce((n, r) => Ft(n) ? n[r] : null, e);
}
function mg(e, t) {
  const n = e.indexOf(":");
  return n < 0 || ze(e.slice(0, n)) !== ze(t) ? null : Ie(e.slice(n + 1));
}
function dt(e) {
  return typeof e == "string" ? Ie(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Ft(e) {
  return !!e && typeof e == "object";
}
function fg(e) {
  return typeof e == "string";
}
function Ut(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Ie(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function ze(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Un(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function Y(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function ss(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function pg(e) {
  for (const t of Array.from(e.querySelectorAll(eu))) {
    const n = Tg(t);
    gg(t), n && (hg(t, n), bg(t, n));
  }
}
function gg(e) {
  for (const t of Array.from(e.querySelectorAll(tu)))
    t.remove();
}
function hg(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Wa) ?? null, o = r?.querySelector(Jc) ?? null, a = r ?? e, s = a.querySelector(iu);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Fg(t.elementTone), l.textContent = Mg(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    a.prepend(l);
  }
}
function bg(e, t) {
  const n = _g(e);
  yg(e, n);
  const r = Ag(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${i}__ritual-metadata`);
  for (const s of r) {
    const l = document.createElement("span");
    l.classList.add(`${i}__ritual-metadata-chip`), l.textContent = s, o.append(l);
  }
  if (n) {
    const s = n.querySelector(`.${i}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const a = e.querySelector(Qa);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function _g(e) {
  return e.closest(`.${i}`)?.querySelector(Wa) ?? null;
}
function yg(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(su)))
      o.remove();
}
function Ag(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Un(e.target)}` : null,
    e.duration ? `Duração: ${Un(e.duration)}` : null,
    e.resistance ? `Resistência: ${ss(e.resistance)}` : null
  ].filter(Ut);
}
function Tg(e) {
  const t = $g(e), n = Cg(e), o = (t ? Ig(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = wr(v(o, "element")), l = q("op.elementChoices", s) ?? Co(oe(a, "Elemento")) ?? Co(n.damageType), c = s ?? Ug(l), d = v(o, "circle") ?? oe(a, "Círculo"), m = Dg(o) ?? oe(a, "Alvo"), y = xg(o, "duration", "op.durationChoices") ?? oe(a, "Duração"), T = Sg(e) ?? Pg(o) ?? oe(a, "Resistência"), $ = Lg(a) ?? n.cost, g = {
    elementLabel: l,
    elementTone: c,
    circle: d,
    cost: $,
    target: m,
    duration: y,
    resistance: T
  };
  return Og(g) ? g : null;
}
function $g(e) {
  const t = Rg(e);
  if (!t) return null;
  const n = t.getFlag?.(u, Ct), r = kg(n);
  if (r.length === 0) return null;
  const o = wg(e);
  if (o.size > 0) {
    const a = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Rg(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Rr()?.messages?.get?.(n) ?? null : null;
}
function wg(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${to}]`))) {
    const o = r.getAttribute(to)?.trim();
    o && n.add(o);
  }
  return n;
}
function kg(e) {
  if (!Ft(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Eg).filter((n) => n !== null) : [];
}
function Eg(e) {
  return Ft(e) ? {
    pendingId: dt(e.pendingId),
    actorId: dt(e.actorId),
    itemId: dt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(fg) : []
  } : null;
}
function Ig(e) {
  if (!e.itemId) return null;
  const t = Rr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Cg(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(nu))) {
    const o = Ie(r.textContent);
    if (!o) continue;
    const a = mg(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Sg(e) {
  const t = Ie(e.querySelector(Ka)?.textContent);
  return t ? ss(t) : null;
}
function oe(e, t) {
  const n = ze(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || ze(r.slice(0, o)) !== n))
      return Ie(r.slice(o + 1));
  }
  return null;
}
function Lg(e) {
  const t = oe(e, "Custo") ?? oe(e, "PE");
  return t || (e.map(Ie).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Dg(e) {
  const t = v(e, "target");
  if (!t) return null;
  if (t === "area")
    return vg(e) ?? q("op.targetChoices", t) ?? "Área";
  const n = q("op.targetChoices", t) ?? Y(t);
  return [t === "people" || t === "creatures" ? v(e, "targetQtd") : null, n].filter(Ut).join(" ");
}
function vg(e) {
  const t = v(e, "area.name"), n = v(e, "area.size"), r = v(e, "area.type"), o = t ? q("op.areaChoices", t) ?? Y(t) : null, a = r ? q("op.areaTypeChoices", r) ?? Y(r) : null;
  return o ? n ? a ? `${o} ${n}m ${Un(a)}` : `${o} ${n}m` : o : null;
}
function Pg(e) {
  const t = v(e, "skillResis"), n = v(e, "resistance");
  if (!t || !n) return null;
  const r = q("op.skill", t) ?? Y(t), o = Ng(n);
  return [r, o].filter(Ut).join(" ");
}
function Ng(e) {
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
      return q("op.resistanceChoices", e) ?? Y(e);
  }
}
function xg(e, t, n) {
  const r = v(e, t);
  return r ? q(n, r) ?? Y(r) : null;
}
function Og(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Mg(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Fg(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Ut).join(" ");
}
function wr(e) {
  const t = ze(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Co(e) {
  const t = wr(e);
  return t ? q("op.elementChoices", t) ?? Y(t) : e ? Y(e) : null;
}
function Ug(e) {
  return wr(e);
}
function q(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Rr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const So = "data-paranormal-toolkit-dice-toggle-enhanced";
function Bg(e) {
  for (const t of Array.from(e.querySelectorAll(Za)))
    ls(t);
}
function qg(e) {
  const t = us(e.target);
  if (!t) return;
  const n = kr(t);
  n && (e.preventDefault(), cs(n, t));
}
function Gg(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = us(e.target);
  if (!t) return;
  const n = kr(t);
  n && (e.preventDefault(), cs(n, t));
}
function ls(e) {
  const t = e.querySelector(Dt);
  if (!t) return;
  const n = e.querySelector(cr);
  if (n && n.getAttribute(So) !== "true" && (n.setAttribute(So, "true"), n.classList.add(ur), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function cs(e, t) {
  const n = e.querySelector(Dt);
  if (!n) return;
  const r = !e.classList.contains(lr);
  zg(e, t, n, r);
}
function zg(e, t, n, r) {
  e.classList.toggle(lr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function us(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(cr);
  if (!t) return null;
  const n = kr(t);
  return n ? (ls(n), t.classList.contains(ur) ? t : null) : null;
}
function kr(e) {
  const t = e.closest(Za);
  return t && t.querySelector(Dt) ? t : null;
}
const Lo = `${u}-workflow-dice-toggle-styles`;
function jg() {
  if (document.getElementById(Lo)) return;
  const e = document.createElement("style");
  e.id = Lo, e.textContent = `
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
const Vg = [0, 100, 500, 1500, 3e3];
let Do = !1, Jt = null;
function Hg() {
  if (!Do) {
    Do = !0, jg(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Fe(Io(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Fe(Io(t));
    }), Hooks.once("ready", () => {
      Fe(document), Wg();
    }), document.addEventListener("click", qg), document.addEventListener("keydown", Gg);
    for (const e of Vg)
      globalThis.setTimeout(() => Fe(document), e);
  }
}
function Wg() {
  Jt || !document.body || (Jt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Fe(n);
  }), Jt.observe(document.body, { childList: !0, subtree: !0 }));
}
function Fe(e) {
  e && (ku(e), pg(e), tg(e), Bg(e), bu(e));
}
function Kg() {
  Hg();
}
const Yg = "data-paranormal-toolkit-action-section", Qg = "ritual-log", Zg = ".paranormal-toolkit-item-use-prompt__actions", Xg = ".paranormal-toolkit-item-use-prompt__actions-title", Jg = [0, 100, 500, 1500];
let vo = !1;
function eh() {
  if (vo) return;
  const e = (t, n) => {
    Po(oh(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Po(document), vo = !0;
}
function Po(e) {
  for (const t of Jg)
    globalThis.setTimeout(() => th(e), t);
}
function th(e) {
  nh(e), rh(e);
}
function nh(e) {
  for (const t of e.querySelectorAll(
    `[${Yg}="${Qg}"]`
  ))
    t.remove();
}
function rh(e) {
  for (const t of e.querySelectorAll(Zg)) {
    if (No(t.querySelector(Xg)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => No(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function oh(e) {
  if (e instanceof HTMLElement || ah(e))
    return e;
  if (ih(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function ah(e) {
  return e instanceof HTMLElement;
}
function ih(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function No(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Ue = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, ds = {
  PV: "system.attributes.hp"
}, Bn = {
  PV: [Ue.PV, ds.PV],
  SAN: [Ue.SAN],
  PE: [Ue.PE],
  PD: [Ue.PD]
}, qn = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class sh {
  getResource(t, n) {
    const r = xo(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(t, a), c = foundry.utils.getProperty(t, s), d = Mo(t, n, a, l, "valor atual");
    if (d) return p(d);
    const m = Mo(t, n, s, c, "valor máximo");
    return m ? p(m) : b({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const o = xo(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function xo(e, t) {
  const n = lh(e.type, t);
  if (n && Oo(e, n))
    return b(n);
  const r = Bn[t].find(
    (o) => Oo(e, o)
  );
  return r ? b(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: ch(e, t),
    path: Bn[t].join(" | ")
  });
}
function lh(e, t) {
  return e === "threat" ? ds[t] ?? null : e === "agent" ? Ue[t] : null;
}
function Oo(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function ch(e, t) {
  const n = e.type ?? "unknown", r = Bn[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Mo(e, t, n, r, o) {
  return r == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${o} de ${t} não encontrado: ${n}.`,
    path: n,
    value: r
  } : typeof r != "number" || !Number.isFinite(r) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${o} de ${t} em ${n}.`,
    path: n,
    value: r
  } : null;
}
class uh {
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
      const s = qn.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, a = dh(o);
    return a ? b(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of qn.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function dh(e) {
  if (Fo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Fo(n))
      return n;
  }
  return null;
}
function Fo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const mh = "dice-so-nice";
async function ms(e) {
  if (!fh() || !ph()) return;
  const t = gh();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function fh() {
  try {
    return Xc().enabled;
  } catch {
    return !1;
  }
}
function ph() {
  return game.modules?.get?.(mh)?.active === !0;
}
function gh() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Uo = "occultism";
class fs {
  getDifficulty(t) {
    return hh(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await _h(t, Uo);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await ms(r);
    const o = Th(r);
    return {
      skill: Uo,
      skillLabel: "Ocultismo",
      roll: r,
      formula: Ah(r),
      total: o,
      difficulty: n,
      success: o >= n,
      diceBreakdown: $h(r)
    };
  }
}
function hh(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function bh(e) {
  return new fs().rollCastingCheck(e);
}
async function _h(e, t) {
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
  return yh(r);
}
function yh(e) {
  return Bo(e) ? e : Array.isArray(e) ? e.find(Bo) ?? null : null;
}
function Bo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Ah(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Th(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function $h(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Rh);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Rh(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const wh = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class kh {
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
    const r = n.value, o = Eh(t.ritual, r);
    return o.ok ? o.value ? b(o.value) : b({
      resource: "PE",
      amount: wh[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Eh(e, t) {
  const n = e.getFlag(u, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Ih(n) ? {
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
function Ih(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const en = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ch(e) {
  if (!Nh(e.item)) return null;
  const t = Gn(e.actor) ? e.actor : Sh(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Dh(e.token) ?? Lh(t),
    targets: ar(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Sh(e) {
  const t = e;
  return Gn(t.actor) ? t.actor : Gn(e.parent) ? e.parent : null;
}
function Lh(e) {
  const t = vh(e) ?? Ph(e);
  return t ? ps(t) : null;
}
function Dh(e) {
  return zn(e) ? ps(e) : null;
}
function vh(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return zn(n) ? n : (t.getActiveTokens?.() ?? []).find(zn) ?? null;
}
function Ph(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function ps(e) {
  const t = e.actor ?? null;
  return {
    tokenId: tn(e.id),
    actorId: tn(t?.id),
    sceneId: tn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Nh(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Gn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function zn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function tn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class xh {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(en.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${en.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Ch(Oh(t));
    if (!n) {
      f.warn(`${en.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Oh(e) {
  return e && typeof e == "object" ? e : {};
}
class Mh {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return nn("missing-item-patch");
    if (t.type !== "ritual") return nn("unsupported-item-type");
    const o = Fh(r);
    return Object.keys(o).length === 0 ? nn("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Fh(e) {
  const t = {};
  k(t, "name", e.name), k(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (k(t, "system.circle", n.circle), k(t, "system.element", n.element), k(t, "system.target", n.target), k(t, "system.targetQtd", n.targetQuantity), k(t, "system.execution", n.execution), k(t, "system.range", n.range), k(t, "system.duration", n.duration), k(t, "system.skillResis", n.resistanceSkill), k(t, "system.resistance", n.resistance), k(t, "system.studentForm", n.studentForm), k(t, "system.trueForm", n.trueForm)), t;
}
function k(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function nn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Uh {
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
    return this.getNumber(t, qn.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const a = this.resourceAdapter.getResource(t, o);
      a.ok ? n[o] = a.value : r.push(a.error);
    }
    return { values: n, errors: r };
  }
  getNumber(t, n, r) {
    const o = foundry.utils.getProperty(t, n);
    return typeof o == "number" && Number.isFinite(o) ? o : r;
  }
}
class Bh {
  async applyPreset(t, n, r = {}) {
    const o = {
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
    return await this.writeAutomationFlag(t, o), o;
  }
  async applyManualDefinition(t, n, r = n.label) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: r,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async clear(t) {
    await t.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(u, "automation", n);
  }
}
class qh {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Gh(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, rn(t)), b(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const o = this.register(r);
      if (!o.ok)
        return o;
      n.push(o.value);
    }
    return b(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? rn(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? b(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(rn);
  }
  findForItem(t) {
    return this.list().map((n) => zh(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Gh(e) {
  return !on(e.id) || !on(e.version) || !on(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : b(e);
}
function zh(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = jh(o, t);
    if (!a.matches)
      return null;
    r += a.score, n.push(a.reason);
  }
  return {
    preset: e,
    score: r,
    reasons: n
  };
}
function jh(e, t) {
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
      const n = qo(t.name), r = e.names.map(qo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Vh(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function qo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Vh(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function rn(e) {
  return structuredClone(e);
}
function on(e) {
  return typeof e == "string" && e.length > 0;
}
function ht(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : b(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Bt(e.amountFrom);
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
    const o = Math.trunc(r.total);
    return !Number.isInteger(o) || o <= 0 ? p({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : b(o);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Bt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function Hh(e, t, n) {
  if (!Go(e.id) || !Go(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), o = await Promise.resolve(r.evaluate()), a = o.total;
    if (typeof a != "number" || !Number.isFinite(a))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await ms(o);
    const l = {
      ...n.rollRequests[e.id] ?? gs(e, t),
      total: a,
      roll: o
    };
    return n.rolls[e.id] = l, b(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function gs(e, t) {
  const n = e.intent ?? Wh(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Wh(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Go(e) {
  return typeof e == "string" && e.length > 0;
}
async function bt(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? at(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? at(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? at(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? at(t, n, r, o) : e.recover(t, n, o);
  }
}
function at(e, t, n, r) {
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
function Kh(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = Yh(t, n, r, o);
    n.damageInstances.push(s), a.emit("afterDamageResolution", n, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), a.emit("afterApplyDamage", n, {
      stepIndex: o,
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
    const s = Qh(t, n, r, o);
    n.healingInstances.push(s), a.emit("afterApplyHealing", n, {
      stepIndex: o,
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
function Yh(e, t, n, r) {
  const o = Bt(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: hs(t.id, "damage", r, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    damageType: a?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Qh(e, t, n, r) {
  const o = Bt(e.amountFrom);
  return {
    id: hs(t.id, "healing", r, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function hs(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Zh(e, t, n) {
  const r = Bt(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    amountFrom: e.amountFrom,
    rollId: r,
    rollIntent: o?.intent,
    damageType: o?.damageType
  };
}
function Xh(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), bs("before", e), zo("before", e), zo("resolve", e);
}
function Jh(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), bs("apply", e);
}
function eb(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function bs(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t, l = tb(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function zo(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function tb(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function nb(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), b(void 0);
  } catch (r) {
    return p({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function rb(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return ob(e, t);
    case "spendRitualCost":
      return ab(e, t);
  }
}
async function ob(e, t) {
  const { context: n, resources: r } = e, o = ht(t, n);
  return o.ok ? _s(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function ab(e, t) {
  const { context: n, resources: r, ritualCosts: o } = e, a = o.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!a.ok)
    return p({
      reason: "ritual-cost-failed",
      message: a.error.message,
      cause: a.error
    });
  const s = a.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), _s(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function _s(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), b(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function ib(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, s = sb(t);
  for (const c of s.before)
    o.emit(c, n, { stepIndex: r, step: t });
  const l = await a();
  if (!l.ok)
    return l;
  for (const c of s.after)
    o.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function sb(e) {
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
class lb {
  constructor(t, n, r, o) {
    this.resources = t, this.ritualCosts = n, this.messages = r, this.lifecycle = o;
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
    for (const [r, o] of t.steps.entries()) {
      const a = await this.runStep(o, n, r);
      if (!a.ok)
        return a;
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
        return ib({
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
    const o = await rb({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = gs(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), b(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await Hh(t, r, n);
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = ht(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Zh(t, n, o.value);
    Xh({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Jh({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
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
      const c = await bt(this.resources, l, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(c, n, r, t);
      if (!d.ok)
        return d;
      Kh({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return eb({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), b(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = ht(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = this.resolveActors(t.actor, n);
    if (a.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of a) {
      const l = await bt(this.resources, s, t.resource, t.operation, o.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return b(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await nb(this.messages, t, n);
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, o) {
    return t.ok ? (n.resourceTransactions.push(t.value), b(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, o, a, s) {
    const l = cb(t, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: o,
      step: a,
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
function cb(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class ub {
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
  async execute(t, n, r, o) {
    if (!Number.isInteger(o) || o <= 0)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: o
      });
    const a = this.adapter.getResource(t, n);
    if (!a.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: a.error.reason,
        message: a.error.message,
        requestedAmount: o,
        path: a.error.path,
        value: a.error.value
      });
    const s = a.value, l = this.calculate(r, s, o);
    if (!l.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: c, appliedAmount: d } = l.value, m = {
      value: c,
      max: s.max
    };
    try {
      c !== s.value && await this.adapter.updateResourceValue(t, n, c);
    } catch (y) {
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: o,
        current: s.value,
        required: o,
        cause: y
      });
    }
    return b({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: d,
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
        }) : b({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const o = Math.max(0, n.value - r);
        return b({
          afterValue: o,
          appliedAmount: n.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(n.max, n.value + r);
        return b({
          afterValue: o,
          appliedAmount: o - n.value
        });
      }
    }
  }
}
class db {
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
function ys(e) {
  return {
    id: mb(),
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
function mb() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class fb {
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
    return ie(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = ys(n);
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
    const o = await this.automation.run(t, r);
    return o.ok ? (this.hooks.emit("completed", r), o) : (this.emitFailed(r, o.error), o);
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
class pb {
  emit(t, n, r = {}) {
    const o = {
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
    }), Hooks.callAll(`${u}.workflow.${t}`, o), Hooks.callAll(`${u}.workflow.phase`, o), o;
  }
}
class gb {
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
    const n = hn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: hb(),
      flags: {
        ...t.flags,
        [u]: {
          ...bb(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = hn();
    if (!r.enabled)
      return;
    const o = n.notification ?? jo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = jo(n);
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
function jo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function hb() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function bb(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const _b = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", As = `${u}-inline-roll-neutralized`, yb = `${u}-inline-roll-notice`, Er = `data-${u}-inline-roll-neutralized`, Vo = `data-${u}-inline-roll-notice`, Ab = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ho(e) {
  const t = Nb(e.message), n = await Tb(e.message), r = $b(t);
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
async function Tb(e) {
  const t = Db(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Rb(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await vb(t, n.content), replacementCount: n.replacementCount };
}
function $b(e) {
  const t = e ? Pb(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Ts(t);
  return n > 0 && $s(Cb(t)), { replacementCount: n };
}
function Rb(e) {
  const t = wb(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Ts(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : ($s(n.content), { content: n.innerHTML, replacementCount: o });
}
function wb(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Eb(o.trim()))), replacementCount: t };
}
function Ts(e) {
  const t = kb(e);
  for (const n of t)
    n.replaceWith(Ib(Sb(n)));
  return t.length;
}
function kb(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(_b))
    n.getAttribute(Er) !== "true" && t.add(n);
  return Array.from(t);
}
function Eb(e) {
  return `<span class="${As}" ${Er}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${xb(e)}</span>`;
}
function Ib(e) {
  const t = document.createElement("span");
  return t.classList.add(As), t.setAttribute(Er, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function $s(e) {
  if (e.querySelector?.(`[${Vo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(yb), t.setAttribute(Vo, "true"), t.textContent = Ab, e.append(t);
}
function Cb(e) {
  return e.querySelector(".message-content") ?? e;
}
function Sb(e) {
  const n = e.getAttribute("data-formula") ?? Lb(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Lb(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Db(e) {
  return e && typeof e == "object" ? e : null;
}
async function vb(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Pb(e) {
  const t = Ob(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Nb(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function xb(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Ob(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const _t = "ritualRollConfig", Te = "ritual-roll";
function qt() {
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
function Rs(e) {
  const t = e.getFlag(u, _t);
  return jn(t);
}
function ws(e) {
  return Rs(e) ?? qt();
}
async function Mb(e, t) {
  const n = jn(t) ?? jn({
    ...qt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(u, _t, n), n;
}
async function Fb(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, u, _t));
    return;
  }
  await e.setFlag(u, _t, null);
}
function jn(e) {
  if (!Gt(e)) return null;
  const t = Wb(e.intent);
  if (!t) return null;
  const n = qt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: yt(e.damageType),
    utilityLabel: yt(e.utilityLabel) ?? n.utilityLabel,
    note: Ir(e.note),
    forms: Kb(e.forms)
  };
}
function Ub(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Bb(e) {
  const t = Rs(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = qb(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Gb(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: jb(e, t),
    resistance: t.intent === "damage" ? Vb(e) : void 0
  };
}
function qb(e, t) {
  const n = {
    type: "rollFormula",
    id: Te,
    formula: t,
    intent: Hb(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function Gb(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Te}.total`,
          ...zb(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Te}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function zb(e) {
  return e ? { damageType: e } : {};
}
function jb(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [Te]: n
      }
    }
  };
  return Wo(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [Te]: t.forms.discente.formula.trim()
    }
  }), Wo(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [Te]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Vb(e) {
  const t = ks(e), n = yt(t.skillResis), r = yt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = Yb(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Hb(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Wb(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Kb(e) {
  const t = qt();
  return Gt(e) ? {
    base: an(e.base),
    discente: an(e.discente),
    verdadeiro: an(e.verdadeiro)
  } : t.forms;
}
function an(e) {
  return Gt(e) ? { formula: Ir(e.formula) } : { formula: "" };
}
function Wo(e, t) {
  const n = ks(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return Qb(r);
}
function ks(e) {
  const t = e.system;
  return Gt(t) ? t : {};
}
function Yb(e) {
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
function Qb(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Ir(e) {
  return typeof e == "string" ? e.trim() : "";
}
function yt(e) {
  const t = Ir(e);
  return t.length > 0 ? t : null;
}
function Gt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Zb(e) {
  switch (Xb(e)) {
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
      return Jb(String(e ?? ""));
  }
}
function Xb(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function Jb(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function e_(e) {
  return {
    header: {
      eyebrow: er,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: a_(e.ritual)
    },
    forms: e.variantOptions.map((t) => t_(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: o_(e.automationStatus ?? "assisted")
  };
}
function t_(e, t) {
  const n = n_(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? r_(t) : "—",
    details: n
  };
}
function n_(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function r_(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function o_(e) {
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
function a_(e) {
  const t = e.system, n = [s_(t?.element), i_(t?.circle)].filter(u_);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function i_(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function s_(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (l_(e)) {
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
      return c_(e);
  }
}
function l_(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function c_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function u_(e) {
  return typeof e == "string" && e.length > 0;
}
const Es = ["base", "discente", "verdadeiro"];
function Is(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function At(e) {
  return typeof e == "string" && Es.includes(e);
}
const { ApplicationV2: d_ } = foundry.applications.api;
class Be extends d_ {
  constructor(t, n) {
    super({
      id: `${u}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = e_(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  resolveRequest;
  model;
  selectedVariant = "base";
  spendResource = !0;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${u}-ritual-cast`,
    classes: [u, "paranormal-toolkit-ritual-cast-app"],
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
      cast: Be.onCast,
      cancel: Be.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Be(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    f_(o, (a) => {
      this.selectedVariant = a;
    }), p_(o, (a) => {
      this.spendResource = a;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${E(this.model.header.eyebrow)}</p>
        <div>
          <h2>${E(this.model.header.title)}</h2>
          <p>${E(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(m_).join("")}
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
          <div><dt>Custo base</dt><dd>${E(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${E(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${E(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${E(this.model.automation.title)}</strong></p>
        <p>${E(this.model.automation.description)}</p>
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
    const n = b_(t), r = g_(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function m_(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${E(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${E(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${E(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${E(e.label)}</strong>
        <em>${E(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function f_(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Ko(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Ko(e, o, t));
    });
  const r = Cs(e);
  r && t(r);
}
function Ko(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !At(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Cs(e));
}
function Cs(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && At(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function p_(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function g_(e, t, n) {
  const r = h_(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function h_(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (At(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return At(n) ? n : null;
}
function b_(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function E(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function __(e) {
  return Be.request(e);
}
const Cr = {
  label: "Padrão"
}, y_ = {
  label: "Discente",
  extraCost: 2
}, A_ = {
  label: "Verdadeiro",
  extraCost: 5
};
class T_ {
  constructor(t, n, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = r;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, n) {
    return t.item.type === "ritual" || n.steps.some((r) => r.type === "spendRitualCost");
  }
  async run(t, n) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const r = this.resolveCostPreview(t), o = dy(n), a = ly(
      n,
      t.item,
      r,
      o
    ), s = await __({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((C) => C.name),
      cost: r,
      defaultSpendResource: by(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = $_(s), c = fy(
      n,
      t.item,
      l.variant,
      o
    ), d = Ga();
    let m = null;
    if (d) {
      const C = await w_(
        this.resources,
        t.actor,
        l,
        c,
        r
      );
      if (!C.ok)
        return {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      try {
        m = await bh(
          t.actor
        );
      } catch (x) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: x instanceof Error ? x.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: x
        };
      }
    }
    const y = R_(
      n,
      l,
      c,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (y.steps.length === 0) {
      const C = my(
        t,
        l
      ), x = Yo(
        t.actor,
        m,
        c,
        r
      ), me = Qo(
        n,
        l,
        c,
        r,
        C,
        t,
        m
      );
      return x.length > 0 ? {
        status: "ready",
        workflowContext: C,
        actions: x,
        summaryLines: me
      } : {
        status: "completed-without-actions",
        workflowContext: C,
        summaryLines: me
      };
    }
    const T = await this.workflow.runAutomation(y, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: "ask"
        },
        ritualCast: {
          variant: l.variant,
          spendResource: l.spendResource
        }
      }
    });
    if (!T.ok)
      return {
        status: "failed",
        reason: T.error.reason,
        message: T.error.message,
        cause: T.error
      };
    const $ = T.value.context, g = D_(
      n,
      t,
      $
    ), j = E_(
      n,
      t
    ), De = Yo(
      t.actor,
      m,
      c,
      r
    ), ve = Qo(
      n,
      l,
      c,
      r,
      $,
      t,
      m
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!j.ok)
      return {
        status: "failed",
        reason: j.reason,
        message: j.message
      };
    const de = [
      ...De,
      ...g.actions,
      ...j.actions
    ];
    return de.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: ve
    } : {
      status: "ready",
      workflowContext: $,
      actions: de,
      summaryLines: ve
    };
  }
  async applyAction(t) {
    return bt(
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
function $_(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function R_(e, t, n, r, o) {
  const a = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Lr(l) && (!o.includeCostSteps || !s) || a.push(k_(l, n));
  return o.includeCostSteps && s && r && _y(n.extraCost) && a.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: a
  };
}
async function w_(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Ye(o, r);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const s = await e.spend(
    t,
    a.resource,
    a.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function k_(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Yo(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Ye(r, n);
  if (!o || o.amount <= 0) return [];
  const a = e.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: e,
      actorName: a,
      resource: "SAN",
      operation: "damage",
      amount: o.amount,
      label: `Aplicar ${o.amount} SAN`,
      executedLabel: "✓ Dano na SAN aplicado",
      actionSectionId: "casting-backlash",
      actionSectionTitle: "Dano na sanidade"
    }
  ];
}
function E_(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = Sr(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const s = bi(a);
      n.push(
        I_(
          r,
          a,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function I_(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? L_(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: C_(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: S_(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function C_(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function S_(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function L_(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function D_(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const s = ht(a, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = Sr(a.actor, t);
    if (l.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (v_(a)) {
        P_(
          o,
          c,
          N_(a, n, s.value)
        );
        continue;
      }
      r.push(O_(a, c, s.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...x_(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function v_(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function P_(e, t, n) {
  const r = B_(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function N_(e, t, n) {
  const r = q_(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function x_(e, t, n, r) {
  const o = V_(e), a = o.length > 1 ? K_() : void 0;
  return o.map((s) => {
    const l = r.map(
      (d, m) => {
        const y = H_(d.amount, s);
        return {
          id: M_(d, s, m),
          amount: y,
          damageType: d.damageType,
          sourceRollId: d.sourceRollId,
          ignoreResistance: d.step.ignoreResistance === !0
        };
      }
    ), c = l.reduce(
      (d, m) => d + m.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: F_(c, s, o.length > 1),
      executedLabel: U_(
        n.name ?? "Ator sem nome",
        s,
        o.length > 1
      ),
      choiceGroupId: a,
      choiceGroupResolvedLabel: a ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: t.uuid ?? null
    };
  });
}
function O_(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = j_(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: G_(e, r, n),
    executedLabel: z_(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function M_(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function F_(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function U_(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function B_(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function q_(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function G_(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function z_(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function j_(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function V_(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function H_(e, t) {
  const n = e * t.multiplier, r = W_(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function W_(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function K_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Sr(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Qo(e, t, n, r, o, a, s = null) {
  return [
    `Forma: ${Is(t.variant)}`,
    X_(t, n, r),
    ...Z_(s),
    ...Object.values(o.rolls).flatMap(J_),
    ...Y_(e, a),
    ...ey(e.resistance),
    ...iy(n)
  ];
}
function Y_(e, t) {
  return Q_(e) ? Sr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Q_(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Z_(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function X_(e, t, n) {
  const r = Ye(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function J_(e) {
  const n = [`${sy(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = ty(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${Zb(e.damageType)}`), n;
}
function ey(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function ty(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let r = "+";
  for (const o of t) {
    if (!o || typeof o != "object") continue;
    const a = o;
    if (a.operator === "+" || a.operator === "-") {
      r = a.operator;
      continue;
    }
    const s = ny(a);
    s && (ay(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function ny(e) {
  const t = ry(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : oy(e);
}
function ry(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function oy(e) {
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
function ay(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function iy(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function sy(e) {
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
function ly(e, t, n, r) {
  return Es.map((o) => {
    const a = Ss(
      e,
      t,
      o,
      r
    ), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? Is(o),
      enabled: s,
      details: a ? cy(a, n, r) : [],
      finalCostText: a ? uy(n, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function cy(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Ye(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function Ye(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function uy(e, t) {
  const n = Ye(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function dy(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Lr);
}
function my(e, t) {
  return ys({
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
function fy(e, t, n, r) {
  return Ss(e, t, n, r) ?? Cr;
}
function Ss(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? gy(t, n) ? py(n) : null : n === "base" ? Cr : null);
}
function py(e) {
  switch (e) {
    case "base":
      return Cr;
    case "discente":
      return y_;
    case "verdadeiro":
      return A_;
  }
}
function gy(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return hy(foundry.utils.getProperty(e, n));
}
function hy(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function by(e) {
  return e.steps.some(Lr);
}
function Lr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function _y(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Ls = "itemUsePrompts", Ds = "chatCard", zt = "data-paranormal-toolkit-prompt-id", jt = "data-paranormal-toolkit-pending-id", Dr = "data-paranormal-toolkit-executed-label", Vn = "data-paranormal-toolkit-choice-group", vs = "data-paranormal-toolkit-skipped-label", Zo = "data-paranormal-toolkit-action-section", Xo = "data-paranormal-toolkit-detail-key", Jo = "data-paranormal-toolkit-roll-card", vr = "data-paranormal-toolkit-roll-detail-toggle", Ps = "data-paranormal-toolkit-roll-detail-id", Ns = "data-paranormal-toolkit-resistance-roll-button", xs = "data-paranormal-toolkit-resistance-skill", Os = "data-paranormal-toolkit-resistance-skill-label", Ms = "data-paranormal-toolkit-resistance-target-actor-id", Fs = "data-paranormal-toolkit-resistance-target-name", Us = "data-paranormal-toolkit-resistance-roll-result", ea = "data-paranormal-toolkit-system-card-replaced", yy = `[${jt}]`, Ay = `[${vr}]`, Ty = `[${Ns}]`, Hn = `${u}-chat-enrichment`, h = `${u}-item-use-prompt`, $y = `${h}__actions`, ta = `${h}__details`, Bs = `${h}__summary`, Ry = `${h}__title`, qs = `${h}__button--executed`, na = `${h}__roll-card`;
let ra = !1, Wn = null;
const N = /* @__PURE__ */ new Map(), wy = [0, 100, 500, 1500, 3e3], ky = 3e4, Ey = [0, 100, 500, 1500, 3e3];
function Iy(e) {
  if (Wn = e, ra) {
    aa(e);
    return;
  }
  const t = (n, r) => {
    zs(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), ra = !0, aa(e);
}
async function oa(e) {
  const t = Gs(e);
  N.set(e.pendingId, t), await xr(t) || Js(t), js(e.pendingId);
}
async function Cy(e) {
  const t = Gs({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", N.set(e.pendingId, t), await xr(t) || Js(t), js(e.pendingId);
}
async function sn(e, t) {
  const n = N.get(e);
  N.delete(e), n && await IA(n, t);
}
function Pr(e) {
  const t = al();
  for (const n of t) {
    const r = z(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Sy(e, t) {
  const n = Pr(e);
  if (!n) return;
  const r = z(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await Ce(n.message, r));
}
async function Ly(e, t, n) {
  if (!t) return;
  const r = Pr(e);
  if (!r) return;
  const o = z(r.message);
  let a = !1;
  for (const [s, l] of Object.entries(o))
    s !== e && l.choiceGroupId === t && (o[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await Ce(r.message, o);
}
function Gs(e) {
  const t = Z(e.context.message), n = e.context.targets.find((s) => Zn(s)), r = n ? Zn(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? o?.id ?? null,
    resistanceTargetName: a,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: nA(e.context),
    executed: !1
  };
}
function zs(e, t, n) {
  EA();
  const r = Ht(t);
  if (!r) return;
  const o = RA(e, r);
  o.length > 0 && Tt(r);
  for (const a of o)
    Kn(r, a);
  Ws(r, n), Yn(r), Qn(r);
}
function aa(e) {
  for (const t of Ey)
    globalThis.setTimeout(() => {
      Dy(e);
    }, t);
}
function Dy(e) {
  for (const t of vy()) {
    const n = Vt(t);
    Py(n) && zs(n, t, e);
  }
}
function vy() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Py(e) {
  return e ? Or(e) ? !0 : SA(e).length > 0 : !1;
}
function js(e) {
  const t = N.get(e);
  if (!t) return;
  const n = t.messageId ? wA(t.messageId) : null;
  if (n) {
    ua(n, t), Tt(n), Kn(n, t), ia(n), Yn(n), Qn(n);
    return;
  }
  if (t.messageId) {
    Jn(t);
    return;
  }
  const r = kA(t);
  if (r) {
    ua(r, t), Tt(r), Kn(r, t), ia(r), Yn(r), Qn(r);
    return;
  }
  Jn(t);
}
function ia(e) {
  Wn && Ws(e, Wn);
}
function Tt(e) {
  const t = Ny();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Hs(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(ea) === "true") return;
  const r = n.querySelector(`.${Hn}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(ea, "true");
}
function Ny() {
  try {
    return _c() === "replace";
  } catch {
    return !1;
  }
}
function Kn(e, t) {
  if (Tt(e), e.querySelector(`[${zt}="${Se(t.pendingId)}"]`)) return;
  const n = xy(e, t);
  My(n, t), Zy(n, Xy(t)).append(tA(t));
}
function xy(e, t) {
  const n = e.querySelector(`.${Hn}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Hn, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Ry), s.textContent = Oy(t);
  const l = document.createElement("span");
  return l.classList.add(Bs), l.textContent = t.summary, o.append(a, s, l), r.append(o), oA(e).append(r), r;
}
function Oy(e) {
  const t = I(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function My(e, t) {
  const n = t.summaryLines ?? [], r = Zs(n, t);
  if (r) {
    Fy(e, r, t);
    return;
  }
  Jy(e, n);
}
function Fy(e, t, n) {
  if (e.querySelector(`[${Jo}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(na, `${na}--${t.intent}`), r.setAttribute(Jo, "true"), t.castingCheck && sa(r, By(t.castingCheck), n.pendingId, "casting"), Uy(t) && sa(r, qy(t), n.pendingId, "effect"), Hy(r, t), Wy(r, t, n), Qy(r, t), e.append(r);
}
function Uy(e) {
  return e.intent !== "casting";
}
function By(e) {
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
function qy(e) {
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
function sa(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, a.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, a.append(l);
  }
  if (o.append(a), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, o.append(l);
  }
  Gy(o, t), Yy(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Gy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = zy(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function zy(e, t) {
  const n = jy(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of Vy(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function jy(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Vy(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? la(e, "highest") : n.includes("kl") ? la(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function la(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Hy(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(WA);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function Wy(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = Ky(t, n);
  o.append(a), s && o.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(o, l), t.resistanceRollResult && r.append(Vs(t.resistanceRollResult)), e.append(r);
}
function Ky(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(zt, t.pendingId), n.setAttribute(Ns, "true"), n.setAttribute(xs, e.resistanceSkill), n.setAttribute(Os, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Ms, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Fs, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Us, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Vs(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Ys(e), t;
}
function Yy(e, t, n, r, o) {
  const a = t.filter((d) => d.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(vr, s), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Ps, s), c.hidden = !0;
  for (const d of a) {
    const m = document.createElement("dt");
    m.textContent = d.label;
    const y = document.createElement("dd");
    y.textContent = d.value, c.append(m, y);
  }
  e.append(l, c);
}
function Qy(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function Zy(e, t) {
  const n = `[${Zo}="${Se(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add($y), o.setAttribute(Zo, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Xy(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = Zs(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Jy(e, t) {
  if (t.length === 0) return;
  const n = eA(e);
  for (const r of t) {
    const o = KA(r);
    if (n.querySelector(`[${Xo}="${Se(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Xo, o), n.append(a);
  }
}
function eA(e) {
  const t = e.querySelector(`.${ta}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(ta), e.append(n), n;
}
function tA(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(zt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(qs), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(jt, e.pendingId), t.setAttribute(Dr, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Vn, e.choiceGroupId), t.setAttribute(vs, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function nA(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = rA(e);
  return `${t} → ${n}`;
}
function rA(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function oA(e) {
  return Hs(e) ?? e;
}
function Hs(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Ws(e, t) {
  const n = Ht(e);
  if (!n) return;
  const r = n.querySelectorAll(yy);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      _A(o, t);
    }));
}
function Yn(e) {
  const t = Ht(e);
  if (!t) return;
  const n = t.querySelectorAll(Ay);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      aA(t, r);
    }));
}
function Qn(e) {
  const t = Ht(e);
  if (!t) return;
  const n = t.querySelectorAll(Ty);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      iA(t, r);
    }));
}
function aA(e, t) {
  const n = t.getAttribute(vr);
  if (!n) return;
  const r = e.querySelector(`[${Ps}="${Se(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function iA(e, t) {
  const n = t.getAttribute(zt), r = t.getAttribute(xs), o = t.getAttribute(Os) ?? (r ? se(r) : "Resistência");
  if (!n || !r) return;
  const a = cA(e, n), s = uA(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Dd(s, r);
    await gA(c.roll);
    const d = {
      skill: r,
      skillLabel: o,
      formula: c.formula,
      total: c.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: c.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    sA(t, d), lA(t, d), hA(n, d), await bA(e, n, d);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function sA(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Us, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function lA(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Vs(t);
  if (r) {
    r.textContent = Ys(t);
    return;
  }
  n.append(o);
}
function cA(e, t) {
  const n = N.get(t);
  if (n) return n;
  const r = Vt(e);
  return z(r)[t] ?? null;
}
function uA(e, t) {
  const n = e?.resistanceTargetActor;
  if (B(n)) return n;
  const o = e?.context?.targets.map(Zn).find(B) ?? null;
  if (o) return o;
  const a = t.getAttribute(Ms) ?? e?.resistanceTargetActorId ?? null, s = a ? mA(a) : null;
  return s || fA(
    t.getAttribute(Fs) ?? e?.resistanceTargetName ?? dA(t)
  );
}
function dA(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Bs}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Zn(e) {
  const t = e.actor;
  if (B(t)) return t;
  const n = e.token, r = je(n);
  if (r) return r;
  const o = e.document;
  return je(o);
}
function je(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (B(t)) return t;
  const n = e.document?.actor;
  return B(n) ? n : null;
}
function mA(e) {
  const n = game.actors?.get?.(e);
  return B(n) ? n : Ks().map((a) => je(a)).find((a) => a?.id === e) ?? null;
}
function fA(e) {
  const t = $e(e);
  if (!t) return null;
  const n = Ks().filter((a) => $e(pA(a)) === t).map((a) => je(a)).find(B) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => B(a) && $e(a.name) === t);
  return B(o) ? o : null;
}
function Ks() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function pA(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : je(e)?.name ?? null;
}
function $e(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function B(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ys(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function gA(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function hA(e, t) {
  const n = N.get(e);
  n && (n.resistanceRollResult = t);
}
async function bA(e, t, n) {
  const r = Vt(e);
  if (r)
    try {
      const o = z(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await Ce(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Vt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return G(r?.get?.(n));
}
async function _A(e, t) {
  const n = e.getAttribute(jt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Qs(e, e.getAttribute(Dr) ?? "✓ Automação aplicada"), yA(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Qs(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(qs), e.removeAttribute(jt), e.removeAttribute(Dr);
}
function yA(e) {
  const t = e.getAttribute(Vn);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Vn}="${Se(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(vs) ?? "✓ Outra opção escolhida";
    Qs(o, a);
  }
}
function Zs(e, t) {
  const n = e.map(Nr).filter(VA), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = I(e, "Forma"), a = I(e, "Custo"), s = I(e, "Dados") ?? I(e, `Dados (${r.label})`), l = I(e, "Tipo"), c = I(e, "Resistência"), d = I(e, "Resistência Perícia"), m = I(e, "Resistência Rótulo") ?? (d ? se(d) : null), y = Xs(e, "Observação"), T = e.filter((g) => $A(g, r)), $ = AA(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: l,
    resistance: c,
    resistanceSkill: d,
    resistanceSkillLabel: m,
    notes: y,
    details: T,
    castingCheck: $,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function AA(e) {
  const t = e.map(Nr).find((a) => a?.intent === "casting") ?? null, n = I(e, "Conjuração DT"), r = I(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: I(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: I(e, "Dados (Conjuração)")
  } : null;
}
function Nr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: TA(n)
  } : null;
}
function TA(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function I(e, t) {
  return Xs(e, t)[0] ?? null;
}
function Xs(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function $A(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Nr(e) ? !1 : e.trim().length > 0;
}
function RA(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of N.values())
    Xn(r, e, t) && n.set(r.pendingId, r);
  for (const r of CA(e))
    Xn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Xn(e, t, n) {
  const r = Z(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !ca(n, "itemId", e.itemId) ? !1 : !e.actorId || ca(n, "actorId", e.actorId);
}
function ca(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${YA(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function wA(e) {
  const t = Se(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function kA(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Xn(e, null, t))
      return t;
  return null;
}
function EA() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of N.entries())
    e - r.createdAt > t && N.delete(n);
}
async function ua(e, t) {
  const n = Vt(e);
  if (!n) return !1;
  try {
    const r = z(n);
    return r[t.pendingId] = Mr(t, Z(n)), await Ce(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function xr(e) {
  const t = nl(e);
  if (!t) return !1;
  try {
    const n = z(t);
    return n[e.pendingId] = Mr(e, Z(t)), await Ce(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Js(e) {
  for (const t of wy)
    globalThis.setTimeout(() => {
      Jn(e);
    }, t);
}
async function Jn(e) {
  const t = nl(e);
  if (Or(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await xr(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function IA(e, t) {
  const n = tl(e.context.message);
  if (n)
    try {
      const r = z(n), o = r[e.pendingId] ?? Mr(e, Z(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await Ce(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function CA(e) {
  return Object.values(z(G(e))).filter(Qe);
}
function z(e) {
  if (!e) return {};
  const t = {}, n = Or(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(el(e)))
    t[r] ??= o;
  return t;
}
function SA(e) {
  return Object.values(el(G(e))).filter(Qe);
}
function el(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, Ls);
  if (!ke(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Qe(o) && (n[r] = o);
  return n;
}
async function Ce(e, t) {
  typeof e.setFlag == "function" && (await DA(e, t), await LA(e, t));
}
async function LA(e, t) {
  await Promise.resolve(e.setFlag?.(u, Ls, t));
}
function Or(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, Ds);
  return zA(t) ? t : null;
}
async function DA(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Qe).sort((a, s) => a.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? Z(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: vA(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(u, Ds, o));
}
function vA(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Mr(e, t) {
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
function tl(e) {
  const t = G(e);
  if (t?.setFlag)
    return t;
  const n = PA(e);
  if (n?.setFlag)
    return n;
  const r = Z(e);
  if (!r) return null;
  const o = game.messages;
  return G(o?.get?.(r));
}
function PA(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(G).find((n) => typeof n?.setFlag == "function") ?? null;
}
function nl(e) {
  const t = tl(e.context.message);
  if (t) return t;
  const n = e.messageId ? NA(e.messageId) : null;
  if (n) return n;
  const r = al().slice().reverse();
  return r.find((o) => xA(o, e)) ?? r.find((o) => OA(o, e)) ?? null;
}
function NA(e) {
  const t = game.messages;
  return G(t?.get?.(e));
}
function xA(e, t) {
  const n = Z(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!rl(e, t)) return !1;
  const o = ol(e);
  return !t.actorId || !o || o === t.actorId;
}
function OA(e, t) {
  if (!FA(e, t)) return !1;
  const n = ol(e);
  return t.actorId && n === t.actorId ? !0 : rl(e, t);
}
function rl(e, t) {
  const n = $e(MA(e));
  if (!n) return !1;
  const r = $e(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = $e(t.itemId);
  return !!(o && n.includes(o));
}
function MA(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function ol(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function FA(e, t) {
  const n = UA(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= ky;
}
function UA(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function G(e) {
  return e && typeof e == "object" ? e : null;
}
function Qe(e) {
  return ke(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && re(e.resistanceTargetActorId) && re(e.resistanceTargetName) && jA(e.resistanceRollResult) && BA(e.actionPayload) && ln(e.title) && ln(e.buttonLabel) && ln(e.executedLabel) && re(e.choiceGroupId) && re(e.skippedLabel) && re(e.actionSectionId) && re(e.actionSectionTitle) && HA(e.summaryLines) : !1;
}
function BA(e) {
  return e == null ? !0 : ke(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && qA(e.resource) && GA(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function qA(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function GA(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function zA(e) {
  return ke(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && ke(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Qe) : !1;
}
function jA(e) {
  return e == null ? !0 : ke(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && re(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function VA(e) {
  return e !== null;
}
function ke(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function ln(e) {
  return e === void 0 || typeof e == "string";
}
function re(e) {
  return e == null || typeof e == "string";
}
function HA(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function WA(e) {
  return typeof e == "string" && e.length > 0;
}
function al() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(G).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(G).filter((r) => r !== null) : [];
}
function Ht(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Z(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function KA(e) {
  return e.trim().toLowerCase();
}
function YA(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Se(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const da = 1e3;
class QA {
  constructor(t, n, r, o, a, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = s, this.ritualAssistant = new T_(
      t,
      n,
      r
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
      settings: Hr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Hr();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = kt(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && oT(t.item) && n.executionMode === "ask") {
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
    if (await Ho(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: dn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), n.executionMode) {
      case "ask":
        await this.handleAskMode(t, r.value);
        return;
      case "automatic":
        await this.executeAutomation(t, r.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const n = this.pendingExecutions.get(t);
    if (!n)
      return this.executePersistedPendingAutomation(t);
    if (n.kind === "workflow")
      return this.pendingExecutions.delete(t), await sn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await sn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Pr(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = sT(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await bt(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await Sy(t), await Ly(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Iy(
      (t) => this.executePendingAutomation(t)
    ), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await Ho(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: dn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      aT(t.item)
    );
  }
  async handleAssistedRitual(t, n) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const r = await this.ritualAssistant.run(t, n);
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), f.info(
          "Ritual assistido concluído sem ações pendentes.",
          ie(r.workflowContext)
        );
        return;
      case "ready":
        await this.registerAssistedActions(
          t,
          r.workflowContext,
          r.actions,
          r.summaryLines
        );
        return;
    }
  }
  async executeAssistedAction(t, n) {
    if (t.kind === "resource-operation") {
      const o = await this.ritualAssistant.applyAction(t);
      return o.ok ? (n.resourceTransactions.push(o.value), { ok: !0 }) : (this.handleResourceActionFailure(o), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      const o = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return o.ok ? (rT(n, o.value), await ZA(o.value), {
        ok: !0,
        executedLabel: XA(o.value)
      }) : (this.handleDamageActionFailure(o.error), { ok: !1 });
    }
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
    const n = cn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && cn(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await sn(
        o,
        fa(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = mn();
    await Cy({
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
  async registerAssistedActions(t, n, r, o) {
    let a;
    for (const s of r) {
      const l = mn();
      a ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await oa({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: cn(s),
        skippedLabel: fa(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: iT(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      a
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      ie(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = mn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await oa({
      pendingId: r,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", r);
  }
  async executeAutomation(t, n, r) {
    this.setAttempt(t, "running");
    const o = await this.workflow.runAutomation(n, {
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
    if (!o.ok) {
      this.setAttempt(t, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(t, "completed"), f.info(
      "Automação executada por uso normal de item.",
      ie(o.value.context)
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
    const n = Date.now(), r = pa(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      n - s > da && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= da;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(pa(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = dn(
      t,
      n,
      r,
      o
    );
  }
}
async function ZA(e) {
  const t = nT();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: JA(e)
      });
    } catch (n) {
      f.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function XA(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function JA(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${mt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = eT(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${mt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${mt(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${r}
        ${o}
        ${a}
      </ul>
    </div>
  `;
}
function eT(e) {
  const t = tT(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${mt(o)}</li>`;
}
function tT(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = ma(n?.value);
  return r === null ? null : {
    value: r,
    max: ma(n?.max)
  };
}
function ma(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function nT() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function mt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function cn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function fa(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function rT(e, t) {
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
function oT(e) {
  return e.type === "ritual";
}
function aT(e) {
  return Bb(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function iT(e) {
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
function sT(e) {
  const t = e.actorUuid ? lT(e.actorUuid) : null;
  if (Ee(t)) return t;
  const n = e.actorId ? cT(e.actorId) : null;
  return n || uT(e.actorName);
}
function lT(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function cT(e) {
  const n = game.actors?.get?.(e);
  if (Ee(n)) return n;
  for (const r of il()) {
    const o = Fr(r);
    if (o?.id === e) return o;
  }
  return null;
}
function uT(e) {
  const t = un(e);
  if (!t) return null;
  for (const o of il()) {
    const a = dT(o);
    if (un(a) === t) {
      const s = Fr(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => Ee(o) && un(o.name) === t
  );
  return Ee(r) ? r : null;
}
function il() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function dT(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Fr(e)?.name ?? null;
}
function Fr(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ee(t)) return t;
  const n = e.document?.actor;
  return Ee(n) ? n : null;
}
function un(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function dn(e, t, n, r) {
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
function pa(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function mn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class mT {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = He(t);
    for (const s of n) {
      const l = s.itemId ? a.find((m) => m.id === s.itemId) ?? null : null, c = s.match?.preset ?? null;
      if (!l || !c) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(l, c);
      const d = await this.itemPatches.applyPresetItemPatch(l, c);
      r.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: c.id,
        presetLabel: c.label,
        previousStatus: s.status,
        itemPatch: d
      });
    }
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      applied: r,
      skipped: o
    };
  }
}
class fT {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = He(t).map((l) => this.analyzeRitual(l)), r = n.filter(it("upToDate")), o = n.filter(it("available")), a = n.filter(it("outdated")), s = n.filter(it("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: a,
      unsupported: s,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = pT(t);
    return n ? r ? r.source.type !== "preset" ? Ne({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Ne({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Ne({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: gT(r, n.preset)
    }) : Ne({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Ne({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Ne(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? wt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function pT(e) {
  const t = e.getFlag(u, "automation");
  return tr(t) ? t : null;
}
function gT(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function it(e) {
  return (t) => t.status === e;
}
class hT {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = rr(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: n,
      data: r,
      flags: {
        [u]: {
          resourceTransaction: r
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, n) {
    const r = this.createWorkflowSummaryContent(t, n), o = ie(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: o,
      flags: {
        [u]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = A(t.actorName), r = A(t.resource), o = A(ga(t)), a = A(_T(t));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => A(g.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(bT(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(yT(g.source))})</li>`
    ), m = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(ga(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), $ = t.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${d.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${c.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${c.join("")}</ul>` : ""}
          ${m.length > 0 ? `<p><strong>Dano:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Cura:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${$}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function bT(e) {
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
function ga(e) {
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
function _T(e) {
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
function yT(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function A(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function AT() {
  const e = new sh(), t = new ub(e), n = new gi(new pi()), r = new hi(new hr()), o = new db(new fs()), a = new uh(), s = new kh(a), l = new Uh(e), c = new qh(), d = c.registerMany(
    Kl()
  );
  if (!d.ok)
    throw new Error(d.error.message);
  const m = new Bh(), y = new Mh(), T = wi(), $ = new yi(T), g = new fT(
    c
  ), j = new mT(
    g,
    m,
    y
  ), De = new gb(), ve = new hT(De), de = new pb(), C = new lb(
    t,
    s,
    ve,
    de
  ), x = new fb(C, de), me = new QA(
    x,
    t,
    s,
    n,
    $,
    De
  );
  return me.addStrategy(
    new xh(
      (pl) => me.handleItemUsed(pl)
    )
  ), {
    ordem: l,
    resourceAdapter: e,
    ritualAdapter: a,
    ritualCosts: s,
    resources: t,
    damage: n,
    resistance: r,
    ritualCasting: o,
    automationRegistry: c,
    automationBinder: m,
    itemPatches: y,
    conditionRegistry: T,
    conditions: $,
    debugOutput: De,
    chatMessages: ve,
    workflowHooks: de,
    automation: C,
    workflow: x,
    itemUseIntegration: me,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: j
  };
}
const { ApplicationV2: TT } = foundry.applications.api;
class $t extends TT {
  constructor(t, n) {
    super({
      id: `${u}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
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
    id: `${u}-ritual-preset-manager`,
    classes: [u, "paranormal-toolkit-ritual-preset-manager"],
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
      apply: $t.onApply,
      cancel: $t.onCancel
    }
  };
  async _renderHTML(t, n) {
    const r = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), o = document.createElement("div");
    return o.className = "paranormal-toolkit-preset-manager", o.innerHTML = this.renderContent(r), o;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${M(er)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${M(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${fn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${fn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${fn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function fn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${M(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? $T(n) : wT(t)}
    </section>
  `;
}
function $T(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(RT).join("")}</ol>`;
}
function RT(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${M(e.appliedPresetId)} v${M(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${M(e.itemName)}</strong>
        <span>${M(e.reason)}</span>
        ${r}
      </div>
      <em>${M(n)}</em>
    </li>
  `;
}
function wT(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${M({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function M(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Rt = `${u}.manageRitualPresets`, ha = `__${u}_ritualPresetHeaderControlRegistered`, kT = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function ET(e) {
  const t = globalThis;
  if (!t[ha]) {
    for (const n of kT)
      Hooks.on(n, (r, o) => {
        IT(r, o, e);
      });
    t[ha] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function IT(e, t, n) {
  Array.isArray(t) && ST(e) && (CT(e, n), !t.some((r) => r.action === Rt) && t.push({
    action: Rt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), sl(e, n);
    }
  }));
}
function CT(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Rt] && (e.options.actions[Rt] = (n) => {
    n.preventDefault(), n.stopPropagation(), sl(e, t);
  }));
}
function ST(e) {
  if (!game.user?.isGM) return !1;
  const t = ll(e);
  return t ? t.type === "agent" && He(t).length > 0 : !1;
}
function sl(e, t) {
  const n = ll(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new $t(n, t).render({ force: !0 });
}
function ll(e) {
  return ba(e.actor) ? e.actor : ba(e.document) ? e.document : null;
}
function ba(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const cl = "data-paranormal-toolkit-ritual-roll-config", Ze = "data-paranormal-toolkit-ritual-roll-field", le = "data-paranormal-toolkit-ritual-roll-action", _a = `__${u}_ritualRollConfigBlockRegistered`, LT = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], DT = [
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
function vT() {
  const e = globalThis;
  if (!e[_a]) {
    PT();
    for (const t of LT)
      Hooks.on(t, (...n) => {
        NT(n[0], n[1]);
      });
    e[_a] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function PT() {
  const e = `${u}-ritual-roll-config-inline-style`;
  if (document.getElementById(e)) return;
  const t = document.createElement("style");
  t.id = e, t.textContent = `
.${u}-ritual-roll-config {
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
.${u}-ritual-roll-config__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.${u}-ritual-roll-config__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.${u}-ritual-roll-config__title strong {
  color: rgba(89, 36, 42, 0.96);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}
.${u}-ritual-roll-config__title span {
  font-size: 0.9rem;
  font-weight: 800;
}
.${u}-ritual-roll-config__badge {
  border: 1px solid rgba(89, 36, 42, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(89, 36, 42, 0.9);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
}
.${u}-ritual-roll-config__hint,
.${u}-ritual-roll-config__status {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  opacity: 0.8;
}
.${u}-ritual-roll-config__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.${u}-ritual-roll-config__forms-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.${u}-ritual-roll-config__forms-title {
  color: rgba(24, 19, 18, 0.9);
  font-size: 0.8rem;
  font-weight: 900;
}
.${u}-ritual-roll-config__forms-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.${u}-ritual-roll-config__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
}
.${u}-ritual-roll-config__field input,
.${u}-ritual-roll-config__field select,
.${u}-ritual-roll-config__field textarea {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
}
.${u}-ritual-roll-config__field textarea {
  resize: vertical;
}
.${u}-ritual-roll-config__field small {
  color: rgba(89, 36, 42, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
}
.${u}-ritual-roll-config__form-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.28);
}
.${u}-ritual-roll-config__form-card:has(input:disabled) {
  opacity: 0.72;
}
.${u}-ritual-roll-config__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${u}-ritual-roll-config__actions button {
  width: auto;
  margin: 0;
}
.${u}-ritual-roll-config [hidden] {
  display: none !important;
}
@media (max-width: 620px) {
  .${u}-ritual-roll-config__fields,
  .${u}-ritual-roll-config__forms-grid {
    grid-template-columns: 1fr;
  }
}
`, document.head.append(t);
}
function NT(e, t) {
  const n = KT(e);
  if (!n || n.type !== "ritual") return;
  const r = ZT(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  OT(o);
  const a = dl(n), s = ws(n), l = YT(n), c = MT(n, s, a, l);
  zT(c, n, a, l), xT(o, c), Ur(c);
}
function xT(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function OT(e) {
  for (const t of Array.from(e.querySelectorAll(`[${cl}]`)))
    t.remove();
}
function MT(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${u}-ritual-roll-config`), o.setAttribute(cl, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${u}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${u}-ritual-roll-config__title`), s.append(ya("strong", "Paranormal Toolkit")), s.append(ya("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${u}-ritual-roll-config__badge`), l.textContent = fl(t) ? "Configurada" : "Rascunho", a.append(s, l), o.append(a);
  const c = document.createElement("p");
  c.classList.add(`${u}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(c);
  const d = document.createElement("div");
  d.classList.add(`${u}-ritual-roll-config__fields`), d.append(FT(t, r)), d.append(UT(t, r)), d.append(BT(t, r)), o.append(d), o.append(qT(t, n, r)), o.append(GT(r));
  const m = document.createElement("p");
  return m.classList.add(`${u}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(m), o;
}
function FT(e, t) {
  const n = Wt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Ze, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Ub(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function UT(e, t) {
  const n = Wt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Ze, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of DT) {
    const s = document.createElement("option");
    s.value = a.value, s.textContent = a.label, s.selected = e.damageType === a.value, r.append(s);
  }
  return n.append(r), n;
}
function BT(e, t) {
  const n = Wt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Ze, "utilityLabel"), n.append(r), n;
}
function qT(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${u}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${u}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${u}-ritual-roll-config__forms-grid`), a.append(pn("base", "Padrão", e.forms.base.formula, !0, n)), a.append(pn("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(pn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function pn(e, t, n, r, o) {
  const a = Wt(t);
  a.classList.add(`${u}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Ze, `formula.${e}`), a.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", a.append(l);
  }
  return a;
}
function GT(e) {
  const t = document.createElement("div");
  t.classList.add(`${u}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(le, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(le, "clear"), t.append(n, r), t;
}
function Wt(e) {
  const t = document.createElement("label");
  t.classList.add(`${u}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function ya(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function zT(e, t, n, r) {
  Le(e, "intent")?.addEventListener("change", () => Ur(e)), $a(e, "system.studentForm")?.addEventListener("change", () => Aa(e, t)), $a(e, "system.trueForm")?.addEventListener("change", () => Aa(e, t)), e.querySelector(`[${le}="save"]`)?.addEventListener("click", () => {
    r && jT(e, t, n);
  }), e.querySelector(`[${le}="clear"]`)?.addEventListener("click", () => {
    r && VT(e, t);
  });
}
async function jT(e, t, n) {
  const r = e.querySelector(`[${le}="save"]`);
  r?.setAttribute("disabled", "true"), Re(e, "Salvando configuração...");
  try {
    const o = HT(e, n);
    await Mb(t, o), ul(e, o), Re(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), Re(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function VT(e, t) {
  const n = e.querySelector(`[${le}="clear"]`);
  n?.setAttribute("disabled", "true"), Re(e, "Limpando configuração...");
  try {
    await Fb(t);
    const r = ws(t);
    WT(e, r), ul(e, r), Re(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Re(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function ul(e, t) {
  const n = e.querySelector(`.${u}-ritual-roll-config__badge`);
  n && (n.textContent = fl(t) ? "Configurada" : "Rascunho");
}
function HT(e, t) {
  return {
    schemaVersion: 1,
    intent: ml(Le(e, "intent")?.value),
    damageType: Ra(e, "damageType"),
    utilityLabel: Ra(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: ft(e, "formula.base") },
      discente: { formula: ft(e, "formula.discente") },
      verdadeiro: { formula: ft(e, "formula.verdadeiro") }
    }
  };
}
function WT(e, t) {
  pe(e, "intent", t.intent), pe(e, "damageType", t.damageType ?? ""), pe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), pe(e, "formula.base", t.forms.base.formula), pe(e, "formula.discente", t.forms.discente.formula), pe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Ur(e);
}
function Ur(e) {
  const t = ml(Le(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function Aa(e, t) {
  const n = dl(t);
  Ta(e, "discente", n.discente), Ta(e, "verdadeiro", n.verdadeiro);
}
function Ta(e, t, n) {
  const r = Le(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${le}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const a = r.closest(`.${u}-ritual-roll-config__field`), s = a?.querySelector("small");
  if (a) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", a.append(l);
    }
  }
}
function Re(e, t) {
  const n = e.querySelector(`.${u}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function dl(e) {
  const t = QT(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function KT(e) {
  return wa(e.item) ? e.item : wa(e.document) ? e.document : null;
}
function YT(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function QT(e) {
  const t = e.system;
  return XT(t) ? t : {};
}
function $a(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Le(e, t) {
  return e.querySelector(`[${Ze}="${JT(t)}"]`);
}
function ft(e, t) {
  return Le(e, t)?.value.trim() ?? "";
}
function Ra(e, t) {
  const n = ft(e, t);
  return n.length > 0 ? n : null;
}
function pe(e, t, n) {
  const r = Le(e, t);
  r && (r.value = n);
}
function ml(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function fl(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function ZT(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function wa(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function XT(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function JT(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ae = null;
Hooks.once("init", () => {
  Vl(), bc(), Zc(), Kg(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Yr.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${Yr.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ae = AT(), ae.itemUseIntegration.registerStrategies(), Wc(ae.conditions), Lc(ae), qc(), Mc(), eh(), ET(ae), vT(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${er} inicializado.`);
});
function e$() {
  if (!ae)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ae;
}
export {
  e$ as getToolkitServices
};
//# sourceMappingURL=main.js.map
