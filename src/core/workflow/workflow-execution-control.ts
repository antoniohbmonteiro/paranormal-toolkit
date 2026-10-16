const authorized = new WeakSet<object>();
export interface WorkflowExecutionControl {
  before(checkpoint: string): Promise<void>;
  after(checkpoint: string, result: unknown): Promise<void>;
}
export function createWorkflowExecutionControl(assertAuthority: () => void,
  before: WorkflowExecutionControl["before"], after: WorkflowExecutionControl["after"]): WorkflowExecutionControl {
  assertAuthority();
  const control = {
    async before(checkpoint: string) { assertAuthority(); await before(checkpoint); assertAuthority(); },
    async after(checkpoint: string, result: unknown) { assertAuthority(); await after(checkpoint, result); assertAuthority(); },
  };
  authorized.add(control); return control;
}
export function assertWorkflowExecutionControl(control: WorkflowExecutionControl): void {
  if (!authorized.has(control)) throw new Error("Contexto interno de execução ausente.");
}
