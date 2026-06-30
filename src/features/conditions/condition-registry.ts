import { failure, type Result, success } from "../../core/result";
import type { ToolkitConditionDefinition, ToolkitConditionId } from "./condition-definition";
import { TOOLKIT_CONDITION_DEFINITIONS } from "./conditions";

export type ConditionRegistryFailure = {
  reason: "condition-not-found";
  conditionId: string;
  message: string;
};

export class ConditionRegistry {
  private readonly definitions = new Map<ToolkitConditionId, ToolkitConditionDefinition>();
  private readonly lookup = new Map<string, ToolkitConditionId>();

  constructor(definitions: ToolkitConditionDefinition[]) {
    for (const definition of definitions) {
      this.definitions.set(definition.id, definition);
      this.registerLookup(definition.id, definition.id);
      this.registerLookup(definition.label, definition.id);

      for (const alias of definition.aliases ?? []) {
        this.registerLookup(alias, definition.id);
      }
    }
  }

  list(): ToolkitConditionDefinition[] {
    return Array.from(this.definitions.values()).map(copyConditionDefinition);
  }

  get(conditionId: string): Result<ToolkitConditionDefinition, ConditionRegistryFailure> {
    const definitionId = this.lookup.get(normalizeConditionLookupKey(conditionId));
    const definition = definitionId ? this.definitions.get(definitionId) : null;

    if (!definition) {
      return failure({
        reason: "condition-not-found",
        conditionId,
        message: `Condição não registrada no Paranormal Toolkit: ${conditionId}.`
      });
    }

    return success(copyConditionDefinition(definition));
  }

  private registerLookup(value: string, conditionId: ToolkitConditionId): void {
    const key = normalizeConditionLookupKey(value);
    if (!key) return;

    this.lookup.set(key, conditionId);
  }
}

export function createToolkitConditionRegistry(): ConditionRegistry {
  return new ConditionRegistry(TOOLKIT_CONDITION_DEFINITIONS);
}

function copyConditionDefinition(definition: ToolkitConditionDefinition): ToolkitConditionDefinition {
  return {
    ...definition,
    aliases: definition.aliases ? [...definition.aliases] : undefined,
    changes: definition.changes.map((change) => ({ ...change }))
  };
}

function normalizeConditionLookupKey(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}
