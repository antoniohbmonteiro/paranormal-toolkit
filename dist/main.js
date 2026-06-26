//#region src/constants.ts
var e = "paranormal-toolkit", t = class {
	static getSelectedActor() {
		return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
	}
}, n = class {
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
//#region src/core/workflow/workflow-debug-snapshot.ts
function r(e) {
	return e ? {
		id: e.id,
		source: {
			...a(e.sourceActor),
			token: e.sourceToken
		},
		item: o(e.item),
		targets: e.targets.map(s),
		phases: [...e.phases],
		lifecycleEvents: e.lifecycleEvents.map((e) => ({ ...e })),
		rollRequests: u(e.rollRequests, c),
		rolls: u(e.rolls, l),
		ritualCosts: e.ritualCosts.map((e) => ({ ...e })),
		damageInstances: e.damageInstances.map((e) => ({
			...e,
			tags: [...e.tags]
		})),
		healingInstances: e.healingInstances.map((e) => ({
			...e,
			tags: [...e.tags]
		})),
		resourceTransactions: e.resourceTransactions.map(i),
		flagKeys: Object.keys(e.flags)
	} : null;
}
function i(e) {
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
function a(e) {
	return {
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		actorType: e.type ?? "unknown"
	};
}
function o(e) {
	return {
		itemId: e.id ?? null,
		itemName: e.name ?? "Item sem nome",
		itemType: e.type ?? "unknown",
		itemUuid: e.uuid ?? null
	};
}
function s(e) {
	return {
		tokenId: e.tokenId,
		actorId: e.actorId,
		sceneId: e.sceneId,
		name: e.name,
		actorName: e.actor?.name,
		actorType: e.actor?.type
	};
}
function c(e) {
	return {
		id: e.id,
		formula: e.formula,
		intent: e.intent,
		damageType: e.damageType,
		sourceStepIndex: e.sourceStepIndex
	};
}
function l(e) {
	return {
		...c(e),
		total: e.total
	};
}
function u(e, t) {
	return Object.fromEntries(Object.entries(e).map(([e, n]) => [e, t(n)]));
}
//#endregion
//#region src/debug/actor-debug-api.ts
function d(e) {
	return {
		getSelected() {
			return t.getSelectedActor();
		},
		logResources() {
			let t = p("Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário.");
			if (!t) return;
			let r = e.ordem.getActorSnapshot(t);
			n.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && n.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
		},
		async spendPE(t) {
			await f(e, "Gasto de PE", p("Nenhum ator encontrado para gastar PE."), (n) => e.resources.spend(n, "PE", t));
		},
		async spendPD(t) {
			await f(e, "Gasto de PD", p("Nenhum ator encontrado para gastar PD."), (n) => e.resources.spend(n, "PD", t));
		},
		async damagePV(t) {
			await f(e, "Dano em PV", p("Nenhum ator encontrado para causar dano em PV."), (n) => e.resources.damage(n, "PV", t));
		},
		async healPV(t) {
			await f(e, "Cura de PV", p("Nenhum ator encontrado para curar PV."), (n) => e.resources.heal(n, "PV", t));
		},
		async damageSAN(t) {
			await f(e, "Dano em SAN", p("Nenhum ator encontrado para causar dano em SAN."), (n) => e.resources.damage(n, "SAN", t));
		},
		async recoverSAN(t) {
			await f(e, "Recuperação de SAN", p("Nenhum ator encontrado para recuperar SAN."), (n) => e.resources.recover(n, "SAN", t));
		}
	};
}
async function f(e, t, r, a) {
	if (!r) return;
	let o = await a(r);
	if (!o.ok) {
		ee(o.error);
		return;
	}
	let s = o.value;
	try {
		await e.chatMessages.createResourceOperationMessage({ transaction: s });
	} catch (e) {
		n.error(`${t} realizado, mas falhou ao criar o chat card.`, e), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
	}
	n.info(`${t} realizado:`, i(s));
}
function p(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ee(e) {
	if (e.reason === "update-failed") {
		n.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
		n.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	n.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
//#endregion
//#region src/debug/output/debug-output-settings.ts
var m = {
	enabled: "debug.output.enabled",
	console: "debug.output.console",
	ui: "debug.output.ui",
	chat: "debug.output.chat"
};
function te() {
	_(m.enabled, {
		name: "Ativar debug do Paranormal Toolkit",
		hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
		default: !1
	}), _(m.console, {
		name: "Debug no console",
		hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
		default: !0
	}), _(m.ui, {
		name: "Debug como notificação",
		hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
		default: !0
	}), _(m.chat, {
		name: "Debug no chat",
		hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
		default: !1
	});
}
function h() {
	return {
		enabled: v(m.enabled),
		console: v(m.console),
		ui: v(m.ui),
		chat: v(m.chat)
	};
}
async function g(t, n) {
	await game.settings.set(e, m[t], n);
}
function _(t, n) {
	game.settings.register(e, t, {
		name: n.name,
		hint: n.hint,
		scope: "world",
		config: !0,
		type: Boolean,
		default: n.default
	});
}
function v(t) {
	return game.settings.get(e, t) === !0;
}
//#endregion
//#region src/debug/output/debug-output-api.ts
function ne() {
	return {
		status() {
			return h();
		},
		async enable() {
			await g("enabled", !0);
		},
		async disable() {
			await g("enabled", !1);
		},
		async enableConsole() {
			await g("console", !0);
		},
		async disableConsole() {
			await g("console", !1);
		},
		async enableUi() {
			await g("ui", !0);
		},
		async disableUi() {
			await g("ui", !1);
		},
		async enableChat() {
			await g("chat", !0);
		},
		async disableChat() {
			await g("chat", !1);
		}
	};
}
//#endregion
//#region src/core/result.ts
function y(e) {
	return {
		ok: !0,
		value: e
	};
}
function b(e) {
	return {
		ok: !1,
		error: e
	};
}
//#endregion
//#region src/features/automation/automation-flag-reader.ts
function x(t) {
	let n = t.getFlag(e, "automation");
	return n == null ? b({
		reason: "missing-automation",
		message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
	}) : se(n) ? y(n) : b({
		reason: "invalid-automation",
		message: `Automação do item ${t.name} é inválida ou não é suportada.`,
		value: n
	});
}
function re() {
	return {
		version: 1,
		label: "Gasto de custo de ritual",
		steps: [{ type: "spendRitualCost" }, {
			type: "chatCard",
			title: "Gasto de custo de ritual",
			message: "Calcula o custo do ritual pelo círculo e gasta o recurso configurado."
		}]
	};
}
function ie(e = "1d8") {
	return {
		version: 1,
		label: "Ritual de cura simples",
		steps: [
			{ type: "spendRitualCost" },
			{
				type: "rollFormula",
				id: "healing",
				formula: e,
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
	};
}
function ae(e = "1d8") {
	return {
		version: 1,
		label: "Ritual de dano simples",
		steps: [
			{ type: "spendRitualCost" },
			{
				type: "rollFormula",
				id: "damage",
				formula: e,
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
	};
}
function oe() {
	return {
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
	};
}
async function S(t, n) {
	await t.setFlag(e, "automation", n);
}
function se(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(ce);
}
function ce(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	switch (t.type) {
		case "spendResource": return le(t);
		case "spendRitualCost": return ue(t);
		case "rollFormula": return de(t);
		case "modifyResource": return fe(t);
		case "chatCard": return pe(t);
		default: return !1;
	}
}
function le(e) {
	let t = e;
	return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && C(t);
}
function ue(e) {
	return e.type === "spendRitualCost";
}
function de(e) {
	let t = e;
	return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || _e(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function fe(e) {
	let t = e;
	return t.type === "modifyResource" && me(t.actor) && he(t.resource) && ge(t.operation) && C(t);
}
function pe(e) {
	let t = e;
	return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function C(e) {
	return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function me(e) {
	return e === "self" || e === "target";
}
function he(e) {
	return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ge(e) {
	return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function _e(e) {
	return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function w(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/automation/workflow-target-resolver.ts
function T() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: D(e.id),
		actorId: D(e.actor?.id),
		sceneId: D(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome",
		actor: e.actor ?? null
	}));
}
function E() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null;
	return {
		tokenId: D(e.id),
		actorId: D(t?.id),
		sceneId: D(e.scene?.id),
		name: e.name ?? t?.name ?? "Origem sem nome"
	};
}
function D(e) {
	return typeof e == "string" && e.length > 0 ? e : null;
}
//#endregion
//#region src/features/automation/actor-item-resolver.ts
function O(e) {
	let t = e.items;
	if (Array.isArray(t)) return t;
	if (t && typeof t == "object") {
		let e = t;
		if (Array.isArray(e.contents)) return e.contents.filter(k);
		if (xe(t)) return Array.from(t).filter(k);
	}
	return [];
}
function ve(e) {
	return O(e)[0] ?? null;
}
function ye(e) {
	return O(e).find(be) ?? null;
}
function be(t) {
	return t.getFlag(e, "automation") !== void 0;
}
function xe(e) {
	return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function k(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/features/rituals/ritual-item-resolver.ts
function Se(e) {
	return O(e).filter((e) => e.type === "ritual");
}
function Ce(e) {
	return Se(e)[0] ?? null;
}
//#endregion
//#region src/debug/ritual-debug-api.ts
function we(t) {
	return {
		logFirstRitualCost() {
			let e = A("Nenhum ator encontrado para consultar custo de ritual.");
			if (!e) return;
			let r = j(e);
			if (!r) return;
			let i = t.ritualCosts.getCost({
				actor: e,
				ritual: r
			});
			if (!i.ok) {
				n.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
				return;
			}
			n.info("Custo do primeiro ritual:", {
				actor: e.name,
				ritual: r.name,
				cost: i.value
			}), ui.notifications?.info(`Paranormal Toolkit: ${r.name} custa ${i.value.amount} ${i.value.resource} (${i.value.circle}º círculo).`);
		},
		async setCustomCostOnFirstRitual(t, r = "PE") {
			let i = A("Nenhum ator encontrado para configurar custo customizado.");
			if (!i) return;
			let a = j(i);
			if (a) {
				if (!De(t, r)) {
					ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
					return;
				}
				await a.setFlag(e, "ritual.cost", {
					resource: r,
					amount: t
				}), n.info(`Custo customizado aplicado em ${a.name}.`, {
					resource: r,
					amount: t
				}), ui.notifications?.info(`Paranormal Toolkit: ${a.name} agora custa ${t} ${r}.`);
			}
		},
		async clearCustomCostOnFirstRitual() {
			let t = A("Nenhum ator encontrado para limpar custo customizado.");
			if (!t) return;
			let r = j(t);
			r && (await r.unsetFlag(e, "ritual.cost"), n.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
		},
		async setTestCostAutomationOnFirstRitual() {
			let e = A("Nenhum ator encontrado para configurar automação de custo de ritual.");
			if (!e) return;
			let t = j(e);
			t && (await S(t, re()), n.info(`Automação de custo aplicada ao ritual: ${t.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${t.name}.`));
		},
		async setTestHealingAutomationOnFirstRitual(e = "1d8") {
			let t = A("Nenhum ator encontrado para configurar ritual de cura simples.");
			if (!t) return;
			let r = j(t);
			if (r) {
				if (!M(e)) {
					ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
					return;
				}
				await S(r, ie(e)), n.info(`Automação de cura simples aplicada ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
			}
		},
		async setTestDamageAutomationOnFirstRitual(e = "1d8") {
			let t = A("Nenhum ator encontrado para configurar ritual de dano simples.");
			if (!t) return;
			let r = j(t);
			if (r) {
				if (!M(e)) {
					ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
					return;
				}
				await S(r, ae(e)), n.info(`Automação de dano simples aplicada ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
			}
		},
		async runFirstRitualAutomation() {
			let e = A("Nenhum ator encontrado para executar automação de ritual.");
			if (!e) return;
			let n = j(e);
			n && await Te(t, e, n);
		}
	};
}
async function Te(e, t, i) {
	let a = x(i);
	if (!a.ok) {
		n.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
		return;
	}
	let o = await e.workflow.runAutomation(a.value, {
		sourceActor: t,
		sourceToken: E(),
		item: i,
		targets: T()
	});
	if (!o.ok) {
		Ee(o.error);
		return;
	}
	n.info("Automação de ritual executada com sucesso.", r(o.value.context));
}
function Ee(e) {
	let t = `Automação de ritual falhou: ${e.message}`;
	if (e.reason === "resource-operation-failed") {
		n.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	if (e.reason === "chat-card-failed") {
		n.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	n.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function A(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function j(e) {
	return Ce(e) || (n.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function De(e, t) {
	return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function M(e) {
	return typeof e == "string" && e.trim().length > 0;
}
//#endregion
//#region src/core/workflow/workflow-phase.ts
var Oe = /* @__PURE__ */ "created.beforeItemUse.resolveTargets.beforeCost.spendCost.afterCost.beforeRoll.beforeDamageRoll.beforeHealingRoll.roll.damageRoll.healingRoll.afterDamageRoll.afterHealingRoll.afterRoll.beforeDamageResolution.damageResolution.afterDamageResolution.beforeApply.beforeApplyDamage.beforeApplyHealing.apply.applyDamage.applyHealing.afterApplyDamage.afterApplyHealing.afterApply.beforeChat.chat.completed.failed".split(".");
//#endregion
//#region src/debug/workflow-debug-api.ts
function ke(e) {
	return {
		phases() {
			return Oe;
		},
		lastContext() {
			return e.workflow.getLastDebugSnapshot();
		},
		async runFirstAutomation() {
			let t = P("Nenhum ator encontrado para executar automação.");
			if (!t) return;
			let r = ye(t);
			if (!r) {
				n.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
				return;
			}
			await N(e, t, r);
		},
		async runSelectedItemAutomation() {
			await this.runFirstAutomation();
		},
		async runItemAutomationByUuid(t) {
			if (!t || typeof t != "string") {
				ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
				return;
			}
			let r = await fromUuid(t);
			if (!Me(r)) {
				n.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
				return;
			}
			let i = je(r) ?? P("Nenhum ator encontrado para executar automação do item.");
			i && await N(e, i, r);
		},
		async setTestHealingAutomationOnFirstItem() {
			let e = P("Nenhum ator encontrado para configurar automação de teste.");
			if (!e) return;
			let t = ve(e);
			if (!t) {
				n.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
				return;
			}
			try {
				await S(t, oe()), n.info(`Automação de teste aplicada ao item: ${t.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${t.name}.`);
			} catch (e) {
				n.error("Falha ao configurar automação de teste no item.", e), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
			}
		}
	};
}
async function N(e, t, i) {
	let a = x(i);
	if (!a.ok) {
		n.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
		return;
	}
	let o = await e.workflow.runAutomation(a.value, {
		sourceActor: t,
		sourceToken: E(),
		item: i,
		targets: T()
	});
	if (!o.ok) {
		Ae(o.error);
		return;
	}
	n.info("Automação executada com sucesso.", r(o.value.context));
}
function Ae(e) {
	let t = `Automação falhou: ${e.message}`;
	if (e.reason === "resource-operation-failed") {
		n.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	if (e.reason === "chat-card-failed") {
		n.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	n.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function P(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function je(e) {
	let t = e.parent;
	return t instanceof Actor ? t : null;
}
function Me(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/debug/debug-api.ts
function Ne(e) {
	let t = d(e);
	return {
		actor: t,
		ritual: we(e),
		workflow: ke(e),
		output: ne(),
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
function Pe(t) {
	let n = {
		services: t,
		ordem: t.ordem,
		resources: t.resources,
		ritualCosts: t.ritualCosts,
		automation: t.automation,
		workflow: t.workflow,
		debug: Ne(t)
	}, r = globalThis;
	return r[e] = n, r.ParanormalToolkit = n, n;
}
//#endregion
//#region src/core/system-guard.ts
var F = class {
	static isSupportedSystem() {
		return game.system.id === "ordemparanormal";
	}
	static getCurrentSystemId() {
		return game.system.id;
	}
};
//#endregion
//#region src/features/chat/chat-workflow-flags.ts
function Fe() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: L(e.id),
		actorId: L(e.actor?.id),
		sceneId: L(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome"
	}));
}
function I() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
	return {
		tokenId: L(e.id),
		actorId: L(t?.id),
		sceneId: L(e.scene?.id),
		name: n
	};
}
function Ie(e, t = I()) {
	return {
		version: 1,
		kind: "chat-targets",
		source: t,
		targets: e
	};
}
function Le(t) {
	if (!He(t)) return null;
	let n = t.getFlag(e, "workflow");
	return Ve(n) ? n : null;
}
function Re() {
	return `flags.${e}.workflow`;
}
function ze(t) {
	if (!t || typeof t != "object") return !1;
	let n = foundry.utils.getProperty(t, `flags.${e}`), r = foundry.utils.getProperty(t, `_source.flags.${e}`);
	return n !== void 0 || r !== void 0;
}
function Be(e) {
	let t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
	return R(t) || R(n);
}
function Ve(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function He(e) {
	return !!(e && typeof e == "object" && "getFlag" in e);
}
function L(e) {
	return R(e) ? e : null;
}
function R(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/chat/chat-enrichment-renderer.ts
function Ue() {
	Hooks.on("renderChatMessageHTML", (e, t) => {
		We(e, t);
	});
}
function We(e, t) {
	let n = Le(e);
	if (!n || n.targets.length === 0) return;
	let r = Ke(t);
	r && (r.querySelector(".paranormal-toolkit-chat-enrichment") || (r.querySelector(".message-content") ?? r).append(Ge(n)));
}
function Ge(t) {
	let n = document.createElement("section");
	n.classList.add(`${e}-chat-enrichment`);
	let r = document.createElement("strong");
	return r.textContent = "Paranormal Toolkit", n.append(r), t.source && n.append(z("Origem", t.source.name)), n.append(z("Alvo", t.targets.map((e) => e.name).join(", "))), n;
}
function z(t, n) {
	let r = document.createElement("p");
	r.classList.add(`${e}-chat-enrichment__row`);
	let i = document.createElement("span");
	i.textContent = `${t}: `;
	let a = document.createElement("span");
	return a.textContent = n, r.append(i, a), r;
}
function Ke(e) {
	if (e instanceof HTMLElement) return e;
	if (e && typeof e == "object") {
		let t = e;
		if (t[0] instanceof HTMLElement) return t[0];
	}
	return null;
}
//#endregion
//#region src/features/chat/chat-target-capture.ts
function qe() {
	Hooks.on("preCreateChatMessage", (e, t, r, i) => {
		if (!Je(i) || !Ye(e) || ze(e) || ze(t)) return;
		let a = Fe();
		if (a.length === 0 || !Be(e) && !Be(t)) return;
		let o = I();
		e.updateSource({ [Re()]: Ie(a, o) }), n.info("Targets capturados para ChatMessage.", {
			source: o,
			targets: a
		});
	});
}
function Je(e) {
	let t = game.user?.id;
	return !t || typeof e != "string" ? !0 : e === t;
}
function Ye(e) {
	return !!(e && typeof e == "object" && "updateSource" in e);
}
//#endregion
//#region src/adapters/ordem/ordem-paths.ts
var B = {
	PV: "system.PV",
	SAN: "system.SAN",
	PE: "system.PE",
	PD: "system.PD"
}, V = { PV: "system.attributes.hp" }, H = {
	PV: [B.PV, V.PV],
	SAN: [B.SAN],
	PE: [B.PE],
	PD: [B.PD]
}, U = {
	ritual: { dt: "system.ritual.DT" },
	ritualItem: { circleCandidates: ["system.circle", "system.ritual.circle"] },
	weapon: {
		category: "system.category",
		attackFormula: "system.formulas.attack",
		damageFormula: "system.formulas.damage",
		critical: "system.critical"
	}
}, Xe = class {
	getResource(e, t) {
		let n = W(e, t);
		if (!n.ok) return b(n.error);
		let r = n.value, i = `${r}.value`, a = `${r}.max`, o = foundry.utils.getProperty(e, i), s = foundry.utils.getProperty(e, a), c = K(e, t, i, o, "valor atual");
		if (c) return b(c);
		let l = K(e, t, a, s, "valor máximo");
		return l ? b(l) : y({
			value: o,
			max: s
		});
	}
	async updateResourceValue(e, t, n) {
		let r = W(e, t);
		if (!r.ok) throw Error(r.error.message);
		await e.update({ [`${r.value}.value`]: n });
	}
};
function W(e, t) {
	let n = Ze(e.type, t);
	if (n && G(e, n)) return y(n);
	let r = H[t].find((t) => G(e, t));
	return r ? y(r) : b({
		actor: e,
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		actorType: e.type ?? "unknown",
		resource: t,
		reason: "resource-path-not-found",
		message: Qe(e, t),
		path: H[t].join(" | ")
	});
}
function Ze(e, t) {
	return e === "threat" ? V[t] ?? null : e === "agent" ? B[t] : null;
}
function G(e, t) {
	let n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
	return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Qe(e, t) {
	let n = e.type ?? "unknown", r = H[t].join(", ");
	return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function K(e, t, n, r, i) {
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
var $e = class {
	isRitual(e) {
		return e.type === "ritual";
	}
	getCircle(e) {
		if (!this.isRitual(e)) return b({
			reason: "not-a-ritual",
			message: `Item ${e.name ?? "sem nome"} não é um ritual.`,
			ritual: e
		});
		let t = this.readCircleFromKnownPaths(e);
		if (!t) {
			let t = U.ritualItem.circleCandidates;
			return b({
				reason: "ritual-circle-not-found",
				message: `Círculo do ritual não encontrado. Paths testados: ${t.join(", ")}.`,
				ritual: e,
				paths: [...t]
			});
		}
		let { path: n, value: r } = t, i = et(r);
		return i ? y(i) : b({
			reason: "invalid-ritual-circle",
			message: `Círculo do ritual inválido em ${n}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
			ritual: e,
			path: n,
			value: r
		});
	}
	readCircleFromKnownPaths(e) {
		for (let t of U.ritualItem.circleCandidates) {
			let n = foundry.utils.getProperty(e, t);
			if (n != null) return {
				path: t,
				value: n
			};
		}
		return null;
	}
};
function et(e) {
	if (q(e)) return e;
	if (typeof e == "string") {
		let t = e.trim();
		if (!/^\d+$/.test(t)) return null;
		let n = Number(t);
		if (q(n)) return n;
	}
	return null;
}
function q(e) {
	return e === 1 || e === 2 || e === 3 || e === 4;
}
//#endregion
//#region src/adapters/ordem/ordem-ritual-cost-provider.ts
var tt = {
	1: 1,
	2: 3,
	3: 6,
	4: 10
}, nt = class {
	ritualAdapter;
	constructor(e) {
		this.ritualAdapter = e;
	}
	getCost(e) {
		let t = this.ritualAdapter.getCircle(e.ritual);
		if (!t.ok) return b({
			...t.error,
			actor: e.actor
		});
		let n = t.value, r = rt(e.ritual, n);
		return r.ok ? r.value ? y(r.value) : y({
			resource: "PE",
			amount: tt[n],
			source: "default-by-circle",
			circle: n
		}) : b(r.error);
	}
};
function rt(t, n) {
	let r = t.getFlag(e, "ritual.cost");
	return r == null ? {
		ok: !0,
		value: null
	} : it(r) ? {
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
function it(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
//#endregion
//#region src/adapters/ordem/ordem-system-adapter.ts
var at = class {
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
		return this.getNumber(e, U.ritual.dt, 0);
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
}, ot = class {
	resources;
	ritualCosts;
	messages;
	lifecycle;
	constructor(e, t, n, r) {
		this.resources = e, this.ritualCosts = t, this.messages = n, this.lifecycle = r;
	}
	async run(e, t) {
		if (e.steps.length === 0) return b({
			reason: "empty-automation",
			message: "A automação não possui steps para executar.",
			context: t
		});
		for (let [n, r] of e.steps.entries()) {
			let e = await this.runStep(r, t, n);
			if (!e.ok) return e;
		}
		return y({
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
		let r = st(e);
		for (let i of r.before) this.lifecycle.emit(i, t, {
			stepIndex: n,
			step: e
		});
		let i = await this.executeStep(e, t, n);
		if (!i.ok) return i;
		for (let i of r.after) this.lifecycle.emit(i, t, {
			stepIndex: n,
			step: e
		});
		return y(void 0);
	}
	async executeStep(e, t, n) {
		switch (e.type) {
			case "spendResource": return this.runSpendResourceStep(e, t, n);
			case "spendRitualCost": return this.runSpendRitualCostStep(e, t, n);
			case "rollFormula": return this.runRollFormulaStep(e, t, n);
			case "modifyResource": return this.runModifyResourceStep(e, t, n);
			case "chatCard": return this.runChatCardStep(e, t, n);
			default: return b({
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
		if (!r.ok) return b({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let i = await this.resources.spend(t.sourceActor, e.resource, r.value), a = this.handleResourceOperationResult(i, t, n, e);
		return a.ok ? y(void 0) : a;
	}
	async runSpendRitualCostStep(e, t, n) {
		let r = this.ritualCosts.getCost({
			actor: t.sourceActor,
			ritual: t.item
		});
		if (!r.ok) return b({
			reason: "ritual-cost-failed",
			message: r.error.message,
			stepIndex: n,
			step: e,
			context: t,
			cause: r.error
		});
		let i = r.value;
		t.ritualCosts.push({
			...i,
			itemId: t.item.id ?? null,
			itemName: t.item.name ?? "Ritual sem nome"
		});
		let a = await this.resources.spend(t.sourceActor, i.resource, i.amount), o = this.handleResourceOperationResult(a, t, n, e);
		return o.ok ? y(void 0) : o;
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
		let i = await this.runRollFormulaStep(e, t, n);
		if (!i.ok) return i;
		let a = t.rolls[r.id];
		return this.emitSpecificRollPhase("after", r, t, n, e, a), this.lifecycle.emit("afterRoll", t, {
			stepIndex: n,
			step: e,
			rollRequest: r,
			rollResult: a
		}), y(void 0);
	}
	async runRollFormulaStep(e, t, n) {
		if (!X(e.id) || !X(e.formula)) return b({
			reason: "invalid-step",
			message: "Step rollFormula precisa de id e formula.",
			stepIndex: n,
			step: e,
			context: t
		});
		try {
			let r = new Roll(e.formula), i = await Promise.resolve(r.evaluate()), a = i.total;
			if (typeof a != "number" || !Number.isFinite(a)) return b({
				reason: "roll-failed",
				message: `A rolagem ${e.id} não retornou um total numérico válido.`,
				stepIndex: n,
				step: e,
				context: t
			});
			let o = t.rollRequests[e.id] ?? this.createRollRequest(e, n);
			return t.rolls[e.id] = {
				...o,
				total: a,
				roll: i
			}, y(void 0);
		} catch (r) {
			return b({
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
		if (!r.ok) return b({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let i = this.createApplyMetadata(e, t, r.value);
		this.lifecycle.emit("beforeApply", t, {
			stepIndex: n,
			step: e,
			metadata: i
		}), this.emitSpecificApplyPhase("before", e, t, n, i), this.emitDamageResolutionPhase("before", e, t, n, i), this.emitDamageResolutionPhase("resolve", e, t, n, i), this.lifecycle.emit("apply", t, {
			stepIndex: n,
			step: e,
			metadata: i
		}), this.emitSpecificApplyPhase("apply", e, t, n, i);
		let a = this.resolveActors(e.actor, t);
		if (a.length === 0) return b({
			reason: "no-target",
			message: "Nenhum alvo válido encontrado para modificar recurso.",
			stepIndex: n,
			step: e,
			context: t
		});
		for (let i of a) {
			let a = await this.runResourceOperation(i, e.resource, e.operation, r.value), o = this.handleResourceOperationResult(a, t, n, e);
			if (!o.ok) return o;
			this.recordTypedApplication(e, t, o.value, n);
		}
		return this.lifecycle.emit("afterApply", t, {
			stepIndex: n,
			step: e,
			metadata: i
		}), y(void 0);
	}
	async runModifyResourceStep(e, t, n) {
		let r = this.resolveAmount(e, t);
		if (!r.ok) return b({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let i = this.resolveActors(e.actor, t);
		if (i.length === 0) return b({
			reason: "no-target",
			message: "Nenhum alvo válido encontrado para modificar recurso.",
			stepIndex: n,
			step: e,
			context: t
		});
		for (let a of i) {
			let i = await this.runResourceOperation(a, e.resource, e.operation, r.value), o = this.handleResourceOperationResult(i, t, n, e);
			if (!o.ok) return o;
		}
		return y(void 0);
	}
	async runChatCardStep(e, t, n) {
		try {
			return await this.messages.createWorkflowSummaryMessage(t, e), y(void 0);
		} catch (r) {
			return b({
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
		return b({
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
		return e.ok ? (t.resourceTransactions.push(e.value), y(e.value)) : b({
			reason: "resource-operation-failed",
			message: e.error.message,
			stepIndex: n,
			step: r,
			context: t,
			cause: e.error
		});
	}
	createRollRequest(e, t) {
		let n = e.intent ?? ut(e.id);
		return {
			id: e.id,
			formula: e.formula,
			intent: n,
			damageType: e.damageType,
			sourceStepIndex: t
		};
	}
	emitSpecificRollPhase(e, t, n, r, i, a) {
		let o = ct(e, t.intent);
		o && this.lifecycle.emit(o, n, {
			stepIndex: r,
			step: i,
			rollRequest: t,
			rollResult: a
		});
	}
	createApplyMetadata(e, t, n) {
		let r = J(e.amountFrom), i = r ? t.rolls[r] : void 0;
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
		let a = lt(e, t.operation);
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
		let i = J(e.amountFrom), a = i ? t.rolls[i] : void 0;
		return {
			id: Y(t.id, "damage", r, t.damageInstances.length),
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
		let i = J(e.amountFrom);
		return {
			id: Y(t.id, "healing", r, t.healingInstances.length),
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
		if (typeof e.amount == "number") return !Number.isInteger(e.amount) || e.amount <= 0 ? b({
			reason: "invalid-amount-source",
			message: "Amount precisa ser um inteiro positivo."
		}) : y(e.amount);
		if (typeof e.amountFrom == "string") {
			let n = J(e.amountFrom);
			if (!n) return b({
				reason: "invalid-amount-source",
				message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
			});
			let r = t.rolls[n];
			if (!r) return b({
				reason: "missing-roll-result",
				message: `Resultado da rolagem não encontrado: ${n}.`
			});
			let i = Math.trunc(r.total);
			return !Number.isInteger(i) || i <= 0 ? b({
				reason: "invalid-amount-source",
				message: `Total da rolagem ${n} não gerou um amount positivo.`
			}) : y(i);
		}
		return b({
			reason: "invalid-amount-source",
			message: "Step precisa informar amount ou amountFrom."
		});
	}
};
function st(e) {
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
function ct(e, t) {
	return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
function lt(e, t) {
	return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
function ut(e) {
	let t = e.toLowerCase();
	return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function J(e) {
	return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
function Y(e, t, n, r) {
	return `${e}.${t}.${n}.${r}`;
}
function X(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/core/resources/resource-engine.ts
var dt = class {
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
		if (!Number.isInteger(r) || r <= 0) return b({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: t,
			operation: n,
			reason: "invalid-amount",
			message: "A quantidade deve ser um inteiro positivo.",
			requestedAmount: r
		});
		let i = this.adapter.getResource(e, t);
		if (!i.ok) return b({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: t,
			operation: n,
			reason: i.error.reason,
			message: i.error.message,
			requestedAmount: r,
			path: i.error.path,
			value: i.error.value
		});
		let a = i.value, o = this.calculate(n, a, r);
		if (!o.ok) return b({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: t,
			operation: n,
			reason: o.error.reason,
			message: o.error.message,
			requestedAmount: r,
			current: a.value,
			required: r
		});
		let { afterValue: s, appliedAmount: c } = o.value, l = {
			value: s,
			max: a.max
		};
		try {
			s !== a.value && await this.adapter.updateResourceValue(e, t, s);
		} catch (i) {
			return b({
				actor: e,
				actorId: e.id ?? null,
				actorName: e.name ?? "Ator sem nome",
				resource: t,
				operation: n,
				reason: "update-failed",
				message: `Falha ao atualizar ${t} no ator.`,
				requestedAmount: r,
				current: a.value,
				required: r,
				cause: i
			});
		}
		return y({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: t,
			operation: n,
			requestedAmount: r,
			appliedAmount: c,
			before: a,
			after: l
		});
	}
	calculate(e, t, n) {
		switch (e) {
			case "spend": return t.value < n ? b({
				reason: "insufficient-resource",
				message: `Recurso insuficiente. Atual: ${t.value}; custo: ${n}.`
			}) : y({
				afterValue: t.value - n,
				appliedAmount: n
			});
			case "damage": {
				let e = Math.max(0, t.value - n);
				return y({
					afterValue: e,
					appliedAmount: t.value - e
				});
			}
			case "heal":
			case "recover": {
				let e = Math.min(t.max, t.value + n);
				return y({
					afterValue: e,
					appliedAmount: e - t.value
				});
			}
		}
	}
};
//#endregion
//#region src/core/workflow/workflow-context.ts
function ft(e) {
	return {
		id: pt(),
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
function pt() {
	let e = globalThis.crypto;
	return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
//#endregion
//#region src/core/workflow/workflow-engine.ts
var mt = class {
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
		return r(this.lastContext);
	}
	async runAutomation(e, t) {
		let n = ft(t);
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
}, ht = class {
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
}, gt = class {
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
		let r = h();
		return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
			speaker: t.speaker,
			content: t.content,
			whisper: _t(),
			flags: {
				...t.flags,
				[e]: {
					...vt(t.flags),
					debugOutput: !0
				}
			}
		}), r.console && t.data !== void 0 && n.info("Debug chat criado.", t.data), !0);
	}
	emit(e, t) {
		let n = h();
		if (!n.enabled) return;
		let r = t.notification ?? Z(t);
		n.console && this.emitConsole(e, t), n.ui && this.emitUi(e, r);
	}
	emitConsole(e, t) {
		let r = Z(t);
		switch (e) {
			case "info":
				n.info(r, t.data ?? "");
				return;
			case "warn":
				n.warn(r, t.data ?? "");
				return;
			case "error":
				n.error(r, t.data ?? "");
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
function Z(e) {
	return e.message ? `${e.title}: ${e.message}` : e.title;
}
function _t() {
	let e = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
	return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function vt(t) {
	let n = t?.[e];
	return n && typeof n == "object" && !Array.isArray(n) ? n : {};
}
//#endregion
//#region src/ui/chat-message-service.ts
var yt = class {
	debugOutput;
	constructor(e) {
		this.debugOutput = e;
	}
	async createResourceOperationMessage(t) {
		let n = this.createResourceOperationContent(t.transaction), r = i(t.transaction);
		await this.debugOutput.chat({
			speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
			content: n,
			data: r,
			flags: { [e]: { resourceTransaction: r } }
		});
	}
	async createWorkflowSummaryMessage(t, n) {
		let i = this.createWorkflowSummaryContent(t, n), a = r(t);
		await this.debugOutput.chat({
			speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
			content: i,
			data: a,
			flags: { [e]: { workflowSummary: a } }
		});
	}
	createResourceOperationContent(t) {
		let n = Q(t.actorName), r = Q(t.resource);
		return `
      <section class="${e}-card ${e}-resource-card">
        <header class="${e}-card__header">
          <strong>${Q(xt(t))}</strong>
          <span>${n}</span>
        </header>
        <div class="${e}-card__body">
          <p><strong>${Q(St(t))}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
	}
	createWorkflowSummaryContent(t, n) {
		let r = Q(n.title ?? "Automação"), i = n.message ? `<p>${Q(n.message)}</p>` : "", a = Q(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), o = Q(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((e) => Q(e.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map((e) => `<li><strong>${Q(e.id)}:</strong> ${Q(e.formula)} = ${e.total} <em>(${Q(bt(e.intent))})</em>${e.damageType ? ` — ${Q(e.damageType)}` : ""}</li>`), l = t.ritualCosts.map((e) => `<li><strong>${Q(e.itemName)}:</strong> ${e.circle}º círculo — ${e.amount} ${Q(e.resource)} (${Q(Ct(e.source))})</li>`), u = t.damageInstances.map((e) => `<li><strong>${Q(e.targetActorName)}:</strong> bruto ${e.rawAmount}${e.damageType ? ` ${Q(e.damageType)}` : ""} &rarr; final ${e.finalAmount} &rarr; aplicado ${e.appliedAmount}</li>`), d = t.healingInstances.map((e) => `<li><strong>${Q(e.targetActorName)}:</strong> bruto ${e.rawAmount} &rarr; final ${e.finalAmount} &rarr; aplicado ${e.appliedAmount}</li>`), f = t.resourceTransactions.map((e) => `<li><strong>${Q(e.actorName)}:</strong> ${Q(xt(e))} — ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</li>`), p = t.phases.map((e) => Q(e)).join(" &rarr; ");
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
function bt(e) {
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
function xt(e) {
	switch (e.operation) {
		case "spend": return `Gasto de ${e.resource}`;
		case "damage": return `Dano em ${e.resource}`;
		case "heal": return `Cura de ${e.resource}`;
		case "recover": return `Recuperação de ${e.resource}`;
	}
}
function St(e) {
	switch (e.operation) {
		case "spend": return `${e.resource} gasto`;
		case "damage": return "Dano aplicado";
		case "heal": return "Cura aplicada";
		case "recover": return "Recuperação aplicada";
	}
}
function Ct(e) {
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
function wt() {
	let e = new Xe(), t = new dt(e), n = new $e(), r = new nt(n), i = new at(e), a = new gt(), o = new yt(a), s = new ht(), c = new ot(t, r, o, s);
	return {
		ordem: i,
		resourceAdapter: e,
		ritualAdapter: n,
		ritualCosts: r,
		resources: t,
		debugOutput: a,
		chatMessages: o,
		workflowHooks: s,
		automation: c,
		workflow: new mt(c, s)
	};
}
//#endregion
//#region src/main.ts
var $ = null;
Hooks.once("init", () => {
	te(), n.info("Inicializando módulo.");
}), Hooks.once("ready", () => {
	if (!F.isSupportedSystem()) {
		n.warn(`Sistema não suportado: ${F.getCurrentSystemId()}. O módulo requer ordemparanormal.`);
		return;
	}
	$ = wt(), Pe($), qe(), Ue(), n.info("Inicializado para o sistema Ordem Paranormal."), n.info(`API de debug disponível em globalThis["${e}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info("Paranormal Toolkit inicializado.");
});
function Tt() {
	if (!$) throw Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
	return $;
}
//#endregion
export { Tt as getToolkitServices };

//# sourceMappingURL=main.js.map