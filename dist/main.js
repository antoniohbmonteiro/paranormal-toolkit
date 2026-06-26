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
		let n = l(t.actorName), r = l(t.resource);
		return `
      <section class="${e}-card ${e}-resource-card">
        <header class="${e}-card__header">
          <strong>${l(o(t))}</strong>
          <span>${n}</span>
        </header>
        <div class="${e}-card__body">
          <p><strong>${l(s(t))}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
	}
	static createWorkflowSummaryContent(t, n) {
		let r = l(n.title ?? "Automação"), i = n.message ? `<p>${l(n.message)}</p>` : "", a = l(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = l(t.item.name ?? "Item sem nome"), u = t.targets.length > 0 ? t.targets.map((e) => l(e.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map((e) => `<li><strong>${l(e.id)}:</strong> ${l(e.formula)} = ${e.total}</li>`), f = t.ritualCosts.map((e) => `<li><strong>${l(e.itemName)}:</strong> ${e.circle}º círculo — ${e.amount} ${l(e.resource)} (${l(c(e.source))})</li>`), p = t.resourceTransactions.map((e) => `<li><strong>${l(e.actorName)}:</strong> ${l(o(e))} — ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</li>`);
		return `
      <section class="${e}-card ${e}-workflow-card">
        <header class="${e}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${e}-card__body">
          ${i}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${u}</p>
          ${f.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${p.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${p.join("")}</ul>` : ""}
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
		ritualCosts: e.ritualCosts.map((e) => ({
			itemId: e.itemId,
			itemName: e.itemName,
			circle: e.circle,
			resource: e.resource,
			amount: e.amount,
			source: e.source
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
	switch (e) {
		case "custom-flag": return "customizado";
		case "default-by-circle": return "padrão por círculo";
		default: return e;
	}
}
function l(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
//#endregion
//#region src/debug/actor-debug-api.ts
function u(e) {
	return {
		getSelected() {
			return t.getSelectedActor();
		},
		logResources() {
			let t = f("Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário.");
			if (!t) return;
			let r = e.ordem.getActorSnapshot(t);
			n.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && n.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
		},
		async spendPE(t) {
			await d("Gasto de PE", f("Nenhum ator encontrado para gastar PE."), (n) => e.resources.spend(n, "PE", t));
		},
		async spendPD(t) {
			await d("Gasto de PD", f("Nenhum ator encontrado para gastar PD."), (n) => e.resources.spend(n, "PD", t));
		},
		async damagePV(t) {
			await d("Dano em PV", f("Nenhum ator encontrado para causar dano em PV."), (n) => e.resources.damage(n, "PV", t));
		},
		async healPV(t) {
			await d("Cura de PV", f("Nenhum ator encontrado para curar PV."), (n) => e.resources.heal(n, "PV", t));
		},
		async damageSAN(t) {
			await d("Dano em SAN", f("Nenhum ator encontrado para causar dano em SAN."), (n) => e.resources.damage(n, "SAN", t));
		},
		async recoverSAN(t) {
			await d("Recuperação de SAN", f("Nenhum ator encontrado para recuperar SAN."), (n) => e.resources.recover(n, "SAN", t));
		}
	};
}
async function d(e, t, i) {
	if (!t) return;
	let a = await i(t);
	if (!a.ok) {
		p(a.error);
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
function f(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function p(e) {
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
//#region src/core/result.ts
function m(e) {
	return {
		ok: !0,
		value: e
	};
}
function h(e) {
	return {
		ok: !1,
		error: e
	};
}
//#endregion
//#region src/features/automation/automation-flag-reader.ts
function g(t) {
	let n = t.getFlag(e, "automation");
	return n == null ? h({
		reason: "missing-automation",
		message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
	}) : ie(n) ? m(n) : h({
		reason: "invalid-automation",
		message: `Automação do item ${t.name} é inválida ou não é suportada.`,
		value: n
	});
}
function ee() {
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
function te(e = "1d8") {
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
function ne(e = "1d8") {
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
function re() {
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
async function _(t, n) {
	await t.setFlag(e, "automation", n);
}
function ie(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && S(t.label) && Array.isArray(t.steps) && t.steps.every(ae);
}
function ae(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	switch (t.type) {
		case "spendResource": return oe(t);
		case "spendRitualCost": return se(t);
		case "rollFormula": return v(t);
		case "modifyResource": return y(t);
		case "chatCard": return b(t);
		default: return !1;
	}
}
function oe(e) {
	let t = e;
	return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && x(t);
}
function se(e) {
	return e.type === "spendRitualCost";
}
function v(e) {
	let t = e;
	return t.type === "rollFormula" && S(t.id) && S(t.formula);
}
function y(e) {
	let t = e;
	return t.type === "modifyResource" && ce(t.actor) && le(t.resource) && ue(t.operation) && x(t);
}
function b(e) {
	let t = e;
	return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function x(e) {
	return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || S(e.amountFrom);
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
function S(e) {
	return typeof e == "string" && e.length > 0;
}
//#endregion
//#region src/features/automation/workflow-target-resolver.ts
function C() {
	return Array.from(game.user?.targets ?? []).map((e) => ({
		tokenId: T(e.id),
		actorId: T(e.actor?.id),
		sceneId: T(e.scene?.id),
		name: e.name ?? e.actor?.name ?? "Alvo sem nome",
		actor: e.actor ?? null
	}));
}
function w() {
	let e = canvas?.tokens?.controlled?.[0];
	if (!e) return null;
	let t = e.actor ?? null;
	return {
		tokenId: T(e.id),
		actorId: T(t?.id),
		sceneId: T(e.scene?.id),
		name: e.name ?? t?.name ?? "Origem sem nome"
	};
}
function T(e) {
	return typeof e == "string" && e.length > 0 ? e : null;
}
//#endregion
//#region src/features/automation/actor-item-resolver.ts
function E(e) {
	let t = e.items;
	if (Array.isArray(t)) return t;
	if (t && typeof t == "object") {
		let e = t;
		if (Array.isArray(e.contents)) return e.contents.filter(D);
		if (me(t)) return Array.from(t).filter(D);
	}
	return [];
}
function de(e) {
	return E(e)[0] ?? null;
}
function fe(e) {
	return E(e).find(pe) ?? null;
}
function pe(t) {
	return t.getFlag(e, "automation") !== void 0;
}
function me(e) {
	return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function D(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/features/rituals/ritual-item-resolver.ts
function he(e) {
	return E(e).filter((e) => e.type === "ritual");
}
function ge(e) {
	return he(e)[0] ?? null;
}
//#endregion
//#region src/debug/ritual-debug-api.ts
function _e(t) {
	return {
		logFirstRitualCost() {
			let e = O("Nenhum ator encontrado para consultar custo de ritual.");
			if (!e) return;
			let r = k(e);
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
			let i = O("Nenhum ator encontrado para configurar custo customizado.");
			if (!i) return;
			let a = k(i);
			if (a) {
				if (!A(t, r)) {
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
			let t = O("Nenhum ator encontrado para limpar custo customizado.");
			if (!t) return;
			let r = k(t);
			r && (await r.unsetFlag(e, "ritual.cost"), n.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
		},
		async setTestCostAutomationOnFirstRitual() {
			let e = O("Nenhum ator encontrado para configurar automação de custo de ritual.");
			if (!e) return;
			let t = k(e);
			t && (await _(t, ee()), n.info(`Automação de custo aplicada ao ritual: ${t.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${t.name}.`));
		},
		async setTestHealingAutomationOnFirstRitual(e = "1d8") {
			let t = O("Nenhum ator encontrado para configurar ritual de cura simples.");
			if (!t) return;
			let r = k(t);
			if (r) {
				if (!j(e)) {
					ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
					return;
				}
				await _(r, te(e)), n.info(`Automação de cura simples aplicada ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
			}
		},
		async setTestDamageAutomationOnFirstRitual(e = "1d8") {
			let t = O("Nenhum ator encontrado para configurar ritual de dano simples.");
			if (!t) return;
			let r = k(t);
			if (r) {
				if (!j(e)) {
					ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
					return;
				}
				await _(r, ne(e)), n.info(`Automação de dano simples aplicada ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
			}
		},
		async runFirstRitualAutomation() {
			let e = O("Nenhum ator encontrado para executar automação de ritual.");
			if (!e) return;
			let n = k(e);
			n && await ve(t, e, n);
		}
	};
}
async function ve(e, t, r) {
	let i = g(r);
	if (!i.ok) {
		n.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
		return;
	}
	let a = await e.automation.run(i.value, {
		sourceActor: t,
		sourceToken: w(),
		item: r,
		targets: C()
	});
	if (!a.ok) {
		ye(a.error);
		return;
	}
	n.info("Automação de ritual executada com sucesso.", a.value);
}
function ye(e) {
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
function O(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function k(e) {
	return ge(e) || (n.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function A(e, t) {
	return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function j(e) {
	return typeof e == "string" && e.trim().length > 0;
}
//#endregion
//#region src/debug/workflow-debug-api.ts
function M(e) {
	return {
		async runFirstAutomation() {
			let t = F("Nenhum ator encontrado para executar automação.");
			if (!t) return;
			let r = fe(t);
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
			if (!xe(r)) {
				n.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
				return;
			}
			let i = be(r) ?? F("Nenhum ator encontrado para executar automação do item.");
			i && await N(e, i, r);
		},
		async setTestHealingAutomationOnFirstItem() {
			let e = F("Nenhum ator encontrado para configurar automação de teste.");
			if (!e) return;
			let t = de(e);
			if (!t) {
				n.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
				return;
			}
			try {
				await _(t, re()), n.info(`Automação de teste aplicada ao item: ${t.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${t.name}.`);
			} catch (e) {
				n.error("Falha ao configurar automação de teste no item.", e), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
			}
		}
	};
}
async function N(e, t, r) {
	let i = g(r);
	if (!i.ok) {
		n.warn(i.error.message, i.error), ui.notifications?.warn(`Paranormal Toolkit: ${i.error.message}`);
		return;
	}
	let a = await e.automation.run(i.value, {
		sourceActor: t,
		sourceToken: w(),
		item: r,
		targets: C()
	});
	if (!a.ok) {
		P(a.error);
		return;
	}
	n.info("Automação executada com sucesso.", a.value);
}
function P(e) {
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
function F(e) {
	return t.getSelectedActor() || (n.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function be(e) {
	let t = e.parent;
	return t instanceof Actor ? t : null;
}
function xe(e) {
	return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
//#endregion
//#region src/debug/debug-api.ts
function Se(e) {
	let t = u(e);
	return {
		actor: t,
		ritual: _e(e),
		workflow: M(e),
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
function Ce(t) {
	let n = {
		services: t,
		ordem: t.ordem,
		resources: t.resources,
		ritualCosts: t.ritualCosts,
		automation: t.automation,
		debug: Se(t)
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
function we() {
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
function Te(e, t = L()) {
	return {
		version: 1,
		kind: "chat-targets",
		source: t,
		targets: e
	};
}
function Ee(t) {
	if (!ke(t)) return null;
	let n = t.getFlag(e, "workflow");
	return Oe(n) ? n : null;
}
function De() {
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
function Oe(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ke(e) {
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
function Ae() {
	let e = (e, t) => {
		je(e, t);
	};
	Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e);
}
function je(e, t) {
	let n = Ee(e);
	if (!n || n.targets.length === 0) return;
	let r = Ne(t);
	r && (r.querySelector(".paranormal-toolkit-chat-enrichment") || (r.querySelector(".message-content") ?? r).append(Me(n)));
}
function Me(t) {
	let n = document.createElement("section");
	n.classList.add(`${e}-chat-enrichment`);
	let r = document.createElement("strong");
	return r.textContent = "Paranormal Toolkit", n.append(r), t.source && n.append(H("Origem", t.source.name)), n.append(H("Alvo", t.targets.map((e) => e.name).join(", "))), n;
}
function H(t, n) {
	let r = document.createElement("p");
	r.classList.add(`${e}-chat-enrichment__row`);
	let i = document.createElement("span");
	i.textContent = `${t}: `;
	let a = document.createElement("span");
	return a.textContent = n, r.append(i, a), r;
}
function Ne(e) {
	if (e instanceof HTMLElement) return e;
	if (e && typeof e == "object") {
		let t = e;
		if (t[0] instanceof HTMLElement) return t[0];
	}
	return null;
}
//#endregion
//#region src/features/chat/chat-target-capture.ts
function Pe() {
	Hooks.on("preCreateChatMessage", (e, t, r, i) => {
		if (!Fe(i) || !Ie(e) || R(e) || R(t)) return;
		let a = we();
		if (a.length === 0 || !z(e) && !z(t)) return;
		let o = L();
		e.updateSource({ [De()]: Te(a, o) }), n.info("Targets capturados para ChatMessage.", {
			source: o,
			targets: a
		});
	});
}
function Fe(e) {
	let t = game.user?.id;
	return !t || typeof e != "string" ? !0 : e === t;
}
function Ie(e) {
	return !!(e && typeof e == "object" && "updateSource" in e);
}
//#endregion
//#region src/adapters/ordem/ordem-paths.ts
var U = {
	PV: "system.PV",
	SAN: "system.SAN",
	PE: "system.PE",
	PD: "system.PD"
}, W = { PV: "system.attributes.hp" }, G = {
	PV: [U.PV, W.PV],
	SAN: [U.SAN],
	PE: [U.PE],
	PD: [U.PD]
}, K = {
	ritual: { dt: "system.ritual.DT" },
	ritualItem: { circleCandidates: ["system.circle", "system.ritual.circle"] },
	weapon: {
		category: "system.category",
		attackFormula: "system.formulas.attack",
		damageFormula: "system.formulas.damage",
		critical: "system.critical"
	}
}, Le = class {
	getResource(e, t) {
		let n = q(e, t);
		if (!n.ok) return h(n.error);
		let r = n.value, i = `${r}.value`, a = `${r}.max`, o = foundry.utils.getProperty(e, i), s = foundry.utils.getProperty(e, a), c = Y(e, t, i, o, "valor atual");
		if (c) return h(c);
		let l = Y(e, t, a, s, "valor máximo");
		return l ? h(l) : m({
			value: o,
			max: s
		});
	}
	async updateResourceValue(e, t, n) {
		let r = q(e, t);
		if (!r.ok) throw Error(r.error.message);
		await e.update({ [`${r.value}.value`]: n });
	}
};
function q(e, t) {
	let n = Re(e.type, t);
	if (n && J(e, n)) return m(n);
	let r = G[t].find((t) => J(e, t));
	return r ? m(r) : h({
		actor: e,
		actorId: e.id ?? null,
		actorName: e.name ?? "Ator sem nome",
		actorType: e.type ?? "unknown",
		resource: t,
		reason: "resource-path-not-found",
		message: ze(e, t),
		path: G[t].join(" | ")
	});
}
function Re(e, t) {
	return e === "threat" ? W[t] ?? null : e === "agent" ? U[t] : null;
}
function J(e, t) {
	let n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
	return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function ze(e, t) {
	let n = e.type ?? "unknown", r = G[t].join(", ");
	return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Y(e, t, n, r, i) {
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
var Be = class {
	isRitual(e) {
		return e.type === "ritual";
	}
	getCircle(e) {
		if (!this.isRitual(e)) return h({
			reason: "not-a-ritual",
			message: `Item ${e.name ?? "sem nome"} não é um ritual.`,
			ritual: e
		});
		let t = this.readCircleFromKnownPaths(e);
		if (!t) {
			let t = K.ritualItem.circleCandidates;
			return h({
				reason: "ritual-circle-not-found",
				message: `Círculo do ritual não encontrado. Paths testados: ${t.join(", ")}.`,
				ritual: e,
				paths: [...t]
			});
		}
		let { path: n, value: r } = t, i = Ve(r);
		return i ? m(i) : h({
			reason: "invalid-ritual-circle",
			message: `Círculo do ritual inválido em ${n}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
			ritual: e,
			path: n,
			value: r
		});
	}
	readCircleFromKnownPaths(e) {
		for (let t of K.ritualItem.circleCandidates) {
			let n = foundry.utils.getProperty(e, t);
			if (n != null) return {
				path: t,
				value: n
			};
		}
		return null;
	}
};
function Ve(e) {
	if (X(e)) return e;
	if (typeof e == "string") {
		let t = e.trim();
		if (!/^\d+$/.test(t)) return null;
		let n = Number(t);
		if (X(n)) return n;
	}
	return null;
}
function X(e) {
	return e === 1 || e === 2 || e === 3 || e === 4;
}
//#endregion
//#region src/adapters/ordem/ordem-ritual-cost-provider.ts
var He = {
	1: 1,
	2: 3,
	3: 6,
	4: 10
}, Ue = class {
	ritualAdapter;
	constructor(e) {
		this.ritualAdapter = e;
	}
	getCost(e) {
		let t = this.ritualAdapter.getCircle(e.ritual);
		if (!t.ok) return h({
			...t.error,
			actor: e.actor
		});
		let n = t.value, r = Z(e.ritual, n);
		return r.ok ? r.value ? m(r.value) : m({
			resource: "PE",
			amount: He[n],
			source: "default-by-circle",
			circle: n
		}) : h(r.error);
	}
};
function Z(t, n) {
	let r = t.getFlag(e, "ritual.cost");
	return r == null ? {
		ok: !0,
		value: null
	} : We(r) ? {
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
function We(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
//#endregion
//#region src/adapters/ordem/ordem-system-adapter.ts
var Ge = class {
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
		return this.getNumber(e, K.ritual.dt, 0);
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
function Ke(e) {
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
var qe = class {
	resources;
	ritualCosts;
	messages;
	constructor(e, t, n) {
		this.resources = e, this.ritualCosts = t, this.messages = n;
	}
	async run(e, t) {
		let n = Ke(t);
		if (e.steps.length === 0) return h({
			reason: "empty-automation",
			message: "A automação não possui steps para executar.",
			context: n
		});
		for (let [t, r] of e.steps.entries()) {
			let e = await this.runStep(r, n, t);
			if (!e.ok) return e;
		}
		return m({
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
			default: return h({
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
		if (!r.ok) return h({
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
		if (!r.ok) return h({
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
		if (!Q(e.id) || !Q(e.formula)) return h({
			reason: "invalid-step",
			message: "Step rollFormula precisa de id e formula.",
			stepIndex: n,
			step: e,
			context: t
		});
		try {
			let r = new Roll(e.formula), i = await Promise.resolve(r.evaluate()), a = i.total;
			return typeof a != "number" || !Number.isFinite(a) ? h({
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
			}, m(void 0));
		} catch (r) {
			return h({
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
		if (!r.ok) return h({
			...r.error,
			stepIndex: n,
			step: e,
			context: t
		});
		let i = this.resolveActors(e.actor, t);
		if (i.length === 0) return h({
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
		return m(void 0);
	}
	async runChatCardStep(e, t, n) {
		try {
			return await this.messages.createWorkflowSummaryMessage(t, e), m(void 0);
		} catch (r) {
			return h({
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
		return h({
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
		return e.ok ? (t.resourceTransactions.push(e.value), m(void 0)) : h({
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
		if (typeof e.amount == "number") return !Number.isInteger(e.amount) || e.amount <= 0 ? h({
			reason: "invalid-amount-source",
			message: "Amount precisa ser um inteiro positivo."
		}) : m(e.amount);
		if (typeof e.amountFrom == "string") {
			let n = /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e.amountFrom)?.groups?.rollId;
			if (!n) return h({
				reason: "invalid-amount-source",
				message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
			});
			let r = t.rolls[n];
			if (!r) return h({
				reason: "missing-roll-result",
				message: `Resultado da rolagem não encontrado: ${n}.`
			});
			let i = Math.trunc(r.total);
			return !Number.isInteger(i) || i <= 0 ? h({
				reason: "invalid-amount-source",
				message: `Total da rolagem ${n} não gerou um amount positivo.`
			}) : m(i);
		}
		return h({
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
var Je = class {
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
		if (!Number.isInteger(r) || r <= 0) return h({
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
		if (!i.ok) return h({
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
		if (!o.ok) return h({
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
			return h({
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
		return m({
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
			case "spend": return t.value < n ? h({
				reason: "insufficient-resource",
				message: `Recurso insuficiente. Atual: ${t.value}; custo: ${n}.`
			}) : m({
				afterValue: t.value - n,
				appliedAmount: n
			});
			case "damage": {
				let e = Math.max(0, t.value - n);
				return m({
					afterValue: e,
					appliedAmount: t.value - e
				});
			}
			case "heal":
			case "recover": {
				let e = Math.min(t.max, t.value + n);
				return m({
					afterValue: e,
					appliedAmount: e - t.value
				});
			}
		}
	}
};
//#endregion
//#region src/toolkit-services.ts
function Ye() {
	let e = new Le(), t = new Je(e), n = new Be(), i = new Ue(n);
	return {
		ordem: new Ge(e),
		resourceAdapter: e,
		ritualAdapter: n,
		ritualCosts: i,
		resources: t,
		automation: new qe(t, i, r)
	};
}
//#endregion
//#region src/main.ts
var $ = null;
Hooks.once("init", () => {
	n.info("Inicializando módulo.");
}), Hooks.once("ready", () => {
	if (!I.isSupportedSystem()) {
		n.warn(`Sistema não suportado: ${I.getCurrentSystemId()}. O módulo requer ordemparanormal.`);
		return;
	}
	$ = Ye(), Ce($), Pe(), Ae(), n.info("Inicializado para o sistema Ordem Paranormal."), n.info(`API de debug disponível em globalThis["${e}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info("Paranormal Toolkit inicializado.");
});
function Xe() {
	if (!$) throw Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
	return $;
}
//#endregion
export { Xe as getToolkitServices };

//# sourceMappingURL=main.js.map