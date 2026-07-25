import { existsSync, readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { renderRitualSingleTargetCard } from "../../../../src/ui/components";
import { createRitualSingleTargetFixture } from "../../../../src/ui/examples/component-example-fixtures";
it("registra CSS e cobre todas as classes do ritual",()=>{const manifest=JSON.parse(readFileSync("module.json","utf8")) as {styles:string[]};const path="styles/components/chat-card-components.css";expect(manifest.styles).toContain(path);expect(existsSync(path)).toBe(true);const css=readFileSync(path,"utf8");const html=renderRitualSingleTargetCard(createRitualSingleTargetFixture());const classes=Array.from(html.matchAll(/class="([^"]+)"/gu)).flatMap(match=>match[1]!.split(/\s+/u)).filter(name=>name.startsWith("paranormal-toolkit-"));for(const name of new Set(classes))expect(css,`selector .${name}`).toContain(`.${name}`);expect(css).toContain("max-width: 100%");expect(css).toContain("min-width: 0")});
