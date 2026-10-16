import { renderAllySheet, type AllySheetViewModel } from "../../src/ui/components/ally/ally-sheet";
import { updateAllySheetDOM } from "../../src/applications/ally-sheet-dom";
import { bindAllyRichText, type AllyRichTextElement } from "../../src/applications/ally-sheet-rich-text";
import { AllySheetEditState } from "../../src/features/allies/ally-sheet-edit-state";

// The local harness loads the real v14 custom element. Only TextEditor/ProseMirror and document lookup are doubled.
export async function checkAllyNativeEditor(): Promise<string[]> {
  const host = document.createElement("form"), checks: string[] = [], edits = new AllySheetEditState();
  host.className = "paranormal-toolkit-ally-sheet";
  host.style.cssText = "position:fixed;left:0;top:0;width:760px;height:500px;opacity:0;pointer-events:none";
  document.body.append(host);
  const model: AllySheetViewModel = { name: "Íris", image: "", editable: true, activeTab: "details", abilities: [],
    profile: { schemaVersion: 1, isDrone: true, description: "<p>Original</p>" }, descriptionHTML: "<p>Original</p>" };
  let opened = 0, closed = 0, changed = 0, saves = 0, outcome: string | null = null;
  const assert = (value: unknown, label: string) => { if (!value) throw new Error(label); checks.push(label); };
  const render = () => {
    model.fields = { "system.description": edits.observe("system.description", model.profile!.description) };
    const next = document.createElement("div"); next.className = "ally-sheet-content"; next.innerHTML = renderAllySheet(model);
    updateAllySheetDOM(host, next);
    const editor = host.querySelector<AllyRichTextElement>("prose-mirror")!;
    bindAllyRichText(editor, { canEdit: () => model.editable,
      opened: () => { opened++; edits.focus("system.description", model.profile!.description); },
      saved: value => { saves++; edits.edit("system.description", value, model.profile!.description); outcome = edits.prepare("system.description", model.profile!.description); },
      closed: () => { closed++; edits.blur("system.description"); } });
    return editor;
  };
  try {
    const editor = render();
    host.addEventListener("change", event => {
      if (event.target !== editor) return;
      changed++;
    });
    assert(editor.value === "<p>Original</p>" && editor.textContent?.includes("Original"), "native toggled element renders canonical HTML");
    const ready = new Promise<void>(resolve => editor.addEventListener("open", () => resolve(), { once: true }));
    editor.querySelector<HTMLButtonElement>("button.toggle")!.click(); await ready;
    assert(opened >= 1 && changed === 0, "native editor opening captures the baseline without saving");
    const content = editor.querySelector<HTMLElement>(".editor-content")!;
    content.focus(); const selection = window.getSelection()!, range = document.createRange();
    range.selectNodeContents(content); range.collapse(false); selection.removeAllRanges(); selection.addRange(range);
    const anchor = selection.anchorNode;
    model.profile!.description = "<p>Remoto</p>"; model.descriptionHTML = "<p>Remoto</p>";
    assert(render() === editor && editor.open && editor.value === "<p>Original</p>", "remote refresh never replaces an active native editor, even before typing");
    assert(selection.anchorNode === anchor, "native editor selection survives remote rendering");
    const localHTML = "<p><strong>Local</strong></p><ul><li>Lista</li></ul>";
    content.innerHTML = localHTML;
    editor.save();
    assert(changed === 1 && closed === 1 && !editor.open, "native save emits one final change and closes editing");
    assert(outcome === "conflict" && edits.observe("system.description", model.profile!.description).value === localHTML,
      "native rich text retains its original baseline and draft after a concurrent edit");
    const retryReady = new Promise<void>(resolve => editor.addEventListener("open", () => resolve(), { once: true }));
    editor.querySelector<HTMLButtonElement>("button.toggle")!.click(); await retryReady;
    editor.save();
    assert(saves === 2 && changed === 1 && outcome === "conflict", "retrying unchanged HTML still reaches final save without relying on a second change event");
    model.profile!.description = String(edits.observe("system.description", model.profile!.description).value);
    const saved = edits.begin("system.description"); edits.saved("system.description", saved);
    model.descriptionHTML = model.profile!.description;
    const refreshed = render();
    assert(refreshed !== editor && refreshed.querySelector("strong") && refreshed.querySelector("ul li"), "closed native editor displays newly saved rich text");
    assert(render() === refreshed, "unchanged inactive native editors are not rebuilt");
    model.editable = false; render();
    assert(refreshed.disabled && refreshed.querySelector<HTMLButtonElement>("button.toggle")!.disabled, "lost ownership disables the existing native editor");
    return checks;
  } finally { host.remove(); }
}
