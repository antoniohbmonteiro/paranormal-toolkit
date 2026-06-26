import { MODULE_ID } from "../../constants";

export type ChatWorkflowSource = {
  tokenId: string | null;
  actorId: string | null;
  sceneId: string | null;
  name: string;
};

export type ChatWorkflowTarget = {
  tokenId: string | null;
  actorId: string | null;
  sceneId: string | null;
  name: string;
};

export type ChatWorkflowFlag = {
  version: 1;
  kind: "chat-targets";
  source: ChatWorkflowSource | null;
  targets: ChatWorkflowTarget[];
};

export function getCurrentChatTargets(): ChatWorkflowTarget[] {
  const targets = Array.from(game.user?.targets ?? []);

  return targets.map((token) => ({
    tokenId: getNullableString(token.id),
    actorId: getNullableString(token.actor?.id),
    sceneId: getNullableString(token.scene?.id),
    name: token.name ?? token.actor?.name ?? "Alvo sem nome"
  }));
}

export function getCurrentWorkflowSource(): ChatWorkflowSource | null {
  const selectedToken = canvas?.tokens?.controlled?.[0];

  if (!selectedToken) return null;

  const actor = selectedToken.actor ?? null;
  const name = selectedToken.name ?? actor?.name ?? "Origem sem nome";

  return {
    tokenId: getNullableString(selectedToken.id),
    actorId: getNullableString(actor?.id),
    sceneId: getNullableString(selectedToken.scene?.id),
    name
  };
}

export function buildChatWorkflowFlag(
  targets: ChatWorkflowTarget[],
  source: ChatWorkflowSource | null = getCurrentWorkflowSource()
): ChatWorkflowFlag {
  return {
    version: 1,
    kind: "chat-targets",
    source,
    targets
  };
}

export function getChatWorkflowFlag(message: unknown): ChatWorkflowFlag | null {
  if (!hasGetFlag(message)) return null;

  const value = message.getFlag(MODULE_ID, "workflow");

  if (!isChatWorkflowFlag(value)) return null;

  return value;
}

export function getWorkflowSourcePath(): string {
  return `flags.${MODULE_ID}.workflow`;
}

export function hasToolkitFlags(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;

  const directFlags = foundry.utils.getProperty(value, `flags.${MODULE_ID}`);
  const sourceFlags = foundry.utils.getProperty(value, `_source.flags.${MODULE_ID}`);

  return directFlags !== undefined || sourceFlags !== undefined;
}

export function hasSpeakerActor(value: unknown): boolean {
  const directActorId = foundry.utils.getProperty(value, "speaker.actor");
  const sourceActorId = foundry.utils.getProperty(value, "_source.speaker.actor");

  return isNonEmptyString(directActorId) || isNonEmptyString(sourceActorId);
}

function isChatWorkflowFlag(value: unknown): value is ChatWorkflowFlag {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ChatWorkflowFlag>;

  return (
    candidate.version === 1 &&
    candidate.kind === "chat-targets" &&
    (candidate.source === null || typeof candidate.source === "object") &&
    Array.isArray(candidate.targets)
  );
}

function hasGetFlag(value: unknown): value is { getFlag(scope: string, key: string): unknown } {
  return Boolean(value && typeof value === "object" && "getFlag" in value);
}

function getNullableString(value: unknown): string | null {
  return isNonEmptyString(value) ? value : null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
