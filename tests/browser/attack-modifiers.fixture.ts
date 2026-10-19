import { INTUITIVE_SHOT_PRESET } from "../../src/features/attack-modifiers/presets/intuitive-shot";

const preview = document.querySelector<HTMLElement>("#preview")!, result = document.querySelector<HTMLElement>("#result")!;
class PreviewApplication {
  element: HTMLElement;
  constructor(public options: any) {
    this.element = document.createElement("section");
    this.element.className = "application paranormal-toolkit paranormal-toolkit-ritual-cast-app paranormal-toolkit-ability-use-app";
    this.element.innerHTML = '<header class="window-header"><span>⚔ Configurar ataque</span><span>×</span></header><div class="window-content"></div>';
    this.element.addEventListener("click", event => {
      const action = (event.target as Element).closest<HTMLElement>("[data-action]")?.dataset.action;
      const handler = (this.constructor as any).DEFAULT_OPTIONS.actions[action ?? ""];
      if (handler) void handler.call(this, event);
    });
    preview.append(this.element);
  }
  async render() {
    const self = this as any;
    self._replaceHTML(await self._renderHTML({}, {}), this.element.querySelector(".window-content"), {});
  }
  async close() { this.element.remove(); return this; }
}
Object.assign(globalThis, {
  foundry: { applications: { api: { ApplicationV2: PreviewApplication } }, utils: { randomID: () => crypto.randomUUID() } },
  game: { modules: new Map(), user: { id: "player" }, packs: new Map() },
  ui: { notifications: { info: (text: string) => { result.textContent = text; }, warn: (text: string) => { result.textContent = text; } } },
});
const { AttackModifierApplication } = await import("../../src/applications/attack-modifier-application");
const input = {
  weaponName: "Fuzil de assalto", weaponImage: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#79695c"/><path d="M10 32h39v7H10zm27-10h17v4H37zM25 39h8v14h-8z" fill="#eee6d9"/></svg>'),
  actorName: "Rafa Nakamura", targetName: null, baseCritical: { margin: 19, multiplier: 3 }, resource: "PE" as const, currentResource: 12,
  available: [{ preset: INTUITIVE_SHOT_PRESET, abilityUuid: "Actor.rafa.Item.ability", abilityName: "Tiro Intuitivo" }],
};
const open = async () => {
  preview.replaceChildren();
  const application = new AttackModifierApplication(input, value => { result.textContent = JSON.stringify(value); });
  await application.render({ force: true });
  return application;
};
document.querySelector("#open")!.addEventListener("click", () => void open());
document.querySelector("#check")!.addEventListener("click", async () => {
  try {
    await open();
    const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
    const inputAt = (id: string) => preview.querySelector<HTMLInputElement>('[data-option-id="' + id + '"]')!;
    check(!inputAt("use").checked && !inputAt("empower").checked && inputAt("empower").disabled, "Estado inicial incorreto");
    inputAt("use").click(); await new Promise(resolve => requestAnimationFrame(resolve));
    check(!inputAt("empower").disabled && preview.textContent?.includes("17/x3"), "Opção principal incorreta");
    inputAt("empower").click(); await new Promise(resolve => requestAnimationFrame(resolve));
    check(preview.textContent?.includes("17/x4") && preview.textContent.includes("10 PE"), "Resumo pago incorreto");
    inputAt("use").click(); await new Promise(resolve => requestAnimationFrame(resolve));
    check(!inputAt("empower").checked && inputAt("empower").disabled && preview.textContent?.includes("19/x3"), "Dependência não foi limpa");
    inputAt("use").click(); await new Promise(resolve => requestAnimationFrame(resolve));
    inputAt("empower").click(); await new Promise(resolve => requestAnimationFrame(resolve));
    result.textContent = "4 verificações aprovadas: estado inicial, seleção principal, resumo pago e limpeza de dependência.";
  } catch (error) { result.textContent = "FALHA: " + String(error); }
});
await open();
