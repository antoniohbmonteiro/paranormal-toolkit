import { failure, type Result, success } from "../../core/result";
import type { ToolkitConditionDefinition, ToolkitConditionId } from "./condition-definition";
import { VULNERABLE_CONDITION } from "./conditions/vulnerable";

export type ConditionRegistryFailure = {
  reason: "condition-not-found";
  conditionId: string;
  message: string;
};

export class ConditionRegistry {
  private readonly definitions = new Map<ToolkitConditionId, ToolkitConditionDefinition>();

  constructor(definitions: ToolkitConditionDefinition[]) {
    for (const definition of definitions) {
      this.definitions.set(definition.id, definition);
    }
  }

  list(): ToolkitConditionDefinition[] {
    return Array.from(this.definitions.values()).map(copyConditionDefinition);
  }

  get(conditionId: string): Result<ToolkitConditionDefinition, ConditionRegistryFailure> {
    const definition = this.definitions.get(conditionId as ToolkitConditionId);

    if (!definition) {
      return failure({
        reason: "condition-not-found",
        conditionId,
        message: `Condição não registrada no Paranormal Toolkit: ${conditionId}.`
      });
    }

    return success(copyConditionDefinition(definition));
  }
}

export function createToolkitConditionRegistry(): ConditionRegistry {
  return new ConditionRegistry([VULNERABLE_CONDITION]);
}

function copyConditionDefinition(definition: ToolkitConditionDefinition): ToolkitConditionDefinition {
  return {
    ...definition,
    changes: definition.changes.map((change) => ({ ...change }))
  };
}
