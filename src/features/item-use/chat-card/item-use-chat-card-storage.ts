import { MODULE_ID } from "../../../constants";
import { isRitualSingleTargetChatCard } from "./item-use-chat-card-schema";
import type { RitualSingleTargetChatCardV2 } from "./ritual/ritual-chat-card-state";

export type ChatCardMessage = { id?: unknown; getFlag?: (scope: string, key: string) => unknown; setFlag?: (scope: string, key: string, value: unknown) => Promise<unknown> | unknown };
const queues = new Map<string, Promise<unknown>>();

export function readRitualChatCard(message: ChatCardMessage | null): RitualSingleTargetChatCardV2 | null {
  const value = message?.getFlag?.(MODULE_ID, "chatCard");
  return isRitualSingleTargetChatCard(value) ? value : null;
}
export async function writeRitualChatCard(message: ChatCardMessage, card: RitualSingleTargetChatCardV2): Promise<void> {
  if (typeof message.setFlag !== "function") throw new Error("ChatMessage não permite persistência de flags.");
  await Promise.resolve(message.setFlag(MODULE_ID, "chatCard", card));
}
export async function mutateRitualChatCard(message: ChatCardMessage, mutate: (card: RitualSingleTargetChatCardV2) => RitualSingleTargetChatCardV2 | Promise<RitualSingleTargetChatCardV2>): Promise<RitualSingleTargetChatCardV2> {
  const key = typeof message.id === "string" ? message.id : "unknown";
  const previous = queues.get(key) ?? Promise.resolve();
  let resolve!: (value: RitualSingleTargetChatCardV2) => void;
  let reject!: (reason?: unknown) => void;
  const result = new Promise<RitualSingleTargetChatCardV2>((ok, fail) => { resolve = ok; reject = fail; });
  const next = previous.catch(() => undefined).then(async () => {
    const current = readRitualChatCard(message);
    if (!current) throw new Error("Card ritual v2 inválido ou ausente.");
    const updated = await mutate(current);
    const versioned = { ...updated, revision: current.revision + 1 };
    await writeRitualChatCard(message, versioned);
    resolve(versioned);
  }).catch(reject).finally(() => { if (queues.get(key) === next) queues.delete(key); });
  queues.set(key, next);
  return result;
}
