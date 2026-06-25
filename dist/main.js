const MODULE_ID = "paranormal-toolkit";
const MODULE_TITLE = "Paranormal Toolkit";
const SUPPORTED_SYSTEM_ID = "ordemparanormal";

const ORDEM_PATHS = {
  resources: {
    pv: "system.PV",
    san: "system.SAN",
    pe: "system.PE",
    pd: "system.PD"
  },
  ritual: {
    dt: "system.ritual.DT"
  },
  weapon: {
    category: "system.category",
    attackFormula: "system.formulas.attack",
    damageFormula: "system.formulas.damage",
    critical: "system.critical"
  }
};

class ModuleLogger {
  static info(message, ...args) {
    console.log(`${MODULE_ID} | ${message}`, ...args);
  }

  static warn(message, ...args) {
    console.warn(`${MODULE_ID} | ${message}`, ...args);
  }

  static error(message, ...args) {
    console.error(`${MODULE_ID} | ${message}`, ...args);
  }
}

class SystemGuard {
  static isSupportedSystem() {
    return game.system.id === SUPPORTED_SYSTEM_ID;
  }

  static getCurrentSystemId() {
    return game.system.id;
  }
}

class OrdemAdapter {
  getResources(actor) {
    return {
      pv: this.#getResource(actor, ORDEM_PATHS.resources.pv),
      san: this.#getResource(actor, ORDEM_PATHS.resources.san),
      pe: this.#getResource(actor, ORDEM_PATHS.resources.pe),
      pd: this.#getResource(actor, ORDEM_PATHS.resources.pd)
    };
  }

  getRitualDT(actor) {
    return this.#getNumber(actor, ORDEM_PATHS.ritual.dt, 0);
  }

  async spendPE(actor, amount) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("A quantidade de PE deve ser um inteiro positivo.");
    }

    const current = this.#getNumber(actor, `${ORDEM_PATHS.resources.pe}.value`, 0);
    const next = Math.max(0, current - amount);

    await actor.update({ [`${ORDEM_PATHS.resources.pe}.value`]: next });
  }

  #getResource(actor, path) {
    return {
      value: this.#getNumber(actor, `${path}.value`, 0),
      max: this.#getNumber(actor, `${path}.max`, 0)
    };
  }

  #getNumber(document, path, fallback) {
    const value = foundry.utils.getProperty(document, path);
    return typeof value === "number" ? value : fallback;
  }
}

let ordemAdapter = null;

Hooks.once("init", () => {
  ModuleLogger.info("Inicializando módulo.");
});

Hooks.once("ready", () => {
  if (!SystemGuard.isSupportedSystem()) {
    ModuleLogger.warn(
      `Sistema não suportado: ${SystemGuard.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }

  ordemAdapter = new OrdemAdapter();

  ModuleLogger.info("Inicializado para o sistema Ordem Paranormal.");
  ui.notifications?.info(`${MODULE_TITLE} inicializado.`);
});

function getOrdemAdapter() {
  if (!ordemAdapter) {
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  }

  return ordemAdapter;
}

export { getOrdemAdapter };
