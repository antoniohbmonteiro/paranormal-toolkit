import { MODULE_ID } from "../../constants";
import { renderComponentExampleCards } from "./component-example-cards";

export type PostComponentExampleChatCardsOptions = { replaceExisting?: boolean; whisperToGm?: boolean };
export type ComponentExampleChatPostResult = { created: number; deletedBeforeCreate: number; messageIds: readonly string[] };
export type ComponentExampleChatClearResult = { deleted: number };
type ExampleMessage = ChatMessageDocumentLike & { delete?: () => Promise<unknown> };
const FLAG_KEY = "uiExamples";
function messages(): ExampleMessage[] { return game.messages?.contents ?? (game.messages.values ? Array.from(game.messages.values()) : []); }
function isExample(message: ExampleMessage): boolean { const flag = message.getFlag?.(MODULE_ID, FLAG_KEY) as { kind?: unknown } | undefined; return flag?.kind === "component-example"; }
export async function clearComponentExampleChatCards(): Promise<ComponentExampleChatClearResult> {
  const found = messages().filter(isExample); await Promise.all(found.map((message) => message.delete?.())); return { deleted: found.length };
}
export async function postComponentExampleChatCards(options: PostComponentExampleChatCardsOptions = {}): Promise<ComponentExampleChatPostResult> {
  const replaceExisting = options.replaceExisting ?? true; const whisperToGm = options.whisperToGm ?? true;
  const deletedBeforeCreate = replaceExisting ? (await clearComponentExampleChatCards()).deleted : 0;
  const batchId = foundry.utils.randomID(); const messageIds: string[] = [];
  for (const example of renderComponentExampleCards(true)) {
    const created = await ChatMessage.create({ content: example.html, whisper: whisperToGm ? game.users.filter((user) => user.isGM && user.id).map((user) => user.id!) : [], flags: { [MODULE_ID]: { [FLAG_KEY]: { version: 1, kind: "component-example", batchId } } } }) as ExampleMessage;
    if (created?.id) messageIds.push(created.id);
  }
  return { created: messageIds.length, deletedBeforeCreate, messageIds };
}
