import type { AllyRichTextElement } from "./ally-sheet-rich-text";

const enrichedContent = new WeakMap<HTMLElement, string>();

function key(node: Node): string | null {
  if (node.nodeType !== 1) return null;
  const element = node as HTMLElement;
  for (const attribute of ["data-ally-key", "data-ally-region", "data-ally-field", "data-field-feedback", "data-tab"]) {
    if (element.hasAttribute(attribute)) return `${element.tagName}/${attribute}/${element.getAttribute(attribute)}`;
  }
  return null;
}
function patchElement(current: HTMLElement, next: HTMLElement): HTMLElement {
  if (current.tagName === "PROSE-MIRROR") {
    const editor = current as AllyRichTextElement, incoming = next as AllyRichTextElement;
    editor.toggleAttribute("disabled", next.hasAttribute("disabled"));
    // The native element owns its internal DOM and editor selection, including while a toolbar has focus.
    if (editor.open || current.hasAttribute("open")) return current;
    if ((editor.value ?? current.getAttribute("value")) === (incoming.value ?? next.getAttribute("value"))
      && enrichedContent.get(current) === enrichedContent.get(next)) return current;
    current.replaceWith(next);
    return next;
  }
  for (const attribute of Array.from(current.attributes)) {
    if (attribute.name === "open" && current.tagName === "DETAILS") continue;
    if (!next.hasAttribute(attribute.name)) current.removeAttribute(attribute.name);
  }
  for (const attribute of Array.from(next.attributes)) {
    if (current.getAttribute(attribute.name) !== attribute.value) current.setAttribute(attribute.name, attribute.value);
  }
  const tag = current.tagName;
  if (["INPUT", "TEXTAREA", "FILE-PICKER"].includes(tag)) {
    const input = current as HTMLInputElement, source = next as HTMLInputElement;
    const focused = current.contains(current.ownerDocument.activeElement);
    const value = tag === "FILE-PICKER" ? next.getAttribute("value") ?? source.value : source.value;
    if (!focused && input.value !== value) input.value = value;
    if (tag === "INPUT" && input.checked !== source.checked) input.checked = source.checked;
    input.disabled = source.disabled;
    return current;
  }
  patchChildren(current, next);
  if (tag === "SELECT") (current as HTMLSelectElement).value = (next as HTMLSelectElement).value;
  return current;
}
function patchChildren(current: HTMLElement, next: HTMLElement): void {
  const old = Array.from(current.childNodes), used = new Set<Node>();
  const keyed = new Map<string, Node>();
  for (const node of old) { const id = key(node); if (id) keyed.set(id, node); }
  for (const [index, incoming] of Array.from(next.childNodes).entries()) {
    const id = key(incoming);
    let existing: Node | undefined = id ? keyed.get(id) : old[index];
    if (existing && (used.has(existing) || existing.nodeType !== incoming.nodeType
      || (existing.nodeType === 1 && ((existing as HTMLElement).tagName !== (incoming as HTMLElement).tagName || key(existing) !== id)))) existing = undefined;
    if (!existing) {
      existing = incoming;
      current.insertBefore(existing, current.childNodes[index] ?? null);
    } else {
      if (current.childNodes[index] !== existing) current.insertBefore(existing, current.childNodes[index] ?? null);
      if (existing.nodeType === 1) existing = patchElement(existing as HTMLElement, incoming as HTMLElement);
      else if (existing.nodeValue !== incoming.nodeValue) existing.nodeValue = incoming.nodeValue;
    }
    used.add(existing);
  }
  for (const node of old) if (!used.has(node)) node.parentNode?.removeChild(node);
}

export function updateAllySheetDOM(content: HTMLElement, result: HTMLElement): void {
  for (const editor of result.querySelectorAll<HTMLElement>("prose-mirror")) enrichedContent.set(editor, editor.innerHTML);
  const current = content.querySelector<HTMLElement>(".ally-sheet-shell");
  const next = result.querySelector<HTMLElement>(".ally-sheet-shell");
  if (!current || !next) { content.replaceChildren(result); return; }
  const focused = content.ownerDocument.activeElement as HTMLElement | null;
  const input = focused as HTMLInputElement | null;
  const selection = input && typeof input.selectionStart === "number" ? [input.selectionStart, input.selectionEnd, input.selectionDirection] as const : null;
  patchElement(current, next);
  if (focused && current.contains(focused) && !focused.matches(":disabled") && focused !== content.ownerDocument.activeElement) {
    focused.focus({ preventScroll: true });
    if (selection) (focused as HTMLInputElement).setSelectionRange(selection[0], selection[1], selection[2] ?? undefined);
  } else if (focused && content.contains(focused) === false && !focused.isConnected) {
    content.querySelector<HTMLElement>('.ally-tabs [aria-selected="true"]')?.focus();
  }
}
