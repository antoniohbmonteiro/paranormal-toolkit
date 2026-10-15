import { describe, expect, it } from "vitest";
import { renderAllyAbilityConfig } from "../../../../src/ui/components/ally/ally-ability-config";
describe("minimal passive editor renderer", () => {
  it("renders numeric fields without changing stable identities or executing mutations", () => {
    const config = { name: "Teste", editable: true, effects: [{ id: 'id"><script>x</script>', name: "Defesa", disabled: false, diagnostic: null }] };
    const before = structuredClone(config);
    const html = renderAllyAbilityConfig(config);
    expect(config).toEqual(before);
    expect(html).toContain('type="number"');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("selectEffect");
    expect(html).not.toContain("Usar no suporte");
    expect(html).not.toContain("Retirar do suporte");
    expect(html).toContain('data-action="editEffect"');
    expect(html).toContain('data-action="removeEffect"');
    expect(html).toContain("automaticamente");
  });
});
