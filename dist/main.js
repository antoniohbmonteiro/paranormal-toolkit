//#region src/constants.ts
var e = "paranormal-toolkit", t = class {
	static getSelectedActor() {
		return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
	}
};
//#endregion
//#region src/core/automation/automation-preset.ts
function n(e) {
	return {
		id: e.id,
		version: e.version,
		label: e.label,
		description: e.description,
		category: e.category,
		itemTypes: [...e.itemTypes],
		matchers: e.matchers.map((e) => ({ ...e }))
	};
}
//#endregion
//#region src/core/module-logger.ts
var r = class {
	static info(t, ...n) {
		console.log(`${e} | ${t}`, ...n);
	}
	static warn(t, ...n) {
		console.warn(`${e} | ${t}`, ...n);
	}
	static error(t, ...n) {
		console.error(`${e} | ${t}`, ...n);
	}
};
//#endregion
//#region src/core/result.ts
function i(e) {
	return {
		ok: !0,
		value: e
	};
}
function a(e) {
	return {
		ok: !1,
		error: e
	};
}
//#endregion
//#region src/features/automation/automation-flag-reader.ts
function o(t) {
	let n = t.getFlag(e, "automation");
	return n == null ? a({
		reason: "missing-automation",
		message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
	}) : c(n) ? i(n.definition) : a({
		reason: "invalid-automation",
		message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
		value: n
	});
}
function s(t) {
	return c(t.getFlag(e, "automation"));
}
function c(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.schemaVersion === 1 && u(t.source) && l(t.definition);
}
function l(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && m(t.label) && Array.isArray(t.steps) && t.steps.every(d);
}
function u(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.type === "preset" ? m(t.presetId) && m(t.presetVersion) && m(t.appliedAt) : t.type === "manual" ? m(t.label) && m(t.appliedAt) : !1;
}
function d(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	switch (t.type) {
		case "spendResource": return f(t);
		case "spendRitualCost": return p(t);
		case "rollFormula": return ee(t);
		case "modifyResource": return te(t);
		case "chatCard": return ne(t);
		default: return !1;
	}
}
function f(e) {
	let t = e;
	return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && re(t);
}
function p(e) {
	return e.type === "spendRitualCost";
}
function ee(e) {
	let t = e;
	return t.type === "rollFormula" && m(t.id) && m(t.formula) && (t.intent === void 0 || se(t.intent)) && (t.damageType === void 0 || m(t.damageType));
}
function te(e) {
	let t = e;
	return t.type === "modifyResource" && ie(t.actor) && ae(t.resource) && oe(t.operation) && re(t);
}
function ne(e) {
	let t = e;
	return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function re(e) {
	return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || m(e.amountFrom);
}
function ie(e) {
	return e === "self" || e === "target";
}
function ae(e) {
	return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function oe(e) {
	return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function se(e) {
	return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function m(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/automation/actor-item-resolver.ts
function h(e) {
	let t = e.items;
	if (Array.isArray(t)) return t;
	if (t && typeof t == "object") {
		let e = t;
		if (Array.isArray(e.contents)) return e.contents.filter(de);
		if (ue(t)) return Array.from(t).filter(de);
	}
	return [];
}
function ce(e) {
	return h(e)[0] ?? null;
}
function le(e) {
	return h(e).find(s) ?? null;
}
function ue(e) {
	return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function de(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/features/rituals/ritual-item-resolver.ts
function fe(e) {
	return h(e).filter((e) => e.type === "ritual");
}
function pe(e) {
	return fe(e)[0] ?? null;
}
//#endregion
//#region src/debug/automation-debug-api.ts
function me(e) {
	return {
		listPresets() {
			let t = e.automationRegistry.list().map(n);
			return r.info("Presets de automação registrados.", t), t;
		},
		findPresetsForFirstRitual() {
			let t = g("Nenhum ator encontrado para buscar presets de ritual.");
			if (!t) return [];
			let n = _(t);
			if (!n) return [];
			let i = e.automationRegistry.findForItem(n).map(he);
			return r.info(`Presets encontrados para ${n.name}.`, i), i;
		},
		async applyPresetToFirstRitual(t) {
			let n = g("Nenhum ator encontrado para aplicar preset de ritual.");
			if (!n) return;
			let i = _(n);
			if (!i) return;
			let a = e.automationRegistry.require(t);
			if (!a.ok) {
				r.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
				return;
			}
			await e.automationBinder.applyPreset(i, a.value), r.info(`Preset ${a.value.id} aplicado em ${i.name}.`), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${i.name}.`);
		},
		async applyBestPresetToFirstRitual() {
			let t = g("Nenhum ator encontrado para aplicar melhor preset de ritual.");
			if (!t) return;
			let n = _(t);
			if (!n) return;
			let i = e.automationRegistry.findForItem(n)[0];
			if (!i) {
				r.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
				return;
			}
			await e.automationBinder.applyPreset(n, i.preset), r.info(`Melhor preset aplicado em ${n.name}.`, he(i)), ui.notifications?.info(`Paranormal Toolkit: preset ${i.preset.label} aplicado em ${n.name}.`);
		},
		async clearAutomationFromFirstRitual() {
			let t = g("Nenhum ator encontrado para limpar automação de ritual.");
			if (!t) return;
			let n = _(t);
			n && (await e.automationBinder.clear(n), r.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
		}
	};
}
function he(e) {
	return {
		preset: n(e.preset),
		score: e.score,
		reasons: [...e.reasons]
	};
}
function g(e) {
	return t.getSelectedActor() || (r.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function _(e) {
	return pe(e) || (r.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
//#endregion
//#region src/core/workflow/workflow-debug-snapshot.ts
function v(e) {
	return e ? {
		id: e.id,
		source: {
			...ge(e.sourceActor),
			token: e.sourceToken
		},
		item: _e(e.item),
		targets: e.targets.map(ve),
		phases: [...e.phases],
		lifecycleEvents: e.lifecycleEvents.map((e) => ({ ...e })),
		rollRequests: xe(e.rollRequests, ye),
		rolls: xe(e.rolls, be),
		ritualCosts: e.ritualCosts.map((e) => ({ ...e })),
		damageInstances: e.damageInstances.map((e) => ({
			...e,
			tags: [...e.tags]
		})),
		healingInstances: e.healingInstances.map((e) => ({
			...e,
			tags: [...e.tags]
		})),
		resourceTransactions: e.resourceTransactions.map(y),
		flagKeys: Object.keys(e.flags)
	} : null;
}
function y(e) {
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
function ge(e) {
	return {
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		actorType: e.type ?? "unknown"
	};
}
function _e(e) {
	return {
		itemId: e.id ?? null,
		itemName: e.name ?? "Item sem nome",
		itemType: e.type ?? "unknown",
		itemUuid: e.uuid ?? null
	};
}
function ve(e) {
	return {
		tokenId: e.tokenId,
		actorId: e.actorId,
		sceneId: e.sceneId,
		name: e.name,
		actorName: e.actor?.name,
		actorType: e.actor?.type
	};
}
function ye(e) {
	return {
		id: e.id,
		formula: e.formula,
		intent: e.intent,
		damageType: e.damageType,
		sourceStepIndex: e.sourceStepIndex
	};
}
function be(e) {
	return {
		...ye(e),
		total: e.total
	};
}
function xe(e, t) {
	return Object.fromEntries(Object.entries(e).map(([e, n]) => [e, t(n)]));
}
//#endregion
//#region src/debug/actor-debug-api.ts
function Se(e) {
	return {
		getSelected() {
			return t.getSelectedActor();
		},
		logResources() {
			let t = x("Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário.");
			if (!t) return;
			let n = e.ordem.getActorSnapshot(t);
			r.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && r.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
		},
		async spendPE(t) {
			await b(e, "Gasto de PE", x("Nenhum ator encontrado para gastar PE."), (n) => e.resources.spend(n, "PE", t));
		},
		async spendPD(t) {
			await b(e, "Gasto de PD", x("Nenhum ator encontrado para gastar PD."), (n) => e.resources.spend(n, "PD", t));
		},
		async damagePV(t) {
			await b(e, "Dano em PV", x("Nenhum ator encontrado para causar dano em PV."), (n) => e.resources.damage(n, "PV", t));
		},
		async healPV(t) {
			await b(e, "Cura de PV", x("Nenhum ator encontrado para curar PV."), (n) => e.resources.heal(n, "PV", t));
		},
		async damageSAN(t) {
			await b(e, "Dano em SAN", x("Nenhum ator encontrado para causar dano em SAN."), (n) => e.resources.damage(n, "SAN", t));
		},
		async recoverSAN(t) {
			await b(e, "Recuperação de SAN", x("Nenhum ator encontrado para recuperar SAN."), (n) => e.resources.recover(n, "SAN", t));
		}
	};
}
async function b(e, t, n, i) {
	if (!n) return;
	let a = await i(n);
	if (!a.ok) {
		Ce(a.error);
		return;
	}
	let o = a.value;
	try {
		await e.chatMessages.createResourceOperationMessage({ transaction: o });
	} catch (e) {
		r.error(`${t} realizado, mas falhou ao criar o chat card.`, e), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
	}
	r.info(`${t} realizado:`, y(o));
}
function x(e) {
	return t.getSelectedActor() || (r.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ce(e) {
	if (e.reason === "update-failed") {
		r.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
		r.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	r.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
//#endregion
//#region src/debug/output/debug-output-settings.ts
var S = {
	enabled: "debug.output.enabled",
	console: "debug.output.console",
	ui: "debug.output.ui",
	chat: "debug.output.chat"
};
function we() {
	T(S.enabled, {
		name: "Ativar debug do Paranormal Toolkit",
		hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
		default: !1
	}), T(S.console, {
		name: "Debug no console",
		hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
		default: !0
	}), T(S.ui, {
		name: "Debug como notificação",
		hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
		default: !0
	}), T(S.chat, {
		name: "Debug no chat",
		hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
		default: !1
	});
}
function C() {
	return {
		enabled: E(S.enabled),
		console: E(S.console),
		ui: E(S.ui),
		chat: E(S.chat)
	};
}
async function w(t, n) {
	await game.settings.set(e, S[t], n);
}
function T(t, n) {
	game.settings.register(e, t, {
		name: n.name,
		hint: n.hint,
		scope: "world",
		config: !0,
		type: Boolean,
		default: n.default
	});
}
function E(t) {
	return game.settings.get(e, t) === !0;
}
//#endregion
//#region src/debug/output/debug-output-api.ts
function Te() {
	return {
		status() {
			return C();
		},
		async enable() {
			await w("enabled", !0);
		},
		async disable() {
			await w("enabled", !1);
		},
		async enableConsole() {
			await w("console", !0);
		},
		async disableConsole() {
			await w("console", !1);
		},
		async enableUi() {
			await w("ui", !0);
		},
		async disableUi() {
			await w("ui", !1);
		},
		async enableChat() {
			await w("chat", !0);
		},
		async disableChat() {
			await w("chat", !1);
		}
	};
}
//#endregion
//#region src/features/rituals/ritual-automation-presets.ts
var Ee = "ritual.costOnly", De = "ritual.simpleHealing", Oe = "ritual.simpleDamage", ke = "generic.simpleHealing";
function Ae() {
	return [
		je(),
		Me(),
		Ne(),
		Pe()
	];
}
function je() {
	return {
		id: Ee,
		version: "1.0.0",
		label: "Gasto de custo de ritual",
		description: "Calcula o custo do ritual pelo círculo e gasta o recurso configurado.",
		category: "ritual",
		itemTypes: ["ritual"],
		matchers: [],
		automation: {
			version: 1,
			label: "Gasto de custo de ritual",
			steps: [{ type: "spendRitualCost" }, {
				type: "chatCard",
				title: "Gasto de custo de ritual",
				message: "Calcula o custo do ritual pelo círculo e gasta o recurso configurado."
			}]
		}
	};
}
function Me() {
	return {
		id: De,
		version: "1.0.0",
		label: "Ritual de cura simples",
		description: "Gasta o custo do ritual, rola 2d8+2 de cura e recupera PV do alvo.",
		category: "ritual",
		itemTypes: ["ritual"],
		matchers: [{
			type: "normalizedName",
			names: ["cicatrizacao"]
		}],
		automation: Fe()
	};
}
function Ne() {
	return {
		id: Oe,
		version: "1.0.0",
		label: "Ritual de dano simples",
		description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
		category: "ritual",
		itemTypes: ["ritual"],
		matchers: [],
		automation: D()
	};
}
function Pe() {
	return {
		id: ke,
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
function Fe(e = "2d8+2") {
	return O({
		version: 1,
		label: "Ritual de cura simples",
		steps: [
			{ type: "spendRitualCost" },
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
				title: "Ritual de cura simples",
				message: "Gasta o custo do ritual, rola a fórmula de cura e recupera PV do alvo."
			}
		]
	}, "healing", e);
}
function D(e = "1d8") {
	return O({
		version: 1,
		label: "Ritual de dano simples",
		steps: [
			{ type: "spendRitualCost" },
			{
				type: "rollFormula",
				id: "damage",
				formula: "1d8",
				intent: "damage",
				damageType: "generic"
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
				title: "Ritual de dano simples",
				message: "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo."
			}
		]
	}, "damage", e);
}
function O(e, t, n) {
	return {
		...e,
		steps: e.steps.map((e) => e.type !== "rollFormula" || e.id !== t ? e : {
			...e,
			formula: n
		})
	};
}
//#endregion
//#region src/features/automation/workflow-target-resolver.ts
function k() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: A(e.id),
		actorId: A(e.actor?.id),
		sceneId: A(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome",
		actor: e.actor ?? null
	}));
}
function Ie() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null;
	return {
		tokenId: A(e.id),
		actorId: A(t?.id),
		sceneId: A(e.scene?.id),
		name: e.name ?? t?.name ?? "Origem sem nome"
	};
}
function A(e) {
	return typeof e == "string" && e.length > 0 ? e : null;
}
//#endregion
//#region src/debug/ritual-debug-api.ts
function Le(t) {
	return {
		logFirstRitualCost() {
			let e = j("Nenhum ator encontrado para consultar custo de ritual.");
			if (!e) return;
			let n = M(e);
			if (!n) return;
			let i = t.ritualCosts.getCost({
				actor: e,
				ritual: n
			});
			if (!i.ok) {
				r.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
				return;
			}
			r.info("Custo do primeiro ritual:", {
				actor: e.name,
				ritual: n.name,
				cost: i.value
			}), ui.notifications?.info(`Paranormal Toolkit: ${n.name} custa ${i.value.amount} ${i.value.resource} (${i.value.circle}º círculo).`);
		},
		async setCustomCostOnFirstRitual(t, n = "PE") {
			let i = j("Nenhum ator encontrado para configurar custo customizado.");
			if (!i) return;
			let a = M(i);
			if (a) {
				if (!Be(t, n)) {
					ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
					return;
				}
				await a.setFlag(e, "ritual.cost", {
					resource: n,
					amount: t
				}), r.info(`Custo customizado aplicado em ${a.name}.`, {
					resource: n,
					amount: t
				}), ui.notifications?.info(`Paranormal Toolkit: ${a.name} agora custa ${t} ${n}.`);
			}
		},
		async clearCustomCostOnFirstRitual() {
			let t = j("Nenhum ator encontrado para limpar custo customizado.");
			if (!t) return;
			let n = M(t);
			n && (await n.unsetFlag(e, "ritual.cost"), r.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
		},
		async setTestCostAutomationOnFirstRitual() {
			let e = j("Nenhum ator encontrado para configurar automação de custo de ritual.");
			if (!e) return;
			let n = M(e);
			if (!n) return;
			let i = t.automationRegistry.require(Ee);
			if (!i.ok) {
				r.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
				return;
			}
			await t.automationBinder.applyPreset(n, i.value), r.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
		},
		async setTestHealingAutomationOnFirstRitual(e = "2d8+2") {
			let n = j("Nenhum ator encontrado para configurar ritual de cura simples.");
			if (!n) return;
			let i = M(n);
			if (!i) return;
			if (!Ve(e)) {
				ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
				return;
			}
			let a = t.automationRegistry.require(De);
			if (!a.ok) {
				r.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
				return;
			}
			await t.automationBinder.applyPreset(i, a.value, { definition: Fe(e) }), r.info(`Preset de cura simples aplicado ao ritual: ${i.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${i.name}.`);
		},
		async setTestDamageAutomationOnFirstRitual(e = "1d8") {
			let n = j("Nenhum ator encontrado para configurar ritual de dano simples.");
			if (!n) return;
			let i = M(n);
			if (!i) return;
			if (!Ve(e)) {
				ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
				return;
			}
			let a = t.automationRegistry.require(Oe);
			if (!a.ok) {
				r.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
				return;
			}
			await t.automationBinder.applyPreset(i, a.value, { definition: D(e) }), r.info(`Preset de dano simples aplicado ao ritual: ${i.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${i.name}.`);
		},
		async runFirstRitualAutomation() {
			let e = j("Nenhum ator encontrado para executar automação de ritual.");
			if (!e) return;
			let n = M(e);
			n && await Re(t, e, n);
		}
	};
}
async function Re(e, t, n) {
	let i = o(n);
	if (!i.ok) {
		r.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
		return;
	}
	let a = await e.workflow.runAutomation(i.value, {
		sourceActor: t,
		sourceToken: Ie(),
		item: n,
		targets: k()
	});
	if (!a.ok) {
		ze(a.error);
		return;
	}
	r.info("Automação de ritual executada com sucesso.", v(a.value.context));
}
function ze(e) {
	let t = `Automação de ritual falhou: ${e.message}`;
	if (e.reason === "resource-operation-failed") {
		r.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	if (e.reason === "chat-card-failed") {
		r.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	r.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function j(e) {
	return t.getSelectedActor() || (r.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function M(e) {
	return pe(e) || (r.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Be(e, t) {
	return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Ve(e) {
	return typeof e == "string" && e.trim().length > 0;
}
//#endregion
//#region src/features/item-use/item-use-settings.ts
var N = { autoRun: "itemUse.autoRun.enabled" };
function He() {
	game.settings.register(e, N.autoRun, {
		name: "Executar automações ao usar item",
		hint: "Quando ativo, itens com automação do Paranormal Toolkit executam o workflow ao serem usados pela ficha. Experimental na versão 0.8.x.",
		scope: "world",
		config: !0,
		type: Boolean,
		default: !1
	});
}
function Ue() {
	return { autoRun: game.settings.get(e, N.autoRun) === !0 };
}
async function We(t) {
	await game.settings.set(e, N.autoRun, t);
}
//#endregion
//#region src/features/item-use/item-use-debug-api.ts
function Ge(e) {
	return {
		status() {
			return e.itemUseIntegration.status();
		},
		async enable() {
			await We(!0), ui.notifications?.info("Paranormal Toolkit: automação ao usar item ativada.");
		},
		async disable() {
			await We(!1), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
		}
	};
}
//#endregion
//#region src/core/workflow/workflow-phase.ts
var Ke = /* @__PURE__ */ "created.beforeItemUse.resolveTargets.beforeCost.spendCost.afterCost.beforeRoll.beforeDamageRoll.beforeHealingRoll.roll.damageRoll.healingRoll.afterDamageRoll.afterHealingRoll.afterRoll.beforeDamageResolution.damageResolution.afterDamageResolution.beforeApply.beforeApplyDamage.beforeApplyHealing.apply.applyDamage.applyHealing.afterApplyDamage.afterApplyHealing.afterApply.beforeChat.chat.completed.failed".split(".");
//#endregion
//#region src/debug/workflow-debug-api.ts
function qe(e) {
	return {
		phases() {
			return Ke;
		},
		lastContext() {
			return e.workflow.getLastDebugSnapshot();
		},
		async runFirstAutomation() {
			let t = F("Nenhum ator encontrado para executar automação.");
			if (!t) return;
			let n = le(t);
			if (!n) {
				r.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
				return;
			}
			await P(e, t, n);
		},
		async runSelectedItemAutomation() {
			await this.runFirstAutomation();
		},
		async runItemAutomationByUuid(t) {
			if (!t || typeof t != "string") {
				ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
				return;
			}
			let n = await fromUuid(t);
			if (!Xe(n)) {
				r.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
				return;
			}
			let i = Ye(n) ?? F("Nenhum ator encontrado para executar automação do item.");
			i && await P(e, i, n);
		},
		async setTestHealingAutomationOnFirstItem() {
			let t = F("Nenhum ator encontrado para configurar automação de teste.");
			if (!t) return;
			let n = ce(t);
			if (!n) {
				r.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
				return;
			}
			try {
				let t = e.automationRegistry.require(ke);
				if (!t.ok) {
					r.warn(t.error.message, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
					return;
				}
				await e.automationBinder.applyPreset(n, t.value), r.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
			} catch (e) {
				r.error("Falha ao configurar automação de teste no item.", e), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
			}
		}
	};
}
async function P(e, t, n) {
	let i = o(n);
	if (!i.ok) {
		r.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
		return;
	}
	let a = await e.workflow.runAutomation(i.value, {
		sourceActor: t,
		sourceToken: Ie(),
		item: n,
		targets: k()
	});
	if (!a.ok) {
		Je(a.error);
		return;
	}
	r.info("Automação executada com sucesso.", v(a.value.context));
}
function Je(e) {
	let t = `Automação falhou: ${e.message}`;
	if (e.reason === "resource-operation-failed") {
		r.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	if (e.reason === "chat-card-failed") {
		r.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	r.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function F(e) {
	return t.getSelectedActor() || (r.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ye(e) {
	let t = e.parent;
	return t instanceof Actor ? t : null;
}
function Xe(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/debug/debug-api.ts
function Ze(e) {
	let t = Se(e);
	return {
		actor: t,
		automation: me(e),
		ritual: Le(e),
		workflow: qe(e),
		output: Te(),
		itemUseIntegration: Ge(e),
		getSelectedActor() {
			return t.getSelected();
		},
		logSelectedActorResources() {
			t.logResources();
		},
		async spendSelectedActorPE(e) {
			await t.spendPE(e);
		}
	};
}
//#endregion
//#region src/core/global-api.ts
function Qe(t) {
	let n = {
		services: t,
		ordem: t.ordem,
		resources: t.resources,
		ritualCosts: t.ritualCosts,
		automation: t.automation,
		automationRegistry: t.automationRegistry,
		automationBinder: t.automationBinder,
		workflow: t.workflow,
		itemUseIntegration: t.itemUseIntegration,
		debug: Ze(t)
	}, r = globalThis;
	return r[e] = n, r.ParanormalToolkit = n, n;
}
//#endregion
//#region src/core/system-guard.ts
var I = class {
	static isSupportedSystem() {
		return game.system.id === "ordemparanormal";
	}
	static getCurrentSystemId() {
		return game.system.id;
	}
};
//#endregion
//#region src/features/chat/chat-workflow-flags.ts
function $e() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: B(e.id),
		actorId: B(e.actor?.id),
		sceneId: B(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome"
	}));
}
function L() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
	return {
		tokenId: B(e.id),
		actorId: B(t?.id),
		sceneId: B(e.scene?.id),
		name: n
	};
}
function et(e, t = L()) {
	return {
		version: 1,
		kind: "chat-targets",
		source: t,
		targets: e
	};
}
function tt(t) {
	if (!it(t)) return null;
	let n = t.getFlag(e, "workflow");
	return rt(n) ? n : null;
}
function nt() {
	return `flags.${e}.workflow`;
}
function R(t) {
	if (!t || typeof t != "object") return !1;
	let n = foundry.utils.getProperty(t, `flags.${e}`), r = foundry.utils.getProperty(t, `_source.flags.${e}`);
	return n !== void 0 || r !== void 0;
}
function z(e) {
	let t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
	return V(t) || V(n);
}
function rt(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function it(e) {
	return !!(e && typeof e == "object" && "getFlag" in e);
}
function B(e) {
	return V(e) ? e : null;
}
function V(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/chat/chat-enrichment-renderer.ts
function at() {
	Hooks.on("renderChatMessageHTML", (e, t) => {
		ot(e, t);
	});
}
function ot(e, t) {
	let n = tt(e);
	if (!n || n.targets.length === 0) return;
	let r = lt(t);
	r && (r.querySelector(".paranormal-toolkit-chat-enrichment") || (r.querySelector(".message-content") ?? r).append(st(n)));
}
function st(t) {
	let n = document.createElement("section");
	n.classList.add(`${e}-chat-enrichment`);
	let r = document.createElement("strong");
	return r.textContent = "Paranormal Toolkit", n.append(r), t.source && n.append(ct("Origem", t.source.name)), n.append(ct("Alvo", t.targets.map((e) => e.name).join(", "))), n;
}
function ct(t, n) {
	let r = document.createElement("p");
	r.classList.add(`${e}-chat-enrichment__row`);
	let i = document.createElement("span");
	i.textContent = `${t}: `;
	let a = document.createElement("span");
	return a.textContent = n, r.append(i, a), r;
}
function lt(e) {
	if (e instanceof HTMLElement) return e;
	if (e && typeof e == "object") {
		let t = e;
		if (t[0] instanceof HTMLElement) return t[0];
	}
	return null;
}
//#endregion
//#region src/features/chat/chat-target-capture.ts
function ut() {
	Hooks.on("preCreateChatMessage", (e, t, n, i) => {
		if (!dt(i) || !ft(e) || R(e) || R(t)) return;
		let a = $e();
		if (a.length === 0 || !z(e) && !z(t)) return;
		let o = L();
		e.updateSource({ [nt()]: et(a, o) }), r.info("Targets capturados para ChatMessage.", {
			source: o,
			targets: a
		});
	});
}
function dt(e) {
	let t = game.user?.id;
	return !t || typeof e != "string" ? !0 : e === t;
}
function ft(e) {
	return !!(e && typeof e == "object" && "updateSource" in e);
}
//#endregion
//#region src/adapters/ordem/ordem-paths.ts
var H = {
	PV: "system.PV",
	SAN: "system.SAN",
	PE: "system.PE",
	PD: "system.PD"
}, U = { PV: "system.attributes.hp" }, W = {
	PV: [H.PV, U.PV],
	SAN: [H.SAN],
	PE: [H.PE],
	PD: [H.PD]
}, G = {
	ritual: { dt: "system.ritual.DT" },
	ritualItem: { circleCandidates: ["system.circle", "system.ritual.circle"] },
	weapon: {
		category: "system.category",
		attackFormula: "system.formulas.attack",
		damageFormula: "system.formulas.damage",
		critical: "system.critical"
	}
}, pt = class {
	getResource(e, t) {
		let n = mt(e, t);
		if (!n.ok) return a(n.error);
		let r = n.value, o = `${r}.value`, s = `${r}.max`, c = foundry.utils.getProperty(e, o), l = foundry.utils.getProperty(e, s), u = vt(e, t, o, c, "valor atual");
		if (u) return a(u);
		let d = vt(e, t, s, l, "valor máximo");
		return d ? a(d) : i({
			value: c,
			max: l
		});
	}
	async updateResourceValue(e, t, n) {
		let r = mt(e, t);
		if (!r.ok) throw Error(r.error.message);
		await e.update({ [`${r.value}.value`]: n });
	}
};
function mt(e, t) {
	let n = ht(e.type, t);
	if (n && gt(e, n)) return i(n);
	let r = W[t].find((t) => gt(e, t));
	return r ? i(r) : a({
		actor: e,
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		actorType: e.type ?? "unknown",
		resource: t,
		reason: "resource-path-not-found",
		message: _t(e, t),
		path: W[t].join(" | ")
	});
}
function ht(e, t) {
	return e === "threat" ? U[t] ?? null : e === "agent" ? H[t] : null;
}
function gt(e, t) {
	let n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
	return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function _t(e, t) {
	let n = e.type ?? "unknown", r = W[t].join(", ");
	return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function vt(e, t, n, r, i) {
	return r == null ? {
		actor: e,
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		actorType: e.type ?? "unknown",
		resource: t,
		reason: "resource-path-not-found",
		message: `Path de ${i} de ${t} não encontrado: ${n}.`,
		path: n,
		value: r
	} : typeof r != "number" || !Number.isFinite(r) ? {
		actor: e,
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		actorType: e.type ?? "unknown",
		resource: t,
		reason: "invalid-resource-value",
		message: `Valor inválido para ${i} de ${t} em ${n}.`,
		path: n,
		value: r
	} : null;
}
//#endregion
//#region src/adapters/ordem/ordem-ritual-adapter.ts
var yt = class {
	isRitual(e) {
		return e.type === "ritual";
	}
	getCircle(e) {
		if (!this.isRitual(e)) return a({
			reason: "not-a-ritual",
			message: `Item ${e.name ?? "sem nome"} não é um ritual.`,
			ritual: e
		});
		let t = this.readCircleFromKnownPaths(e);
		if (!t) {
			let t = G.ritualItem.circleCandidates;
			return a({
				reason: "ritual-circle-not-found",
				message: `Círculo do ritual não encontrado. Paths testados: ${t.join(", ")}.`,
				ritual: e,
				paths: [...t]
			});
		}
		let { path: n, value: r } = t, o = bt(r);
		return o ? i(o) : a({
			reason: "invalid-ritual-circle",
			message: `Círculo do ritual inválido em ${n}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
			ritual: e,
			path: n,
			value: r
		});
	}
	readCircleFromKnownPaths(e) {
		for (let t of G.ritualItem.circleCandidates) {
			let n = foundry.utils.getProperty(e, t);
			if (n != null) return {
				path: t,
				value: n
			};
		}
		return null;
	}
};
function bt(e) {
	if (xt(e)) return e;
	if (typeof e == "string") {
		let t = e.trim();
		if (!/^\d+$/.test(t)) return null;
		let n = Number(t);
		if (xt(n)) return n;
	}
	return null;
}
function xt(e) {
	return e === 1 || e === 2 || e === 3 || e === 4;
}
//#endregion
//#region src/adapters/ordem/ordem-ritual-cost-provider.ts
var St = {
	1: 1,
	2: 3,
	3: 6,
	4: 10
}, Ct = class {
	ritualAdapter;
	constructor(e) {
		this.ritualAdapter = e;
	}
	getCost(e) {
		let t = this.ritualAdapter.getCircle(e.ritual);
		if (!t.ok) return a({
			...t.error,
			actor: e.actor
		});
		let n = t.value, r = wt(e.ritual, n);
		return r.ok ? r.value ? i(r.value) : i({
			resource: "PE",
			amount: St[n],
			source: "default-by-circle",
			circle: n
		}) : a(r.error);
	}
};
function wt(t, n) {
	let r = t.getFlag(e, "ritual.cost");
	return r == null ? {
		ok: !0,
		value: null
	} : Tt(r) ? {
		ok: !0,
		value: {
			resource: r.resource,
			amount: r.amount,
			source: "custom-flag",
			circle: n
		}
	} : {
		ok: !1,
		error: {
			reason: "invalid-custom-cost",
			message: `Custo customizado do ritual ${t.name ?? "sem nome"} é inválido.`,
			ritual: t,
			value: r
		}
	};
}
function Tt(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
//#endregion
//#region src/adapters/ordem/item-use/ordem-item-use-context-resolver.ts
function Et(e, t) {
	let n = Ot(e);
	return {
		source: "ordem-item-roll-wrapper",
		actor: n,
		item: e,
		token: kt(n),
		targets: k(),
		originalResult: t
	};
}
function Dt(e) {
	if (!Pt(e.item)) return null;
	let t = K(e.actor) ? e.actor : Ot(e.item);
	return {
		source: "ordem-item-used-hook",
		actor: t,
		item: e.item,
		token: At(e.token) ?? kt(t),
		targets: k(),
		message: e.message
	};
}
function Ot(e) {
	let t = e;
	return K(t.actor) ? t.actor : K(e.parent) ? e.parent : null;
}
function kt(e) {
	let t = jt(e) ?? Mt(e);
	return t ? Nt(t) : null;
}
function At(e) {
	return q(e) ? Nt(e) : null;
}
function jt(e) {
	if (!e) return null;
	let t = e, n = t.token;
	return q(n) ? n : (t.getActiveTokens?.() ?? []).find(q) ?? null;
}
function Mt(e) {
	return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Nt(e) {
	let t = e.actor ?? null;
	return {
		tokenId: J(e.id),
		actorId: J(t?.id),
		sceneId: J(e.scene?.id),
		name: e.name ?? t?.name ?? "Origem sem nome"
	};
}
function Pt(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function K(e) {
	return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function q(e) {
	return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function J(e) {
	return typeof e == "string" && e.length > 0 ? e : null;
}
//#endregion
//#region src/adapters/ordem/item-use/ordem-item-roll-wrapper-strategy.ts
var Ft = class {
	onItemUsed;
	id = "ordem-item-roll-wrapper";
	registered = !1;
	constructor(e) {
		this.onItemUsed = e;
	}
	register() {
		let e = It();
		if (!e?.roll) {
			r.warn("Não foi possível registrar fallback de uso de item: CONFIG.Item.documentClass.prototype.roll não encontrado.");
			return;
		}
		if (e.__paranormalToolkitRollWrapped) {
			this.registered = !0;
			return;
		}
		let t = e.roll, n = this;
		e.__paranormalToolkitOriginalRoll = t, e.roll = async function(...e) {
			let r = await t.apply(this, e), i = Et(this, r);
			return i && await n.onItemUsed(i), r;
		}, e.__paranormalToolkitRollWrapped = !0, this.registered = !0, r.info("Fallback de uso de item registrado em OrdemItem.roll().");
	}
	status() {
		return {
			id: this.id,
			registered: this.registered
		};
	}
};
function It() {
	return CONFIG?.Item?.documentClass?.prototype ?? null;
}
//#endregion
//#region src/adapters/ordem/item-use/ordem-item-used-hook-strategy.ts
var Lt = class {
	onItemUsed;
	id = "ordem-item-used-hook";
	registered = !1;
	constructor(e) {
		this.onItemUsed = e;
	}
	register() {
		this.registered || (Hooks.on("ordemparanormal.itemUsed", (e) => {
			this.handleHook(e);
		}), this.registered = !0, r.info("Strategy de hook ordemparanormal.itemUsed registrada."));
	}
	status() {
		return {
			id: this.id,
			registered: this.registered
		};
	}
	async handleHook(e) {
		let t = Dt(Rt(e));
		if (!t) {
			r.warn("Hook ordemparanormal.itemUsed disparou sem payload de item válido.", e);
			return;
		}
		await this.onItemUsed(t);
	}
};
function Rt(e) {
	return e && typeof e == "object" ? e : {};
}
//#endregion
//#region src/adapters/ordem/ordem-system-adapter.ts
var zt = class {
	resourceAdapter;
	constructor(e) {
		this.resourceAdapter = e;
	}
	getActorSnapshot(e) {
		let t = this.getResources(e);
		return {
			id: e.id ?? null,
			name: e.name ?? "Ator sem nome",
			type: e.type ?? "unknown",
			resources: t.values,
			resourceErrors: t.errors,
			ritualDT: this.getRitualDT(e)
		};
	}
	getRitualDT(e) {
		return this.getNumber(e, G.ritual.dt, 0);
	}
	getResources(e) {
		let t = {
			PV: null,
			SAN: null,
			PE: null,
			PD: null
		}, n = [];
		for (let r of [
			"PV",
			"SAN",
			"PE",
			"PD"
		]) {
			let i = this.resourceAdapter.getResource(e, r);
			i.ok ? t[r] = i.value : n.push(i.error);
		}
		return {
			values: t,
			errors: n
		};
	}
	getNumber(e, t, n) {
		let r = foundry.utils.getProperty(e, t);
		return typeof r == "number" && Number.isFinite(r) ? r : n;
	}
}, Bt = class {
	async applyPreset(e, t, n = {}) {
		let r = {
			schemaVersion: 1,
			source: {
				type: "preset",
				presetId: t.id,
				presetVersion: t.version,
				appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
				appliedBy: game.user?.id ?? null
			},
			definition: n.definition ?? t.automation
		};
		return await this.writeAutomationFlag(e, r), r;
	}
	async applyManualDefinition(e, t, n = t.label) {
		let r = {
			schemaVersion: 1,
			source: {
				type: "manual",
				label: n,
				appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
				appliedBy: game.user?.id ?? null
			},
			definition: t
		};
		return await this.writeAutomationFlag(e, r), r;
	}
	async clear(t) {
		await t.unsetFlag(e, "automation");
	}
	async writeAutomationFlag(t, n) {
		await this.clear(t), await t.setFlag(e, "automation", n);
	}
}, Vt = class {
	presets = /* @__PURE__ */ new Map();
	register(e) {
		let t = Ht(e);
		return t.ok ? this.presets.has(e.id) ? a({
			reason: "duplicate-preset",
			message: `Preset de automação duplicado: ${e.id}.`,
			presetId: e.id
		}) : (this.presets.set(e.id, Y(e)), i(e)) : t;
	}
	registerMany(e) {
		let t = [];
		for (let n of e) {
			let e = this.register(n);
			if (!e.ok) return e;
			t.push(e.value);
		}
		return i(t);
	}
	get(e) {
		let t = this.presets.get(e);
		return t ? Y(t) : null;
	}
	require(e) {
		let t = this.get(e);
		return t ? i(t) : a({
			reason: "preset-not-found",
			message: `Preset de automação não encontrado: ${e}.`,
			presetId: e
		});
	}
	list() {
		return Array.from(this.presets.values()).map(Y);
	}
	findForItem(e) {
		return this.list().map((t) => Ut(t, e)).filter((e) => e !== null).sort((e, t) => t.score - e.score || e.preset.id.localeCompare(t.preset.id));
	}
};
function Ht(e) {
	return !X(e.id) || !X(e.version) || !X(e.label) ? a({
		reason: "invalid-preset",
		message: "Preset de automação precisa de id, version e label válidos.",
		presetId: e.id
	}) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? a({
		reason: "invalid-preset",
		message: `Preset ${e.id} possui definição de automação inválida.`,
		presetId: e.id
	}) : i(e);
}
function Ut(e, t) {
	if (e.matchers.length === 0) return null;
	let n = [], r = 0;
	if (e.itemTypes.length > 0) {
		if (!e.itemTypes.includes(t.type)) return null;
		r += 10, n.push(`itemType:${t.type}`);
	}
	for (let i of e.matchers) {
		let e = Wt(i, t);
		if (!e.matches) return null;
		r += e.score, n.push(e.reason);
	}
	return {
		preset: e,
		score: r,
		reasons: n
	};
}
function Wt(e, t) {
	switch (e.type) {
		case "itemType": {
			let n = e.itemTypes.includes(t.type);
			return {
				matches: n,
				score: n ? 10 : 0,
				reason: `itemType:${t.type}`
			};
		}
		case "normalizedName": {
			let n = Gt(t.name), r = e.names.map(Gt).includes(n);
			return {
				matches: r,
				score: r ? 100 : 0,
				reason: `normalizedName:${n}`
			};
		}
		case "ritualCircle": {
			let n = Kt(t), r = n !== null && e.circles.includes(n);
			return {
				matches: r,
				score: r ? 20 : 0,
				reason: `ritualCircle:${n ?? "unknown"}`
			};
		}
	}
}
function Gt(e) {
	return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Kt(e) {
	let t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
	return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Y(e) {
	return structuredClone(e);
}
function X(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/core/automation/automation-runner.ts
var qt = class {
	resources;
	ritualCosts;
	messages;
	lifecycle;
	constructor(e, t, n, r) {
		this.resources = e, this.ritualCosts = t, this.messages = n, this.lifecycle = r;
	}
	async run(e, t) {
		if (e.steps.length === 0) return a({
			reason: "empty-automation",
			message: "A automação não possui steps para executar.",
			context: t
		});
		for (let [n, r] of e.steps.entries()) {
			let e = await this.runStep(r, t, n);
			if (!e.ok) return e;
		}
		return i({
			definition: e,
			context: t
		});
	}
	async runStep(e, t, n) {
		switch (e.type) {
			case "rollFormula": return this.runRollFormulaStepWithLifecycle(e, t, n);
			case "modifyResource": return this.runModifyResourceStepWithLifecycle(e, t, n);
			default: return this.runGenericStepWithLifecycle(e, t, n);
		}
	}
	async runGenericStepWithLifecycle(e, t, n) {
		let r = Jt(e);
		for (let i of r.before) this.lifecycle.emit(i, t, {
			stepIndex: n,
			step: e
		});
		let a = await this.executeStep(e, t, n);
		if (!a.ok) return a;
		for (let i of r.after) this.lifecycle.emit(i, t, {
			stepIndex: n,
			step: e
		});
		return i(void 0);
	}
	async executeStep(e, t, n) {
		switch (e.type) {
			case "spendResource": return this.runSpendResourceStep(e, t, n);
			case "spendRitualCost": return this.runSpendRitualCostStep(e, t, n);
			case "rollFormula": return this.runRollFormulaStep(e, t, n);
			case "modifyResource": return this.runModifyResourceStep(e, t, n);
			case "chatCard": return this.runChatCardStep(e, t, n);
			default: return a({
				reason: "unsupported-step",
				message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
				stepIndex: n,
				step: e,
				context: t
			});
		}
	}
	async runSpendResourceStep(e, t, n) {
		let r = this.resolveAmount(e, t);
		if (!r.ok) return a({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let o = await this.resources.spend(t.sourceActor, e.resource, r.value), s = this.handleResourceOperationResult(o, t, n, e);
		return s.ok ? i(void 0) : s;
	}
	async runSpendRitualCostStep(e, t, n) {
		let r = this.ritualCosts.getCost({
			actor: t.sourceActor,
			ritual: t.item
		});
		if (!r.ok) return a({
			reason: "ritual-cost-failed",
			message: r.error.message,
			stepIndex: n,
			step: e,
			context: t,
			cause: r.error
		});
		let o = r.value;
		t.ritualCosts.push({
			...o,
			itemId: t.item.id ?? null,
			itemName: t.item.name ?? "Ritual sem nome"
		});
		let s = await this.resources.spend(t.sourceActor, o.resource, o.amount), c = this.handleResourceOperationResult(s, t, n, e);
		return c.ok ? i(void 0) : c;
	}
	async runRollFormulaStepWithLifecycle(e, t, n) {
		let r = this.createRollRequest(e, n);
		t.rollRequests[r.id] = r, this.lifecycle.emit("beforeRoll", t, {
			stepIndex: n,
			step: e,
			rollRequest: r
		}), this.emitSpecificRollPhase("before", r, t, n, e), this.lifecycle.emit("roll", t, {
			stepIndex: n,
			step: e,
			rollRequest: r
		}), this.emitSpecificRollPhase("roll", r, t, n, e);
		let a = await this.runRollFormulaStep(e, t, n);
		if (!a.ok) return a;
		let o = t.rolls[r.id];
		return this.emitSpecificRollPhase("after", r, t, n, e, o), this.lifecycle.emit("afterRoll", t, {
			stepIndex: n,
			step: e,
			rollRequest: r,
			rollResult: o
		}), i(void 0);
	}
	async runRollFormulaStep(e, t, n) {
		if (!$t(e.id) || !$t(e.formula)) return a({
			reason: "invalid-step",
			message: "Step rollFormula precisa de id e formula.",
			stepIndex: n,
			step: e,
			context: t
		});
		try {
			let r = new Roll(e.formula), o = await Promise.resolve(r.evaluate()), s = o.total;
			if (typeof s != "number" || !Number.isFinite(s)) return a({
				reason: "roll-failed",
				message: `A rolagem ${e.id} não retornou um total numérico válido.`,
				stepIndex: n,
				step: e,
				context: t
			});
			let c = t.rollRequests[e.id] ?? this.createRollRequest(e, n);
			return t.rolls[e.id] = {
				...c,
				total: s,
				roll: o
			}, i(void 0);
		} catch (r) {
			return a({
				reason: "roll-failed",
				message: `Falha ao rolar fórmula: ${e.formula}.`,
				stepIndex: n,
				step: e,
				context: t,
				cause: r
			});
		}
	}
	async runModifyResourceStepWithLifecycle(e, t, n) {
		let r = this.resolveAmount(e, t);
		if (!r.ok) return a({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let o = this.createApplyMetadata(e, t, r.value);
		this.lifecycle.emit("beforeApply", t, {
			stepIndex: n,
			step: e,
			metadata: o
		}), this.emitSpecificApplyPhase("before", e, t, n, o), this.emitDamageResolutionPhase("before", e, t, n, o), this.emitDamageResolutionPhase("resolve", e, t, n, o), this.lifecycle.emit("apply", t, {
			stepIndex: n,
			step: e,
			metadata: o
		}), this.emitSpecificApplyPhase("apply", e, t, n, o);
		let s = this.resolveActors(e.actor, t);
		if (s.length === 0) return a({
			reason: "no-target",
			message: "Nenhum alvo válido encontrado para modificar recurso.",
			stepIndex: n,
			step: e,
			context: t
		});
		for (let i of s) {
			let a = await this.runResourceOperation(i, e.resource, e.operation, r.value), o = this.handleResourceOperationResult(a, t, n, e);
			if (!o.ok) return o;
			this.recordTypedApplication(e, t, o.value, n);
		}
		return this.lifecycle.emit("afterApply", t, {
			stepIndex: n,
			step: e,
			metadata: o
		}), i(void 0);
	}
	async runModifyResourceStep(e, t, n) {
		let r = this.resolveAmount(e, t);
		if (!r.ok) return a({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let o = this.resolveActors(e.actor, t);
		if (o.length === 0) return a({
			reason: "no-target",
			message: "Nenhum alvo válido encontrado para modificar recurso.",
			stepIndex: n,
			step: e,
			context: t
		});
		for (let i of o) {
			let a = await this.runResourceOperation(i, e.resource, e.operation, r.value), o = this.handleResourceOperationResult(a, t, n, e);
			if (!o.ok) return o;
		}
		return i(void 0);
	}
	async runChatCardStep(e, t, n) {
		try {
			return await this.messages.createWorkflowSummaryMessage(t, e), i(void 0);
		} catch (r) {
			return a({
				reason: "chat-card-failed",
				message: "Workflow executado, mas falhou ao criar chat card de resumo.",
				stepIndex: n,
				step: e,
				context: t,
				cause: r
			});
		}
	}
	async runResourceOperation(e, t, n, r) {
		switch (n) {
			case "spend": return t !== "PE" && t !== "PD" ? this.invalidResourceOperation(e, t, n, r) : this.resources.spend(e, t, r);
			case "damage": return t !== "PV" && t !== "SAN" ? this.invalidResourceOperation(e, t, n, r) : this.resources.damage(e, t, r);
			case "heal": return t === "PV" ? this.resources.heal(e, t, r) : this.invalidResourceOperation(e, t, n, r);
			case "recover": return t === "SAN" ? this.resources.recover(e, t, r) : this.invalidResourceOperation(e, t, n, r);
		}
	}
	invalidResourceOperation(e, t, n, r) {
		return a({
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
	handleResourceOperationResult(e, t, n, r) {
		return e.ok ? (t.resourceTransactions.push(e.value), i(e.value)) : a({
			reason: "resource-operation-failed",
			message: e.error.message,
			stepIndex: n,
			step: r,
			context: t,
			cause: e.error
		});
	}
	createRollRequest(e, t) {
		let n = e.intent ?? Zt(e.id);
		return {
			id: e.id,
			formula: e.formula,
			intent: n,
			damageType: e.damageType,
			sourceStepIndex: t
		};
	}
	emitSpecificRollPhase(e, t, n, r, i, a) {
		let o = Yt(e, t.intent);
		o && this.lifecycle.emit(o, n, {
			stepIndex: r,
			step: i,
			rollRequest: t,
			rollResult: a
		});
	}
	createApplyMetadata(e, t, n) {
		let r = Z(e.amountFrom), i = r ? t.rolls[r] : void 0;
		return {
			actorSelector: e.actor,
			resource: e.resource,
			operation: e.operation,
			amount: n,
			amountFrom: e.amountFrom,
			rollId: r,
			rollIntent: i?.intent,
			damageType: i?.damageType
		};
	}
	emitSpecificApplyPhase(e, t, n, r, i) {
		let a = Xt(e, t.operation);
		a && this.lifecycle.emit(a, n, {
			stepIndex: r,
			step: t,
			metadata: i
		});
	}
	emitDamageResolutionPhase(e, t, n, r, i) {
		t.operation === "damage" && this.lifecycle.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
			stepIndex: r,
			step: t,
			metadata: i
		});
	}
	recordTypedApplication(e, t, n, r) {
		if (e.operation === "damage") {
			let i = this.createDamageInstance(e, t, n, r);
			t.damageInstances.push(i), this.lifecycle.emit("afterDamageResolution", t, {
				stepIndex: r,
				step: e,
				damage: i,
				resourceTransaction: n,
				metadata: {
					rawAmount: i.rawAmount,
					finalAmount: i.finalAmount,
					appliedAmount: i.appliedAmount,
					damageType: i.damageType
				}
			}), this.lifecycle.emit("afterApplyDamage", t, {
				stepIndex: r,
				step: e,
				damage: i,
				resourceTransaction: n,
				metadata: {
					rawAmount: i.rawAmount,
					finalAmount: i.finalAmount,
					appliedAmount: i.appliedAmount,
					damageType: i.damageType
				}
			});
			return;
		}
		if (e.operation === "heal") {
			let i = this.createHealingInstance(e, t, n, r);
			t.healingInstances.push(i), this.lifecycle.emit("afterApplyHealing", t, {
				stepIndex: r,
				step: e,
				healing: i,
				resourceTransaction: n,
				metadata: {
					rawAmount: i.rawAmount,
					finalAmount: i.finalAmount,
					appliedAmount: i.appliedAmount
				}
			});
		}
	}
	createDamageInstance(e, t, n, r) {
		let i = Z(e.amountFrom), a = i ? t.rolls[i] : void 0;
		return {
			id: Qt(t.id, "damage", r, t.damageInstances.length),
			source: t.item.type === "ritual" ? "ritual" : "automation",
			sourceId: t.item.id ?? null,
			sourceName: t.item.name ?? "Item sem nome",
			targetActorId: n.actorId,
			targetActorName: n.actorName,
			rollId: i ?? void 0,
			damageType: a?.damageType,
			rawAmount: n.requestedAmount,
			finalAmount: n.requestedAmount,
			appliedAmount: n.appliedAmount,
			tags: [
				"workflow",
				"resource",
				e.resource
			]
		};
	}
	createHealingInstance(e, t, n, r) {
		let i = Z(e.amountFrom);
		return {
			id: Qt(t.id, "healing", r, t.healingInstances.length),
			source: t.item.type === "ritual" ? "ritual" : "automation",
			sourceId: t.item.id ?? null,
			sourceName: t.item.name ?? "Item sem nome",
			targetActorId: n.actorId,
			targetActorName: n.actorName,
			rollId: i ?? void 0,
			rawAmount: n.requestedAmount,
			finalAmount: n.requestedAmount,
			appliedAmount: n.appliedAmount,
			tags: [
				"workflow",
				"resource",
				e.resource
			]
		};
	}
	resolveActors(e, t) {
		switch (e) {
			case "self": return [t.sourceActor];
			case "target": return t.targets.flatMap((e) => e.actor ? [e.actor] : []);
		}
	}
	resolveAmount(e, t) {
		if (typeof e.amount == "number") return !Number.isInteger(e.amount) || e.amount <= 0 ? a({
			reason: "invalid-amount-source",
			message: "Amount precisa ser um inteiro positivo."
		}) : i(e.amount);
		if (typeof e.amountFrom == "string") {
			let n = Z(e.amountFrom);
			if (!n) return a({
				reason: "invalid-amount-source",
				message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
			});
			let r = t.rolls[n];
			if (!r) return a({
				reason: "missing-roll-result",
				message: `Resultado da rolagem não encontrado: ${n}.`
			});
			let o = Math.trunc(r.total);
			return !Number.isInteger(o) || o <= 0 ? a({
				reason: "invalid-amount-source",
				message: `Total da rolagem ${n} não gerou um amount positivo.`
			}) : i(o);
		}
		return a({
			reason: "invalid-amount-source",
			message: "Step precisa informar amount ou amountFrom."
		});
	}
};
function Jt(e) {
	switch (e.type) {
		case "spendResource":
		case "spendRitualCost": return {
			before: ["beforeCost", "spendCost"],
			after: ["afterCost"]
		};
		case "chatCard": return {
			before: ["beforeChat", "chat"],
			after: []
		};
		default: return {
			before: [],
			after: []
		};
	}
}
function Yt(e, t) {
	return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
function Xt(e, t) {
	return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
function Zt(e) {
	let t = e.toLowerCase();
	return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Z(e) {
	return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
function Qt(e, t, n, r) {
	return `${e}.${t}.${n}.${r}`;
}
function $t(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/core/resources/resource-engine.ts
var en = class {
	adapter;
	constructor(e) {
		this.adapter = e;
	}
	async spend(e, t, n) {
		return this.execute(e, t, "spend", n);
	}
	async damage(e, t, n) {
		return this.execute(e, t, "damage", n);
	}
	async heal(e, t, n) {
		return this.execute(e, t, "heal", n);
	}
	async recover(e, t, n) {
		return this.execute(e, t, "recover", n);
	}
	async execute(e, t, n, r) {
		if (!Number.isInteger(r) || r <= 0) return a({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: t,
			operation: n,
			reason: "invalid-amount",
			message: "A quantidade deve ser um inteiro positivo.",
			requestedAmount: r
		});
		let o = this.adapter.getResource(e, t);
		if (!o.ok) return a({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: t,
			operation: n,
			reason: o.error.reason,
			message: o.error.message,
			requestedAmount: r,
			path: o.error.path,
			value: o.error.value
		});
		let s = o.value, c = this.calculate(n, s, r);
		if (!c.ok) return a({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: t,
			operation: n,
			reason: c.error.reason,
			message: c.error.message,
			requestedAmount: r,
			current: s.value,
			required: r
		});
		let { afterValue: l, appliedAmount: u } = c.value, d = {
			value: l,
			max: s.max
		};
		try {
			l !== s.value && await this.adapter.updateResourceValue(e, t, l);
		} catch (i) {
			return a({
				actor: e,
				actorId: e.id ?? null,
				actorName: e.name ?? "Ator sem nome",
				resource: t,
				operation: n,
				reason: "update-failed",
				message: `Falha ao atualizar ${t} no ator.`,
				requestedAmount: r,
				current: s.value,
				required: r,
				cause: i
			});
		}
		return i({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: t,
			operation: n,
			requestedAmount: r,
			appliedAmount: u,
			before: s,
			after: d
		});
	}
	calculate(e, t, n) {
		switch (e) {
			case "spend": return t.value < n ? a({
				reason: "insufficient-resource",
				message: `Recurso insuficiente. Atual: ${t.value}; custo: ${n}.`
			}) : i({
				afterValue: t.value - n,
				appliedAmount: n
			});
			case "damage": {
				let e = Math.max(0, t.value - n);
				return i({
					afterValue: e,
					appliedAmount: t.value - e
				});
			}
			case "heal":
			case "recover": {
				let e = Math.min(t.max, t.value + n);
				return i({
					afterValue: e,
					appliedAmount: e - t.value
				});
			}
		}
	}
};
//#endregion
//#region src/core/workflow/workflow-context.ts
function tn(e) {
	return {
		id: nn(),
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
function nn() {
	let e = globalThis.crypto;
	return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
//#endregion
//#region src/core/workflow/workflow-engine.ts
var rn = class {
	automation;
	hooks;
	lastContext = null;
	constructor(e, t) {
		this.automation = e, this.hooks = t;
	}
	getLastContext() {
		return this.lastContext;
	}
	getLastDebugSnapshot() {
		return v(this.lastContext);
	}
	async runAutomation(e, t) {
		let n = tn(t);
		this.lastContext = n, this.hooks.emit("created", n, { metadata: {
			definitionLabel: e.label,
			itemId: n.item.id ?? null,
			itemName: n.item.name ?? "Item sem nome"
		} }), this.hooks.emit("beforeItemUse", n), this.hooks.emit("resolveTargets", n, { metadata: { targetCount: n.targets.length } });
		let r = await this.automation.run(e, n);
		return r.ok ? (this.hooks.emit("completed", n), r) : (this.emitFailed(n, r.error), r);
	}
	emitFailed(e, t) {
		this.hooks.emit("failed", e, {
			stepIndex: t.stepIndex,
			step: t.step,
			metadata: {
				reason: t.reason,
				message: t.message
			}
		});
	}
}, an = class {
	emit(t, n, r = {}) {
		let i = {
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
		}), Hooks.callAll(`${e}.workflow.${t}`, i), Hooks.callAll(`${e}.workflow.phase`, i), i;
	}
}, on = class {
	info(e) {
		this.emit("info", e);
	}
	warn(e) {
		this.emit("warn", e);
	}
	error(e) {
		this.emit("error", e);
	}
	async chat(t) {
		let n = C();
		return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
			speaker: t.speaker,
			content: t.content,
			whisper: cn(),
			flags: {
				...t.flags,
				[e]: {
					...ln(t.flags),
					debugOutput: !0
				}
			}
		}), n.console && t.data !== void 0 && r.info("Debug chat criado.", t.data), !0);
	}
	emit(e, t) {
		let n = C();
		if (!n.enabled) return;
		let r = t.notification ?? sn(t);
		n.console && this.emitConsole(e, t), n.ui && this.emitUi(e, r);
	}
	emitConsole(e, t) {
		let n = sn(t);
		switch (e) {
			case "info":
				r.info(n, t.data ?? "");
				return;
			case "warn":
				r.warn(n, t.data ?? "");
				return;
			case "error":
				r.error(n, t.data ?? "");
				return;
		}
	}
	emitUi(e, t) {
		switch (e) {
			case "info":
				ui.notifications?.info(`Paranormal Toolkit: ${t}`);
				return;
			case "warn":
				ui.notifications?.warn(`Paranormal Toolkit: ${t}`);
				return;
			case "error":
				ui.notifications?.error(`Paranormal Toolkit: ${t}`);
				return;
		}
	}
};
function sn(e) {
	return e.message ? `${e.title}: ${e.message}` : e.title;
}
function cn() {
	let e = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
	return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function ln(t) {
	let n = t?.[e];
	return n && typeof n == "object" && !Array.isArray(n) ? n : {};
}
//#endregion
//#region src/features/item-use/item-use-integration.ts
var un = 1e3, dn = class {
	workflow;
	debugOutput;
	strategies = [];
	recentExecutionKeys = /* @__PURE__ */ new Map();
	lastAttempt = null;
	constructor(e, t) {
		this.workflow = e, this.debugOutput = t;
	}
	addStrategy(e) {
		this.strategies.push(e);
	}
	registerStrategies() {
		for (let e of this.strategies) e.register();
	}
	status() {
		return {
			settings: Ue(),
			strategies: this.strategies.map((e) => e.status()),
			lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null
		};
	}
	async handleItemUsed(e) {
		if (!Ue().autoRun) {
			this.setAttempt(e, "skipped", "auto-run-disabled");
			return;
		}
		let t = o(e.item);
		if (!t.ok) {
			let n = t.error.reason === "missing-automation" ? "ignored" : "failed";
			this.setAttempt(e, n, t.error.reason), t.error.reason === "invalid-automation" && this.debugOutput.warn({
				title: "Automação de item inválida",
				message: t.error.message,
				data: t.error
			});
			return;
		}
		if (!e.actor) {
			this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
				title: "Uso de item sem ator",
				message: `Não foi possível resolver o ator para ${e.item.name}.`,
				data: fn(e, "failed", "missing-actor")
			});
			return;
		}
		if (this.isDuplicate(e)) {
			this.setAttempt(e, "skipped", "duplicate-window");
			return;
		}
		this.markExecution(e), this.setAttempt(e, "running");
		let n = await this.workflow.runAutomation(t.value, {
			sourceActor: e.actor,
			sourceToken: e.token,
			item: e.item,
			targets: e.targets,
			flags: { itemUse: { source: e.source } }
		});
		if (!n.ok) {
			this.setAttempt(e, "failed", n.error.reason), this.handleAutomationFailure(n.error);
			return;
		}
		this.setAttempt(e, "completed"), r.info("Automação executada por uso normal de item.", v(n.value.context));
	}
	handleAutomationFailure(e) {
		let t = `Automação por uso de item falhou: ${e.message}`;
		if (e.reason === "resource-operation-failed") {
			r.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
			return;
		}
		if (e.reason === "chat-card-failed") {
			r.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
			return;
		}
		r.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
	}
	isDuplicate(e) {
		let t = Date.now(), n = pn(e);
		for (let [e, n] of this.recentExecutionKeys.entries()) t - n > un && this.recentExecutionKeys.delete(e);
		let r = this.recentExecutionKeys.get(n);
		return r !== void 0 && t - r <= un;
	}
	markExecution(e) {
		this.recentExecutionKeys.set(pn(e), Date.now());
	}
	setAttempt(e, t, n) {
		this.lastAttempt = fn(e, t, n);
	}
};
function fn(e, t, n) {
	return {
		source: e.source,
		status: t,
		reason: n,
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
function pn(e) {
	return `${e.actor?.id ?? "no-actor"}:${e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item"}`;
}
//#endregion
//#region src/ui/chat-message-service.ts
var mn = class {
	debugOutput;
	constructor(e) {
		this.debugOutput = e;
	}
	async createResourceOperationMessage(t) {
		let n = this.createResourceOperationContent(t.transaction), r = y(t.transaction);
		await this.debugOutput.chat({
			speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
			content: n,
			data: r,
			flags: { [e]: { resourceTransaction: r } }
		});
	}
	async createWorkflowSummaryMessage(t, n) {
		let r = this.createWorkflowSummaryContent(t, n), i = v(t);
		await this.debugOutput.chat({
			speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
			content: r,
			data: i,
			flags: { [e]: { workflowSummary: i } }
		});
	}
	createResourceOperationContent(t) {
		let n = Q(t.actorName), r = Q(t.resource);
		return `
      <section class="${e}-card ${e}-resource-card">
        <header class="${e}-card__header">
          <strong>${Q(gn(t))}</strong>
          <span>${n}</span>
        </header>
        <div class="${e}-card__body">
          <p><strong>${Q(_n(t))}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
	}
	createWorkflowSummaryContent(t, n) {
		let r = Q(n.title ?? "Automação"), i = n.message ? `<p>${Q(n.message)}</p>` : "", a = Q(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), o = Q(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((e) => Q(e.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map((e) => `<li><strong>${Q(e.id)}:</strong> ${Q(e.formula)} = ${e.total} <em>(${Q(hn(e.intent))})</em>${e.damageType ? ` — ${Q(e.damageType)}` : ""}</li>`), l = t.ritualCosts.map((e) => `<li><strong>${Q(e.itemName)}:</strong> ${e.circle}º círculo — ${e.amount} ${Q(e.resource)} (${Q(vn(e.source))})</li>`), u = t.damageInstances.map((e) => `<li><strong>${Q(e.targetActorName)}:</strong> bruto ${e.rawAmount}${e.damageType ? ` ${Q(e.damageType)}` : ""} &rarr; final ${e.finalAmount} &rarr; aplicado ${e.appliedAmount}</li>`), d = t.healingInstances.map((e) => `<li><strong>${Q(e.targetActorName)}:</strong> bruto ${e.rawAmount} &rarr; final ${e.finalAmount} &rarr; aplicado ${e.appliedAmount}</li>`), f = t.resourceTransactions.map((e) => `<li><strong>${Q(e.actorName)}:</strong> ${Q(gn(e))} — ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</li>`), p = t.phases.map((e) => Q(e)).join(" &rarr; ");
		return `
      <section class="${e}-card ${e}-workflow-card">
        <header class="${e}-card__header">
          <strong>${r}</strong>
          <span>${o}</span>
        </header>
        <div class="${e}-card__body">
          ${i}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${s}</p>
          ${l.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${l.join("")}</ul>` : ""}
          ${c.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${c.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Dano:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Cura:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${p.length > 0 ? `<p class="${e}-workflow-card__phases"><strong>Fases:</strong> ${p}</p>` : ""}
        </div>
      </section>
    `;
	}
};
function hn(e) {
	switch (e) {
		case "damage": return "dano";
		case "healing": return "cura";
		case "attack": return "ataque";
		case "resistance": return "resistência";
		case "skill": return "perícia";
		case "ritual": return "ritual";
		default: return "genérica";
	}
}
function gn(e) {
	switch (e.operation) {
		case "spend": return `Gasto de ${e.resource}`;
		case "damage": return `Dano em ${e.resource}`;
		case "heal": return `Cura de ${e.resource}`;
		case "recover": return `Recuperação de ${e.resource}`;
	}
}
function _n(e) {
	switch (e.operation) {
		case "spend": return `${e.resource} gasto`;
		case "damage": return "Dano aplicado";
		case "heal": return "Cura aplicada";
		case "recover": return "Recuperação aplicada";
	}
}
function vn(e) {
	switch (e) {
		case "custom-flag": return "customizado";
		case "default-by-circle": return "padrão por círculo";
		default: return e;
	}
}
function Q(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
//#endregion
//#region src/toolkit-services.ts
function yn() {
	let e = new pt(), t = new en(e), n = new yt(), r = new Ct(n), i = new zt(e), a = new Vt(), o = a.registerMany(Ae());
	if (!o.ok) throw Error(o.error.message);
	let s = new Bt(), c = new on(), l = new mn(c), u = new an(), d = new qt(t, r, l, u), f = new rn(d, u), p = new dn(f, c);
	return p.addStrategy(new Lt((e) => p.handleItemUsed(e))), p.addStrategy(new Ft((e) => p.handleItemUsed(e))), {
		ordem: i,
		resourceAdapter: e,
		ritualAdapter: n,
		ritualCosts: r,
		resources: t,
		automationRegistry: a,
		automationBinder: s,
		debugOutput: c,
		chatMessages: l,
		workflowHooks: u,
		automation: d,
		workflow: f,
		itemUseIntegration: p
	};
}
//#endregion
//#region src/main.ts
var $ = null;
Hooks.once("init", () => {
	we(), He(), r.info("Inicializando módulo.");
}), Hooks.once("ready", () => {
	if (!I.isSupportedSystem()) {
		r.warn(`Sistema não suportado: ${I.getCurrentSystemId()}. O módulo requer ordemparanormal.`);
		return;
	}
	$ = yn(), $.itemUseIntegration.registerStrategies(), Qe($), ut(), at(), r.info("Inicializado para o sistema Ordem Paranormal."), r.info(`API de debug disponível em globalThis["${e}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info("Paranormal Toolkit inicializado.");
});
function bn() {
	if (!$) throw Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
	return $;
}
//#endregion
export { bn as getToolkitServices };

//# sourceMappingURL=main.js.map