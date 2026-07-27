import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderAssistedActionRow } from "../../../../src/ui/components/chat/assisted-action-row";
describe("renderAssistedActionRow", () => {
  it("escapes text and enforces active/disabled states", () => {
    const active=renderAssistedActionRow({label:"<Dano>",description:"A & B",control:{state:"active",button:{label:"Apply",disabled:true}}});
    expect(active).toContain("&lt;Dano&gt;"); expect(active).toContain("A &amp; B"); expect(active).not.toContain(" disabled");
    expect(renderAssistedActionRow({label:"Dano",description:"Wait",control:{state:"disabled",button:{label:"Wait"}}})).toContain(" disabled>");
  });
  it("completed renders indicator rather than button and empty rows disappear", () => {
    const html=renderAssistedActionRow({label:"Dano",description:"Done",control:{state:"completed",indicator:{label:"Aplicado"}}}); expect(html).toContain("completion-indicator"); expect(html).not.toContain("<button");
    expect(renderAssistedActionRow({label:"",description:"x",control:{state:"active",button:{label:"x"}}})).toBe("");
  });
  it("uses defensive grid and no integration", () => { const css=readFileSync("styles/components/assisted-action-row.css","utf8"); expect(css).toContain("grid-template-columns: minmax(0, 1fr) auto"); expect(css).toContain("overflow-wrap: anywhere"); expect(readFileSync("src/ui/components/chat/assisted-action-row.ts","utf8")).not.toMatch(/data-action|workflow|foundry|game/); });
});
