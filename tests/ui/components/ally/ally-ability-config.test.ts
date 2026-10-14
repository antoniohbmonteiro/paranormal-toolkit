import { describe, expect, it } from "vitest";
import { renderAllyAbilityConfig } from "../../../../src/ui/components/ally/ally-ability-config";
describe("minimal passive editor renderer", () => {
  it("renders numeric fields without changing stable identities or executing mutations", () => {
    const config = { version: 1 as const, benefits: [{ id: 'id"><script>x</script>', kind: "defense" as const, value: 5 }] };
    const before = structuredClone(config);
    const html = renderAllyAbilityConfig(config);
    expect(config).toEqual(before);
    expect(html).toContain('type="number"');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
