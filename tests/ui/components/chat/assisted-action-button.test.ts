import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderAssistedActionButton } from "../../../../src/ui/components/chat/assisted-action-button";
describe("renderAssistedActionButton", () => {
  it("escapes, filters empty labels, and renders active/disabled buttons", () => {
    expect(renderAssistedActionButton({ label: "<Apply>" })).toContain("&lt;Apply&gt;");
    expect(renderAssistedActionButton({ label: "Wait", disabled: true })).toContain(" disabled>");
    expect(renderAssistedActionButton({ label: " " })).toBe("");
  });
  it("has scoped active, hover, focus and disabled styling", () => {
    const css=readFileSync("styles/components/assisted-action-button.css","utf8");
    expect(css).toContain("background: #7d272b"); expect(css).toContain(":not(:disabled):hover");
    expect(css).toContain(":focus-visible"); expect(css).toContain("box-shadow: none");
  });
  it("stays content-sized without a fixed width", () => {
    const css=readFileSync("styles/components/assisted-action-button.css","utf8");
    expect(css).toContain("width: fit-content");
    expect(css).toContain("max-width: 100%");
    expect(css).toContain("flex: 0 0 auto");
    expect(css).not.toMatch(/(?:^|[;{]\s*)width:\s*\d+(?:px|rem|em)/m);
  });
  it("has no runtime behavior", () => expect(readFileSync("src/ui/components/chat/assisted-action-button.ts","utf8")).not.toMatch(/data-action|addEventListener|game|foundry|workflow/));
});
