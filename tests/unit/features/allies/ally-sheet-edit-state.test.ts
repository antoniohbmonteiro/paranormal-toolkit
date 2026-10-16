import { describe, expect, it } from "vitest";
import { AllySheetEditState, buildAllyFieldUpdate, isAllyEditField } from "../../../../src/features/allies/ally-sheet-edit-state";

describe("Ally sheet field editing", () => {
  it("holds focused text, draft and baseline through external updates", () => {
    const state = new AllySheetEditState(); state.focus("name", "Íris");
    expect(state.observe("name", "Nome remoto").value).toBe("Íris");
    state.edit("name", "Íris médica", "Nome remoto");
    expect(state.prepare("name", "Nome remoto")).toBe("conflict");
    expect(state.observe("name", "Nome remoto")).toMatchObject({ value: "Íris médica", baseline: "Íris", dirty: true });
  });
  it("updates untouched fields and only adopts remote focused text after blur", () => {
    const state = new AllySheetEditState(); state.focus("name", "Íris"); state.blur("name");
    expect(state.observe("name", "Remoto").value).toBe("Remoto");
    expect(state.prepare("name", "Remoto")).toBe("unchanged");
  });
  it("preserves typing during an outstanding save and detects the next changed draft", () => {
    const state = new AllySheetEditState(); state.edit("name", "Primeiro", "Íris");
    const sent = state.begin("name"); state.edit("name", "Segundo", "Íris"); state.saved("name", sent);
    expect(state.observe("name", "Primeiro")).toMatchObject({ value: "Segundo", baseline: "Primeiro", dirty: true, saving: false });
    expect(state.prepare("name", "Primeiro")).toBe("ready");
  });
  it("keeps failed text for retry and never turns a save failure into a clean draft", () => {
    const state = new AllySheetEditState(); state.edit("system.description", "Texto", ""); state.begin("system.description");
    state.failed("system.description", "Sem conexão");
    expect(state.observe("system.description", "")).toMatchObject({ value: "Texto", dirty: true, saving: false, error: "Sem conexão" });
    expect(state.prepare("system.description", "")).toBe("ready");
  });
  it("can explicitly adopt the server value or normalize a successful name without a false conflict", () => {
    const state = new AllySheetEditState(); state.edit("name", " Íris ", "Original"); state.begin("name");
    state.saved("name", " Íris ", "Íris"); expect(state.observe("name", "Íris").dirty).toBe(false);
    state.edit("name", "Local", "Íris"); state.acceptRemote("name", "Remoto");
    expect(state.observe("name", "Remoto")).toMatchObject({ value: "Remoto", dirty: false });
  });
  it("recognizes an externally confirmed value without another write", () => {
    const state = new AllySheetEditState(); state.edit("name", "Novo", "Antigo");
    expect(state.prepare("name", "Novo")).toBe("unchanged");
  });
  it.each([["name", " Íris ", "Íris"], ["img", "iris.webp", "iris.webp"], ["system.description", "<p>Drone</p>", "<p>Drone</p>"], ["system.isDrone", true, true]])
    ("builds a single whitelisted %s update", (field, value, expected) => {
      expect(isAllyEditField(field as string)).toBe(true);
      expect(buildAllyFieldUpdate(field as any, value as any)).toEqual({ [field as string]: expected });
    });
  it("rejects unknown paths, empty names and incorrect field types", () => {
    expect(isAllyEditField("system.PE.value")).toBe(false); expect(isAllyEditField("ownership")).toBe(false);
    expect(() => buildAllyFieldUpdate("name", "  ")).toThrow(); expect(() => buildAllyFieldUpdate("name", false)).toThrow();
    expect(() => buildAllyFieldUpdate("system.isDrone", "true")).toThrow();
  });
});
