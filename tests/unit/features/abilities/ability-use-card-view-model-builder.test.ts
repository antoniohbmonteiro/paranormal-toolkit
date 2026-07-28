import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildAbilityUseCardViewModel } from "../../../../src/features/abilities/ability-use-card-view-model-builder";
import type { AbilityUseCardState } from "../../../../src/features/abilities/ability-use-card-state";
import { renderAbilityUseCard } from "../../../../src/ui/components/ability/ability-use-card";

function state(
  resource: Partial<AbilityUseCardState["resource"]> = {},
): AbilityUseCardState {
  return {
    schemaVersion: 1,
    ability: {
      name: "Habilidade",
      image: null,
      descriptionHtml: "<p>Descrição segura</p>",
      activationLabel: "Livre",
    },
    actor: { id: "a", uuid: "Actor.a", name: "Agente" },
    item: { id: "i", uuid: "Item.i", name: "Habilidade" },
    resource: {
      type: "PE",
      cost: 2,
      passive: false,
      spent: true,
      before: 5,
      after: 3,
      ...resource,
    },
    rolls: [
      {
        id: "damage",
        sourceRollId: "damage",
        label: "Ataque psíquico",
        intent: "damage",
        damageType: "fear",
        formula: "2d6",
        total: 6,
        diceResults: [2, 4],
        nexThreshold: 40,
      },
    ],
    createdAt: 1,
  };
}

describe("ability use result presentation", () => {
  it.each([
    [{ spent: true }, "2 PE"],
    [{ spent: false }, "2 PE não descontados"],
    [{ passive: true }, "Passiva"],
    [{ cost: 0 }, "Sem custo"],
  ] as const)("maps resource state %o to its only cost pill", (resource, pill) => {
    const model = buildAbilityUseCardViewModel(state(resource));
    expect(model.metadata.items[0]).toEqual({ text: pill });
    const html = renderAbilityUseCard(model);
    expect(html).not.toContain("5 → 3");
    expect(html).not.toContain("ability-use-card__status");
  });

  it("uses the configured roll label once as the section title", () => {
    const html = renderAbilityUseCard(buildAbilityUseCardViewModel(state()));
    expect(html.match(/Ataque psíquico/g)).toHaveLength(1);
    expect(html).toContain(
      'paranormal-toolkit-section-header__title">Ataque psíquico',
    );
    expect(html).toContain("Dano · NEX 40%");
    expect(html).not.toContain("Dano · Medo");
  });

  it("falls back to Rolagem for an empty persisted label", () => {
    const input = state();
    input.rolls[0]!.label = "   ";
    const html = renderAbilityUseCard(buildAbilityUseCardViewModel(input));
    expect(html).toContain('section-header__title">Rolagem</span>');
  });

  it("shows a damage tag only when damage has a configured type", () => {
    const withType = renderAbilityUseCard(buildAbilityUseCardViewModel(state()));
    expect(withType).toContain("damage-type-badge--fear");
    expect(withType).toContain(">Medo</span>");

    const withoutTypeState = state();
    withoutTypeState.rolls[0]!.damageType = null;
    const withoutType = renderAbilityUseCard(
      buildAbilityUseCardViewModel(withoutTypeState),
    );
    expect(withoutType).not.toContain("damage-type-badge");
  });

  it.each([
    ["healing", "Cura"],
    ["generic", "Rolagem genérica"],
  ] as const)("renders %s without a damage badge", (intent, detail) => {
    const input = state();
    input.rolls[0]!.intent = intent;
    input.rolls[0]!.damageType = null;
    const html = renderAbilityUseCard(buildAbilityUseCardViewModel(input));
    expect(html).toContain(`${detail} · NEX 40%`);
    expect(html).not.toContain("damage-type-badge");
  });

  it("keeps resource values in state although the renderer omits them", () => {
    const input = state();
    buildAbilityUseCardViewModel(input);
    expect(input.resource).toMatchObject({
      spent: true,
      before: 5,
      after: 3,
    });
  });

  it("keeps long result names in an overflow-safe flexible layout", () => {
    const sectionHeaderCss = readFileSync(
      "styles/components/section-header.css",
      "utf8",
    );
    const abilityCss = readFileSync(
      "styles/components/ability-use-card.css",
      "utf8",
    );
    expect(sectionHeaderCss).toContain("flex: 1 1 auto");
    expect(sectionHeaderCss).toContain("overflow-wrap: anywhere");
    expect(abilityCss).toContain("max-width: 100%");
    expect(abilityCss).not.toMatch(/grid-template-columns|width:\s*\d+px/iu);
  });
});
