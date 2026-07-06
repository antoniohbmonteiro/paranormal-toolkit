import type { WorkflowTarget } from "../../../core/workflow/workflow-context";

export class MeasuredTemplateTargetResolver {
  resolveTargets(_templateDocument: unknown): WorkflowTarget[] {
    // Token resolution from native MeasuredTemplate geometry will be enabled
    // together with the native placement flow. Returning no targets here keeps
    // this foundation inert and prevents the SVG resolver from being used as a
    // fallback.
    return [];
  }
}
