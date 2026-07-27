import { describe, expect, it } from "vitest";
import { resolveSafeRitualDescription, sanitizeRitualDescriptionHtml } from "../../../src/features/rituals/ritual-description-resolver";

describe("ritual description resolver", () => {
  it("reads the real system.description path and omits absent/empty values", () => {
    expect(resolveSafeRitualDescription({ system: {} } as Item)).toBeNull();
    expect(resolveSafeRitualDescription({ system: { description: "<p> </p>" } } as Item)).toBeNull();
    expect(resolveSafeRitualDescription({ system: { description: "Texto" } } as Item)).toBe("Texto");
  });
  it("preserves safe structure and strips attributes and unsafe blocks", () => {
    const html = sanitizeRitualDescriptionHtml('<p class="x">Um <strong>ritual</strong></p><ol><li>Passo</li></ol><script>alert(1)</script><img src=x onerror=x>');
    expect(html).toBe("<p>Um <strong>ritual</strong></p><ol><li>Passo</li></ol>");
  });
});
