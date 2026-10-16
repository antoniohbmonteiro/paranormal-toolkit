const MENU = "details.ally-item-menu";

export type AllyItemMenus = { dispose(): void };

/**
 * Closes the ability action menus of one sheet element on outside pointer, action click, another menu opening and Escape.
 * The document listener exists only while a menu of this element is open.
 */
export function bindAllyItemMenus(root: HTMLElement): AllyItemMenus {
  const document = root.ownerDocument;
  let watching = false;
  const openMenus = () => Array.from(root.querySelectorAll<HTMLDetailsElement>(`${MENU}[open]`));
  const close = (menu: HTMLDetailsElement, focusSummary: boolean) => {
    const hadFocus = menu.contains(document.activeElement);
    menu.open = false;
    if (focusSummary || hadFocus) menu.querySelector<HTMLElement>("summary")?.focus({ preventScroll: true });
  };
  const watch = (enabled: boolean) => {
    if (enabled === watching) return;
    watching = enabled;
    if (enabled) document.addEventListener("pointerdown", onOutsidePointer, true);
    else document.removeEventListener("pointerdown", onOutsidePointer, true);
  };
  const sync = () => watch(root.isConnected && openMenus().length > 0);
  function onOutsidePointer(event: Event): void {
    const target = event.target as Node | null;
    for (const menu of openMenus()) if (!target || !menu.contains(target)) close(menu, false);
    sync();
  }
  const onToggle = (event: Event) => {
    const menu = event.target as HTMLDetailsElement;
    if (!menu.matches?.(MENU)) return;
    if (menu.open) for (const other of openMenus()) if (other !== menu) close(other, false);
    sync();
  };
  // Capture runs before the ApplicationV2 action dispatcher bound to the same element.
  const onClick = (event: Event) => {
    const menu = (event.target as HTMLElement).closest?.("[data-action]")?.closest<HTMLDetailsElement>(`${MENU}[open]`);
    if (!menu) return;
    close(menu, true); sync();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    const menu = (event.target as HTMLElement).closest?.<HTMLDetailsElement>(`${MENU}[open]`);
    if (!menu) return;
    event.preventDefault(); event.stopPropagation();
    close(menu, true); sync();
  };
  root.addEventListener("toggle", onToggle, true);
  root.addEventListener("click", onClick, true);
  root.addEventListener("keydown", onKeyDown);
  return {
    dispose() {
      root.removeEventListener("toggle", onToggle, true);
      root.removeEventListener("click", onClick, true);
      root.removeEventListener("keydown", onKeyDown);
      for (const menu of openMenus()) menu.open = false;
      watch(false);
    },
  };
}
