export const ALLY_EDIT_FIELDS = ["name", "img", "system.isDrone", "system.description"] as const;
export type AllyEditField = typeof ALLY_EDIT_FIELDS[number];
export type AllyEditValue = string | boolean;
export type AllyFieldDraft = { value: AllyEditValue; baseline: AllyEditValue; dirty: boolean; saving: boolean; error: string | null };

export function isAllyEditField(field: string | undefined): field is AllyEditField {
  return ALLY_EDIT_FIELDS.includes(field as AllyEditField);
}
export function buildAllyFieldUpdate(field: AllyEditField, value: AllyEditValue): Record<string, AllyEditValue> {
  if (field === "system.isDrone") {
    if (typeof value !== "boolean") throw new Error("Informe se o Aliado é um Drone.");
  } else {
    if (typeof value !== "string") throw new Error("Valor inválido para este campo.");
    if (field === "name") {
      value = value.trim();
      if (!value) throw new Error("Informe o nome do Aliado.");
    }
  }
  return { [field]: value };
}

export class AllySheetEditState {
  private readonly fields = new Map<AllyEditField, AllyFieldDraft>();
  private readonly focused = new Set<AllyEditField>();
  observe(field: AllyEditField, remote: AllyEditValue): AllyFieldDraft {
    let draft = this.fields.get(field);
    if (!draft || (!draft.dirty && !draft.saving && !this.focused.has(field))) {
      draft = { value: remote, baseline: remote, dirty: false, saving: false, error: null };
      this.fields.set(field, draft);
    }
    return { ...draft };
  }
  focus(field: AllyEditField, remote: AllyEditValue): void { this.observe(field, remote); this.focused.add(field); }
  blur(field: AllyEditField): void { this.focused.delete(field); }
  edit(field: AllyEditField, value: AllyEditValue, remote: AllyEditValue): void {
    this.observe(field, remote);
    const draft = this.fields.get(field)!;
    Object.assign(draft, { value, dirty: value !== draft.baseline, error: null });
  }
  prepare(field: AllyEditField, remote: AllyEditValue): "unchanged" | "conflict" | "ready" {
    const draft = this.observe(field, remote);
    if (!draft.dirty || draft.saving) return "unchanged";
    if (draft.value === remote) { this.acceptRemote(field, remote); return "unchanged"; }
    return draft.baseline !== remote ? "conflict" : "ready";
  }
  begin(field: AllyEditField): AllyEditValue {
    const draft = this.fields.get(field)!;
    draft.saving = true; draft.error = null;
    return draft.value;
  }
  saved(field: AllyEditField, submitted: AllyEditValue, canonical = submitted): void {
    const draft = this.fields.get(field)!;
    if (draft.value === submitted) draft.value = canonical;
    Object.assign(draft, { baseline: canonical, dirty: draft.value !== canonical, saving: false, error: null });
  }
  failed(field: AllyEditField, error: string): void {
    const draft = this.fields.get(field)!;
    draft.saving = false; draft.error = error;
  }
  acceptRemote(field: AllyEditField, remote: AllyEditValue): void {
    this.fields.delete(field); this.observe(field, remote);
  }
}
