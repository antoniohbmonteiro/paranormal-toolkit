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
//#region src/debug/actor-debug-api.ts
function r(e) {
	return {
		getSelected() {
			return t.getSelectedActor();
		},
		logResources() {
			let t = a("Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário.");
			if (!t) return;
			let r = e.ordem.getActorSnapshot(t);
			n.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && n.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
		},
		async spendPE(t) {
			await i(e, "Gasto de PE", a("Nenhum ator encontrado para gastar PE."), (n) => e.resources.spend(n, "PE", t));
		},
		async spendPD(t) {
			await i(e, "Gasto de PD", a("Nenhum ator encontrado para gastar PD."), (n) => e.resources.spend(n, "PD", t));
		},
		async damagePV(t) {
			await i(e, "Dano em PV", a("Nenhum ator encontrado para causar dano em PV."), (n) => e.resources.damage(n, "PV", t));
		},
		async healPV(t) {
			await i(e, "Cura de PV", a("Nenhum ator encontrado para curar PV."), (n) => e.resources.heal(n, "PV", t));
		},
		async damageSAN(t) {
			await i(e, "Dano em SAN", a("Nenhum ator encontrado para causar dano em SAN."), (n) => e.resources.damage(n, "SAN", t));
		},
		async recoverSAN(t) {
			await i(e, "Recuperação de SAN", a("Nenhum ator encontrado para recuperar SAN."), (n) => e.resources.recover(n, "SAN", t));
		}
	};
}
async function i(e, t, r, i) {
	if (!r) return;
	let a = await i(r);
	if (!a.ok) {
		o(a.error);
		return;
	}
	let s = a.value;
	try {
		await e.chatMessages.createResourceOperationMessage({ transaction: s });
	} catch (e) {
		n.error(`${t} realizado, mas falhou ao criar o chat card.`, e), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
	}
	n.info(`${t} realizado:`, s);
}
function a(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function o(e) {
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
var s = {
	enabled: "debug.output.enabled",
	console: "debug.output.console",
	ui: "debug.output.ui",
	chat: "debug.output.chat"
};
function c() {
	d(s.enabled, {
		name: "Ativar debug do Paranormal Toolkit",
		hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
		default: !1
	}), d(s.console, {
		name: "Debug no console",
		hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
		default: !0
	}), d(s.ui, {
		name: "Debug como notificação",
		hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
		default: !0
	}), d(s.chat, {
		name: "Debug no chat",
		hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
		default: !1
	});
}
function l() {
	return {
		enabled: f(s.enabled),
		console: f(s.console),
		ui: f(s.ui),
		chat: f(s.chat)
	};
}
async function u(t, n) {
	await game.settings.set(e, s[t], n);
}
function d(t, n) {
	game.settings.register(e, t, {
		name: n.name,
		hint: n.hint,
		scope: "world",
		config: !0,
		type: Boolean,
		default: n.default
	});
}
function f(t) {
	return game.settings.get(e, t) === !0;
}
//#endregion
//#region src/debug/output/debug-output-api.ts
function ee() {
	return {
		status() {
			return l();
		},
		async enable() {
			await u("enabled", !0);
		},
		async disable() {
			await u("enabled", !1);
		},
		async enableConsole() {
			await u("console", !0);
		},
		async disableConsole() {
			await u("console", !1);
		},
		async enableUi() {
			await u("ui", !0);
		},
		async disableUi() {
			await u("ui", !1);
		},
		async enableChat() {
			await u("chat", !0);
		},
		async disableChat() {
			await u("chat", !1);
		}
	};
}
//#endregion
//#region src/core/result.ts
function p(e) {
	return {
		ok: !0,
		value: e
	};
}
function m(e) {
	return {
		ok: !1,
		error: e
	};
}
//#endregion
//#region src/features/automation/automation-flag-reader.ts
function h(t) {
	let n = t.getFlag(e, "automation");
	return n == null ? m({
		reason: "missing-automation",
		message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
	}) : ae(n) ? p(n) : m({
		reason: "invalid-automation",
		message: `Automação do item ${t.name} é inválida ou não é suportada.`,
		value: n
	});
}
function te() {
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
function ne(e = "1d8") {
	return {
		version: 1,
		label: "Ritual de cura simples",
		steps: [
			{ type: "spendRitualCost" },
			{
				type: "rollFormula",
				id: "healing",
				formula: e
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
function re(e = "1d8") {
	return {
		version: 1,
		label: "Ritual de dano simples",
		steps: [
			{ type: "spendRitualCost" },
			{
				type: "rollFormula",
				id: "damage",
				formula: e
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
function ie() {
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
				formula: "1d8"
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
async function g(t, n) {
	await t.setFlag(e, "automation", n);
}
function ae(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && y(t.label) && Array.isArray(t.steps) && t.steps.every(oe);
}
function oe(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	switch (t.type) {
		case "spendResource": return se(t);
		case "spendRitualCost": return ce(t);
		case "rollFormula": return le(t);
		case "modifyResource": return _(t);
		case "chatCard": return ue(t);
		default: return !1;
	}
}
function se(e) {
	let t = e;
	return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && v(t);
}
function ce(e) {
	return e.type === "spendRitualCost";
}
function le(e) {
	let t = e;
	return t.type === "rollFormula" && y(t.id) && y(t.formula);
}
function _(e) {
	let t = e;
	return t.type === "modifyResource" && de(t.actor) && fe(t.resource) && pe(t.operation) && v(t);
}
function ue(e) {
	let t = e;
	return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function v(e) {
	return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || y(e.amountFrom);
}
function de(e) {
	return e === "self" || e === "target";
}
function fe(e) {
	return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function pe(e) {
	return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function y(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/automation/workflow-target-resolver.ts
function b() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: S(e.id),
		actorId: S(e.actor?.id),
		sceneId: S(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome",
		actor: e.actor ?? null
	}));
}
function x() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null;
	return {
		tokenId: S(e.id),
		actorId: S(t?.id),
		sceneId: S(e.scene?.id),
		name: e.name ?? t?.name ?? "Origem sem nome"
	};
}
function S(e) {
	return typeof e == "string" && e.length > 0 ? e : null;
}
//#endregion
//#region src/features/automation/actor-item-resolver.ts
function C(e) {
	let t = e.items;
	if (Array.isArray(t)) return t;
	if (t && typeof t == "object") {
		let e = t;
		if (Array.isArray(e.contents)) return e.contents.filter(w);
		if (_e(t)) return Array.from(t).filter(w);
	}
	return [];
}
function me(e) {
	return C(e)[0] ?? null;
}
function he(e) {
	return C(e).find(ge) ?? null;
}
function ge(t) {
	return t.getFlag(e, "automation") !== void 0;
}
function _e(e) {
	return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function w(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/features/rituals/ritual-item-resolver.ts
function ve(e) {
	return C(e).filter((e) => e.type === "ritual");
}
function ye(e) {
	return ve(e)[0] ?? null;
}
//#endregion
//#region src/debug/ritual-debug-api.ts
function be(t) {
	return {
		logFirstRitualCost() {
			let e = T("Nenhum ator encontrado para consultar custo de ritual.");
			if (!e) return;
			let r = E(e);
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
			let i = T("Nenhum ator encontrado para configurar custo customizado.");
			if (!i) return;
			let a = E(i);
			if (a) {
				if (!Ce(t, r)) {
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
			let t = T("Nenhum ator encontrado para limpar custo customizado.");
			if (!t) return;
			let r = E(t);
			r && (await r.unsetFlag(e, "ritual.cost"), n.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
		},
		async setTestCostAutomationOnFirstRitual() {
			let e = T("Nenhum ator encontrado para configurar automação de custo de ritual.");
			if (!e) return;
			let t = E(e);
			t && (await g(t, te()), n.info(`Automação de custo aplicada ao ritual: ${t.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${t.name}.`));
		},
		async setTestHealingAutomationOnFirstRitual(e = "1d8") {
			let t = T("Nenhum ator encontrado para configurar ritual de cura simples.");
			if (!t) return;
			let r = E(t);
			if (r) {
				if (!D(e)) {
					ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
					return;
				}
				await g(r, ne(e)), n.info(`Automação de cura simples aplicada ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
			}
		},
		async setTestDamageAutomationOnFirstRitual(e = "1d8") {
			let t = T("Nenhum ator encontrado para configurar ritual de dano simples.");
			if (!t) return;
			let r = E(t);
			if (r) {
				if (!D(e)) {
					ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
					return;
				}
				await g(r, re(e)), n.info(`Automação de dano simples aplicada ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
			}
		},
		async runFirstRitualAutomation() {
			let e = T("Nenhum ator encontrado para executar automação de ritual.");
			if (!e) return;
			let n = E(e);
			n && await xe(t, e, n);
		}
	};
}
async function xe(e, t, r) {
	let i = h(r);
	if (!i.ok) {
		n.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
		return;
	}
	let a = await e.automation.run(i.value, {
		sourceActor: t,
		sourceToken: x(),
		item: r,
		targets: b()
	});
	if (!a.ok) {
		Se(a.error);
		return;
	}
	n.info("Automação de ritual executada com sucesso.", a.value);
}
function Se(e) {
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
function T(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function E(e) {
	return ye(e) || (n.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ce(e, t) {
	return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function D(e) {
	return typeof e == "string" && e.trim().length > 0;
}
//#endregion
//#region src/debug/workflow-debug-api.ts
function we(e) {
	return {
		async runFirstAutomation() {
			let t = A("Nenhum ator encontrado para executar automação.");
			if (!t) return;
			let r = he(t);
			if (!r) {
				n.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
				return;
			}
			await O(e, t, r);
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
			if (!Ee(r)) {
				n.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
				return;
			}
			let i = Te(r) ?? A("Nenhum ator encontrado para executar automação do item.");
			i && await O(e, i, r);
		},
		async setTestHealingAutomationOnFirstItem() {
			let e = A("Nenhum ator encontrado para configurar automação de teste.");
			if (!e) return;
			let t = me(e);
			if (!t) {
				n.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
				return;
			}
			try {
				await g(t, ie()), n.info(`Automação de teste aplicada ao item: ${t.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${t.name}.`);
			} catch (e) {
				n.error("Falha ao configurar automação de teste no item.", e), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
			}
		}
	};
}
async function O(e, t, r) {
	let i = h(r);
	if (!i.ok) {
		n.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
		return;
	}
	let a = await e.automation.run(i.value, {
		sourceActor: t,
		sourceToken: x(),
		item: r,
		targets: b()
	});
	if (!a.ok) {
		k(a.error);
		return;
	}
	n.info("Automação executada com sucesso.", a.value);
}
function k(e) {
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
function A(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Te(e) {
	let t = e.parent;
	return t instanceof Actor ? t : null;
}
function Ee(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/debug/debug-api.ts
function De(e) {
	let t = r(e);
	return {
		actor: t,
		ritual: be(e),
		workflow: we(e),
		output: ee(),
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
function Oe(t) {
	let n = {
		services: t,
		ordem: t.ordem,
		resources: t.resources,
		ritualCosts: t.ritualCosts,
		automation: t.automation,
		debug: De(t)
	}, r = globalThis;
	return r[e] = n, r.ParanormalToolkit = n, n;
}
//#endregion
//#region src/core/system-guard.ts
var j = class {
	static isSupportedSystem() {
		return game.system.id === "ordemparanormal";
	}
	static getCurrentSystemId() {
		return game.system.id;
	}
};
//#endregion
//#region src/features/chat/chat-workflow-flags.ts
function ke() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: F(e.id),
		actorId: F(e.actor?.id),
		sceneId: F(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome"
	}));
}
function M() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
	return {
		tokenId: F(e.id),
		actorId: F(t?.id),
		sceneId: F(e.scene?.id),
		name: n
	};
}
function Ae(e, t = M()) {
	return {
		version: 1,
		kind: "chat-targets",
		source: t,
		targets: e
	};
}
function je(t) {
	if (!Pe(t)) return null;
	let n = t.getFlag(e, "workflow");
	return Ne(n) ? n : null;
}
function Me() {
	return `flags.${e}.workflow`;
}
function N(t) {
	if (!t || typeof t != "object") return !1;
	let n = foundry.utils.getProperty(t, `flags.${e}`), r = foundry.utils.getProperty(t, `_source.flags.${e}`);
	return n !== void 0 || r !== void 0;
}
function P(e) {
	let t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
	return I(t) || I(n);
}
function Ne(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Pe(e) {
	return !!(e && typeof e == "object" && "getFlag" in e);
}
function F(e) {
	return I(e) ? e : null;
}
function I(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/chat/chat-enrichment-renderer.ts
function Fe() {
	Hooks.on("renderChatMessageHTML", (e, t) => {
		Ie(e, t);
	});
}
function Ie(e, t) {
	let n = je(e);
	if (!n || n.targets.length === 0) return;
	let r = Re(t);
	r && (r.querySelector(".paranormal-toolkit-chat-enrichment") || (r.querySelector(".message-content") ?? r).append(Le(n)));
}
function Le(t) {
	let n = document.createElement("section");
	n.classList.add(`${e}-chat-enrichment`);
	let r = document.createElement("strong");
	return r.textContent = "Paranormal Toolkit", n.append(r), t.source && n.append(L("Origem", t.source.name)), n.append(L("Alvo", t.targets.map((e) => e.name).join(", "))), n;
}
function L(t, n) {
	let r = document.createElement("p");
	r.classList.add(`${e}-chat-enrichment__row`);
	let i = document.createElement("span");
	i.textContent = `${t}: `;
	let a = document.createElement("span");
	return a.textContent = n, r.append(i, a), r;
}
function Re(e) {
	if (e instanceof HTMLElement) return e;
	if (e && typeof e == "object") {
		let t = e;
		if (t[0] instanceof HTMLElement) return t[0];
	}
	return null;
}
//#endregion
//#region src/features/chat/chat-target-capture.ts
function ze() {
	Hooks.on("preCreateChatMessage", (e, t, r, i) => {
		if (!Be(i) || !Ve(e) || N(e) || N(t)) return;
		let a = ke();
		if (a.length === 0 || !P(e) && !P(t)) return;
		let o = M();
		e.updateSource({ [Me()]: Ae(a, o) }), n.info("Targets capturados para ChatMessage.", {
			source: o,
			targets: a
		});
	});
}
function Be(e) {
	let t = game.user?.id;
	return !t || typeof e != "string" ? !0 : e === t;
}
function Ve(e) {
	return !!(e && typeof e == "object" && "updateSource" in e);
}
//#endregion
//#region src/adapters/ordem/ordem-paths.ts
var R = {
	PV: "system.PV",
	SAN: "system.SAN",
	PE: "system.PE",
	PD: "system.PD"
}, z = { PV: "system.attributes.hp" }, B = {
	PV: [R.PV, z.PV],
	SAN: [R.SAN],
	PE: [R.PE],
	PD: [R.PD]
}, V = {
	ritual: { dt: "system.ritual.DT" },
	ritualItem: { circleCandidates: ["system.circle", "system.ritual.circle"] },
	weapon: {
		category: "system.category",
		attackFormula: "system.formulas.attack",
		damageFormula: "system.formulas.damage",
		critical: "system.critical"
	}
}, He = class {
	getResource(e, t) {
		let n = H(e, t);
		if (!n.ok) return m(n.error);
		let r = n.value, i = `${r}.value`, a = `${r}.max`, o = foundry.utils.getProperty(e, i), s = foundry.utils.getProperty(e, a), c = W(e, t, i, o, "valor atual");
		if (c) return m(c);
		let l = W(e, t, a, s, "valor máximo");
		return l ? m(l) : p({
			value: o,
			max: s
		});
	}
	async updateResourceValue(e, t, n) {
		let r = H(e, t);
		if (!r.ok) throw Error(r.error.message);
		await e.update({ [`${r.value}.value`]: n });
	}
};
function H(e, t) {
	let n = Ue(e.type, t);
	if (n && U(e, n)) return p(n);
	let r = B[t].find((t) => U(e, t));
	return r ? p(r) : m({
		actor: e,
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		actorType: e.type ?? "unknown",
		resource: t,
		reason: "resource-path-not-found",
		message: We(e, t),
		path: B[t].join(" | ")
	});
}
function Ue(e, t) {
	return e === "threat" ? z[t] ?? null : e === "agent" ? R[t] : null;
}
function U(e, t) {
	let n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
	return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function We(e, t) {
	let n = e.type ?? "unknown", r = B[t].join(", ");
	return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function W(e, t, n, r, i) {
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
var Ge = class {
	isRitual(e) {
		return e.type === "ritual";
	}
	getCircle(e) {
		if (!this.isRitual(e)) return m({
			reason: "not-a-ritual",
			message: `Item ${e.name ?? "sem nome"} não é um ritual.`,
			ritual: e
		});
		let t = this.readCircleFromKnownPaths(e);
		if (!t) {
			let t = V.ritualItem.circleCandidates;
			return m({
				reason: "ritual-circle-not-found",
				message: `Círculo do ritual não encontrado. Paths testados: ${t.join(", ")}.`,
				ritual: e,
				paths: [...t]
			});
		}
		let { path: n, value: r } = t, i = Ke(r);
		return i ? p(i) : m({
			reason: "invalid-ritual-circle",
			message: `Círculo do ritual inválido em ${n}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
			ritual: e,
			path: n,
			value: r
		});
	}
	readCircleFromKnownPaths(e) {
		for (let t of V.ritualItem.circleCandidates) {
			let n = foundry.utils.getProperty(e, t);
			if (n != null) return {
				path: t,
				value: n
			};
		}
		return null;
	}
};
function Ke(e) {
	if (G(e)) return e;
	if (typeof e == "string") {
		let t = e.trim();
		if (!/^\d+$/.test(t)) return null;
		let n = Number(t);
		if (G(n)) return n;
	}
	return null;
}
function G(e) {
	return e === 1 || e === 2 || e === 3 || e === 4;
}
//#endregion
//#region src/adapters/ordem/ordem-ritual-cost-provider.ts
var qe = {
	1: 1,
	2: 3,
	3: 6,
	4: 10
}, Je = class {
	ritualAdapter;
	constructor(e) {
		this.ritualAdapter = e;
	}
	getCost(e) {
		let t = this.ritualAdapter.getCircle(e.ritual);
		if (!t.ok) return m({
			...t.error,
			actor: e.actor
		});
		let n = t.value, r = Ye(e.ritual, n);
		return r.ok ? r.value ? p(r.value) : p({
			resource: "PE",
			amount: qe[n],
			source: "default-by-circle",
			circle: n
		}) : m(r.error);
	}
};
function Ye(t, n) {
	let r = t.getFlag(e, "ritual.cost");
	return r == null ? {
		ok: !0,
		value: null
	} : Xe(r) ? {
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
function Xe(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
//#endregion
//#region src/adapters/ordem/ordem-system-adapter.ts
var Ze = class {
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
		return this.getNumber(e, V.ritual.dt, 0);
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
};
//#endregion
//#region src/core/automation/workflow-context.ts
function Qe(e) {
	return {
		sourceActor: e.sourceActor,
		sourceToken: e.sourceToken ?? null,
		item: e.item,
		targets: e.targets ?? [],
		rolls: {},
		ritualCosts: [],
		resourceTransactions: []
	};
}
//#endregion
//#region src/core/automation/automation-runner.ts
var $e = class {
	resources;
	ritualCosts;
	messages;
	constructor(e, t, n) {
		this.resources = e, this.ritualCosts = t, this.messages = n;
	}
	async run(e, t) {
		let n = Qe(t);
		if (e.steps.length === 0) return m({
			reason: "empty-automation",
			message: "A automação não possui steps para executar.",
			context: n
		});
		for (let [t, r] of e.steps.entries()) {
			let e = await this.runStep(r, n, t);
			if (!e.ok) return e;
		}
		return p({
			definition: e,
			context: n
		});
	}
	async runStep(e, t, n) {
		switch (e.type) {
			case "spendResource": return this.runSpendResourceStep(e, t, n);
			case "spendRitualCost": return this.runSpendRitualCostStep(e, t, n);
			case "rollFormula": return this.runRollFormulaStep(e, t, n);
			case "modifyResource": return this.runModifyResourceStep(e, t, n);
			case "chatCard": return this.runChatCardStep(e, t, n);
			default: return m({
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
		if (!r.ok) return m({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let i = await this.resources.spend(t.sourceActor, e.resource, r.value);
		return this.handleResourceOperationResult(i, t, n, e);
	}
	async runSpendRitualCostStep(e, t, n) {
		let r = this.ritualCosts.getCost({
			actor: t.sourceActor,
			ritual: t.item
		});
		if (!r.ok) return m({
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
		let a = await this.resources.spend(t.sourceActor, i.resource, i.amount);
		return this.handleResourceOperationResult(a, t, n, e);
	}
	async runRollFormulaStep(e, t, n) {
		if (!K(e.id) || !K(e.formula)) return m({
			reason: "invalid-step",
			message: "Step rollFormula precisa de id e formula.",
			stepIndex: n,
			step: e,
			context: t
		});
		try {
			let r = new Roll(e.formula), i = await Promise.resolve(r.evaluate()), a = i.total;
			return typeof a != "number" || !Number.isFinite(a) ? m({
				reason: "roll-failed",
				message: `A rolagem ${e.id} não retornou um total numérico válido.`,
				stepIndex: n,
				step: e,
				context: t
			}) : (t.rolls[e.id] = {
				id: e.id,
				formula: e.formula,
				total: a,
				roll: i
			}, p(void 0));
		} catch (r) {
			return m({
				reason: "roll-failed",
				message: `Falha ao rolar fórmula: ${e.formula}.`,
				stepIndex: n,
				step: e,
				context: t,
				cause: r
			});
		}
	}
	async runModifyResourceStep(e, t, n) {
		let r = this.resolveAmount(e, t);
		if (!r.ok) return m({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let i = this.resolveActors(e.actor, t);
		if (i.length === 0) return m({
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
		return p(void 0);
	}
	async runChatCardStep(e, t, n) {
		try {
			return await this.messages.createWorkflowSummaryMessage(t, e), p(void 0);
		} catch (r) {
			return m({
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
		return m({
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
		return e.ok ? (t.resourceTransactions.push(e.value), p(void 0)) : m({
			reason: "resource-operation-failed",
			message: e.error.message,
			stepIndex: n,
			step: r,
			context: t,
			cause: e.error
		});
	}
	resolveActors(e, t) {
		switch (e) {
			case "self": return [t.sourceActor];
			case "target": return t.targets.flatMap((e) => e.actor ? [e.actor] : []);
		}
	}
	resolveAmount(e, t) {
		if (typeof e.amount == "number") return !Number.isInteger(e.amount) || e.amount <= 0 ? m({
			reason: "invalid-amount-source",
			message: "Amount precisa ser um inteiro positivo."
		}) : p(e.amount);
		if (typeof e.amountFrom == "string") {
			let n = /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e.amountFrom)?.groups?.rollId;
			if (!n) return m({
				reason: "invalid-amount-source",
				message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
			});
			let r = t.rolls[n];
			if (!r) return m({
				reason: "missing-roll-result",
				message: `Resultado da rolagem não encontrado: ${n}.`
			});
			let i = Math.trunc(r.total);
			return !Number.isInteger(i) || i <= 0 ? m({
				reason: "invalid-amount-source",
				message: `Total da rolagem ${n} não gerou um amount positivo.`
			}) : p(i);
		}
		return m({
			reason: "invalid-amount-source",
			message: "Step precisa informar amount ou amountFrom."
		});
	}
};
function K(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/core/resources/resource-engine.ts
var et = class {
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
		if (!Number.isInteger(r) || r <= 0) return m({
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
		if (!i.ok) return m({
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
		if (!o.ok) return m({
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
			return m({
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
		return p({
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
			case "spend": return t.value < n ? m({
				reason: "insufficient-resource",
				message: `Recurso insuficiente. Atual: ${t.value}; custo: ${n}.`
			}) : p({
				afterValue: t.value - n,
				appliedAmount: n
			});
			case "damage": {
				let e = Math.max(0, t.value - n);
				return p({
					afterValue: e,
					appliedAmount: t.value - e
				});
			}
			case "heal":
			case "recover": {
				let e = Math.min(t.max, t.value + n);
				return p({
					afterValue: e,
					appliedAmount: e - t.value
				});
			}
		}
	}
}, q = class {
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
		let r = l();
		return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
			speaker: t.speaker,
			content: t.content,
			whisper: tt(),
			flags: {
				...t.flags,
				[e]: {
					...nt(t.flags),
					debugOutput: !0
				}
			}
		}), r.console && t.data !== void 0 && n.info("Debug chat criado.", t.data), !0);
	}
	emit(e, t) {
		let n = l();
		if (!n.enabled) return;
		let r = t.notification ?? J(t);
		n.console && this.emitConsole(e, t), n.ui && this.emitUi(e, r);
	}
	emitConsole(e, t) {
		let r = J(t);
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
function J(e) {
	return e.message ? `${e.title}: ${e.message}` : e.title;
}
function tt() {
	let e = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
	return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function nt(t) {
	let n = t?.[e];
	return n && typeof n == "object" && !Array.isArray(n) ? n : {};
}
//#endregion
//#region src/ui/chat-message-service.ts
var rt = class {
	debugOutput;
	constructor(e) {
		this.debugOutput = e;
	}
	async createResourceOperationMessage(t) {
		let n = this.createResourceOperationContent(t.transaction);
		await this.debugOutput.chat({
			speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
			content: n,
			data: t.transaction,
			flags: { [e]: { resourceTransaction: Y(t.transaction) } }
		});
	}
	async createWorkflowSummaryMessage(t, n) {
		let r = this.createWorkflowSummaryContent(t, n);
		await this.debugOutput.chat({
			speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
			content: r,
			data: X(t),
			flags: { [e]: { workflowSummary: X(t) } }
		});
	}
	createResourceOperationContent(t) {
		let n = Q(t.actorName), r = Q(t.resource);
		return `
      <section class="${e}-card ${e}-resource-card">
        <header class="${e}-card__header">
          <strong>${Q(Z(t))}</strong>
          <span>${n}</span>
        </header>
        <div class="${e}-card__body">
          <p><strong>${Q(it(t))}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
	}
	createWorkflowSummaryContent(t, n) {
		let r = Q(n.title ?? "Automação"), i = n.message ? `<p>${Q(n.message)}</p>` : "", a = Q(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), o = Q(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((e) => Q(e.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map((e) => `<li><strong>${Q(e.id)}:</strong> ${Q(e.formula)} = ${e.total}</li>`), l = t.ritualCosts.map((e) => `<li><strong>${Q(e.itemName)}:</strong> ${e.circle}º círculo — ${e.amount} ${Q(e.resource)} (${Q(at(e.source))})</li>`), u = t.resourceTransactions.map((e) => `<li><strong>${Q(e.actorName)}:</strong> ${Q(Z(e))} — ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</li>`);
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
          ${u.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${u.join("")}</ul>` : ""}
        </div>
      </section>
    `;
	}
};
function Y(e) {
	return {
		actorId: e.actorId,
		actorName: e.actorName,
		resource: e.resource,
		operation: e.operation,
		requestedAmount: e.requestedAmount,
		appliedAmount: e.appliedAmount,
		before: e.before,
		after: e.after
	};
}
function X(e) {
	return {
		sourceActorId: e.sourceActor.id ?? null,
		sourceActorName: e.sourceActor.name ?? "Ator sem nome",
		sourceToken: e.sourceToken,
		itemId: e.item.id ?? null,
		itemName: e.item.name ?? "Item sem nome",
		targets: e.targets.map((e) => ({
			tokenId: e.tokenId,
			actorId: e.actorId,
			sceneId: e.sceneId,
			name: e.name
		})),
		rolls: Object.values(e.rolls).map((e) => ({
			id: e.id,
			formula: e.formula,
			total: e.total
		})),
		ritualCosts: e.ritualCosts.map((e) => ({
			itemId: e.itemId,
			itemName: e.itemName,
			circle: e.circle,
			resource: e.resource,
			amount: e.amount,
			source: e.source
		})),
		resourceTransactions: e.resourceTransactions.map(Y)
	};
}
function Z(e) {
	switch (e.operation) {
		case "spend": return `Gasto de ${e.resource}`;
		case "damage": return `Dano em ${e.resource}`;
		case "heal": return `Cura de ${e.resource}`;
		case "recover": return `Recuperação de ${e.resource}`;
	}
}
function it(e) {
	switch (e.operation) {
		case "spend": return `${e.resource} gasto`;
		case "damage": return "Dano aplicado";
		case "heal": return "Cura aplicada";
		case "recover": return "Recuperação aplicada";
	}
}
function at(e) {
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
function ot() {
	let e = new He(), t = new et(e), n = new Ge(), r = new Je(n), i = new Ze(e), a = new q(), o = new rt(a);
	return {
		ordem: i,
		resourceAdapter: e,
		ritualAdapter: n,
		ritualCosts: r,
		resources: t,
		debugOutput: a,
		chatMessages: o,
		automation: new $e(t, r, o)
	};
}
//#endregion
//#region src/main.ts
var $ = null;
Hooks.once("init", () => {
	c(), n.info("Inicializando módulo.");
}), Hooks.once("ready", () => {
	if (!j.isSupportedSystem()) {
		n.warn(`Sistema não suportado: ${j.getCurrentSystemId()}. O módulo requer ordemparanormal.`);
		return;
	}
	$ = ot(), Oe($), ze(), Fe(), n.info("Inicializado para o sistema Ordem Paranormal."), n.info(`API de debug disponível em globalThis["${e}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info("Paranormal Toolkit inicializado.");
});
function st() {
	if (!$) throw Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
	return $;
}
//#endregion
export { st as getToolkitServices };

//# sourceMappingURL=main.js.map