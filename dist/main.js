//#region src/constants.ts
var e = "paranormal-toolkit";
//#endregion
//#region src/core/result.ts
function t(e) {
	return {
		ok: !0,
		value: e
	};
}
function n(e) {
	return {
		ok: !1,
		error: e
	};
}
//#endregion
//#region src/core/resources/resource-engine.ts
var r = class {
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
	async execute(e, r, i, a) {
		if (!Number.isInteger(a) || a <= 0) return n({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: r,
			operation: i,
			reason: "invalid-amount",
			message: "A quantidade deve ser um inteiro positivo.",
			requestedAmount: a
		});
		let o = this.adapter.getResource(e, r), s = this.calculate(i, o, a);
		if (!s.ok) return n({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: r,
			operation: i,
			reason: s.error.reason,
			message: s.error.message,
			requestedAmount: a,
			current: o.value,
			required: a
		});
		let { afterValue: c, appliedAmount: l } = s.value, u = {
			value: c,
			max: o.max
		};
		try {
			c !== o.value && await this.adapter.updateResourceValue(e, r, c);
		} catch (t) {
			return n({
				actor: e,
				actorId: e.id ?? null,
				actorName: e.name ?? "Ator sem nome",
				resource: r,
				operation: i,
				reason: "update-failed",
				message: `Falha ao atualizar ${r} no ator.`,
				requestedAmount: a,
				current: o.value,
				required: a,
				cause: t
			});
		}
		return t({
			actor: e,
			actorId: e.id ?? null,
			actorName: e.name ?? "Ator sem nome",
			resource: r,
			operation: i,
			requestedAmount: a,
			appliedAmount: l,
			before: o,
			after: u
		});
	}
	calculate(e, r, i) {
		switch (e) {
			case "spend": return r.value < i ? n({
				reason: "insufficient-resource",
				message: `Recurso insuficiente. Atual: ${r.value}; custo: ${i}.`
			}) : t({
				afterValue: r.value - i,
				appliedAmount: i
			});
			case "damage": {
				let e = Math.max(0, r.value - i);
				return t({
					afterValue: e,
					appliedAmount: r.value - e
				});
			}
			case "heal":
			case "recover": {
				let e = Math.min(r.max, r.value + i);
				return t({
					afterValue: e,
					appliedAmount: e - r.value
				});
			}
		}
	}
}, i = {
	resources: {
		PV: "system.PV",
		SAN: "system.SAN",
		PE: "system.PE",
		PD: "system.PD",
		pv: "system.PV",
		san: "system.SAN",
		pe: "system.PE",
		pd: "system.PD"
	},
	ritual: { dt: "system.ritual.DT" },
	weapon: {
		category: "system.category",
		attackFormula: "system.formulas.attack",
		damageFormula: "system.formulas.damage",
		critical: "system.critical"
	}
}, a = {
	PV: i.resources.PV,
	SAN: i.resources.SAN,
	PE: i.resources.PE,
	PD: i.resources.PD
}, o = class {
	getResource(e, t) {
		let n = a[t];
		return {
			value: this.getNumber(e, `${n}.value`, 0),
			max: this.getNumber(e, `${n}.max`, 0)
		};
	}
	async updateResourceValue(e, t, n) {
		let r = a[t];
		await e.update({ [`${r}.value`]: n });
	}
	getNumber(e, t, n) {
		let r = foundry.utils.getProperty(e, t);
		return typeof r == "number" ? r : n;
	}
}, s = class {
	resourceAdapter = new o();
	resourceEngine = new r(this.resourceAdapter);
	getActorSnapshot(e) {
		return {
			id: e.id ?? null,
			name: e.name ?? "Ator sem nome",
			type: e.type ?? "unknown",
			resources: this.getResources(e),
			ritualDT: this.getRitualDT(e)
		};
	}
	getResources(e) {
		return {
			pv: this.getResource(e, "PV"),
			san: this.getResource(e, "SAN"),
			pe: this.getResource(e, "PE"),
			pd: this.getResource(e, "PD")
		};
	}
	getResource(e, t) {
		return this.resourceAdapter.getResource(e, t);
	}
	async updateResourceValue(e, t, n) {
		await this.resourceAdapter.updateResourceValue(e, t, n);
	}
	getRitualDT(e) {
		return this.getNumber(e, i.ritual.dt, 0);
	}
	async spendPE(e, t) {
		return this.resourceEngine.spend(e, "PE", t);
	}
	async spendPD(e, t) {
		return this.resourceEngine.spend(e, "PD", t);
	}
	async damagePV(e, t) {
		return this.resourceEngine.damage(e, "PV", t);
	}
	async healPV(e, t) {
		return this.resourceEngine.heal(e, "PV", t);
	}
	async damageSAN(e, t) {
		return this.resourceEngine.damage(e, "SAN", t);
	}
	async recoverSAN(e, t) {
		return this.resourceEngine.recover(e, "SAN", t);
	}
	getNumber(e, t, n) {
		let r = foundry.utils.getProperty(e, t);
		return typeof r == "number" ? r : n;
	}
}, c = class {
	static getSelectedActor() {
		return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
	}
}, l = class {
	static async createResourceSpendMessage(e) {
		await this.createResourceOperationMessage({ transaction: {
			actor: e.actor,
			actorId: e.actor.id ?? null,
			actorName: e.actor.name ?? "Ator sem nome",
			resource: e.resourceLabel === "PD" ? "PD" : "PE",
			operation: "spend",
			requestedAmount: e.amount,
			appliedAmount: e.amount,
			before: {
				value: e.before,
				max: e.before
			},
			after: {
				value: e.after,
				max: e.before
			}
		} });
	}
	static async createResourceOperationMessage(t) {
		let n = this.createResourceOperationContent(t.transaction);
		await ChatMessage.create({
			speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
			content: n,
			flags: { [e]: { resourceTransaction: u(t.transaction) } }
		});
	}
	static createResourceOperationContent(t) {
		let n = p(t.actorName), r = p(t.resource);
		return `
      <section class="${e}-card ${e}-resource-card">
        <header class="${e}-card__header">
          <strong>${p(d(t))}</strong>
          <span>${n}</span>
        </header>
        <div class="${e}-card__body">
          <p><strong>${p(f(t))}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
	}
};
function u(e) {
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
function d(e) {
	switch (e.operation) {
		case "spend": return `Gasto de ${e.resource}`;
		case "damage": return `Dano em ${e.resource}`;
		case "heal": return `Cura de ${e.resource}`;
		case "recover": return `Recuperação de ${e.resource}`;
	}
}
function f(e) {
	switch (e.operation) {
		case "spend": return `${e.resource} gasto`;
		case "damage": return "Dano aplicado";
		case "heal": return "Cura aplicada";
		case "recover": return "Recuperação aplicada";
	}
}
function p(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
//#endregion
//#region src/core/module-logger.ts
var m = class {
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
function h(e) {
	return {
		getSelected() {
			return c.getSelectedActor();
		},
		logResources() {
			let t = _("Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário.");
			if (!t) return;
			let n = e.getActorSnapshot(t);
			m.info("Recursos do ator selecionado:", n);
		},
		async spendPE(t) {
			await g("Gasto de PE", _("Nenhum ator encontrado para gastar PE."), (n) => e.spendPE(n, t));
		},
		async spendPD(t) {
			await g("Gasto de PD", _("Nenhum ator encontrado para gastar PD."), (n) => e.spendPD(n, t));
		},
		async damagePV(t) {
			await g("Dano em PV", _("Nenhum ator encontrado para causar dano em PV."), (n) => e.damagePV(n, t));
		},
		async healPV(t) {
			await g("Cura de PV", _("Nenhum ator encontrado para curar PV."), (n) => e.healPV(n, t));
		},
		async damageSAN(t) {
			await g("Dano em SAN", _("Nenhum ator encontrado para causar dano em SAN."), (n) => e.damageSAN(n, t));
		},
		async recoverSAN(t) {
			await g("Recuperação de SAN", _("Nenhum ator encontrado para recuperar SAN."), (n) => e.recoverSAN(n, t));
		}
	};
}
async function g(e, t, n) {
	if (!t) return;
	let r = await n(t);
	if (!r.ok) {
		v(r.error);
		return;
	}
	let i = r.value;
	try {
		await l.createResourceOperationMessage({ transaction: i });
	} catch (t) {
		m.error(`${e} realizado, mas falhou ao criar o chat card.`, t), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
	}
	m.info(`${e} realizado:`, i);
}
function _(e) {
	return c.getSelectedActor() || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function v(e) {
	if (e.reason === "update-failed") {
		m.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	m.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
//#endregion
//#region src/debug/debug-api.ts
function y(e) {
	let t = h(e);
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
function b(t) {
	let n = {
		adapter: t,
		debug: y(t)
	}, r = globalThis;
	return r[e] = n, r.ParanormalToolkit = n, n;
}
//#endregion
//#region src/core/system-guard.ts
var x = class {
	static isSupportedSystem() {
		return game.system.id === "ordemparanormal";
	}
	static getCurrentSystemId() {
		return game.system.id;
	}
};
//#endregion
//#region src/features/chat/chat-workflow-flags.ts
function S() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: O(e.id),
		actorId: O(e.actor?.id),
		sceneId: O(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome"
	}));
}
function C(e) {
	return {
		version: 1,
		kind: "chat-targets",
		targets: e
	};
}
function w(t) {
	if (!D(t)) return null;
	let n = t.getFlag(e, "workflow");
	return E(n) ? n : null;
}
function T() {
	return `flags.${e}.workflow`;
}
function E(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && t.kind === "chat-targets" && Array.isArray(t.targets);
}
function D(e) {
	return !!(e && typeof e == "object" && "getFlag" in e);
}
function O(e) {
	return typeof e == "string" && e.length > 0 ? e : null;
}
//#endregion
//#region src/features/chat/chat-enrichment-renderer.ts
function k() {
	let e = (e, t) => {
		A(e, t);
	};
	Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e);
}
function A(e, t) {
	let n = w(e);
	if (!n || n.targets.length === 0) return;
	let r = M(t);
	r && (r.querySelector(".paranormal-toolkit-chat-enrichment") || (r.querySelector(".message-content") ?? r).append(j(n.targets.map((e) => e.name))));
}
function j(t) {
	let n = document.createElement("section");
	n.classList.add(`${e}-chat-enrichment`);
	let r = document.createElement("strong");
	r.textContent = "Paranormal Toolkit";
	let i = document.createElement("p");
	i.classList.add(`${e}-chat-enrichment__row`);
	let a = document.createElement("span");
	a.textContent = "Alvo: ";
	let o = document.createElement("span");
	return o.textContent = t.join(", "), i.append(a, o), n.append(r, i), n;
}
function M(e) {
	if (e instanceof HTMLElement) return e;
	if (e && typeof e == "object") {
		let t = e;
		if (t[0] instanceof HTMLElement) return t[0];
	}
	return null;
}
//#endregion
//#region src/features/chat/chat-target-capture.ts
function N() {
	Hooks.on("preCreateChatMessage", (e, t, n, r) => {
		if (!P(r) || !F(e)) return;
		let i = S();
		i.length !== 0 && (e.updateSource({ [T()]: C(i) }), m.info("Targets capturados para ChatMessage.", i));
	});
}
function P(e) {
	let t = game.user?.id;
	return !t || typeof e != "string" ? !0 : e === t;
}
function F(e) {
	return !!(e && typeof e == "object" && "updateSource" in e);
}
//#endregion
//#region src/main.ts
var I = null;
Hooks.once("init", () => {
	m.info("Inicializando módulo.");
}), Hooks.once("ready", () => {
	if (!x.isSupportedSystem()) {
		m.warn(`Sistema não suportado: ${x.getCurrentSystemId()}. O módulo requer ordemparanormal.`);
		return;
	}
	I = new s(), b(I), N(), k(), m.info("Inicializado para o sistema Ordem Paranormal."), m.info(`API de debug disponível em globalThis["${e}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info("Paranormal Toolkit inicializado.");
});
function L() {
	if (!I) throw Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
	return I;
}
//#endregion
export { L as getOrdemAdapter };

//# sourceMappingURL=main.js.map