export type WorkflowTokenRef = {
  tokenId: string | null;
  actorId: string | null;
  sceneId: string | null;
  name: string;
};

export type WorkflowTarget = WorkflowTokenRef & {
  actor: Actor | null;
};
