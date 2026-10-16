import { describe, expect, it, vi } from "vitest";
import { bindAllyItemMenus } from "../../../../src/applications/ally-sheet-menus";

// Minimal DOM doubles: the native details toggle and capture/bubble order are emulated only for the sheet root.
type Listener = { type: string; callback: (event: any) => void; capture: boolean };
class Target {
  listeners: Listener[] = [];
  addEventListener(type: string, callback: (event: any) => void, capture: boolean = false) { this.listeners.push({ type, callback, capture }); }
  removeEventListener(type: string, callback: (event: any) => void, capture: boolean = false) {
    this.listeners = this.listeners.filter(entry => !(entry.type === type && entry.callback === callback && entry.capture === capture));
  }
  emit(type: string, event: unknown, capture: boolean) { for (const entry of [...this.listeners]) if (entry.type === type && entry.capture === capture) entry.callback(event); }
}
class Doc extends Target { activeElement: Element | null = null; }
class Element extends Target {
  parent: Element | null = null;
  children: Element[] = [];
  constructor(public doc: Doc, public tag: string, public classes: string[] = [], public attributes: Record<string, string> = {}) { super(); }
  get ownerDocument() { return this.doc; }
  append(...children: Element[]) { for (const child of children) { child.parent = this; this.children.push(child); } return this; }
  contains(node: unknown) { for (let current = node as Element | null; current; current = current.parent) if (current === this) return true; return false; }
  matches(selector: string): boolean {
    const open = selector.endsWith("[open]"), base = open ? selector.slice(0, -"[open]".length) : selector;
    if (base === "[data-action]") return "data-action" in this.attributes;
    if (base === "summary") return this.tag === "summary";
    if (base === "details.ally-item-menu") return this instanceof Details && this.classes.includes("ally-item-menu") && (!open || this.open);
    return false;
  }
  closest(selector: string): Element | null { for (let current: Element | null = this; current; current = current.parent) if (current.matches(selector)) return current; return null; }
  querySelectorAll(selector: string): Element[] { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
  querySelector(selector: string) { return this.querySelectorAll(selector)[0] ?? null; }
  focus = vi.fn(() => { this.doc.activeElement = this; });
}
class Details extends Element {
  #open = false;
  constructor(doc: Doc, private readonly root: () => Sheet) { super(doc, "details", ["ally-item-menu"]); }
  get open() { return this.#open; }
  set open(value: boolean) {
    if (value === this.#open) return;
    this.#open = value;
    this.root().emit("toggle", { target: this }, true);
  }
}
class Sheet extends Element { isConnected = true; }

function sheetWithMenus(doc = new Doc(), names = ["support-a", "abilities-a", "abilities-b"]) {
  const sheet = new Sheet(doc, "form");
  const executed: { action: string; menuOpen: boolean }[] = [];
  const menus = Object.fromEntries(names.map(name => {
    const menu = new Details(doc, () => sheet);
    const summary = new Element(doc, "summary");
    const configure = new Element(doc, "button", [], { "data-action": "configureBenefits" });
    const remove = new Element(doc, "button", [], { "data-action": "removeAbility" });
    menu.append(summary, new Element(doc, "div").append(configure, remove));
    sheet.append(new Element(doc, "li").append(new Element(doc, "button", [], { "data-action": "openAbility" }), menu));
    return [name, { menu, summary, configure, remove }];
  }));
  const outside = new Element(doc, "button", [], { "data-action": "changeAllyTab" });
  sheet.append(outside);
  // Stands in for the ApplicationV2 action dispatcher, bound to the sheet element in bubble phase.
  sheet.addEventListener("click", event => {
    const action = (event.target as Element).closest("[data-action]");
    if (action) executed.push({ action: action.attributes["data-action"], menuOpen: Boolean((action.closest("details.ally-item-menu") as Details | null)?.open) });
  });
  const event = (target: Element, extra: Record<string, unknown> = {}) => ({ target, preventDefault: vi.fn(), stopPropagation: vi.fn(), ...extra });
  const pointer = (target: unknown) => { const fired = event(target as Element); doc.emit("pointerdown", fired, true); return fired; };
  const click = (target: Element) => {
    pointer(target);
    const fired = event(target);
    sheet.emit("click", fired, true);
    const summary = target.closest("summary");
    if (summary) { const menu = summary.parent as Details; menu.open = !menu.open; }
    sheet.emit("click", fired, false);
    return fired;
  };
  const key = (target: Element, name: string) => { const fired = event(target, { key: name }); sheet.emit("keydown", fired, false); return fired; };
  const documentListeners = () => doc.listeners.filter(entry => entry.type === "pointerdown").length;
  return { doc, sheet, menus, outside, executed, pointer, click, key, documentListeners };
}

describe("ally sheet ability action menus", () => {
  it("keeps no document listener while every menu is closed", () => {
    const view = sheetWithMenus(); bindAllyItemMenus(view.sheet as any);
    expect(view.documentListeners()).toBe(0);
    view.click(view.menus["support-a"].summary);
    expect(view.menus["support-a"].menu.open).toBe(true);
    expect(view.documentListeners()).toBe(1);
  });

  it("closes on an outside pointer without blocking that click", () => {
    const view = sheetWithMenus(); bindAllyItemMenus(view.sheet as any);
    view.click(view.menus["abilities-a"].summary);
    const fired = view.pointer({ parent: null });
    expect(view.menus["abilities-a"].menu.open).toBe(false);
    expect(fired.preventDefault).not.toHaveBeenCalled(); expect(fired.stopPropagation).not.toHaveBeenCalled();
    expect(view.documentListeners()).toBe(0);
    view.click(view.menus["abilities-a"].summary); view.click(view.outside);
    expect(view.menus["abilities-a"].menu.open).toBe(false);
    expect(view.executed.at(-1)).toEqual({ action: "changeAllyTab", menuOpen: false });
  });

  it.each(["configureBenefits", "removeAbility"] as const)("closes before the %s action runs and returns focus to the summary", name => {
    const view = sheetWithMenus(); bindAllyItemMenus(view.sheet as any);
    const { menu, summary, configure, remove } = view.menus["support-a"];
    view.click(summary);
    const button = name === "configureBenefits" ? configure : remove;
    button.focus();
    view.click(button);
    expect(view.executed).toEqual([{ action: name, menuOpen: false }]);
    expect(menu.open).toBe(false);
    expect(view.doc.activeElement).toBe(summary);
    expect(view.documentListeners()).toBe(0);
  });

  it("closes the previous menu when another one opens, across support and abilities rows", () => {
    const view = sheetWithMenus(); bindAllyItemMenus(view.sheet as any);
    view.click(view.menus["support-a"].summary);
    view.click(view.menus["abilities-b"].summary);
    expect(view.menus["support-a"].menu.open).toBe(false);
    expect(view.menus["abilities-b"].menu.open).toBe(true);
    view.menus["abilities-a"].menu.open = true;
    expect(view.sheet.querySelectorAll("details.ally-item-menu[open]")).toEqual([view.menus["abilities-a"].menu]);
    expect(view.documentListeners()).toBe(1);
  });

  it("toggles closed when the same summary is clicked again", () => {
    const view = sheetWithMenus(); bindAllyItemMenus(view.sheet as any);
    const { menu, summary } = view.menus["abilities-b"];
    view.click(summary); view.click(summary);
    expect(menu.open).toBe(false);
    expect(view.documentListeners()).toBe(0);
    view.click(summary);
    expect(menu.open).toBe(true);
  });

  it("closes on Escape from inside the menu, keeps keyboard focus and leaves other Escapes to Foundry", () => {
    const view = sheetWithMenus(); bindAllyItemMenus(view.sheet as any);
    const { menu, summary, remove } = view.menus["support-a"];
    view.click(summary); remove.focus();
    const escape = view.key(remove, "Escape");
    expect(menu.open).toBe(false);
    expect(view.doc.activeElement).toBe(summary);
    expect(escape.preventDefault).toHaveBeenCalledOnce(); expect(escape.stopPropagation).toHaveBeenCalledOnce();
    const elsewhere = view.key(view.outside, "Escape");
    const other = view.key(summary, "Enter");
    expect(elsewhere.stopPropagation).not.toHaveBeenCalled(); expect(other.preventDefault).not.toHaveBeenCalled();
  });

  it("removes every listener on dispose and stops reacting afterwards", () => {
    const view = sheetWithMenus(); const menus = bindAllyItemMenus(view.sheet as any);
    view.click(view.menus["support-a"].summary);
    menus.dispose();
    expect(view.menus["support-a"].menu.open).toBe(false);
    expect(view.documentListeners()).toBe(0);
    expect(view.sheet.listeners.filter(entry => entry.type !== "click" || entry.capture)).toEqual([]);
    view.click(view.menus["support-a"].summary); view.click(view.menus["abilities-a"].summary);
    expect(view.menus["support-a"].menu.open).toBe(true);
    expect(view.documentListeners()).toBe(0);
  });

  it("drops the document listener when the sheet element is no longer connected", () => {
    const view = sheetWithMenus(); bindAllyItemMenus(view.sheet as any);
    view.click(view.menus["support-a"].summary);
    view.sheet.isConnected = false;
    view.pointer({ parent: null });
    expect(view.documentListeners()).toBe(0);
  });

  it("does not touch menus that belong to another sheet sharing the document", () => {
    const doc = new Doc();
    const first = sheetWithMenus(doc), second = sheetWithMenus(doc);
    bindAllyItemMenus(first.sheet as any); const secondMenus = bindAllyItemMenus(second.sheet as any);
    first.click(first.menus["support-a"].summary);
    secondMenus.dispose();
    expect(first.menus["support-a"].menu.open).toBe(true);
    second.click(second.menus["support-a"].summary);
    expect(first.menus["support-a"].menu.open).toBe(false);
  });
});
