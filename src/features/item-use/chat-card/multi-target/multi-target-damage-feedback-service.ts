type DamageFeedbackInput = {
  actor: Actor;
  finalDamage: number;
  blocked: number;
  targetName: string;
};

type UserLike = {
  id?: string | null;
  isGM?: boolean;
};

type ActorPermissionLike = Actor & {
  testUserPermission?: (user: unknown, permission: string) => boolean;
};

export async function createMultiTargetDamageFeedbackMessage(input: DamageFeedbackInput): Promise<void> {
  const recipients = resolveDamageRecipients(input.actor);
  const blockedText = input.blocked > 0
    ? ` (${game.i18n.format("op.damageBlocked", { blocked: input.blocked })})`
    : "";

  await ChatMessage.create({
    content: game.i18n.format("op.applyDamageResult", {
      amount: input.finalDamage,
      target: input.targetName,
      blocked: blockedText,
    }),
    whisper: recipients,
  });
}

function resolveDamageRecipients(targetActor: Actor): string[] {
  const ids = new Set<string>();

  for (const user of getGameUsers()) {
    const id = typeof user.id === "string" && user.id.length > 0 ? user.id : null;
    if (!id) continue;

    if (user.isGM === true) {
      ids.add(id);
      continue;
    }

    if (canUserOwnActor(targetActor, user)) {
      ids.add(id);
    }
  }

  return Array.from(ids);
}

function getGameUsers(): UserLike[] {
  const users = (game as { users?: Iterable<unknown> }).users;
  if (!users) return [];

  return Array.from(users).filter(isUserLike);
}

function isUserLike(value: unknown): value is UserLike {
  return Boolean(value && typeof value === "object" && "id" in value);
}

function canUserOwnActor(actor: Actor, user: UserLike): boolean {
  const permissionActor = actor as ActorPermissionLike;
  if (typeof permissionActor.testUserPermission !== "function") return false;

  try {
    return permissionActor.testUserPermission(user, "OWNER") === true;
  } catch {
    return false;
  }
}
