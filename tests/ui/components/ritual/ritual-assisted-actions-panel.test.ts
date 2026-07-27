import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderRitualAssistedActionsPanel } from "../../../../src/ui/components/ritual/ritual-assisted-actions-panel";
const row=(label:string)=>({label,description:`${label} description`,control:{state:"active" as const,button:{label:`Apply ${label}`}}});
describe("renderRitualAssistedActionsPanel", () => {
  it("renders title, preserves order, and filters invalid rows", () => { const html=renderRitualAssistedActionsPanel({rows:[row("First"),row(""),row("Second")]}); expect(html).toContain("AÇÕES ASSISTIDAS"); expect(html.indexOf("First")).toBeLessThan(html.indexOf("Second")); expect(html.match(/assisted-action-row"/g)).toHaveLength(2); });
  it("returns empty without rows and does not create a shell", () => { expect(renderRitualAssistedActionsPanel({rows:[]})).toBe(""); expect(readFileSync("src/ui/components/ritual/ritual-assisted-actions-panel.ts","utf8")).not.toMatch(/renderChatCardShell|workflow|foundry|game/); });
  it("keeps one top separator with clear space before rows and no host surface", () => { const css=readFileSync("styles/components/ritual-assisted-actions-panel.css","utf8"); expect(css).toContain("border-top: 1px solid"); expect(css).toContain("gap: 9px"); expect(css.match(/border-top: 1px solid/g)).toHaveLength(2); expect(css).not.toMatch(/background\s*:|box-shadow\s*:|border-left\s*:/); });
  it("provides every QA helper through shared infrastructure", () => { const source=readFileSync("src/dev/chat-card-examples.ts","utf8"); expect(source).toContain("postAssistedActionButtonExample"); expect(source).toContain("postAssistedActionRowExample"); expect(source).toContain("postRitualAssistedActionsPanelExample"); expect(source).toContain('["pending", "available", "completed", "damage-only"]'); expect(source.match(/function createExampleMessage/g)).toHaveLength(1); });
});
