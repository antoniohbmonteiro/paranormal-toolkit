import { renderRitualSingleTargetCard, type HtmlString } from "../components";
import { createRitualSingleTargetFixture, ritualSingleTargetResolvedFixture } from "./component-example-fixtures";
export type ComponentExampleCard = { kind: "ritual-single-target"; html: HtmlString };
export function renderComponentExampleCards(forChat = false): readonly ComponentExampleCard[] {
  return [{ kind: "ritual-single-target", html: renderRitualSingleTargetCard(forChat ? ritualSingleTargetResolvedFixture : createRitualSingleTargetFixture(), { disabled: forChat }) }];
}
