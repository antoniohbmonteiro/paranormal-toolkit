import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderRitualSingleTargetCard,
  type RitualSingleTargetCardViewModel,
} from "../../../../src/ui/components/ritual/ritual-single-target-card";

const baseModel: RitualSingleTargetCardViewModel = {
  header: {
    title: "Eletrocussão",
    subtitle: "Padrão",
    badges: [{ label: "ENERGIA 1" }],
    context: "Mercy → Malvadão",
  },
  metadata: {
    items: [
      { text: "1 PE gasto" },
      { text: "Alvo: 1 Ser" },
      { text: "Duração: Instantânea" },
    ],
  },
  detailRows: [
    { label: "Alcance:", detailHtml: "Curto · até 9 metros" },
  ],
  conjuration: {
    status: "success",
    skillLabel: "Ocultismo",
    total: 23,
    difficultyClass: 21,
    formula: "1d20 + 10 + 5",
    diceResults: [8],
  },
  damage: {
    damageType: "Eletricidade",
    formula: "3d6",
    total: 9,
    diceResults: [2, 3, 4],
  },
  resistance: {
    skill: "Fortitude",
    difficultyLabel: "DT 22",
    outcome: "reduz dano à metade",
    action: { ariaLabel: "Rolar resistência de Fortitude" },
  },
};

describe("renderRitualSingleTargetCard", () => {
  it("composes the real ChatCardShell and every approved child renderer", () => {
    const html = renderRitualSingleTargetCard(baseModel);
    expect(html).toMatch(/^<article class="paranormal-toolkit-chat-card-shell">/);
    expect(html).toContain("paranormal-toolkit-ritual-single-target-card");
    expect(html).toContain("paranormal-toolkit-chat-card-header");
    expect(html).toContain("paranormal-toolkit-ritual-metadata");
    expect(html).toContain("paranormal-toolkit-metadata-detail-row");
    expect(html).toContain("paranormal-toolkit-section-card--casting");
    expect(html).toContain("paranormal-toolkit-section-card--damage");
    expect(html).toContain("paranormal-toolkit-section-card--resistance");
  });

  it("preserves the exact component and detail-row order", () => {
    const html = renderRitualSingleTargetCard({
      ...baseModel,
      detailRows: [
        { label: "First:", detailHtml: "one" },
        { label: "Second:", detailHtml: "two" },
      ],
    });
    const positions = [
      html.indexOf("paranormal-toolkit-chat-card-header"),
      html.indexOf("paranormal-toolkit-ritual-metadata"),
      html.indexOf("First:"),
      html.indexOf("Second:"),
      html.indexOf("paranormal-toolkit-section-card--casting"),
      html.indexOf("paranormal-toolkit-section-card--damage"),
      html.indexOf("paranormal-toolkit-section-card--resistance"),
    ];
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((left, right) => left - right));
  });

  it("omits optional sections when the consumer does not provide them", () => {
    const html = renderRitualSingleTargetCard({
      header: baseModel.header,
      conjuration: baseModel.conjuration,
    });
    expect(html).not.toContain("paranormal-toolkit-ritual-metadata");
    expect(html).not.toContain("paranormal-toolkit-metadata-detail-row");
    expect(html).not.toContain("paranormal-toolkit-section-card--damage");
    expect(html).not.toContain("paranormal-toolkit-section-card--resistance");
    expect(html).toContain("paranormal-toolkit-section-card--casting");
  });

  it("ignores empty metadata and detail rows without empty child wrappers", () => {
    const html = renderRitualSingleTargetCard({
      ...baseModel,
      metadata: { items: [{ text: "   " }] },
      detailRows: [
        { label: "", detailHtml: "detail" },
        { label: "Label:", detailHtml: "   " },
        { label: "Valid:", detailHtml: "detail" },
      ],
      damage: undefined,
      resistance: undefined,
    });
    expect(html).not.toContain("paranormal-toolkit-ritual-metadata");
    expect(html.match(/paranormal-toolkit-metadata-detail-row"/g)).toHaveLength(1);
    expect(html).not.toContain('class=""');
  });

  it("only composes existing renderers without workflow inference or duplicated markup", () => {
    const source = readFileSync(
      "src/ui/components/ritual/ritual-single-target-card.ts",
      "utf8",
    );
    for (const renderer of [
      "renderChatCardShell",
      "renderChatCardHeader",
      "renderRitualMetadata",
      "renderMetadataDetailRow",
      "renderRitualConjurationSection",
      "renderRitualDamageSection",
      "renderRitualResistanceSection",
    ]) {
      expect(source).toContain(renderer);
    }
    expect(source).not.toMatch(/status\s*[=!]==?\s*["'](?:success|failure)/);
    expect(source).not.toMatch(/total\s*[<>]=?|difficultyClass\s*[<>]=?/);
    expect(source).not.toMatch(/paranormal-toolkit-(?:chat-card-header|section-card|metadata-pill)/);
    expect(source).not.toMatch(/addEventListener|data-action|features\/(rituals|item-use|abilities)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|Roll|ChatMessage|TextEditor|workflow|flags|targets)\b/,
    );
  });

  it("uses a borderless, background-free, overflow-safe flex column", () => {
    const css = readFileSync(
      "styles/components/ritual-single-target-card.css",
      "utf8",
    );
    for (const rule of [
      "display: flex",
      "flex-direction: column",
      "gap: 0.42rem",
      "width: 100%",
      "max-width: 100%",
      "min-width: 0",
      "overflow-wrap: anywhere",
    ]) {
      expect(css).toContain(rule);
    }
    expect(css).not.toMatch(/\b(border|background|box-shadow)\s*:/);
    expect(css).not.toContain("!important");
    expect(css).not.toContain("300px");
  });

  it("defines success, failure, long, and all examples through shared infrastructure", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    expect(source).toContain(
      'export type RitualSingleTargetCardExample = "success" | "failure" | "long" | "all"',
    );
    expect(source).toContain("renderRitualSingleTargetCard(ritualSingleTargetCardExample(item))");
    expect(source).toContain('["success", "failure", "long"]');
    expect(source).toContain('"ritual-single-target-card"');
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
    expect(source.match(/const clearChatCardExamples/g)).toHaveLength(1);
  });
});
