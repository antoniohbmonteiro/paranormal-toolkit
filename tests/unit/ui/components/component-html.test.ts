import { describe, expect, it } from "vitest";
import * as publicApi from "../../../../src/ui/components";
import { escapeHtml, markTrustedHtml, type HtmlString } from "../../../../src/ui/components/component-html";
describe("component html",()=>{it("escapa valores e preserva a marca nominal",()=>{const value:HtmlString=markTrustedHtml("<b>x</b>");expect(value).toBe("<b>x</b>");expect(escapeHtml(`&<>\"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");expect(escapeHtml(null)).toBe("");expect(escapeHtml(undefined)).toBe("")});it("não publica o marcador",()=>expect("markTrustedHtml" in publicApi).toBe(false))});
