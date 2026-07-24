import { clearComponentExampleChatCards, postComponentExampleChatCards, type ComponentExampleChatClearResult, type ComponentExampleChatPostResult, type PostComponentExampleChatCardsOptions } from "./component-example-chat-service";
import { openComponentGallery } from "./component-gallery-application";
export type { ComponentExampleChatClearResult, ComponentExampleChatPostResult, PostComponentExampleChatCardsOptions };
export type ToolkitUiExamplesApi = { openGallery(): void; postChatCards(options?: PostComponentExampleChatCardsOptions): Promise<ComponentExampleChatPostResult>; clearChatCards(): Promise<ComponentExampleChatClearResult> };
function allowed(): boolean { if (game.user?.isGM) return true; ui.notifications?.warn("Apenas o mestre pode usar os exemplos visuais do Paranormal Toolkit."); return false; }
export function createToolkitUiExamplesApi(): ToolkitUiExamplesApi {
  return { openGallery(): void { if (allowed()) openComponentGallery(); }, async postChatCards(options) { return allowed() ? postComponentExampleChatCards(options) : { created: 0, deletedBeforeCreate: 0, messageIds: [] }; }, async clearChatCards() { return allowed() ? clearComponentExampleChatCards() : { deleted: 0 }; } };
}
export function registerToolkitUiExamplesApi(): ToolkitUiExamplesApi {
  const uiExamples = createToolkitUiExamplesApi();
  const module = game.modules.get("paranormal-toolkit") as (FoundryModuleLike & { api?: Record<string, unknown> }) | undefined;
  if (module) module.api = { ...(module.api ?? {}), uiExamples };
  return uiExamples;
}
