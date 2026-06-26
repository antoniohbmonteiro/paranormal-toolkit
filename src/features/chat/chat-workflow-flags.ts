import { MODULE_ID } from "../../constants";

export type ChatWorkflowTarget = {
  tokenId: string | null;
  actorId: string | null;
  sceneId: string | null;
  name: string;
};

export type ChatWorkflowFlag = {
  version: 1;
  kind: "chat-targets";
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

export function buildChatWorkflowFlag(targets: ChatWorkflowTarget[]): ChatWorkflowFlag {
  return {
    version: 1,
    kind: "chat-targets",
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

function isChatWorkflowFlag(value: unknown): value is ChatWorkflowFlag {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ChatWorkflowFlag>;

  return (
    candidate.version === 1 &&
    candidate.kind === "chat-targets" &&
    Array.isArray(candidate.targets)
  );
}

function hasGetFlag(value: unknown): value is { getFlag(scope: string, key: string): unknown } {
  return Boolean(value && typeof value === "object" && "getFlag" in value);
}

function getNullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
