// Internal single-target card architecture entrypoints.
export { bindSingleTargetCardRefresh } from "./single-target-card-actions";
export {
  findDamageActionSection,
  findDamageWorkflowSection,
  findEffectActionInSections,
  findEffectActionSource,
  findNextRollCard,
  findPromptIdInRollCard,
  getActionSectionsForCard,
  getActionSectionsInPromptRoot,
  getLegacyActionSectionsForCard,
  getPromptMatchedActionSections,
  getPromptRoot,
  isAfter,
  isBefore,
  sectionContainsPromptId,
} from "./single-target-card-dom";
export {
  enhanceSingleTargetCardLayout,
  type EnhancedSingleTargetCardLayout,
} from "./single-target-card-enhancer";
export {
  createSingleTargetDamageViewModel,
  createSingleTargetEffectViewModel,
  type SingleTargetDamageButtonKind,
  type SingleTargetDamageButtonViewModel,
  type SingleTargetDamageResolutionMode,
  type SingleTargetDamageResolutionState,
  type SingleTargetDamageViewModel,
  type SingleTargetEffectActionKind,
  type SingleTargetEffectViewModel,
  type SingleTargetEffectViewModelInput,
} from "./single-target-card-view-model";
