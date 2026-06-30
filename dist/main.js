const c = "paranormal-toolkit", dt = "Paranormal Toolkit", ao = "ordemparanormal";
class de {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Ce(e) {
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
class l {
  static info(t, ...r) {
    console.log(`${c} | ${t}`, ...r);
  }
  static warn(t, ...r) {
    console.warn(`${c} | ${t}`, ...r);
  }
  static error(t, ...r) {
    console.error(`${c} | ${t}`, ...r);
  }
}
function h(e) {
  return { ok: !0, value: e };
}
function f(e) {
  return { ok: !1, error: e };
}
function mt(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? f({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : ft(t) ? h(t.definition) : f({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function so(e) {
  return ft(e.getFlag(c, "automation"));
}
function ft(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && co(t.source) && io(t.definition);
}
function io(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && I(t.label) && Array.isArray(t.steps) && t.steps.every(lo);
}
function co(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? I(t.presetId) && I(t.presetVersion) && I(t.appliedAt) : t.type === "manual" ? I(t.label) && I(t.appliedAt) : !1;
}
function lo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return uo(t);
    case "spendRitualCost":
      return mo(t);
    case "rollFormula":
      return fo(t);
    case "modifyResource":
      return po(t);
    case "chatCard":
      return go(t);
    default:
      return !1;
  }
}
function uo(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Nr(t);
}
function mo(e) {
  return e.type === "spendRitualCost";
}
function fo(e) {
  const t = e;
  return t.type === "rollFormula" && I(t.id) && I(t.formula) && (t.intent === void 0 || Ro(t.intent)) && (t.damageType === void 0 || I(t.damageType));
}
function po(e) {
  const t = e;
  return t.type === "modifyResource" && ho(t.actor) && yo(t.resource) && Ao(t.operation) && Nr(t);
}
function go(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Nr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || I(e.amountFrom);
}
function ho(e) {
  return e === "self" || e === "target";
}
function yo(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ao(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Ro(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function I(e) {
  return typeof e == "string" && e.length > 0;
}
function pt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Nt);
    if (To(t))
      return Array.from(t).filter(Nt);
  }
  return [];
}
function bo(e) {
  return pt(e)[0] ?? null;
}
function ko(e) {
  return pt(e).find(so) ?? null;
}
function To(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Nt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function me(e) {
  return pt(e).filter((t) => t.type === "ritual");
}
function vr(e) {
  return me(e)[0] ?? null;
}
function wo(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Ce);
      return l.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ae("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = pe(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(Mt);
      return l.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = ae("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = pe(r);
      if (!n) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await Ke(e, n, o.value);
      l.info(`Preset ${o.value.id} aplicado em ${n.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = ae("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = pe(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        l.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await Ke(e, r, n.preset);
      l.info(`Melhor preset aplicado em ${r.name}.`, { match: Mt(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return vt(e);
    },
    async applyBestPresetsToActorRituals() {
      return vt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ae("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = pe(t);
      r && (await e.automationBinder.clear(r), l.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function vt(e) {
  const t = ae("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = me(t);
  if (r.length === 0)
    return l.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Ot(t);
  const n = Ot(t, r.length);
  for (const o of r) {
    const a = e.automationRegistry.findForItem(o)[0];
    if (!a) {
      n.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await Ke(e, o, a.preset);
    n.applied.push($o(o, a, s));
  }
  return l.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), Co(n), n;
}
async function Ke(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function $o(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Ce(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function Ot(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Co(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Mt(e) {
  return {
    preset: Ce(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function ae(e) {
  const t = de.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function pe(e) {
  const t = vr(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function W(e) {
  return e ? {
    id: e.id,
    source: {
      ..._o(e.sourceActor),
      token: e.sourceToken
    },
    item: So(e.item),
    targets: e.targets.map(Io),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Ft(e.rollRequests, Or),
    rolls: Ft(e.rolls, Po),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(gt),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function gt(e) {
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
function _o(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function So(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Io(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Or(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Po(e) {
  return {
    ...Or(e),
    total: e.total
  };
}
function Ft(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function Eo(e) {
  return {
    getSelected() {
      return de.getSelectedActor();
    },
    logResources() {
      const t = j(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      l.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && l.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await K(
        e,
        "Gasto de PE",
        j("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await K(
        e,
        "Gasto de PD",
        j("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await K(
        e,
        "Dano em PV",
        j("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await K(
        e,
        "Cura de PV",
        j("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await K(
        e,
        "Dano em SAN",
        j("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await K(
        e,
        "Recuperação de SAN",
        j("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function K(e, t, r, n) {
  if (!r) return;
  const o = await n(r);
  if (!o.ok) {
    Lo(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    l.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  l.info(`${t} realizado:`, gt(a));
}
function j(e) {
  const t = de.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Lo(e) {
  if (e.reason === "update-failed") {
    l.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    l.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  l.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const D = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Do() {
  ge(D.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), ge(D.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), ge(D.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), ge(D.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Ye() {
  return {
    enabled: he(D.enabled),
    console: he(D.console),
    ui: he(D.ui),
    chat: he(D.chat)
  };
}
async function U(e, t) {
  await game.settings.set(c, D[e], t);
}
function ge(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function he(e) {
  return game.settings.get(c, e) === !0;
}
function No() {
  return {
    status() {
      return Ye();
    },
    async enable() {
      await U("enabled", !0);
    },
    async disable() {
      await U("enabled", !1);
    },
    async enableConsole() {
      await U("console", !0);
    },
    async disableConsole() {
      await U("console", !1);
    },
    async enableUi() {
      await U("ui", !0);
    },
    async disableUi() {
      await U("ui", !1);
    },
    async enableChat() {
      await U("chat", !0);
    },
    async disableChat() {
      await U("chat", !1);
    }
  };
}
const Mr = "ritual.costOnly", Fr = "ritual.simpleHealing", vo = "ritual.eletrocussao", Ur = "ritual.simpleDamage", xr = "generic.simpleHealing", Br = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Oo() {
  return [
    Mo(),
    Fo(),
    Uo(),
    xo(),
    Bo()
  ];
}
function Mo() {
  return {
    id: Mr,
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
function Fo() {
  return {
    id: Fr,
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
    automation: jr(),
    itemPatch: Ho()
  };
}
function Uo() {
  return {
    id: vo,
    version: "1.1.0",
    label: "Eletrocussão",
    description: "Preset inicial de dano de energia. Gasta o custo do ritual, rola dano conforme a forma escolhida e prepara ação assistida para aplicar dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"]
      }
    ],
    automation: jo(),
    itemPatch: qo()
  };
}
function xo() {
  return {
    id: Ur,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ht()
  };
}
function Bo() {
  return {
    id: xr,
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
function jr(e = "2d8+2") {
  return Hr(
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
function jo() {
  return {
    ...ht("1d8", {
      label: "Eletrocussão",
      title: "Eletrocussão",
      damageType: "energia",
      message: "Gasta o custo do ritual, rola dano de energia e prepara aplicação de dano em PV do alvo. Resistência deve ser resolvida manualmente por enquanto."
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
    ritualForms: {
      base: {
        label: "Padrão",
        rollFormulaOverrides: {
          damage: "1d8"
        }
      },
      discente: {
        label: "Discente",
        extraCost: 2,
        rollFormulaOverrides: {
          damage: "3d8"
        }
      },
      verdadeiro: {
        label: "Verdadeiro",
        extraCost: 5,
        rollFormulaOverrides: {
          damage: "6d8"
        },
        notes: ["Se o alvo falhar na Fortitude, aplique Atordoado por 1 rodada manualmente."]
      }
    }
  };
}
function ht(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Hr(
    {
      version: 1,
      label: r,
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
          title: n,
          message: a
        }
      ]
    },
    "damage",
    e
  );
}
function Ho() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Br,
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
function qo() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Br,
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
function Hr(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function yt() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Q(t.id),
    actorId: Q(t.actor?.id),
    sceneId: Q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function qr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Q(e.id),
    actorId: Q(t?.id),
    sceneId: Q(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Q(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Vo(e) {
  return {
    logFirstRitualCost() {
      const t = H("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = q(t);
      if (!r) return;
      const n = e.ritualCosts.getCost({ actor: t, ritual: r });
      if (!n.ok) {
        l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      l.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: r.name,
        cost: n.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${n.value.amount} ${n.value.resource} (${n.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, r = "PE") {
      const n = H("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const o = q(n);
      if (o) {
        if (!Wo(t, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(c, "ritual.cost", {
          resource: r,
          amount: t
        }), l.info(`Custo customizado aplicado em ${o.name}.`, { resource: r, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = H("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = q(t);
      r && (await r.unsetFlag(c, "ritual.cost"), l.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = H("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = q(t);
      if (!r) return;
      const n = e.automationRegistry.require(Mr);
      if (!n.ok) {
        l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), l.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = H("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = q(r);
      if (!n) return;
      if (!Ut(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Fr);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: jr(t)
      }), l.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = H("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = q(r);
      if (!n) return;
      if (!Ut(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Ur);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: ht(t)
      }), l.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = H("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = q(t);
      r && await Go(e, t, r);
    }
  };
}
async function Go(e, t, r) {
  const n = mt(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: qr(),
    item: r,
    targets: yt()
  });
  if (!o.ok) {
    zo(o.error);
    return;
  }
  l.info("Automação de ritual executada com sucesso.", W(o.value.context));
}
function zo(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    l.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    l.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  l.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function H(e) {
  const t = de.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function q(e) {
  const t = vr(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Wo(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Ut(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Ko = ["disabled", "ask", "automatic"], Yo = ["buttons", "confirm"], Vr = "ask";
function Qo(e) {
  return typeof e == "string" && Ko.includes(e);
}
function Xo(e) {
  return typeof e == "string" && Yo.includes(e);
}
function Zo(e) {
  return Qo(e) ? e : Xo(e) ? "ask" : Vr;
}
const Jo = ["keep", "replace"], Gr = "keep", ea = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function ta() {
  game.settings.register(c, N.executionMode, {
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
    default: Vr
  }), game.settings.register(c, N.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Gr
  }), game.settings.register(c, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: ea
  }), game.settings.register(c, N.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function xt() {
  const e = Zo(game.settings.get(c, N.executionMode)), t = Wr(game.settings.get(c, N.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: zr()
  };
}
function ra() {
  return Wr(game.settings.get(c, N.systemCardMode));
}
function zr() {
  return game.settings.get(c, N.ritualCastingCheckEnabled) === !0;
}
async function V(e) {
  await game.settings.set(c, N.executionMode, e);
}
function Wr(e) {
  return Jo.includes(e) ? e : Gr;
}
function na(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await V("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await V(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await V("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const oa = [
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
function aa(e) {
  return {
    phases() {
      return oa;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = ve("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = ko(t);
      if (!r) {
        l.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Bt(e, t, r);
    },
    async runSelectedItemAutomation() {
      await this.runFirstAutomation();
    },
    async runItemAutomationByUuid(t) {
      if (!t || typeof t != "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }
      const r = await fromUuid(t);
      if (!ca(r)) {
        l.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = ia(r) ?? ve("Nenhum ator encontrado para executar automação do item.");
      n && await Bt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = ve("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = bo(t);
      if (!r) {
        l.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(xr);
        if (!n.ok) {
          l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(r, n.value), l.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (n) {
        l.error("Falha ao configurar automação de teste no item.", n), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Bt(e, t, r) {
  const n = mt(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: qr(),
    item: r,
    targets: yt()
  });
  if (!o.ok) {
    sa(o.error);
    return;
  }
  l.info("Automação executada com sucesso.", W(o.value.context));
}
function sa(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    l.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    l.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  l.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function ve(e) {
  const t = de.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ia(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ca(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function la(e) {
  const t = Eo(e), r = wo(e), n = Vo(e), o = aa(e), a = No(), s = na(e);
  return {
    actor: t,
    automation: r,
    ritual: n,
    workflow: o,
    output: a,
    itemUseIntegration: s,
    getSelectedActor() {
      return t.getSelected();
    },
    logSelectedActorResources() {
      t.logResources();
    },
    async spendSelectedActorPE(i) {
      await t.spendPE(i);
    }
  };
}
function ua(e) {
  const t = {
    services: e,
    ordem: e.ordem,
    resources: e.resources,
    ritualCosts: e.ritualCosts,
    automation: e.automation,
    automationRegistry: e.automationRegistry,
    automationBinder: e.automationBinder,
    workflow: e.workflow,
    itemUseIntegration: e.itemUseIntegration,
    debug: la(e)
  }, r = globalThis;
  return r[c] = t, r.ParanormalToolkit = t, t;
}
class jt {
  static isSupportedSystem() {
    return game.system.id === ao;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function da() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: X(t.id),
    actorId: X(t.actor?.id),
    sceneId: X(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Kr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: X(e.id),
    actorId: X(t?.id),
    sceneId: X(e.scene?.id),
    name: r
  };
}
function ma(e, t = Kr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function fa(e) {
  if (!ha(e)) return null;
  const t = e.getFlag(c, "workflow");
  return ga(t) ? t : null;
}
function pa() {
  return `flags.${c}.workflow`;
}
function Ht(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), r = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || r !== void 0;
}
function qt(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Qe(t) || Qe(r);
}
function ga(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ha(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function X(e) {
  return Qe(e) ? e : null;
}
function Qe(e) {
  return typeof e == "string" && e.length > 0;
}
function ya() {
  const e = (t, r) => {
    Aa(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Aa(e, t) {
  const r = fa(e);
  if (!r || r.targets.length === 0) return;
  const n = ba(t);
  if (!n || n.querySelector(`.${c}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Ra(r));
}
function Ra(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(Vt("Origem", e.source.name)), t.append(Vt("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function Vt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${c}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function ba(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ka() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!Ta(n) || !wa(e) || Ht(e) || Ht(t)) return;
    const o = da();
    if (o.length === 0 || !qt(e) && !qt(t)) return;
    const a = Kr();
    e.updateSource({
      [pa()]: ma(o, a)
    }), l.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Ta(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function wa(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const Yr = {
  enabled: "dice.animations.enabled"
};
function $a() {
  game.settings.register(c, Yr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ca() {
  return {
    enabled: game.settings.get(c, Yr.enabled) === !0
  };
}
const _a = "chatCard", Gt = "data-paranormal-toolkit-prompt-id", u = `${c}-item-use-prompt`, Sa = `.${u}__title`, Qr = `.${u}__header`, Ia = `.${u}__roll-card`, Pa = `.${u}__roll-meta`, Ea = `.${u}__roll-meta-pill`, La = `.${u}__resistance`, Da = `.${u}__resistance-header`, Xr = `.${u}__resistance-description`, Na = `.${u}__resistance-roll-button`, va = `.${u}__resistance-roll-result`, zt = `${u}__resistance-content`, Zr = `.${u}__workflow-section`, Jr = `.${u}__workflow-roll`, en = `${u}__workflow-roll--dice-open`, tn = `.${u}__workflow-roll-formula`, rn = `${u}__workflow-roll-formula--toggle`, At = `.${u}__workflow-dice-tray`, Oa = `.${u}__roll-detail-toggle`, Ma = `.${u}__roll-detail-list`, Fa = `.${u}__ritual-element-badge`, Ua = `.${u}__ritual-metadata`;
function xa(e) {
  for (const t of Array.from(e.querySelectorAll(Zr)))
    for (const r of Array.from(t.querySelectorAll(`${Oa}, ${Ma}`)))
      r.remove();
}
function Ba(e) {
  for (const t of Array.from(e.querySelectorAll(La)))
    ja(t);
}
function ja(e) {
  const t = e.querySelector(Da), r = e.querySelector(Xr), n = e.querySelector(Na), o = e.querySelector(va);
  if (!n || !t && !r && !o) return;
  const a = Ha(e, n);
  t && t.parentElement !== a && a.append(t), r && r.parentElement !== a && a.append(r), o && o.parentElement !== a && !n.contains(o) && a.append(o), n.parentElement !== e && e.append(n);
}
function Ha(e, t) {
  const r = e.querySelector(`.${zt}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(zt), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function Wt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Rt() {
  const e = globalThis.game;
  return _e(e) ? e : null;
}
function P(e, t) {
  const r = qa(e, t);
  return Re(r);
}
function qa(e, t) {
  return t.split(".").reduce((r, n) => _e(r) ? r[n] : null, e);
}
function Va(e, t) {
  const r = e.indexOf(":");
  return r < 0 || le(e.slice(0, r)) !== le(t) ? null : te(e.slice(r + 1));
}
function Re(e) {
  return typeof e == "string" ? te(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function _e(e) {
  return !!e && typeof e == "object";
}
function Ga(e) {
  return typeof e == "string";
}
function Se(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function te(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function le(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Xe(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function x(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function nn(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function za(e) {
  for (const t of Array.from(e.querySelectorAll(Ia))) {
    const r = Ja(t);
    Wa(t), r && (Ka(t, r), Ya(t, r));
  }
}
function Wa(e) {
  for (const t of Array.from(e.querySelectorAll(Pa)))
    t.remove();
}
function Ka(e, t) {
  const n = e.closest(`.${u}`)?.querySelector(Qr) ?? null, o = n?.querySelector(Sa) ?? null, a = n ?? e, s = a.querySelector(Fa);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const i = s ?? document.createElement("span");
  if (i.className = hs(t.elementTone), i.textContent = gs(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", i);
      return;
    }
    a.prepend(i);
  }
}
function Ya(e, t) {
  const r = Qa(e);
  Xa(e, r);
  const n = Za(t);
  if (n.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${u}__ritual-metadata`);
  for (const s of n) {
    const i = document.createElement("span");
    i.classList.add(`${u}__ritual-metadata-chip`), i.textContent = s, o.append(i);
  }
  if (r) {
    const s = r.querySelector(`.${u}__summary`);
    if (s?.parentElement === r) {
      s.insertAdjacentElement("afterend", o);
      return;
    }
    r.append(o);
    return;
  }
  const a = e.querySelector(Zr);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Qa(e) {
  return e.closest(`.${u}`)?.querySelector(Qr) ?? null;
}
function Xa(e, t) {
  const r = [e, t].filter((n) => n !== null);
  for (const n of r)
    for (const o of Array.from(n.querySelectorAll(Ua)))
      o.remove();
}
function Za(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Xe(e.target)}` : null,
    e.duration ? `Duração: ${Xe(e.duration)}` : null,
    e.resistance ? `Resistência: ${nn(e.resistance)}` : null
  ].filter(Se);
}
function Ja(e) {
  const t = es(e), r = ss(e), o = (t ? as(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = bt(P(o, "element")), i = O("op.elementChoices", s) ?? Kt(z(a, "Elemento")) ?? Kt(r.damageType), d = s ?? ys(i), g = P(o, "circle") ?? z(a, "Círculo"), A = ls(o) ?? z(a, "Alvo"), R = fs(o, "duration", "op.durationChoices") ?? z(a, "Duração"), k = is(e) ?? ds(o) ?? z(a, "Resistência"), b = cs(a) ?? r.cost, m = {
    elementLabel: i,
    elementTone: d,
    circle: g,
    cost: b,
    target: A,
    duration: R,
    resistance: k
  };
  return ps(m) ? m : null;
}
function es(e) {
  const t = ts(e);
  if (!t) return null;
  const r = t.getFlag?.(c, _a), n = ns(r);
  if (n.length === 0) return null;
  const o = rs(e);
  if (o.size > 0) {
    const a = n.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return n.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function ts(e) {
  const r = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return r ? Rt()?.messages?.get?.(r) ?? null : null;
}
function rs(e) {
  const t = e.closest(`.${u}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${Gt}]`))) {
    const o = n.getAttribute(Gt)?.trim();
    o && r.add(o);
  }
  return r;
}
function ns(e) {
  if (!_e(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(os).filter((r) => r !== null) : [];
}
function os(e) {
  return _e(e) ? {
    pendingId: Re(e.pendingId),
    actorId: Re(e.actorId),
    itemId: Re(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Ga) : []
  } : null;
}
function as(e) {
  if (!e.itemId) return null;
  const t = Rt(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function ss(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(Ea))) {
    const o = te(n.textContent);
    if (!o) continue;
    const a = Va(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function is(e) {
  const t = te(e.querySelector(Xr)?.textContent);
  return t ? nn(t) : null;
}
function z(e, t) {
  const r = le(t);
  for (const n of e) {
    const o = n.indexOf(":");
    if (!(o < 0 || le(n.slice(0, o)) !== r))
      return te(n.slice(o + 1));
  }
  return null;
}
function cs(e) {
  const t = z(e, "Custo") ?? z(e, "PE");
  return t || (e.map(te).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function ls(e) {
  const t = P(e, "target");
  if (!t) return null;
  if (t === "area")
    return us(e) ?? O("op.targetChoices", t) ?? "Área";
  const r = O("op.targetChoices", t) ?? x(t);
  return [t === "people" || t === "creatures" ? P(e, "targetQtd") : null, r].filter(Se).join(" ");
}
function us(e) {
  const t = P(e, "area.name"), r = P(e, "area.size"), n = P(e, "area.type"), o = t ? O("op.areaChoices", t) ?? x(t) : null, a = n ? O("op.areaTypeChoices", n) ?? x(n) : null;
  return o ? r ? a ? `${o} ${r}m ${Xe(a)}` : `${o} ${r}m` : o : null;
}
function ds(e) {
  const t = P(e, "skillResis"), r = P(e, "resistance");
  if (!t || !r) return null;
  const n = O("op.skill", t) ?? x(t), o = ms(r);
  return [n, o].filter(Se).join(" ");
}
function ms(e) {
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
      return O("op.resistanceChoices", e) ?? x(e);
  }
}
function fs(e, t, r) {
  const n = P(e, t);
  return n ? O(r, n) ?? x(n) : null;
}
function ps(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function gs(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function hs(e) {
  return [
    `${u}__ritual-element-badge`,
    e ? `${u}__ritual-element-badge--${e}` : null
  ].filter(Se).join(" ");
}
function bt(e) {
  const t = le(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Kt(e) {
  const t = bt(e);
  return t ? O("op.elementChoices", t) ?? x(t) : e ? x(e) : null;
}
function ys(e) {
  return bt(e);
}
function O(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = Rt()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
const Yt = "data-paranormal-toolkit-dice-toggle-enhanced";
function As(e) {
  for (const t of Array.from(e.querySelectorAll(Jr)))
    on(t);
}
function Rs(e) {
  const t = sn(e.target);
  if (!t) return;
  const r = kt(t);
  r && (e.preventDefault(), an(r, t));
}
function bs(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = sn(e.target);
  if (!t) return;
  const r = kt(t);
  r && (e.preventDefault(), an(r, t));
}
function on(e) {
  const t = e.querySelector(At);
  if (!t) return;
  const r = e.querySelector(tn);
  if (r && r.getAttribute(Yt) !== "true" && (r.setAttribute(Yt, "true"), r.classList.add(rn), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function an(e, t) {
  const r = e.querySelector(At);
  if (!r) return;
  const n = !e.classList.contains(en);
  ks(e, t, r, n);
}
function ks(e, t, r, n) {
  e.classList.toggle(en, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function sn(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(tn);
  if (!t) return null;
  const r = kt(t);
  return r ? (on(r), t.classList.contains(rn) ? t : null) : null;
}
function kt(e) {
  const t = e.closest(Jr);
  return t && t.querySelector(At) ? t : null;
}
const Qt = `${c}-workflow-dice-toggle-styles`;
function Ts() {
  if (document.getElementById(Qt)) return;
  const e = document.createElement("style");
  e.id = Qt, e.textContent = `
.${u}__workflow-section .${u}__roll-detail-toggle,
.${u}__workflow-section .${u}__roll-detail-list {
  display: none !important;
}

.${u}__workflow-roll:not(.${u}__workflow-roll--dice-open) .${u}__workflow-dice-tray,
.${u}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${u}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${u}__workflow-roll-formula--toggle:hover,
.${u}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${u}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${u}__header .${u}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${u}__ritual-element-badge {
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

.${u}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${u}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${u}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${u}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${u}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${u}__header .${u}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${u}__roll-card > .${u}__ritual-metadata {
  display: none !important;
}

.${u}__ritual-metadata-chip {
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

.${u}__resistance {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px;
  grid-template-areas: "content button";
  align-items: center !important;
  column-gap: 0.62rem;
  row-gap: 0;
  padding: 0.56rem 0.58rem !important;
}

.${u}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${u}__resistance-content .${u}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${u}__resistance-content .${u}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${u}__resistance-content .${u}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${u}__resistance > .${u}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: center;
}

.${u}__resistance-content .${u}__resistance-roll-result {
  margin-top: 0;
}
`, document.head.append(e);
}
const ws = [0, 100, 500, 1500, 3e3];
let Xt = !1, Oe = null;
function $s() {
  if (!Xt) {
    Xt = !0, Ts(), Hooks.on("renderChatMessageHTML", (e, t) => {
      se(Wt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      se(Wt(t));
    }), Hooks.once("ready", () => {
      se(document), Cs();
    }), document.addEventListener("click", Rs), document.addEventListener("keydown", bs);
    for (const e of ws)
      globalThis.setTimeout(() => se(document), e);
  }
}
function Cs() {
  Oe || !document.body || (Oe = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && se(r);
  }), Oe.observe(document.body, { childList: !0, subtree: !0 }));
}
function se(e) {
  e && (xa(e), za(e), Ba(e), As(e));
}
function _s() {
  $s();
}
const ie = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, cn = {
  PV: "system.attributes.hp"
}, Ze = {
  PV: [ie.PV, cn.PV],
  SAN: [ie.SAN],
  PE: [ie.PE],
  PD: [ie.PD]
}, Je = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ss {
  getResource(t, r) {
    const n = Zt(t, r);
    if (!n.ok)
      return f(n.error);
    const o = n.value, a = `${o}.value`, s = `${o}.max`, i = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, s), g = er(t, r, a, i, "valor atual");
    if (g) return f(g);
    const A = er(t, r, s, d, "valor máximo");
    return A ? f(A) : h({
      value: i,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = Zt(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function Zt(e, t) {
  const r = Is(e.type, t);
  if (r && Jt(e, r))
    return h(r);
  const n = Ze[t].find(
    (o) => Jt(e, o)
  );
  return n ? h(n) : f({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Ps(e, t),
    path: Ze[t].join(" | ")
  });
}
function Is(e, t) {
  return e === "threat" ? cn[t] ?? null : e === "agent" ? ie[t] : null;
}
function Jt(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Ps(e, t) {
  const r = e.type ?? "unknown", n = Ze[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function er(e, t, r, n, o) {
  return n == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${o} de ${t} não encontrado: ${r}.`,
    path: r,
    value: n
  } : typeof n != "number" || !Number.isFinite(n) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${o} de ${t} em ${r}.`,
    path: r,
    value: n
  } : null;
}
class Es {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return f({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const r = this.readCircleFromKnownPaths(t);
    if (!r) {
      const s = Je.ritualItem.circleCandidates;
      return f({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: o } = r, a = Ls(o);
    return a ? h(a) : f({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of Je.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function Ls(e) {
  if (tr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (tr(r))
      return r;
  }
  return null;
}
function tr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ds = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Ns {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const r = this.ritualAdapter.getCircle(t.ritual);
    if (!r.ok)
      return f({
        ...r.error,
        actor: t.actor
      });
    const n = r.value, o = vs(t.ritual, n);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: Ds[n],
      source: "default-by-circle",
      circle: n
    }) : f(o.error);
  }
}
function vs(e, t) {
  const r = e.getFlag(c, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Os(r) ? {
    ok: !0,
    value: {
      resource: r.resource,
      amount: r.amount,
      source: "custom-flag",
      circle: t
    }
  } : {
    ok: !1,
    error: {
      reason: "invalid-custom-cost",
      message: `Custo customizado do ritual ${e.name ?? "sem nome"} é inválido.`,
      ritual: e,
      value: r
    }
  };
}
function Os(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Me = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ms(e) {
  if (!Hs(e.item)) return null;
  const t = et(e.actor) ? e.actor : Fs(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: xs(e.token) ?? Us(t),
    targets: yt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Fs(e) {
  const t = e;
  return et(t.actor) ? t.actor : et(e.parent) ? e.parent : null;
}
function Us(e) {
  const t = Bs(e) ?? js(e);
  return t ? ln(t) : null;
}
function xs(e) {
  return tt(e) ? ln(e) : null;
}
function Bs(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return tt(r) ? r : (t.getActiveTokens?.() ?? []).find(tt) ?? null;
}
function js(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function ln(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Fe(e.id),
    actorId: Fe(t?.id),
    sceneId: Fe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Hs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function et(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function tt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Fe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class qs {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Me.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, l.info(`${Me.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Ms(Vs(t));
    if (!r) {
      l.warn(`${Me.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Vs(e) {
  return e && typeof e == "object" ? e : {};
}
class Gs {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return Ue("missing-item-patch");
    if (t.type !== "ritual") return Ue("unsupported-item-type");
    const o = zs(n);
    return Object.keys(o).length === 0 ? Ue("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function zs(e) {
  const t = {};
  T(t, "name", e.name), T(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (T(t, "system.circle", r.circle), T(t, "system.element", r.element), T(t, "system.target", r.target), T(t, "system.targetQtd", r.targetQuantity), T(t, "system.execution", r.execution), T(t, "system.range", r.range), T(t, "system.duration", r.duration), T(t, "system.skillResis", r.resistanceSkill), T(t, "system.resistance", r.resistance), T(t, "system.studentForm", r.studentForm), T(t, "system.trueForm", r.trueForm)), t;
}
function T(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Ue(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Ws {
  constructor(t) {
    this.resourceAdapter = t;
  }
  resourceAdapter;
  getActorSnapshot(t) {
    const r = this.getResources(t);
    return {
      id: t.id ?? null,
      name: t.name ?? "Ator sem nome",
      type: t.type ?? "unknown",
      resources: r.values,
      resourceErrors: r.errors,
      ritualDT: this.getRitualDT(t)
    };
  }
  getRitualDT(t) {
    return this.getNumber(t, Je.ritual.dt, 0);
  }
  getResources(t) {
    const r = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, n = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const a = this.resourceAdapter.getResource(t, o);
      a.ok ? r[o] = a.value : n.push(a.error);
    }
    return { values: r, errors: n };
  }
  getNumber(t, r, n) {
    const o = foundry.utils.getProperty(t, r);
    return typeof o == "number" && Number.isFinite(o) ? o : n;
  }
}
class Ks {
  async applyPreset(t, r, n = {}) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: r.id,
        presetVersion: r.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n.definition ?? r.automation
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async applyManualDefinition(t, r, n = r.label) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: n,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async clear(t) {
    await t.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(t, r) {
    await this.clear(t), await t.setFlag(c, "automation", r);
  }
}
class Ys {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Qs(t);
    return r.ok ? this.presets.has(t.id) ? f({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, xe(t)), h(t)) : r;
  }
  registerMany(t) {
    const r = [];
    for (const n of t) {
      const o = this.register(n);
      if (!o.ok)
        return o;
      r.push(o.value);
    }
    return h(r);
  }
  get(t) {
    const r = this.presets.get(t);
    return r ? xe(r) : null;
  }
  require(t) {
    const r = this.get(t);
    return r ? h(r) : f({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(xe);
  }
  findForItem(t) {
    return this.list().map((r) => Xs(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Qs(e) {
  return !Be(e.id) || !Be(e.version) || !Be(e.label) ? f({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? f({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : h(e);
}
function Xs(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Zs(o, t);
    if (!a.matches)
      return null;
    n += a.score, r.push(a.reason);
  }
  return {
    preset: e,
    score: n,
    reasons: r
  };
}
function Zs(e, t) {
  switch (e.type) {
    case "itemType": {
      const r = e.itemTypes.includes(t.type);
      return {
        matches: r,
        score: r ? 10 : 0,
        reason: `itemType:${t.type}`
      };
    }
    case "normalizedName": {
      const r = rr(t.name), n = e.names.map(rr).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Js(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function rr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Js(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function xe(e) {
  return structuredClone(e);
}
function Be(e) {
  return typeof e == "string" && e.length > 0;
}
function be(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? f({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : h(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = Ie(e.amountFrom);
    if (!r)
      return f({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const n = t.rolls[r];
    if (!n)
      return f({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const o = Math.trunc(n.total);
    return !Number.isInteger(o) || o <= 0 ? f({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : h(o);
  }
  return f({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Ie(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const ei = "dice-so-nice";
async function un(e) {
  if (!Ca().enabled || !ti()) return;
  const t = ri();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      l.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function ti() {
  return game.modules.get(ei)?.active === !0;
}
function ri() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function ni(e, t, r) {
  if (!nr(e.id) || !nr(e.formula))
    return f({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const n = new Roll(e.formula), o = await Promise.resolve(n.evaluate()), a = o.total;
    if (typeof a != "number" || !Number.isFinite(a))
      return f({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await un(o);
    const i = {
      ...r.rollRequests[e.id] ?? dn(e, t),
      total: a,
      roll: o
    };
    return r.rolls[e.id] = i, h(i);
  } catch (n) {
    return f({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: n
    });
  }
}
function dn(e, t) {
  const r = e.intent ?? oi(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function oi(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function nr(e) {
  return typeof e == "string" && e.length > 0;
}
async function ke(e, t, r, n, o) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? ye(t, r, n, o) : e.spend(t, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? ye(t, r, n, o) : e.damage(t, r, o);
    case "heal":
      return r !== "PV" ? ye(t, r, n, o) : e.heal(t, r, o);
    case "recover":
      return r !== "SAN" ? ye(t, r, n, o) : e.recover(t, r, o);
  }
}
function ye(e, t, r, n) {
  return f({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: r,
    reason: "invalid-resource-operation",
    message: `Operação ${r} não é válida para ${t}.`,
    requestedAmount: n
  });
}
function ai(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = si(t, r, n, o);
    r.damageInstances.push(s), a.emit("afterDamageResolution", r, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: n,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), a.emit("afterApplyDamage", r, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: n,
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
    const s = ii(t, r, n, o);
    r.healingInstances.push(s), a.emit("afterApplyHealing", r, {
      stepIndex: o,
      step: t,
      healing: s,
      resourceTransaction: n,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function si(e, t, r, n) {
  const o = Ie(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: mn(t.id, "damage", n, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: o ?? void 0,
    damageType: a?.damageType,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function ii(e, t, r, n) {
  const o = Ie(e.amountFrom);
  return {
    id: mn(t.id, "healing", n, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: o ?? void 0,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function mn(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function ci(e, t, r) {
  const n = Ie(e.amountFrom), o = n ? t.rolls[n] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    amountFrom: e.amountFrom,
    rollId: n,
    rollIntent: o?.intent,
    damageType: o?.damageType
  };
}
function li(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), fn("before", e), or("before", e), or("resolve", e);
}
function di(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), fn("apply", e);
}
function mi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function fn(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t, i = fi(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function or(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function fi(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function pi(e, t, r) {
  try {
    return await e.createWorkflowSummaryMessage(r, t), h(void 0);
  } catch (n) {
    return f({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: n
    });
  }
}
async function gi(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return hi(e, t);
    case "spendRitualCost":
      return yi(e, t);
  }
}
async function hi(e, t) {
  const { context: r, resources: n } = e, o = be(t, r);
  return o.ok ? pn(await n.spend(r.sourceActor, t.resource, o.value), r) : f(o.error);
}
async function yi(e, t) {
  const { context: r, resources: n, ritualCosts: o } = e, a = o.getCost({
    actor: r.sourceActor,
    ritual: r.item
  });
  if (!a.ok)
    return f({
      reason: "ritual-cost-failed",
      message: a.error.message,
      cause: a.error
    });
  const s = a.value;
  return r.ritualCosts.push({
    ...s,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), pn(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function pn(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), f({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ai(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, s = Ri(t);
  for (const d of s.before)
    o.emit(d, r, { stepIndex: n, step: t });
  const i = await a();
  if (!i.ok)
    return i;
  for (const d of s.after)
    o.emit(d, r, { stepIndex: n, step: t });
  return i;
}
function Ri(e) {
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
class bi {
  constructor(t, r, n, o) {
    this.resources = t, this.ritualCosts = r, this.messages = n, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, r) {
    if (t.steps.length === 0)
      return f({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: r
      });
    for (const [n, o] of t.steps.entries()) {
      const a = await this.runStep(o, r, n);
      if (!a.ok)
        return a;
    }
    return h({ definition: t, context: r });
  }
  async runStep(t, r, n) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, r, n);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, r, n);
      default:
        return Ai({
          step: t,
          context: r,
          stepIndex: n,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, r, n)
        });
    }
  }
  async executeStep(t, r, n) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, r, n);
      case "rollFormula":
        return this.runRollFormulaStep(t, r, n);
      case "modifyResource":
        return this.runModifyResourceStep(t, r, n);
      case "chatCard":
        return this.runChatCardStep(t, r, n);
      default:
        return f({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: n,
          step: t,
          context: r
        });
    }
  }
  async runCostStep(t, r, n) {
    const o = await gi({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = dn(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: s }), h(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await ni(t, n, r);
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = be(t, r);
    if (!o.ok)
      return f({ ...o.error, stepIndex: n, step: t, context: r });
    const a = ci(t, r, o.value);
    li({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), di({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, r);
    if (s.length === 0)
      return f({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const i of s) {
      const d = await ke(this.resources, i, t.resource, t.operation, o.value), g = this.handleResourceOperationResult(d, r, n, t);
      if (!g.ok)
        return g;
      ai({
        step: t,
        context: r,
        transaction: g.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return mi({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), h(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const o = be(t, r);
    if (!o.ok)
      return f({ ...o.error, stepIndex: n, step: t, context: r });
    const a = this.resolveActors(t.actor, r);
    if (a.length === 0)
      return f({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const s of a) {
      const i = await ke(this.resources, s, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(i, r, n, t);
      if (!d.ok)
        return d;
    }
    return h(void 0);
  }
  async runChatCardStep(t, r, n) {
    const o = await pi(this.messages, t, r);
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  handleResourceOperationResult(t, r, n, o) {
    return t.ok ? (r.resourceTransactions.push(t.value), h(t.value)) : f({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: n,
      step: o,
      context: r,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, r, n, o, a, s) {
    const i = ki(t, r.intent);
    i && this.lifecycle.emit(i, n, {
      stepIndex: o,
      step: a,
      rollRequest: r,
      rollResult: s
    });
  }
  resolveActors(t, r) {
    switch (t) {
      case "self":
        return [r.sourceActor];
      case "target":
        return r.targets.flatMap((n) => n.actor ? [n.actor] : []);
    }
  }
}
function ki(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Ti {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, r, n) {
    return this.execute(t, r, "spend", n);
  }
  async damage(t, r, n) {
    return this.execute(t, r, "damage", n);
  }
  async heal(t, r, n) {
    return this.execute(t, r, "heal", n);
  }
  async recover(t, r, n) {
    return this.execute(t, r, "recover", n);
  }
  async execute(t, r, n, o) {
    if (!Number.isInteger(o) || o <= 0)
      return f({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: o
      });
    const a = this.adapter.getResource(t, r);
    if (!a.ok)
      return f({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: a.error.reason,
        message: a.error.message,
        requestedAmount: o,
        path: a.error.path,
        value: a.error.value
      });
    const s = a.value, i = this.calculate(n, s, o);
    if (!i.ok)
      return f({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: i.error.reason,
        message: i.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: d, appliedAmount: g } = i.value, A = {
      value: d,
      max: s.max
    };
    try {
      d !== s.value && await this.adapter.updateResourceValue(t, r, d);
    } catch (R) {
      return f({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: "update-failed",
        message: `Falha ao atualizar ${r} no ator.`,
        requestedAmount: o,
        current: s.value,
        required: o,
        cause: R
      });
    }
    return h({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: r,
      operation: n,
      requestedAmount: o,
      appliedAmount: g,
      before: s,
      after: A
    });
  }
  calculate(t, r, n) {
    switch (t) {
      case "spend":
        return r.value < n ? f({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${r.value}; custo: ${n}.`
        }) : h({
          afterValue: r.value - n,
          appliedAmount: n
        });
      case "damage": {
        const o = Math.max(0, r.value - n);
        return h({
          afterValue: o,
          appliedAmount: r.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(r.max, r.value + n);
        return h({
          afterValue: o,
          appliedAmount: o - r.value
        });
      }
    }
  }
}
function gn(e) {
  return {
    id: wi(),
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
function wi() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class $i {
  constructor(t, r) {
    this.automation = t, this.hooks = r;
  }
  automation;
  hooks;
  lastContext = null;
  getLastContext() {
    return this.lastContext;
  }
  getLastDebugSnapshot() {
    return W(this.lastContext);
  }
  async runAutomation(t, r) {
    const n = gn(r);
    this.lastContext = n, this.hooks.emit("created", n, {
      metadata: {
        definitionLabel: t.label,
        itemId: n.item.id ?? null,
        itemName: n.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", n), this.hooks.emit("resolveTargets", n, {
      metadata: {
        targetCount: n.targets.length
      }
    });
    const o = await this.automation.run(t, n);
    return o.ok ? (this.hooks.emit("completed", n), o) : (this.emitFailed(n, o.error), o);
  }
  emitFailed(t, r) {
    this.hooks.emit("failed", t, {
      stepIndex: r.stepIndex,
      step: r.step,
      metadata: {
        reason: r.reason,
        message: r.message
      }
    });
  }
}
class Ci {
  emit(t, r, n = {}) {
    const o = {
      phase: t,
      context: r,
      stepIndex: n.stepIndex,
      step: n.step,
      rollRequest: n.rollRequest,
      rollResult: n.rollResult,
      damage: n.damage,
      healing: n.healing,
      resourceTransaction: n.resourceTransaction,
      metadata: n.metadata
    };
    return r.phases.push(t), r.lifecycleEvents.push({
      phase: t,
      stepIndex: n.stepIndex,
      stepType: n.step?.type,
      rollId: n.rollRequest?.id ?? n.rollResult?.id,
      rollIntent: n.rollRequest?.intent ?? n.rollResult?.intent,
      damageId: n.damage?.id,
      healingId: n.healing?.id,
      resourceOperation: n.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${c}.workflow.${t}`, o), Hooks.callAll(`${c}.workflow.phase`, o), o;
  }
}
class _i {
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
    const r = Ye();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Si(),
      flags: {
        ...t.flags,
        [c]: {
          ...Ii(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && l.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = Ye();
    if (!n.enabled)
      return;
    const o = r.notification ?? ar(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = ar(r);
    switch (t) {
      case "info":
        l.info(n, r.data ?? "");
        return;
      case "warn":
        l.warn(n, r.data ?? "");
        return;
      case "error":
        l.error(n, r.data ?? "");
        return;
    }
  }
  emitUi(t, r) {
    switch (t) {
      case "info":
        ui.notifications?.info(`Paranormal Toolkit: ${r}`);
        return;
      case "warn":
        ui.notifications?.warn(`Paranormal Toolkit: ${r}`);
        return;
      case "error":
        ui.notifications?.error(`Paranormal Toolkit: ${r}`);
        return;
    }
  }
}
function ar(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Si() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Ii(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Pi = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", hn = `${c}-inline-roll-neutralized`, Ei = `${c}-inline-roll-notice`, Tt = `data-${c}-inline-roll-neutralized`, sr = `data-${c}-inline-roll-notice`, Li = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function ir(e) {
  const t = Gi(e.message), r = await Di(e.message), n = Ni(t);
  return r.replacementCount + n.replacementCount > 0 && l.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: n.replacementCount
  }), {
    messageId: t,
    contentUpdated: r.updated,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: n.replacementCount
  };
}
async function Di(e) {
  const t = Hi(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = vi(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await qi(t, r.content), replacementCount: r.replacementCount };
}
function Ni(e) {
  const t = e ? Vi(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = yn(t);
  return r > 0 && An(xi(t)), { replacementCount: r };
}
function vi(e) {
  const t = Oi(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = yn(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (An(r.content), { content: r.innerHTML, replacementCount: o });
}
function Oi(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, Fi(o.trim()))), replacementCount: t };
}
function yn(e) {
  const t = Mi(e);
  for (const r of t)
    r.replaceWith(Ui(Bi(r)));
  return t.length;
}
function Mi(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(Pi))
    r.getAttribute(Tt) !== "true" && t.add(r);
  return Array.from(t);
}
function Fi(e) {
  return `<span class="${hn}" ${Tt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${zi(e)}</span>`;
}
function Ui(e) {
  const t = document.createElement("span");
  return t.classList.add(hn), t.setAttribute(Tt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function An(e) {
  if (e.querySelector?.(`[${sr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Ei), t.setAttribute(sr, "true"), t.textContent = Li, e.append(t);
}
function xi(e) {
  return e.querySelector(".message-content") ?? e;
}
function Bi(e) {
  const r = e.getAttribute("data-formula") ?? ji(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function ji(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Hi(e) {
  return e && typeof e == "object" ? e : null;
}
async function qi(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return l.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function Vi(e) {
  const t = Wi(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Gi(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function zi(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Wi(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const cr = "occultism";
function Ki(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Yi(e) {
  const t = Ki(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await Qi(e, cr);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await un(r);
  const n = Ji(r);
  return {
    skill: cr,
    skillLabel: "Ocultismo",
    roll: r,
    formula: Zi(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: ec(r)
  };
}
async function Qi(e, t) {
  const r = e;
  if (typeof r.rollSkill != "function")
    return null;
  const n = await Promise.resolve(
    r.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return Xi(n);
}
function Xi(e) {
  return lr(e) ? e : Array.isArray(e) ? e.find(lr) ?? null : null;
}
function lr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Zi(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Ji(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function ec(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(tc);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function tc(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function rc(e) {
  return {
    header: {
      eyebrow: dt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: ic(e.ritual)
    },
    forms: e.variantOptions.map((t) => nc(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: sc(e.automationStatus ?? "assisted")
  };
}
function nc(e, t) {
  const r = oc(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? ac(t) : "—",
    details: r
  };
}
function oc(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function ac(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function sc(e) {
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
function ic(e) {
  const t = e.system, r = [lc(t?.element), cc(t?.circle)].filter(uc);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function cc(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function lc(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function uc(e) {
  return typeof e == "string" && e.length > 0;
}
const Rn = ["base", "discente", "verdadeiro"];
function bn(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function dc(e) {
  return typeof e == "string" && Rn.includes(e);
}
const { ApplicationV2: mc } = foundry.applications.api;
class ce extends mc {
  constructor(t, r) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r, this.model = rc(t);
  }
  input;
  resolveRequest;
  model;
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
      cast: ce.onCast,
      cancel: ce.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new ce(t, r).render({ force: !0 });
    });
  }
  async _renderHTML(t, r) {
    const n = document.createElement("div");
    return n.className = "paranormal-toolkit-ritual-cast", n.innerHTML = this.renderContent(), n;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t), pc(r);
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${w(this.model.header.eyebrow)}</p>
        <div>
          <h2>${w(this.model.header.title)}</h2>
          <p>${w(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(fc).join("")}
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
          <div><dt>Custo base</dt><dd>${w(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${w(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${w(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${w(this.model.automation.title)}</strong></p>
        <p>${w(this.model.automation.description)}</p>
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
    const r = yc(t), n = gc(r, this.input.defaultSpendResource);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function fc(e) {
  const t = e.checked ? "checked" : "", r = e.enabled ? "" : "disabled", n = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${w(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${n}"
      data-paranormal-toolkit-ritual-cast-form="${w(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${w(e.variant)}" ${t} ${r}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${w(e.label)}</strong>
        <em>${w(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function pc(e) {
  const t = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const r of t)
    r.addEventListener("click", () => ur(e, r)), r.addEventListener("keydown", (n) => {
      n.key !== "Enter" && n.key !== " " || (n.preventDefault(), ur(e, r));
    });
  kn(e);
}
function ur(e, t) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || (r.checked = !0, r.dispatchEvent(new Event("change", { bubbles: !0 })), kn(e));
}
function kn(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  for (const r of t) {
    const n = r.querySelector('input[name="variant"]');
    r.setAttribute("aria-checked", n?.checked ? "true" : "false");
  }
}
function gc(e, t) {
  const r = hc(e), n = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: n
  };
}
function hc(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return dc(t) ? t : "base";
}
function yc(e) {
  return (e.currentTarget instanceof HTMLElement ? e.currentTarget : null)?.closest(".paranormal-toolkit-ritual-cast") ?? null;
}
function w(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Ac(e) {
  return ce.request(e);
}
const wt = {
  label: "Padrão"
}, Rc = {
  label: "Discente",
  extraCost: 2
}, bc = {
  label: "Verdadeiro",
  extraCost: 5
};
class kc {
  constructor(t, r, n) {
    this.workflow = t, this.resources = r, this.ritualCosts = n;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, r) {
    return t.item.type === "ritual" || r.steps.some((n) => n.type === "spendRitualCost");
  }
  async run(t, r) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const n = this.resolveCostPreview(t), o = Qc(r), a = Wc(r, t.item, n, o), s = await Ac({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((C) => C.name),
      cost: n,
      defaultSpendResource: tl(r),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const i = Xc(r, t.item, s.variant, o), d = zr();
    let g = null;
    if (d) {
      const C = await wc(this.resources, t.actor, s, i, n);
      if (!C.ok)
        return {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      try {
        g = await Yi(t.actor);
      } catch (S) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: S instanceof Error ? S.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: S
        };
      }
      if (!g.success) {
        const S = mr(t, s);
        return {
          status: "completed-without-actions",
          workflowContext: S,
          summaryLines: je(r, s, i, n, S, g, {
            effectStopped: !0
          })
        };
      }
    }
    const A = Tc(r, s, i, n, {
      includeCostSteps: !d
    });
    if (A.steps.length === 0) {
      const C = mr(t, s);
      return {
        status: "completed-without-actions",
        workflowContext: C,
        summaryLines: je(r, s, i, n, C, g)
      };
    }
    const R = await this.workflow.runAutomation(A, {
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
          variant: s.variant,
          spendResource: s.spendResource
        }
      }
    });
    if (!R.ok)
      return {
        status: "failed",
        reason: R.error.reason,
        message: R.error.message,
        cause: R.error
      };
    const k = R.value.context, b = Cc(r, t, k), m = je(r, s, i, n, k, g);
    return b.ok ? b.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: k,
      summaryLines: m
    } : {
      status: "ready",
      workflowContext: k,
      actions: b.actions,
      summaryLines: m
    } : {
      status: "failed",
      reason: b.reason,
      message: b.message
    };
  }
  async applyAction(t) {
    return ke(this.resources, t.actor, t.resource, t.operation, t.amount);
  }
  resolveCostPreview(t) {
    if (!t.actor) return null;
    const r = this.ritualCosts.getCost({
      actor: t.actor,
      ritual: t.item
    });
    return r.ok ? r.value : null;
  }
}
function Tc(e, t, r, n, o) {
  const a = [];
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || $t(s) && (!o.includeCostSteps || !t.spendResource) || a.push($c(s, r));
  return o.includeCostSteps && t.spendResource && n && rl(r.extraCost) && a.push({
    type: "spendResource",
    actor: "self",
    resource: n.resource,
    amount: r.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: a
  };
}
async function wc(e, t, r, n, o) {
  if (!r.spendResource) return { ok: !0 };
  const a = Pe(o, n);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const s = await e.spend(t, a.resource, a.amount);
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function $c(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Cc(e, t, r) {
  const n = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = be(o, r);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const s = vc(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(..._c(e, o, i, a.value));
  }
  return { ok: !0, actions: n };
}
function _c(e, t, r, n) {
  if (!Ec(e, t))
    return [dr(t, r, n)];
  const o = Nc();
  return Tn(e).map((a) => {
    const s = Lc(n, a);
    return dr(t, r, s, {
      option: a,
      choiceGroupId: o
    });
  });
}
function dr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = Pc(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: Sc(e, o, r, n?.option),
    executedLabel: Ic(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Sc(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function Ic(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Pc(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Ec(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Tn(e).length > 1;
}
function Tn(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Lc(e, t) {
  const r = e * t.multiplier, n = Dc(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function Dc(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Nc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function vc(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function je(e, t, r, n, o, a = null, s = {}) {
  const i = s.effectStopped === !0;
  return [
    `Forma: ${bn(t.variant)}`,
    Mc(t, r, n),
    ...Oc(a),
    ...i ? [] : Object.values(o.rolls).flatMap(Fc),
    ...i ? [] : Uc(e.resistance),
    ...Gc(r),
    ...i ? ["Observação: O efeito do ritual não foi resolvido porque a conjuração falhou."] : []
  ];
}
function Oc(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Mc(e, t, r) {
  const n = Pe(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Fc(e) {
  const r = [`${zc(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = xc(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Vc(e.damageType)}`), r;
}
function Uc(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function xc(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const r = [];
  let n = "+";
  for (const o of t) {
    if (!o || typeof o != "object") continue;
    const a = o;
    if (a.operator === "+" || a.operator === "-") {
      n = a.operator;
      continue;
    }
    const s = Bc(a);
    s && (qc(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Bc(e) {
  const t = jc(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Hc(e);
}
function jc(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Hc(e) {
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
function qc(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Vc(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Gc(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function zc(e) {
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
function Wc(e, t, r, n) {
  return Rn.map((o) => {
    const a = wn(e, t, o, n), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? bn(o),
      enabled: s,
      details: a ? Kc(a, r, n) : [],
      finalCostText: a ? Yc(r, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Kc(e, t, r) {
  const n = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? n.push(o.join(", ")) : r && n.push("efeito manual");
  const a = Pe(t, e);
  return n.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), n;
}
function Pe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Yc(e, t) {
  const r = Pe(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function Qc(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every($t);
}
function mr(e, t) {
  return gn({
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
function Xc(e, t, r, n) {
  return wn(e, t, r, n) ?? wt;
}
function wn(e, t, r, n) {
  const o = e.ritualForms?.[r] ?? null;
  return o || (n ? Jc(t, r) ? Zc(r) : null : r === "base" ? wt : null);
}
function Zc(e) {
  switch (e) {
    case "base":
      return wt;
    case "discente":
      return Rc;
    case "verdadeiro":
      return bc;
  }
}
function Jc(e, t) {
  if (t === "base") return !0;
  const r = t === "discente" ? "system.studentForm" : "system.trueForm";
  return el(foundry.utils.getProperty(e, r));
}
function el(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function tl(e) {
  return e.steps.some($t);
}
function $t(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function rl(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function nl(e, t) {
  const r = await ol(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: sl(r),
    total: il(r),
    diceBreakdown: cl(r)
  };
}
function $n(e) {
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
async function ol(e, t) {
  const r = e;
  if (typeof r.rollSkill != "function")
    return null;
  const n = await Promise.resolve(
    r.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return al(n);
}
function al(e) {
  return fr(e) ? e : Array.isArray(e) ? e.find(fr) ?? null : null;
}
function fr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function sl(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function il(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function cl(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(ll);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function ll(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Cn = "itemUsePrompts", _n = "chatCard", Ee = "data-paranormal-toolkit-prompt-id", Le = "data-paranormal-toolkit-pending-id", Ct = "data-paranormal-toolkit-executed-label", rt = "data-paranormal-toolkit-choice-group", Sn = "data-paranormal-toolkit-skipped-label", pr = "data-paranormal-toolkit-action-section", gr = "data-paranormal-toolkit-detail-key", hr = "data-paranormal-toolkit-roll-card", _t = "data-paranormal-toolkit-roll-detail-toggle", In = "data-paranormal-toolkit-roll-detail-id", Pn = "data-paranormal-toolkit-resistance-roll-button", En = "data-paranormal-toolkit-resistance-skill", Ln = "data-paranormal-toolkit-resistance-skill-label", Dn = "data-paranormal-toolkit-resistance-target-actor-id", Nn = "data-paranormal-toolkit-resistance-target-name", vn = "data-paranormal-toolkit-resistance-roll-result", yr = "data-paranormal-toolkit-system-card-replaced", ul = `[${Le}]`, dl = `[${_t}]`, ml = `[${Pn}]`, nt = `${c}-chat-enrichment`, p = `${c}-item-use-prompt`, fl = `${p}__actions`, Ar = `${p}__details`, On = `${p}__summary`, pl = `${p}__title`, Mn = `${p}__button--executed`, Rr = `${p}__roll-card`;
let br = !1, ot = null;
const E = /* @__PURE__ */ new Map(), gl = [0, 100, 500, 1500, 3e3], hl = 3e4, yl = [0, 100, 500, 1500, 3e3];
function Al(e) {
  if (ot = e, br) {
    Tr(e);
    return;
  }
  const t = (r, n) => {
    Un(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), br = !0, Tr(e);
}
async function kr(e) {
  const t = Fn(e);
  E.set(e.pendingId, t), await Pt(t) || Kn(t), xn(e.pendingId);
}
async function Rl(e) {
  const t = Fn({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", E.set(e.pendingId, t), await Pt(t) || Kn(t), xn(e.pendingId);
}
async function He(e, t) {
  const r = E.get(e);
  E.delete(e), r && await Au(r, t);
}
function St(e) {
  const t = eo();
  for (const r of t) {
    const n = F(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function bl(e, t) {
  const r = St(e);
  if (!r) return;
  const n = F(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await re(r.message, n));
}
async function kl(e, t, r) {
  if (!t) return;
  const n = St(e);
  if (!n) return;
  const o = F(n.message);
  let a = !1;
  for (const [s, i] of Object.entries(o))
    s !== e && i.choiceGroupId === t && (o[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await re(n.message, o);
}
function Fn(e) {
  const t = B(e.context.message), r = e.context.targets.find((s) => ct(s)), n = r ? ct(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Wl(e.context),
    executed: !1
  };
}
function Un(e, t, r) {
  yu();
  const n = Ne(t);
  if (!n) return;
  const o = pu(e, n);
  o.length > 0 && Te(n);
  for (const a of o)
    at(n, a);
  Hn(n, r), st(n), it(n);
}
function Tr(e) {
  for (const t of yl)
    globalThis.setTimeout(() => {
      Tl(e);
    }, t);
}
function Tl(e) {
  for (const t of wl()) {
    const r = De(t);
    $l(r) && Un(r, t, e);
  }
}
function wl() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function $l(e) {
  return e ? Et(e) ? !0 : bu(e).length > 0 : !1;
}
function xn(e) {
  const t = E.get(e);
  if (!t) return;
  const r = t.messageId ? gu(t.messageId) : null;
  if (r) {
    Sr(r, t), Te(r), at(r, t), wr(r), st(r), it(r);
    return;
  }
  if (t.messageId) {
    ut(t);
    return;
  }
  const n = hu(t);
  if (n) {
    Sr(n, t), Te(n), at(n, t), wr(n), st(n), it(n);
    return;
  }
  ut(t);
}
function wr(e) {
  ot && Hn(e, ot);
}
function Te(e) {
  const t = Cl();
  e.classList.toggle(`${p}--system-card-replaced`, t);
  const r = jn(e);
  if (!r || (r.classList.toggle(`${p}__host--system-card-replaced`, t), !t) || r.getAttribute(yr) === "true") return;
  const n = r.querySelector(`.${nt}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(yr, "true");
}
function Cl() {
  try {
    return ra() === "replace";
  } catch {
    return !1;
  }
}
function at(e, t) {
  if (Te(e), e.querySelector(`[${Ee}="${ne(t.pendingId)}"]`)) return;
  const r = _l(e, t);
  Il(r, t), Hl(r, ql(t)).append(zl(t));
}
function _l(e, t) {
  const r = e.querySelector(`.${nt}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(nt, p);
  const o = document.createElement("header");
  o.classList.add(`${p}__header`);
  const a = document.createElement("span");
  a.classList.add(`${p}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(pl), s.textContent = Sl(t);
  const i = document.createElement("span");
  return i.classList.add(On), i.textContent = t.summary, o.append(a, s, i), n.append(o), Yl(e).append(n), n;
}
function Sl(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Il(e, t) {
  const r = t.summaryLines ?? [], n = zn(r, t);
  if (n) {
    Pl(e, n, t);
    return;
  }
  Vl(e, r);
}
function Pl(e, t, r) {
  if (e.querySelector(`[${hr}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(Rr, `${Rr}--${t.intent}`), n.setAttribute(hr, "true"), t.castingCheck && $r(n, Ll(t.castingCheck), r.pendingId, "casting"), El(t) && $r(n, Dl(t), r.pendingId, "effect"), Fl(n, t), Ul(n, t, r), jl(n, t), e.append(n);
}
function El(e) {
  return e.intent !== "casting";
}
function Ll(e) {
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
function Dl(e) {
  const t = e.intent === "healing" ? "Cura" : e.intent === "damage" ? "Dano" : e.label, r = e.damageType ? `${e.damageType}` : null;
  return {
    kind: "effect",
    title: t,
    label: e.label,
    formula: e.formula,
    total: e.total,
    diceBreakdown: e.diceBreakdown,
    description: r,
    detailRows: [
      { label: "Fórmula", value: e.formula },
      ...e.diceBreakdown ? [{ label: "Dados", value: e.diceBreakdown }] : [],
      ...e.damageType ? [{ label: "Tipo", value: e.damageType }] : []
    ]
  };
}
function $r(e, t, r, n) {
  const o = document.createElement("section");
  o.classList.add(
    `${p}__workflow-section`,
    `${p}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${p}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${p}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, a.append(s), t.statusLabel) {
    const i = document.createElement("span");
    i.classList.add(`${p}__workflow-section-status`), i.textContent = t.statusLabel, a.append(i);
  }
  if (o.append(a), t.description) {
    const i = document.createElement("span");
    i.classList.add(`${p}__workflow-section-description`), i.textContent = t.description, o.append(i);
  }
  Nl(o, t), Bl(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Nl(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${p}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${p}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = vl(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function vl(e, t) {
  const r = Ol(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${p}__workflow-dice-tray`);
  for (const o of Ml(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${p}__workflow-die`), o.active || a.classList.add(`${p}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function Ol(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function Ml(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? Cr(e, "highest") : r.includes("kl") ? Cr(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function Cr(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function Fl(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Uu);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${p}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function Ul(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${p}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = xl(t, r);
  o.append(a), s && o.append(s);
  const i = document.createElement("span");
  i.classList.add(`${p}__resistance-description`), i.textContent = t.resistance, n.append(o, i), t.resistanceRollResult && n.append(Bn(t.resistanceRollResult)), e.append(n);
}
function xl(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${p}__resistance-roll-button`), r.setAttribute(Ee, t.pendingId), r.setAttribute(Pn, "true"), r.setAttribute(En, e.resistanceSkill), r.setAttribute(Ln, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(Dn, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Nn, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${p}__resistance-roll-button--rolled`), r.setAttribute(vn, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${p}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function Bn(e) {
  const t = document.createElement("span");
  return t.classList.add(`${p}__resistance-roll-result`), t.textContent = Vn(e), t;
}
function Bl(e, t, r, n, o) {
  const a = t.filter((g) => g.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${p}__roll-detail-toggle`), i.setAttribute(_t, s), i.setAttribute("aria-expanded", "false"), i.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${p}__roll-detail-list`), d.setAttribute(In, s), d.hidden = !0;
  for (const g of a) {
    const A = document.createElement("dt");
    A.textContent = g.label;
    const R = document.createElement("dd");
    R.textContent = g.value, d.append(A, R);
  }
  e.append(i, d);
}
function jl(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function Hl(e, t) {
  const r = `[${pr}="${ne(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(fl), o.setAttribute(pr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${p}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function ql(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = zn(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Vl(e, t) {
  if (t.length === 0) return;
  const r = Gl(e);
  for (const n of t) {
    const o = xu(n);
    if (r.querySelector(`[${gr}="${ne(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(gr, o), r.append(a);
  }
}
function Gl(e) {
  const t = e.querySelector(`.${Ar}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(Ar), e.append(r), r;
}
function zl(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${p}__button`), t.setAttribute(Ee, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Mn), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Le, e.pendingId), t.setAttribute(Ct, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(rt, e.choiceGroupId), t.setAttribute(Sn, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Wl(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = Kl(e);
  return `${t} → ${r}`;
}
function Kl(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Yl(e) {
  return jn(e) ?? e;
}
function jn(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Hn(e, t) {
  const r = Ne(e);
  if (!r) return;
  const n = r.querySelectorAll(ul);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      lu(o, t);
    }));
}
function st(e) {
  const t = Ne(e);
  if (!t) return;
  const r = t.querySelectorAll(dl);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      Ql(t, n);
    }));
}
function it(e) {
  const t = Ne(e);
  if (!t) return;
  const r = t.querySelectorAll(ml);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      Xl(t, n);
    }));
}
function Ql(e, t) {
  const r = t.getAttribute(_t);
  if (!r) return;
  const n = e.querySelector(`[${In}="${ne(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Xl(e, t) {
  const r = t.getAttribute(Ee), n = t.getAttribute(En), o = t.getAttribute(Ln) ?? (n ? $n(n) : "Resistência");
  if (!r || !n) return;
  const a = eu(e, r), s = tu(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await nl(s, n);
    await su(d.roll);
    const g = {
      skill: n,
      skillLabel: o,
      formula: d.formula,
      total: d.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: d.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Zl(t, g), Jl(t, g), iu(r, g), await cu(e, r, g);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function Zl(e, t) {
  e.classList.add(`${p}__resistance-roll-button--rolled`), e.setAttribute(vn, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Jl(e, t) {
  const r = e.closest(`.${p}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${p}__resistance-roll-result`), o = n ?? Bn(t);
  if (n) {
    n.textContent = Vn(t);
    return;
  }
  r.append(o);
}
function eu(e, t) {
  const r = E.get(t);
  if (r) return r;
  const n = De(e);
  return F(n)[t] ?? null;
}
function tu(e, t) {
  const r = e?.resistanceTargetActor;
  if (v(r)) return r;
  const o = e?.context?.targets.map(ct).find(v) ?? null;
  if (o) return o;
  const a = t.getAttribute(Dn) ?? e?.resistanceTargetActorId ?? null, s = a ? nu(a) : null;
  return s || ou(
    t.getAttribute(Nn) ?? e?.resistanceTargetName ?? ru(t)
  );
}
function ru(e) {
  const r = e.closest(`.${p}`)?.querySelector(`.${On}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function ct(e) {
  const t = e.actor;
  if (v(t)) return t;
  const r = e.token, n = ue(r);
  if (n) return n;
  const o = e.document;
  return ue(o);
}
function ue(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (v(t)) return t;
  const r = e.document?.actor;
  return v(r) ? r : null;
}
function nu(e) {
  const r = game.actors?.get?.(e);
  return v(r) ? r : qn().map((a) => ue(a)).find((a) => a?.id === e) ?? null;
}
function ou(e) {
  const t = Z(e);
  if (!t) return null;
  const r = qn().filter((a) => Z(au(a)) === t).map((a) => ue(a)).find(v) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => v(a) && Z(a.name) === t);
  return v(o) ? o : null;
}
function qn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function au(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : ue(e)?.name ?? null;
}
function Z(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function v(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Vn(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function su(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function iu(e, t) {
  const r = E.get(e);
  r && (r.resistanceRollResult = t);
}
async function cu(e, t, r) {
  const n = De(e);
  if (n)
    try {
      const o = F(n), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: r
      }, await re(n, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function De(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return M(n?.get?.(r));
}
async function lu(e, t) {
  const r = e.getAttribute(Le);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    Gn(e, e.getAttribute(Ct) ?? "✓ Automação aplicada"), uu(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function Gn(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Mn), e.removeAttribute(Le), e.removeAttribute(Ct);
}
function uu(e) {
  const t = e.getAttribute(rt);
  if (!t) return;
  const r = e.closest(`.${p}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${rt}="${ne(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(Sn) ?? "✓ Outra opção escolhida";
    Gn(o, a);
  }
}
function zn(e, t) {
  const r = e.map(It).filter(Mu), n = r.find((m) => m.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), s = $(e, "Dados") ?? $(e, `Dados (${n.label})`), i = $(e, "Tipo"), d = $(e, "Resistência"), g = $(e, "Resistência Perícia"), A = $(e, "Resistência Rótulo") ?? (g ? $n(g) : null), R = Wn(e, "Observação"), k = e.filter((m) => fu(m, n)), b = du(e);
  return {
    ...n,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: i,
    resistance: d,
    resistanceSkill: g,
    resistanceSkillLabel: A,
    notes: R,
    details: k,
    castingCheck: b,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function du(e) {
  const t = e.map(It).find((a) => a?.intent === "casting") ?? null, r = $(e, "Conjuração DT"), n = $(e, "Conjuração Resultado");
  if (!t || !r || !n) return null;
  const o = Number(r);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: $(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: n.toLowerCase() === "sucesso",
    diceBreakdown: $(e, "Dados (Conjuração)")
  } : null;
}
function It(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: r,
    formula: n,
    total: a,
    intent: mu(r)
  } : null;
}
function mu(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return Wn(e, t)[0] ?? null;
}
function Wn(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function fu(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || It(e) ? !1 : e.trim().length > 0;
}
function pu(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of E.values())
    lt(n, e, t) && r.set(n.pendingId, n);
  for (const n of Ru(e))
    lt(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function lt(e, t, r) {
  const n = B(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !_r(r, "itemId", e.itemId) ? !1 : !e.actorId || _r(r, "actorId", e.actorId);
}
function _r(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${Bu(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function gu(e) {
  const t = ne(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function hu(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (lt(e, null, t))
      return t;
  return null;
}
function yu() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of E.entries())
    e - n.createdAt > t && E.delete(r);
}
async function Sr(e, t) {
  const r = De(e);
  if (!r) return !1;
  try {
    const n = F(r);
    return n[t.pendingId] = Lt(t, B(r)), await re(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function Pt(e) {
  const t = Xn(e);
  if (!t) return !1;
  try {
    const r = F(t);
    return r[e.pendingId] = Lt(e, B(t)), await re(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function Kn(e) {
  for (const t of gl)
    globalThis.setTimeout(() => {
      ut(e);
    }, t);
}
async function ut(e) {
  const t = Xn(e);
  if (Et(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await Pt(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function Au(e, t) {
  const r = Qn(e.context.message);
  if (r)
    try {
      const n = F(r), o = n[e.pendingId] ?? Lt(e, B(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await re(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function Ru(e) {
  return Object.values(F(M(e))).filter(fe);
}
function F(e) {
  if (!e) return {};
  const t = {}, r = Et(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(Yn(e)))
    t[n] ??= o;
  return t;
}
function bu(e) {
  return Object.values(Yn(M(e))).filter(fe);
}
function Yn(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Cn);
  if (!J(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    fe(o) && (r[n] = o);
  return r;
}
async function re(e, t) {
  typeof e.setFlag == "function" && (await Tu(e, t), await ku(e, t));
}
async function ku(e, t) {
  await Promise.resolve(e.setFlag?.(c, Cn, t));
}
function Et(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, _n);
  return vu(t) ? t : null;
}
async function Tu(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(fe).sort((a, s) => a.createdAt - s.createdAt);
  if (r.length === 0) return;
  const n = r[0];
  if (!n) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...r.map((a) => a.createdAt)),
    messageId: n.messageId ?? B(e) ?? null,
    source: {
      actorId: n.actorId,
      actorName: wu(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(c, _n, o));
}
function wu(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function Lt(e, t) {
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
function Qn(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const r = $u(e);
  if (r?.setFlag)
    return r;
  const n = B(e);
  if (!n) return null;
  const o = game.messages;
  return M(o?.get?.(n));
}
function $u(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(M).find((r) => typeof r?.setFlag == "function") ?? null;
}
function Xn(e) {
  const t = Qn(e.context.message);
  if (t) return t;
  const r = e.messageId ? Cu(e.messageId) : null;
  if (r) return r;
  const n = eo().slice().reverse();
  return n.find((o) => _u(o, e)) ?? n.find((o) => Su(o, e)) ?? null;
}
function Cu(e) {
  const t = game.messages;
  return M(t?.get?.(e));
}
function _u(e, t) {
  const r = B(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!Zn(e, t)) return !1;
  const o = Jn(e);
  return !t.actorId || !o || o === t.actorId;
}
function Su(e, t) {
  if (!Pu(e, t)) return !1;
  const r = Jn(e);
  return t.actorId && r === t.actorId ? !0 : Zn(e, t);
}
function Zn(e, t) {
  const r = Z(Iu(e));
  if (!r) return !1;
  const n = Z(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = Z(t.itemId);
  return !!(o && r.includes(o));
}
function Iu(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Jn(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Pu(e, t) {
  const r = Eu(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= hl;
}
function Eu(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function fe(e) {
  return J(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && _(e.messageId) && _(e.itemId) && _(e.actorId) && _(e.itemName) && G(e.resistanceTargetActorId) && G(e.resistanceTargetName) && Ou(e.resistanceRollResult) && Lu(e.actionPayload) && qe(e.title) && qe(e.buttonLabel) && qe(e.executedLabel) && G(e.choiceGroupId) && G(e.skippedLabel) && G(e.actionSectionId) && G(e.actionSectionTitle) && Fu(e.summaryLines) : !1;
}
function Lu(e) {
  return e == null ? !0 : J(e) ? e.kind === "resource-operation" && _(e.actorId) && _(e.actorUuid) && typeof e.actorName == "string" && Du(e.resource) && Nu(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Du(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Nu(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function vu(e) {
  return J(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && _(e.messageId) && J(e.source) && _(e.source.actorId) && _(e.source.actorName) && _(e.source.itemId) && _(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(fe) : !1;
}
function Ou(e) {
  return e == null ? !0 : J(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && G(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Mu(e) {
  return e !== null;
}
function J(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _(e) {
  return e === null || typeof e == "string";
}
function qe(e) {
  return e === void 0 || typeof e == "string";
}
function G(e) {
  return e == null || typeof e == "string";
}
function Fu(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Uu(e) {
  return typeof e == "string" && e.length > 0;
}
function eo() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(M).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(M).filter((n) => n !== null) : [];
}
function Ne(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function B(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function xu(e) {
  return e.trim().toLowerCase();
}
function Bu(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ne(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ir = 1e3;
class ju {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new kc(t, r, n);
  }
  workflow;
  resources;
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
      settings: xt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = xt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = mt(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && Hu(t.item) && r.executionMode === "ask") {
        await this.handleGenericRitual(t);
        return;
      }
      const o = n.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, o, n.error.reason), n.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: n.error.message,
        data: n.error
      });
      return;
    }
    if (await ir(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ge(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), r.executionMode) {
      case "ask":
        await this.handleAskMode(t, n.value);
        return;
      case "automatic":
        await this.executeAutomation(t, n.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const r = this.pendingExecutions.get(t);
    if (!r)
      return this.executePersistedPendingAutomation(t);
    if (r.kind === "workflow")
      return this.pendingExecutions.delete(t), await He(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await He(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = St(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = Gu(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await ke(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await bl(t), await kl(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Al((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await ir(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ge(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, qu(t.item));
  }
  async handleAssistedRitual(t, r) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const n = await this.ritualAssistant.run(t, r);
    switch (n.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", n.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: n.message,
          data: n.cause ?? n
        }), ui.notifications?.warn(`Paranormal Toolkit: ${n.message}`);
        return;
      case "completed-without-actions":
        await this.registerCompletedRitualCard(t, n.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), l.info("Ritual assistido concluído sem ações pendentes.", W(n.workflowContext));
        return;
      case "ready":
        await this.registerAssistedResourceActions(t, n.workflowContext, n.actions, n.summaryLines);
        return;
    }
  }
  async resolveAlternativeResourceActions(t) {
    const r = t.action.choiceGroupId;
    if (!r) return;
    const n = Array.from(this.pendingExecutions.entries()).filter(([, o]) => o.kind === "resource-action" && o.action.choiceGroupId === r);
    for (const [o, a] of n)
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await He(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = ze();
    await Rl({
      pendingId: n,
      context: t,
      mode: "ask",
      title: "Paranormal Toolkit · Ritual",
      buttonLabel: "Ritual conjurado",
      executedLabel: "✓ Ritual conjurado",
      actionSectionId: "ritual-log",
      actionSectionTitle: "Registro",
      summaryLines: r
    });
  }
  async registerAssistedResourceActions(t, r, n, o) {
    let a;
    for (const s of n) {
      const i = ze();
      a ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await kr({
        pendingId: i,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: s.choiceGroupId ?? null,
        skippedLabel: s.choiceGroupResolvedLabel ?? null,
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: Vu(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), l.info("Ritual assistido preparado com ações pendentes.", W(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = ze();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await kr({
      pendingId: n,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", n);
  }
  async executeAutomation(t, r, n) {
    this.setAttempt(t, "running");
    const o = await this.workflow.runAutomation(r, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: n
        }
      }
    });
    if (!o.ok) {
      this.setAttempt(t, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(t, "completed"), l.info("Automação executada por uso normal de item.", W(o.value.context));
  }
  handleAutomationFailure(t) {
    const r = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      l.warn(r, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      l.error(r, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    l.warn(r, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    l.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const r = Date.now(), n = Pr(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      r - s > Ir && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= Ir;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Pr(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = Ge(t, r, n, o);
  }
}
function Hu(e) {
  return e.type === "ritual";
}
function qu(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Vu(e) {
  return {
    kind: "resource-operation",
    actorId: e.actor.id ?? null,
    actorUuid: e.actor.uuid ?? null,
    actorName: e.actorName,
    resource: e.resource,
    operation: e.operation,
    amount: e.amount
  };
}
function Gu(e) {
  const t = e.actorUuid ? zu(e.actorUuid) : null;
  if (ee(t)) return t;
  const r = e.actorId ? Wu(e.actorId) : null;
  return r || Ku(e.actorName);
}
function zu(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Wu(e) {
  const r = game.actors?.get?.(e);
  if (ee(r)) return r;
  for (const n of to()) {
    const o = Dt(n);
    if (o?.id === e) return o;
  }
  return null;
}
function Ku(e) {
  const t = Ve(e);
  if (!t) return null;
  for (const o of to()) {
    const a = Yu(o);
    if (Ve(a) === t) {
      const s = Dt(o);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((o) => ee(o) && Ve(o.name) === t);
  return ee(n) ? n : null;
}
function to() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Yu(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : Dt(e)?.name ?? null;
}
function Dt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ee(t)) return t;
  const r = e.document?.actor;
  return ee(r) ? r : null;
}
function Ve(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ge(e, t, r, n) {
  return {
    source: e.source,
    status: t,
    reason: r,
    pendingId: n,
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
function Pr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function ze() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Qu {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], o = [], a = me(t);
    for (const s of r) {
      const i = s.itemId ? a.find((A) => A.id === s.itemId) ?? null : null, d = s.match?.preset ?? null;
      if (!i || !d) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(i, d);
      const g = await this.itemPatches.applyPresetItemPatch(i, d);
      n.push({
        itemId: i.id ?? null,
        itemName: i.name ?? "Ritual sem nome",
        presetId: d.id,
        presetLabel: d.label,
        previousStatus: s.status,
        itemPatch: g
      });
    }
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      applied: n,
      skipped: o
    };
  }
}
class Xu {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = me(t).map((i) => this.analyzeRitual(i)), n = r.filter(Ae("upToDate")), o = r.filter(Ae("available")), a = r.filter(Ae("outdated")), s = r.filter(Ae("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: r.length,
      upToDate: n,
      available: o,
      outdated: a,
      unsupported: s,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const r = this.analyzeActor(t);
    return [...r.available, ...r.outdated];
  }
  analyzeRitual(t) {
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = Zu(t);
    return r ? n ? n.source.type !== "preset" ? oe({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : n.source.presetId === r.preset.id && n.source.presetVersion === r.preset.version ? oe({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : oe({
      ritual: t,
      status: "outdated",
      match: r,
      flag: n,
      reason: Ju(n, r.preset)
    }) : oe({
      ritual: t,
      status: "available",
      match: r,
      flag: n,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : oe({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: n,
      reason: n ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function oe(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Ce(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function Zu(e) {
  const t = e.getFlag(c, "automation");
  return ft(t) ? t : null;
}
function Ju(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ae(e) {
  return (t) => t.status === e;
}
class ed {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = gt(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: r,
      data: n,
      flags: {
        [c]: {
          resourceTransaction: n
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, r) {
    const n = this.createWorkflowSummaryContent(t, r), o = W(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: n,
      data: o,
      flags: {
        [c]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const r = y(t.actorName), n = y(t.resource), o = y(Er(t)), a = y(rd(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${o}</strong>
          <span>${r}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${n}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, r) {
    const n = y(r.title ?? "Automação"), o = r.message ? `<p>${y(r.message)}</p>` : "", a = y(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = y(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((m) => y(m.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (m) => `<li><strong>${y(m.id)}:</strong> ${y(m.formula)} = ${m.total} <em>(${y(td(m.intent))})</em>${m.damageType ? ` — ${y(m.damageType)}` : ""}</li>`
    ), g = t.ritualCosts.map(
      (m) => `<li><strong>${y(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${y(m.resource)} (${y(nd(m.source))})</li>`
    ), A = t.damageInstances.map(
      (m) => `<li><strong>${y(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${y(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), R = t.healingInstances.map(
      (m) => `<li><strong>${y(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), k = t.resourceTransactions.map(
      (m) => `<li><strong>${y(m.actorName)}:</strong> ${y(Er(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), b = t.phases.map((m) => y(m)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${n}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${i}</p>
          ${g.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${g.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Dano:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${k.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${b}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function td(e) {
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
function Er(e) {
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
function rd(e) {
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
function nd(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function y(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function od() {
  const e = new Ss(), t = new Ti(e), r = new Es(), n = new Ns(r), o = new Ws(e), a = new Ys(), s = a.registerMany(Oo());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new Ks(), d = new Gs(), g = new Xu(a), A = new Qu(g, i, d), R = new _i(), k = new ed(R), b = new Ci(), m = new bi(t, n, k, b), C = new $i(m, b), S = new ju(C, t, n, R);
  return S.addStrategy(new qs((oo) => S.handleItemUsed(oo))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: a,
    automationBinder: i,
    itemPatches: d,
    debugOutput: R,
    chatMessages: k,
    workflowHooks: b,
    automation: m,
    workflow: C,
    itemUseIntegration: S,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: A
  };
}
const { ApplicationV2: ad } = foundry.applications.api;
class we extends ad {
  constructor(t, r) {
    super({
      id: `${c}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Presets de rituais: ${t.name ?? "Ator"}`
      }
    }), this.actor = t, this.services = r;
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
      apply: we.onApply,
      cancel: we.onCancel
    }
  };
  async _renderHTML(t, r) {
    const n = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), o = document.createElement("div");
    return o.className = "paranormal-toolkit-preset-manager", o.innerHTML = this.renderContent(n), o;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${L(dt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${L(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${We("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${We("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${We("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
    const t = this.lastApplicationResult.applied.length, r = this.lastApplicationResult.skipped.length, n = r > 0 ? ` ${r} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${t} preset(s) aplicado(s).${n}</span>
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
        const n = this.lastApplicationResult.applied.length;
        ui.notifications?.info(`Paranormal Toolkit: ${n} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
      } finally {
        this.isApplying = !1, await this.render({ force: !0 });
      }
    }
  }
  static async onCancel(t) {
    t.preventDefault(), await this.close();
  }
}
function We(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${L(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? sd(r) : cd(t)}
    </section>
  `;
}
function sd(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(id).join("")}</ol>`;
}
function id(e) {
  const t = e.preset, r = t ? `${t.label} v${t.version}` : "Sem preset", n = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${L(e.appliedPresetId)} v${L(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${L(e.itemName)}</strong>
        <span>${L(e.reason)}</span>
        ${n}
      </div>
      <em>${L(r)}</em>
    </li>
  `;
}
function cd(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${L({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function L(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const $e = `${c}.manageRitualPresets`, Lr = `__${c}_ritualPresetHeaderControlRegistered`, ld = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function ud(e) {
  const t = globalThis;
  if (!t[Lr]) {
    for (const r of ld)
      Hooks.on(r, (n, o) => {
        dd(n, o, e);
      });
    t[Lr] = !0, l.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function dd(e, t, r) {
  Array.isArray(t) && fd(e) && (md(e, r), !t.some((n) => n.action === $e) && t.push({
    action: $e,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), ro(e, r);
    }
  }));
}
function md(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[$e] && (e.options.actions[$e] = (r) => {
    r.preventDefault(), r.stopPropagation(), ro(e, t);
  }));
}
function fd(e) {
  if (!game.user?.isGM) return !1;
  const t = no(e);
  return t ? t.type === "agent" && me(t).length > 0 : !1;
}
function ro(e, t) {
  const r = no(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new we(r, t).render({ force: !0 });
}
function no(e) {
  return Dr(e.actor) ? e.actor : Dr(e.document) ? e.document : null;
}
function Dr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let Y = null;
Hooks.once("init", () => {
  Do(), ta(), $a(), _s(), l.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!jt.isSupportedSystem()) {
    l.warn(
      `Sistema não suportado: ${jt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Y = od(), Y.itemUseIntegration.registerStrategies(), ua(Y), ka(), ya(), ud(Y), l.info("Inicializado para o sistema Ordem Paranormal."), l.info(`API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${dt} inicializado.`);
});
function pd() {
  if (!Y)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Y;
}
export {
  pd as getToolkitServices
};
//# sourceMappingURL=main.js.map
