import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeAbilityUseMessageFlag } from "../../../../src/features/abilities/ability-roll-chat-contract";
import { buildAbilityUseCardViewModel } from "../../../../src/features/abilities/ability-use-card-view-model-builder";
import { renderAbilityUseCard } from "../../../../src/ui/components/ability/ability-use-card";

function version3Flag(descriptionHtml = "<p>Visão</p>"): unknown {
  return {
    version: 3,
    state: {
      schemaVersion: 1,
      ability: {
        name: "Premonição",
        image: "a.webp",
        descriptionHtml,
        activationLabel: "Livre",
      },
      actor: { id: "a", uuid: "Actor.a", name: "Agente" },
      item: { id: "i", uuid: "Actor.a.Item.i", name: "Premonição" },
      resource: {
        type: "PE",
        cost: 2,
        passive: false,
        spent: true,
        before: 5,
        after: 3,
      },
      rolls: [
        {
          id: "r",
          sourceRollId: "r",
          label: "Medo",
          intent: "damage",
          damageType: "fear",
          formula: "2d6",
          total: 7,
          diceResults: [3, 4],
          nexThreshold: 40,
        },
      ],
      createdAt: 10,
    },
  };
}

afterEach(() => {
  delete (foundry.utils as Record<string, unknown>).cleanHTML;
  vi.restoreAllMocks();
});

describe("normalizeAbilityUseMessageFlag", () => {
  it("keeps only valid roll actions from version 2 cards", () => {
    const flag = normalizeAbilityUseMessageFlag({
      version: 2,
      actorUuid: "Actor.actor-id",
      itemUuid: "Actor.actor-id.Item.ability-id",
      abilityName: "Ataque Furtivo",
      resource: "PE",
      cost: 1,
      spentResource: true,
      resourceBefore: 5,
      resourceAfter: 4,
      rolls: [
        {
          id: "damage",
          sourceRollId: "damage",
          label: "Dano adicional",
          intent: "damage",
          damageType: "impact",
          formula: "2d6",
          nexThreshold: 40,
        },
        { id: "invalid" },
      ],
    });

    expect(flag?.version).toBe(2);
    if (!flag || flag.version !== 2) throw new Error("Expected v2 flag");
    expect(flag.rolls).toEqual([
      expect.objectContaining({
        id: "damage",
        formula: "2d6",
        nexThreshold: 40,
      }),
    ]);
  });

  it("rejects legacy or malformed card flags", () => {
    expect(normalizeAbilityUseMessageFlag({ version: 1, rolls: [] })).toBeNull();
    expect(normalizeAbilityUseMessageFlag({ version: 2, rolls: [] })).toBeNull();
  });

  it("normalizes a serializable v3 result snapshot defensively", () => {
    const flag = normalizeAbilityUseMessageFlag(version3Flag());

    expect(flag).toMatchObject({
      version: 3,
      state: { rolls: [{ total: 7, diceResults: [3, 4] }] },
    });
    expect(
      normalizeAbilityUseMessageFlag({
        version: 3,
        state: { schemaVersion: 1 },
      }),
    ).toBeNull();
  });

  it("sanitizes persisted description HTML before it reaches rendered DOM markup", () => {
    (foundry.utils as Record<string, unknown>).cleanHTML = (html: string) =>
      html
        .replace(/<script[\s\S]*?<\/script>/giu, "")
        .replace(/\son[a-z]+="[^"]*"/giu, "")
        .replace(/javascript:/giu, "");

    const flag = normalizeAbilityUseMessageFlag(
      version3Flag(
        '<p onclick="steal()">Texto</p><script>steal()</script><a href="javascript:steal()">link</a>',
      ),
    );
    if (!flag || flag.version !== 3) throw new Error("Expected v3 flag");

    const html = renderAbilityUseCard(buildAbilityUseCardViewModel(flag.state));

    expect(html).toContain("<p>Texto</p>");
    expect(html).toContain("<a href=\"steal()\">link</a>");
    expect(html).not.toMatch(/onclick|<script|javascript:/iu);
  });

  it("fails closed when Foundry's HTML sanitizer is unavailable", () => {
    const flag = normalizeAbilityUseMessageFlag(
      version3Flag('<img src=x onerror="steal()">'),
    );
    if (!flag || flag.version !== 3) throw new Error("Expected v3 flag");

    expect(flag.state.ability.descriptionHtml).toContain("&lt;img");
    expect(flag.state.ability.descriptionHtml).not.toContain("<img");
  });
});
