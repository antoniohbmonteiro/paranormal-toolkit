import { MODULE_ID } from "../../constants";
import { ModuleLogger } from "../../core/module-logger";
import { canReadAbilityEffects } from "../../features/allies/config/ally-ability-config";
import { ItemEffectConfigService, resolveItemEffectConfigContext } from "../../features/item-effects/item-effect-config-service";
import { renderItemEffectConfigEntry } from "../components/item-effects/item-effect-config";

export type EffectItemSheet = {
  item?: Item; document?: Item; element: HTMLElement; parts?: Record<string, HTMLElement>;
  isVisible?: boolean; isEditable?: boolean;
};
type Mount = { root: HTMLElement; host: HTMLElement; controller: AbortController; presentation: string };
const mounts = new WeakMap<object, Mount>();
const warned = new WeakSet<object>();
const ATTRIBUTE = "data-paranormal-toolkit-item-effect-config";
const REGISTERED = `__${MODULE_ID}_itemEffectConfigBlockRegistered`;

export function disposeItemEffectConfigBlock(sheet: object): void {
  const mount = mounts.get(sheet);
  mount?.controller.abort(); mount?.root.remove(); mounts.delete(sheet);
}
export function mountItemEffectConfigBlock(sheet: EffectItemSheet): void {
  const item = sheet.item ?? sheet.document;
  const context = item && resolveItemEffectConfigContext(item);
  if (!item || !context || sheet.isVisible === false || !canReadAbilityEffects(item)) { disposeItemEffectConfigBlock(sheet); return; }
  const part = sheet.parts?.effects;
  const descriptor = (sheet.constructor as typeof Object & { PARTS?: { effects?: { scrollable?: string[] } } }).PARTS?.effects;
  const selectors = descriptor?.scrollable;
  const hosts = new Set<HTMLElement>();
  if (part && sheet.element?.contains(part) && selectors?.length) {
    for (const selector of selectors) for (const host of part.querySelectorAll<HTMLElement>(selector)) hosts.add(host);
  }
  if (!part || hosts.size !== 1) {
    disposeItemEffectConfigBlock(sheet);
    if (!warned.has(sheet)) { warned.add(sheet); ModuleLogger.warn("A ficha não expõe uma parte Efeitos com contêiner rolável único. Interface nativa preservada."); }
    return;
  }
  const host = [...hosts][0];
  let mounted = mounts.get(sheet);
  if (mounted && (mounted.host !== host || !host.contains(mounted.root))) { disposeItemEffectConfigBlock(sheet); mounted = undefined; }
  for (const duplicate of part.querySelectorAll<HTMLElement>(`[${ATTRIBUTE}]`)) if (duplicate !== mounted?.root) duplicate.remove();
  const service = new ItemEffectConfigService(item);
  const presentation = renderItemEffectConfigEntry({ benefits: context === "ally", independent: context === "independent",
    readOnly: sheet.isEditable === false || !service.editable });
  if (mounted) {
    if (mounted.presentation !== presentation) { mounted.root.innerHTML = presentation; mounted.presentation = presentation; }
    return;
  }
  const root = document.createElement("section");
  root.className = "paranormal-toolkit-item-effect-config-entry";
  root.setAttribute(ATTRIBUTE, item.uuid); root.innerHTML = presentation;
  const Controller = root.ownerDocument.defaultView?.AbortController ?? AbortController;
  const controller = new Controller();
  root.addEventListener("click", event => {
    const target = event.target as Element | null;
    if (!target?.closest("[data-paranormal-toolkit-effect-config-open]")) return;
    event.preventDefault(); event.stopPropagation();
    const current = sheet.item ?? sheet.document;
    if (!current || !canReadAbilityEffects(current) || !resolveItemEffectConfigContext(current)) return;
    void import("../../applications/item-effect-config-application").then(({ openItemEffectConfig }) => openItemEffectConfig(current))
      .catch(error => ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao abrir efeitos da habilidade."));
  }, { signal: controller.signal });
  host.append(root); mounts.set(sheet, { root, host, controller, presentation });
}
export function registerItemSheetAbilityEffectConfigBlock(): void {
  const globals = globalThis as typeof globalThis & Record<string, unknown>;
  if (globals[REGISTERED]) return;
  globals[REGISTERED] = true;
  Hooks.on("renderItemSheetV2", (sheet: EffectItemSheet) => { if (game.system.id === "ordemparanormal") mountItemEffectConfigBlock(sheet); });
  Hooks.on("closeItemSheetV2", (sheet: object) => disposeItemEffectConfigBlock(sheet));
}
