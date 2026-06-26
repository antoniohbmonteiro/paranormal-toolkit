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
	static createResourceOperationContent(t) {
		let n = s(t.actorName), r = s(t.resource);
		return `
      <section class="${e}-card ${e}-resource-card">
        <header class="${e}-card__header">
          <strong>${s(a(t))}</strong>
          <span>${n}</span>
        </header>
        <div class="${e}-card__body">
          <p><strong>${s(o(t))}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
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
	switch (e.operation) {
		case "spend": return `Gasto de ${e.resource}`;
		case "damage": return `Dano em ${e.resource}`;
		case "heal": return `Cura de ${e.resource}`;
		case "recover": return `Recuperação de ${e.resource}`;
	}
}
function o(e) {
	switch (e.operation) {
		case "spend": return `${e.resource} gasto`;
		case "damage": return "Dano aplicado";
		case "heal": return "Cura aplicada";
		case "recover": return "Recuperação aplicada";
	}
}
function s(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
//#endregion
//#region src/debug/actor-debug-api.ts
function c(e) {
	return {
		getSelected() {
			return t.getSelectedActor();
		},
		logResources() {
			let t = u("Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário.");
			if (!t) return;
			let r = e.ordem.getActorSnapshot(t);
			n.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && n.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
		},
		async spendPE(t) {
			await l("Gasto de PE", u("Nenhum ator encontrado para gastar PE."), (n) => e.resources.spend(n, "PE", t));
		},
		async spendPD(t) {
			await l("Gasto de PD", u("Nenhum ator encontrado para gastar PD."), (n) => e.resources.spend(n, "PD", t));
		},
		async damagePV(t) {
			await l("Dano em PV", u("Nenhum ator encontrado para causar dano em PV."), (n) => e.resources.damage(n, "PV", t));
		},
		async healPV(t) {
			await l("Cura de PV", u("Nenhum ator encontrado para curar PV."), (n) => e.resources.heal(n, "PV", t));
		},
		async damageSAN(t) {
			await l("Dano em SAN", u("Nenhum ator encontrado para causar dano em SAN."), (n) => e.resources.damage(n, "SAN", t));
		},
		async recoverSAN(t) {
			await l("Recuperação de SAN", u("Nenhum ator encontrado para recuperar SAN."), (n) => e.resources.recover(n, "SAN", t));
		}
	};
}
async function l(e, t, i) {
	if (!t) return;
	let a = await i(t);
	if (!a.ok) {
		d(a.error);
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
function u(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function d(e) {
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
//#region src/debug/debug-api.ts
function f(e) {
	let t = c(e);
	return {
		actor: t,
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
function p(t) {
	let n = {
		services: t,
		ordem: t.ordem,
		resources: t.resources,
		debug: f(t)
	}, r = globalThis;
	return r[e] = n, r.ParanormalToolkit = n, n;
}
//#endregion
//#region src/core/system-guard.ts
var m = class {
	static isSupportedSystem() {
		return game.system.id === "ordemparanormal";
	}
	static getCurrentSystemId() {
		return game.system.id;
	}
};
//#endregion
//#region src/features/chat/chat-workflow-flags.ts
function h() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: w(e.id),
		actorId: w(e.actor?.id),
		sceneId: w(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome"
	}));
}
function g() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
	return {
		tokenId: w(e.id),
		actorId: w(t?.id),
		sceneId: w(e.scene?.id),
		name: n
	};
}
function _(e, t = g()) {
	return {
		version: 1,
		kind: "chat-targets",
		source: t,
		targets: e
	};
}
function v(t) {
	if (!C(t)) return null;
	let n = t.getFlag(e, "workflow");
	return S(n) ? n : null;
}
function y() {
	return `flags.${e}.workflow`;
}
function b(t) {
	if (!t || typeof t != "object") return !1;
	let n = foundry.utils.getProperty(t, `flags.${e}`), r = foundry.utils.getProperty(t, `_source.flags.${e}`);
	return n !== void 0 || r !== void 0;
}
function x(e) {
	let t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
	return T(t) || T(n);
}
function S(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function C(e) {
	return !!(e && typeof e == "object" && "getFlag" in e);
}
function w(e) {
	return T(e) ? e : null;
}
function T(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/chat/chat-enrichment-renderer.ts
function E() {
	let e = (e, t) => {
		D(e, t);
	};
	Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e);
}
function D(e, t) {
	let n = v(e);
	if (!n || n.targets.length === 0) return;
	let r = A(t);
	r && (r.querySelector(".paranormal-toolkit-chat-enrichment") || (r.querySelector(".message-content") ?? r).append(O(n)));
}
function O(t) {
	let n = document.createElement("section");
	n.classList.add(`${e}-chat-enrichment`);
	let r = document.createElement("strong");
	return r.textContent = "Paranormal Toolkit", n.append(r), t.source && n.append(k("Origem", t.source.name)), n.append(k("Alvo", t.targets.map((e) => e.name).join(", "))), n;
}
function k(t, n) {
	let r = document.createElement("p");
	r.classList.add(`${e}-chat-enrichment__row`);
	let i = document.createElement("span");
	i.textContent = `${t}: `;
	let a = document.createElement("span");
	return a.textContent = n, r.append(i, a), r;
}
function A(e) {
	if (e instanceof HTMLElement) return e;
	if (e && typeof e == "object") {
		let t = e;
		if (t[0] instanceof HTMLElement) return t[0];
	}
	return null;
}
//#endregion
//#region src/features/chat/chat-target-capture.ts
function j() {
	Hooks.on("preCreateChatMessage", (e, t, r, i) => {
		if (!M(i) || !N(e) || b(e) || b(t)) return;
		let a = h();
		if (a.length === 0 || !x(e) && !x(t)) return;
		let o = g();
		e.updateSource({ [y()]: _(a, o) }), n.info("Targets capturados para ChatMessage.", {
			source: o,
			targets: a
		});
	});
}
function M(e) {
	let t = game.user?.id;
	return !t || typeof e != "string" ? !0 : e === t;
}
function N(e) {
	return !!(e && typeof e == "object" && "updateSource" in e);
}
//#endregion
//#region src/core/result.ts
function P(e) {
	return {
		ok: !0,
		value: e
	};
}
function F(e) {
	return {
		ok: !1,
		error: e
	};
}
//#endregion
//#region src/adapters/ordem/ordem-paths.ts
var I = {
	PV: "system.PV",
	SAN: "system.SAN",
	PE: "system.PE",
	PD: "system.PD"
}, L = {
	ritual: { dt: "system.ritual.DT" },
	weapon: {
		category: "system.category",
		attackFormula: "system.formulas.attack",
		damageFormula: "system.formulas.damage",
		critical: "system.critical"
	}
}, R = class {
	getResource(e, t) {
		let n = I[t], r = `${n}.value`, i = `${n}.max`, a = foundry.utils.getProperty(e, r), o = foundry.utils.getProperty(e, i), s = z(e, t, r, a, "valor atual");
		if (s) return F(s);
		let c = z(e, t, i, o, "valor máximo");
		return c ? F(c) : P({
			value: a,
			max: o
		});
	}
	async updateResourceValue(e, t, n) {
		let r = I[t];
		await e.update({ [`${r}.value`]: n });
	}
};
function z(e, t, n, r, i) {
	return r == null ? {
		actor: e,
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		resource: t,
		reason: "resource-path-not-found",
		message: `Path de ${i} de ${t} não encontrado: ${n}.`,
		path: n,
		value: r
	} : typeof r != "number" || !Number.isFinite(r) ? {
		actor: e,
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		resource: t,
		reason: "invalid-resource-value",
		message: `Valor inválido para ${i} de ${t} em ${n}.`,
		path: n,
		value: r
	} : null;
}
//#endregion
//#region src/adapters/ordem/ordem-system-adapter.ts
var B = class {
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
		return this.getNumber(e, L.ritual.dt, 0);
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
}, V = class {
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
		if (!Number.isInteger(r) || r <= 0) return F({
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
		if (!i.ok) return F({
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
		if (!o.ok) return F({
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
			return F({
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
		return P({
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
			case "spend": return t.value < n ? F({
				reason: "insufficient-resource",
				message: `Recurso insuficiente. Atual: ${t.value}; custo: ${n}.`
			}) : P({
				afterValue: t.value - n,
				appliedAmount: n
			});
			case "damage": {
				let e = Math.max(0, t.value - n);
				return P({
					afterValue: e,
					appliedAmount: t.value - e
				});
			}
			case "heal":
			case "recover": {
				let e = Math.min(t.max, t.value + n);
				return P({
					afterValue: e,
					appliedAmount: e - t.value
				});
			}
		}
	}
};
//#endregion
//#region src/toolkit-services.ts
function H() {
	let e = new R(), t = new V(e);
	return {
		ordem: new B(e),
		resourceAdapter: e,
		resources: t
	};
}
//#endregion
//#region src/main.ts
var U = null;
Hooks.once("init", () => {
	n.info("Inicializando módulo.");
}), Hooks.once("ready", () => {
	if (!m.isSupportedSystem()) {
		n.warn(`Sistema não suportado: ${m.getCurrentSystemId()}. O módulo requer ordemparanormal.`);
		return;
	}
	U = H(), p(U), j(), E(), n.info("Inicializado para o sistema Ordem Paranormal."), n.info(`API de debug disponível em globalThis["${e}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info("Paranormal Toolkit inicializado.");
});
function W() {
	if (!U) throw Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
	return U;
}
//#endregion
export { W as getToolkitServices };

//# sourceMappingURL=main.js.map