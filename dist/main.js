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
//#region src/adapters/ordem/ordem-paths.ts
var r = {
	resources: {
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
}, i = class {
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
			pv: this.getResource(e, r.resources.pv),
			san: this.getResource(e, r.resources.san),
			pe: this.getResource(e, r.resources.pe),
			pd: this.getResource(e, r.resources.pd)
		};
	}
	getRitualDT(e) {
		return this.getNumber(e, r.ritual.dt, 0);
	}
	async spendPE(e, i) {
		if (!Number.isInteger(i) || i <= 0) return n({
			actor: e,
			resource: "PE",
			reason: "invalid-amount",
			message: "A quantidade de PE deve ser um inteiro positivo.",
			amount: i
		});
		let a = this.getNumber(e, `${r.resources.pe}.value`, 0);
		if (a < i) return n({
			actor: e,
			resource: "PE",
			reason: "insufficient-resource",
			message: `PE insuficiente. Atual: ${a}; custo: ${i}.`,
			amount: i,
			current: a,
			required: i
		});
		let o = a - i;
		try {
			await e.update({ [`${r.resources.pe}.value`]: o });
		} catch (t) {
			return n({
				actor: e,
				resource: "PE",
				reason: "update-failed",
				message: "Falha ao atualizar PE no ator.",
				amount: i,
				current: a,
				required: i,
				cause: t
			});
		}
		return t({
			actor: e,
			resource: "PE",
			amount: i,
			before: a,
			after: o,
			snapshot: this.getActorSnapshot(e)
		});
	}
	getResource(e, t) {
		return {
			value: this.getNumber(e, `${t}.value`, 0),
			max: this.getNumber(e, `${t}.max`, 0)
		};
	}
	getNumber(e, t, n) {
		let r = foundry.utils.getProperty(e, t);
		return typeof r == "number" ? r : n;
	}
}, a = class {
	static getSelectedActor() {
		return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
	}
}, o = class {
	static async createResourceSpendMessage(e) {
		let t = this.createResourceSpendContent(e);
		await ChatMessage.create({
			speaker: ChatMessage.getSpeaker({ actor: e.actor }),
			content: t
		});
	}
	static createResourceSpendContent(t) {
		let n = s(t.actor.name ?? "Ator sem nome"), r = s(t.resourceLabel);
		return `
      <section class="${e}-card ${e}-resource-card">
        <header class="${e}-card__header">
          <strong>Gasto de ${r}</strong>
          <span>${n}</span>
        </header>
        <div class="${e}-card__body">
          <p><strong>${r} gasto:</strong> ${t.amount}</p>
          <p><strong>Antes:</strong> ${t.before} &rarr; <strong>Depois:</strong> ${t.after}</p>
        </div>
      </section>
    `;
	}
};
function s(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
//#endregion
//#region src/core/module-logger.ts
var c = class {
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
function l(e) {
	return {
		getSelected() {
			return a.getSelectedActor();
		},
		logResources() {
			let t = u("Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário.");
			if (!t) return;
			let n = e.getActorSnapshot(t);
			c.info("Recursos do ator selecionado:", n);
		},
		async spendPE(t) {
			let n = u("Nenhum ator encontrado para gastar PE.");
			if (!n) return;
			let r = await e.spendPE(n, t);
			if (!r.ok) {
				d(r.error);
				return;
			}
			let i = r.value;
			try {
				await o.createResourceSpendMessage({
					actor: n,
					resourceLabel: i.resource,
					amount: i.amount,
					before: i.before,
					after: i.after
				});
			} catch (e) {
				c.error("PE foi gasto, mas falhou ao criar o chat card.", e), ui.notifications?.error("Paranormal Toolkit: PE gasto, mas falhou ao criar mensagem no chat.");
			}
			c.info(`PE gasto: ${t}. Recursos atualizados:`, i.snapshot);
		}
	};
}
function u(e) {
	return a.getSelectedActor() || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function d(e) {
	if (e.reason === "update-failed") {
		c.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
		return;
	}
	c.warn(`Gasto de PE não realizado: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
//#endregion
//#region src/debug/debug-api.ts
function f(e) {
	let t = l(e);
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
		adapter: t,
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
}, h = null;
Hooks.once("init", () => {
	c.info("Inicializando módulo.");
}), Hooks.once("ready", () => {
	if (!m.isSupportedSystem()) {
		c.warn(`Sistema não suportado: ${m.getCurrentSystemId()}. O módulo requer ordemparanormal.`);
		return;
	}
	h = new i(), p(h), c.info("Inicializado para o sistema Ordem Paranormal."), c.info(`API de debug disponível em globalThis["${e}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info("Paranormal Toolkit inicializado.");
});
function g() {
	if (!h) throw Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
	return h;
}
//#endregion
export { g as getOrdemAdapter };

//# sourceMappingURL=main.js.map