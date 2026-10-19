export type WorkflowExecutorUser = { id: string; isGM: boolean; active: boolean };
export function electWorkflowExecutor(users: WorkflowExecutorUser[]): string | null {
  return users.filter(user => user.isGM && user.active).map(user => user.id).sort()[0] ?? null;
}
