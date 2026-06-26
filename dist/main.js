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
}, r = class {
	static async createResourceOperationMessage(t) {
		let n = this.createResourceOperationContent(t.transaction);
		await ChatMessage.create({
			speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
			content: n,
			flags: { [e]: { resourceTransaction: i(t.transaction) } }
		});
	}
	static async createWorkflowSummaryMessage(t, n) {
		let r = this.createWorkflowSummaryContent(t, n);
		await ChatMessage.create({
			speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
			content: r,
			flags: { [e]: { workflowSummary: a(t) } }
		});
	}
	static createResourceOperationContent(t) {
		let n = c(t.actorName), r = c(t.resource);
		return `
      <section class="${e}-card ${e}-resource-card">
        <header class="${e}-card__header">
          <strong>${c(o(t))}</strong>
          <span>${n}</span>
        </header>
        <div class="${e}-card__body">
          <p><strong>${c(s(t))}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
	}
	static createWorkflowSummaryContent(t, n) {
		let r = c(n.title ?? "Automação"), i = n.message ? `<p>${c(n.message)}</p>` : "", a = c(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = c(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((e) => c(e.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map((e) => `<li><strong>${c(e.id)}:</strong> ${c(e.formula)} = ${e.total}</li>`), d = t.resourceTransactions.map((e) => `<li><strong>${c(e.actorName)}:</strong> ${c(o(e))} — ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</li>`);
		return `
      <section class="${e}-card ${e}-workflow-card">
        <header class="${e}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${e}-card__body">
          ${i}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${d.join("")}</ul>` : ""}
        </div>
      </section>
    `;
	}
};
function i(e) {
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
function a(e) {
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
		resourceTransactions: e.resourceTransactions.map(i)
	};
}
function o(e) {
	switch (e.operation) {
		case "spend": return `Gasto de ${e.resource}`;
		case "damage": return `Dano em ${e.resource}`;
		case "heal": return `Cura de ${e.resource}`;
		case "recover": return `Recuperação de ${e.resource}`;
	}
}
function s(e) {
	switch (e.operation) {
		case "spend": return `${e.resource} gasto`;
		case "damage": return "Dano aplicado";
		case "heal": return "Cura aplicada";
		case "recover": return "Recuperação aplicada";
	}
}
function c(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
//#endregion
//#region src/debug/actor-debug-api.ts
function l(e) {
	return {
		getSelected() {
			return t.getSelectedActor();
		},
		logResources() {
			let t = d("Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário.");
			if (!t) return;
			let r = e.ordem.getActorSnapshot(t);
			n.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && n.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
		},
		async spendPE(t) {
			await u("Gasto de PE", d("Nenhum ator encontrado para gastar PE."), (n) => e.resources.spend(n, "PE", t));
		},
		async spendPD(t) {
			await u("Gasto de PD", d("Nenhum ator encontrado para gastar PD."), (n) => e.resources.spend(n, "PD", t));
		},
		async damagePV(t) {
			await u("Dano em PV", d("Nenhum ator encontrado para causar dano em PV."), (n) => e.resources.damage(n, "PV", t));
		},
		async healPV(t) {
			await u("Cura de PV", d("Nenhum ator encontrado para curar PV."), (n) => e.resources.heal(n, "PV", t));
		},
		async damageSAN(t) {
			await u("Dano em SAN", d("Nenhum ator encontrado para causar dano em SAN."), (n) => e.resources.damage(n, "SAN", t));
		},
		async recoverSAN(t) {
			await u("Recuperação de SAN", d("Nenhum ator encontrado para recuperar SAN."), (n) => e.resources.recover(n, "SAN", t));
		}
	};
}
async function u(e, t, i) {
	if (!t) return;
	let a = await i(t);
	if (!a.ok) {
		ee(a.error);
		return;
	}
	let o = a.value;
	try {
		await r.createResourceOperationMessage({ transaction: o });
	} catch (t) {
		n.error(`${e} realizado, mas falhou ao criar o chat card.`, t), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
	}
	n.info(`${e} realizado:`, o);
}
function d(e) {
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
//#region src/features/automation/actor-item-resolver.ts
function f(e) {
	let t = e.items;
	if (Array.isArray(t)) return t;
	if (t && typeof t == "object") {
		let e = t;
		if (Array.isArray(e.contents)) return e.contents.filter(h);
		if (ne(t)) return Array.from(t).filter(h);
	}
	return [];
}
function p(e) {
	return f(e)[0] ?? null;
}
function m(e) {
	return f(e).find(te) ?? null;
}
function te(t) {
	return t.getFlag(e, "automation") !== void 0;
}
function ne(e) {
	return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function h(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/core/result.ts
function g(e) {
	return {
		ok: !0,
		value: e
	};
}
function _(e) {
	return {
		ok: !1,
		error: e
	};
}
//#endregion
//#region src/features/automation/automation-flag-reader.ts
function v(t) {
	let n = t.getFlag(e, "automation");
	return n == null ? _({
		reason: "missing-automation",
		message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
	}) : x(n) ? g(n) : _({
		reason: "invalid-automation",
		message: `Automação do item ${t.name} é inválida ou não é suportada.`,
		value: n
	});
}
function y() {
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
async function b(t, n) {
	await t.setFlag(e, "automation", n);
}
function x(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && C(t.label) && Array.isArray(t.steps) && t.steps.every(re);
}
function re(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	switch (t.type) {
		case "spendResource": return ie(t);
		case "rollFormula": return ae(t);
		case "modifyResource": return oe(t);
		case "chatCard": return se(t);
		default: return !1;
	}
}
function ie(e) {
	let t = e;
	return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && S(t);
}
function ae(e) {
	let t = e;
	return t.type === "rollFormula" && C(t.id) && C(t.formula);
}
function oe(e) {
	let t = e;
	return t.type === "modifyResource" && ce(t.actor) && le(t.resource) && ue(t.operation) && S(t);
}
function se(e) {
	let t = e;
	return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function S(e) {
	return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || C(e.amountFrom);
}
function ce(e) {
	return e === "self" || e === "target";
}
function le(e) {
	return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ue(e) {
	return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function C(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/automation/workflow-target-resolver.ts
function de() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: w(e.id),
		actorId: w(e.actor?.id),
		sceneId: w(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome",
		actor: e.actor ?? null
	}));
}
function fe() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null;
	return {
		tokenId: w(e.id),
		actorId: w(t?.id),
		sceneId: w(e.scene?.id),
		name: e.name ?? t?.name ?? "Origem sem nome"
	};
}
function w(e) {
	return typeof e == "string" && e.length > 0 ? e : null;
}
//#endregion
//#region src/debug/workflow-debug-api.ts
function T(e) {
	return {
		async runFirstAutomation() {
			let t = O("Nenhum ator encontrado para executar automação.");
			if (!t) return;
			let r = m(t);
			if (!r) {
				n.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
				return;
			}
			await E(e, t, r);
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
			if (!A(r)) {
				n.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
				return;
			}
			let i = k(r) ?? O("Nenhum ator encontrado para executar automação do item.");
			i && await E(e, i, r);
		},
		async setTestHealingAutomationOnFirstItem() {
			let e = O("Nenhum ator encontrado para configurar automação de teste.");
			if (!e) return;
			let t = p(e);
			if (!t) {
				n.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
				return;
			}
			try {
				await b(t, y()), n.info(`Automação de teste aplicada ao item: ${t.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${t.name}.`);
			} catch (e) {
				n.error("Falha ao configurar automação de teste no item.", e), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
			}
		}
	};
}
async function E(e, t, r) {
	let i = v(r);
	if (!i.ok) {
		n.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
		return;
	}
	let a = await e.automation.run(i.value, {
		sourceActor: t,
		sourceToken: fe(),
		item: r,
		targets: de()
	});
	if (!a.ok) {
		D(a.error);
		return;
	}
	n.info("Automação executada com sucesso.", a.value);
}
function D(e) {
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
function O(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function k(e) {
	let t = e.parent;
	return t instanceof Actor ? t : null;
}
function A(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/debug/debug-api.ts
function j(e) {
	let t = l(e);
	return {
		actor: t,
		workflow: T(e),
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
function M(t) {
	let n = {
		services: t,
		ordem: t.ordem,
		resources: t.resources,
		automation: t.automation,
		debug: j(t)
	}, r = globalThis;
	return r[e] = n, r.ParanormalToolkit = n, n;
}
//#endregion
//#region src/core/system-guard.ts
var N = class {
	static isSupportedSystem() {
		return game.system.id === "ordemparanormal";
	}
	static getCurrentSystemId() {
		return game.system.id;
	}
};
//#endregion
//#region src/features/chat/chat-workflow-flags.ts
function P() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: H(e.id),
		actorId: H(e.actor?.id),
		sceneId: H(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome"
	}));
}
function F() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
	return {
		tokenId: H(e.id),
		actorId: H(t?.id),
		sceneId: H(e.scene?.id),
		name: n
	};
}
function I(e, t = F()) {
	return {
		version: 1,
		kind: "chat-targets",
		source: t,
		targets: e
	};
}
function L(t) {
	if (!pe(t)) return null;
	let n = t.getFlag(e, "workflow");
	return V(n) ? n : null;
}
function R() {
	return `flags.${e}.workflow`;
}
function z(t) {
	if (!t || typeof t != "object") return !1;
	let n = foundry.utils.getProperty(t, `flags.${e}`), r = foundry.utils.getProperty(t, `_source.flags.${e}`);
	return n !== void 0 || r !== void 0;
}
function B(e) {
	let t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
	return U(t) || U(n);
}
function V(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function pe(e) {
	return !!(e && typeof e == "object" && "getFlag" in e);
}
function H(e) {
	return U(e) ? e : null;
}
function U(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/chat/chat-enrichment-renderer.ts
function me() {
	let e = (e, t) => {
		he(e, t);
	};
	Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e);
}
function he(e, t) {
	let n = L(e);
	if (!n || n.targets.length === 0) return;
	let r = _e(t);
	r && (r.querySelector(".paranormal-toolkit-chat-enrichment") || (r.querySelector(".message-content") ?? r).append(ge(n)));
}
function ge(t) {
	let n = document.createElement("section");
	n.classList.add(`${e}-chat-enrichment`);
	let r = document.createElement("strong");
	return r.textContent = "Paranormal Toolkit", n.append(r), t.source && n.append(W("Origem", t.source.name)), n.append(W("Alvo", t.targets.map((e) => e.name).join(", "))), n;
}
function W(t, n) {
	let r = document.createElement("p");
	r.classList.add(`${e}-chat-enrichment__row`);
	let i = document.createElement("span");
	i.textContent = `${t}: `;
	let a = document.createElement("span");
	return a.textContent = n, r.append(i, a), r;
}
function _e(e) {
	if (e instanceof HTMLElement) return e;
	if (e && typeof e == "object") {
		let t = e;
		if (t[0] instanceof HTMLElement) return t[0];
	}
	return null;
}
//#endregion
//#region src/features/chat/chat-target-capture.ts
function ve() {
	Hooks.on("preCreateChatMessage", (e, t, r, i) => {
		if (!ye(i) || !be(e) || z(e) || z(t)) return;
		let a = P();
		if (a.length === 0 || !B(e) && !B(t)) return;
		let o = F();
		e.updateSource({ [R()]: I(a, o) }), n.info("Targets capturados para ChatMessage.", {
			source: o,
			targets: a
		});
	});
}
function ye(e) {
	let t = game.user?.id;
	return !t || typeof e != "string" ? !0 : e === t;
}
function be(e) {
	return !!(e && typeof e == "object" && "updateSource" in e);
}
//#endregion
//#region src/adapters/ordem/ordem-paths.ts
var G = {
	PV: "system.PV",
	SAN: "system.SAN",
	PE: "system.PE",
	PD: "system.PD"
}, K = { PV: "system.attributes.hp" }, q = {
	PV: [G.PV, K.PV],
	SAN: [G.SAN],
	PE: [G.PE],
	PD: [G.PD]
}, xe = {
	ritual: { dt: "system.ritual.DT" },
	weapon: {
		category: "system.category",
		attackFormula: "system.formulas.attack",
		damageFormula: "system.formulas.damage",
		critical: "system.critical"
	}
}, Se = class {
	getResource(e, t) {
		let n = J(e, t);
		if (!n.ok) return _(n.error);
		let r = n.value, i = `${r}.value`, a = `${r}.max`, o = foundry.utils.getProperty(e, i), s = foundry.utils.getProperty(e, a), c = Z(e, t, i, o, "valor atual");
		if (c) return _(c);
		let l = Z(e, t, a, s, "valor máximo");
		return l ? _(l) : g({
			value: o,
			max: s
		});
	}
	async updateResourceValue(e, t, n) {
		let r = J(e, t);
		if (!r.ok) throw Error(r.error.message);
		await e.update({ [`${r.value}.value`]: n });
	}
};
function J(e, t) {
	let n = Ce(e.type, t);
	if (n && Y(e, n)) return g(n);
	let r = q[t].find((t) => Y(e, t));
	return r ? g(r) : _({
		actor: e,
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		actorType: e.type ?? "unknown",
		resource: t,
		reason: "resource-path-not-found",
		message: X(e, t),
		path: q[t].join(" | ")
	});
}
function Ce(e, t) {
	return e === "threat" ? K[t] ?? null : e === "agent" ? G[t] : null;
}
function Y(e, t) {
	let n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
	return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function X(e, t) {
	let n = e.type ?? "unknown", r = q[t].join(", ");
	return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Z(e, t, n, r, i) {
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
//#region src/adapters/ordem/ordem-system-adapter.ts
var we = class {
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
		return this.getNumber(e, xe.ritual.dt, 0);
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
function Te(e) {
	return {
		sourceActor: e.sourceActor,
		sourceToken: e.sourceToken ?? null,
		item: e.item,
		targets: e.targets ?? [],
		rolls: {},
		resourceTransactions: []
	};
}
//#endregion
//#region src/core/automation/automation-runner.ts
var Ee = class {
	resources;
	messages;
	constructor(e, t) {
		this.resources = e, this.messages = t;
	}
	async run(e, t) {
		let n = Te(t);
		if (e.steps.length === 0) return _({
			reason: "empty-automation",
			message: "A automação não possui steps para executar.",
			context: n
		});
		for (let [t, r] of e.steps.entries()) {
			let e = await this.runStep(r, n, t);
			if (!e.ok) return e;
		}
		return g({
			definition: e,
			context: n
		});
	}
	async runStep(e, t, n) {
		switch (e.type) {
			case "spendResource": return this.runSpendResourceStep(e, t, n);
			case "rollFormula": return this.runRollFormulaStep(e, t, n);
			case "modifyResource": return this.runModifyResourceStep(e, t, n);
			case "chatCard": return this.runChatCardStep(e, t, n);
			default: return _({
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
		if (!r.ok) return _({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let i = await this.resources.spend(t.sourceActor, e.resource, r.value);
		return this.handleResourceOperationResult(i, t, n, e);
	}
	async runRollFormulaStep(e, t, n) {
		if (!Q(e.id) || !Q(e.formula)) return _({
			reason: "invalid-step",
			message: "Step rollFormula precisa de id e formula.",
			stepIndex: n,
			step: e,
			context: t
		});
		try {
			let r = new Roll(e.formula), i = await Promise.resolve(r.evaluate()), a = i.total;
			return typeof a != "number" || !Number.isFinite(a) ? _({
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
			}, g(void 0));
		} catch (r) {
			return _({
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
		if (!r.ok) return _({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let i = this.resolveActors(e.actor, t);
		if (i.length === 0) return _({
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
		return g(void 0);
	}
	async runChatCardStep(e, t, n) {
		try {
			return await this.messages.createWorkflowSummaryMessage(t, e), g(void 0);
		} catch (r) {
			return _({
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
		return _({
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
		return e.ok ? (t.resourceTransactions.push(e.value), g(void 0)) : _({
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
		if (typeof e.amount == "number") return !Number.isInteger(e.amount) || e.amount <= 0 ? _({
			reason: "invalid-amount-source",
			message: "Amount precisa ser um inteiro positivo."
		}) : g(e.amount);
		if (typeof e.amountFrom == "string") {
			let n = /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e.amountFrom)?.groups?.rollId;
			if (!n) return _({
				reason: "invalid-amount-source",
				message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
			});
			let r = t.rolls[n];
			if (!r) return _({
				reason: "missing-roll-result",
				message: `Resultado da rolagem não encontrado: ${n}.`
			});
			let i = Math.trunc(r.total);
			return !Number.isInteger(i) || i <= 0 ? _({
				reason: "invalid-amount-source",
				message: `Total da rolagem ${n} não gerou um amount positivo.`
			}) : g(i);
		}
		return _({
			reason: "invalid-amount-source",
			message: "Step precisa informar amount ou amountFrom."
		});
	}
};
function Q(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/core/resources/resource-engine.ts
var De = class {
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
		if (!Number.isInteger(r) || r <= 0) return _({
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
		if (!i.ok) return _({
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
		if (!o.ok) return _({
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
			return _({
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
		return g({
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
			case "spend": return t.value < n ? _({
				reason: "insufficient-resource",
				message: `Recurso insuficiente. Atual: ${t.value}; custo: ${n}.`
			}) : g({
				afterValue: t.value - n,
				appliedAmount: n
			});
			case "damage": {
				let e = Math.max(0, t.value - n);
				return g({
					afterValue: e,
					appliedAmount: t.value - e
				});
			}
			case "heal":
			case "recover": {
				let e = Math.min(t.max, t.value + n);
				return g({
					afterValue: e,
					appliedAmount: e - t.value
				});
			}
		}
	}
};
//#endregion
//#region src/toolkit-services.ts
function Oe() {
	let e = new Se(), t = new De(e);
	return {
		ordem: new we(e),
		resourceAdapter: e,
		resources: t,
		automation: new Ee(t, r)
	};
}
//#endregion
//#region src/main.ts
var $ = null;
Hooks.once("init", () => {
	n.info("Inicializando módulo.");
}), Hooks.once("ready", () => {
	if (!N.isSupportedSystem()) {
		n.warn(`Sistema não suportado: ${N.getCurrentSystemId()}. O módulo requer ordemparanormal.`);
		return;
	}
	$ = Oe(), M($), ve(), me(), n.info("Inicializado para o sistema Ordem Paranormal."), n.info(`API de debug disponível em globalThis["${e}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info("Paranormal Toolkit inicializado.");
});
function ke() {
	if (!$) throw Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
	return $;
}
//#endregion
export { ke as getToolkitServices };

//# sourceMappingURL=main.js.map