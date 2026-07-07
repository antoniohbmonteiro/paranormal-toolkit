import type { WorkflowTarget, WorkflowTokenRef } from "../../core/workflow/workflow-context";

export function getCurrentWorkflowTargets(): WorkflowTarget[] {
  const targets = Array.from(game.user?.targets ?? []);

  return targets.map(createWorkflowTargetFromToken);
}

export function createWorkflowTargetFromToken(token: TokenLike): WorkflowTarget {
  return {
    tokenId: getNullableString(token.id),
    actorId: getNullableString(token.actor?.id),
    sceneId: getNullableString(token.scene?.id),
    name: token.name ?? token.actor?.name ?? "Alvo sem nome",
    actor: token.actor ?? null
  };
}

export function getCurrentSourceTokenRef(): WorkflowTokenRef | null {
  const selectedToken = canvas?.tokens?.controlled?.[0];

  if (!selectedToken) return null;

  const actor = selectedToken.actor ?? null;

  return {
    tokenId: getNullableString(selectedToken.id),
    actorId: getNullableString(actor?.id),
    sceneId: getNullableString(selectedToken.scene?.id),
    name: selectedToken.name ?? actor?.name ?? "Origem sem nome"
  };
}

function getNullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
