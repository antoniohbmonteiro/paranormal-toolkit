export type AllyRichTextElement = HTMLElement & { value: string; open: boolean; disabled: boolean; save(): void };

const bound = new WeakSet<HTMLElement>();

// Native open events do not bubble in v14. Bind each element, including replacements after a save.
export function bindAllyRichText(editor: AllyRichTextElement, handlers: {
  canEdit(): boolean;
  opened(): void;
  saved(value: string): void;
  closed(): void;
}): void {
  if (bound.has(editor)) return;
  bound.add(editor);
  editor.addEventListener("open", () => handlers.opened());
  editor.addEventListener("save", () => { if (handlers.canEdit()) handlers.saved(editor.value); });
  editor.addEventListener("close", () => handlers.closed());
  editor.addEventListener("click", event => {
    if (editor.open || !handlers.canEdit()) return;
    const target = event.target as HTMLElement;
    if (target.closest("button.toggle") || !target.closest("button, a, input, select, textarea, [data-action], [data-link]")) handlers.opened();
  }, { capture: true });
  editor.addEventListener("click", event => {
    if (editor.open || !handlers.canEdit()) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea, [data-action], [data-link]")) return;
    editor.open = true;
  });
  const toggle = editor.querySelector("button.toggle");
  toggle?.setAttribute("aria-label", "Editar descrição");
  toggle?.setAttribute("title", "Editar descrição");
}
