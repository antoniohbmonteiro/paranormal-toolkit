# AGENTS.md

## Repository scope

This file applies to **Paranormal Toolkit** only.

Primary repository:
- `antoniohbmonteiro/paranormal-toolkit`

This workspace may also contain sibling projects such as:
- `paranormal-fx`
- `ordemparanormal_fvtt`

Unless the user explicitly requests otherwise:

- modify **Paranormal Toolkit only**;
- treat Paranormal FX as read-only reference;
- treat the Ordem Paranormal system repository as read-only reference;
- never commit changes to sibling repositories as part of a Toolkit task.

Before making changes, confirm that the files being edited belong to Paranormal Toolkit.

---

## Project goal

Paranormal Toolkit is a modern Foundry VTT module for the unofficial Ordem Paranormal system.

Target:
- Foundry VTT v14+
- `game.system.id === "ordemparanormal"`

Prioritize maintainable public-module quality over prototypes or one-off fixes.

---

## Technology

Prefer:

- TypeScript
- Vite
- ES Modules
- current Foundry VTT v14 APIs
- ApplicationV2
- DocumentSheetV2 where applicable
- Active Effects V2
- Template Regions where applicable
- module-owned flags
- explicit adapters around system-specific behavior

Do not add legacy Foundry v13 compatibility unless there is a demonstrated requirement.

---

## Language

Internal code must use English:

- filenames
- types
- functions
- classes
- variables
- comments
- commit messages

User-facing text shown to players or GMs must be in Brazilian Portuguese.

Comments should be used only when they clarify non-obvious behavior.

---

## Architecture

Favor:

- small focused modules;
- strong typing;
- pure functions where practical;
- explicit state;
- explicit dependencies;
- adapters for Foundry and Ordem integration;
- testable services and builders;
- low coupling between features;
- predictable internal APIs.

Avoid:

- God Objects;
- giant workflow files;
- hidden side effects;
- direct system-path access spread across feature code;
- DOM-dependent business logic;
- mutations inside renderers;
- duplicated abstractions when a shared core abstraction already exists;
- fragile dependency on the Ordem system's HTML/templates.

The preferred general direction is:

```text
State
↓
ViewModel
↓
Pure Renderer
↓
Controller / Action Handler
↓
Use Case / Service
↓
Core Engine
↓
Ordem Adapter
```

Do not force this structure where it does not fit, but preserve separation of responsibilities.

---

## Ordem system integration

The Ordem system repository is a source of truth for:

- actual document paths;
- Actor and Item APIs;
- system hooks;
- damage behavior;
- resource paths;
- skill paths;
- sheet behavior.

Do not guess system paths or APIs.

When system-specific behavior is needed:

1. inspect the real system implementation;
2. keep direct system coupling inside an adapter/resolver when practical;
3. expose a Toolkit-owned interface to feature code.

Do not modify the Ordem system repository unless the user explicitly asks for a system change.

---

## Foundry API usage

This project is Foundry v14-first.

When uncertain about a Foundry API:

- verify the current v14 API or an existing working usage in the repository;
- do not invent hooks, classes, methods, or signatures;
- avoid deprecated APIs when a current v14 API exists.

---

## Rituals

Ritual support is an existing feature and must be evolved incrementally.

Before making significant ritual changes, inspect:

- `src/features/rituals/`
- `src/features/rituals/casting/`
- `src/features/rituals/config/`
- `src/features/rituals/presets/`
- `src/features/item-use/`
- `src/features/item-use/chat-card/`

Preserve existing responsibilities around:

- item resolution;
- cast preparation;
- cast dialog;
- resource cost;
- resource spending;
- occultism roll;
- casting failure;
- resistance;
- damage/healing/effects;
- chat card state;
- assisted actions.

Do not turn `ritual-assisted-workflow` or another workflow into a God Object.

Prefer extracting a service, resolver, builder, controller, or adapter when responsibility grows.

---

## Ability cards

Ability cards are being migrated toward the newer modular and persistent card architecture.

Relevant areas include:

- `src/features/abilities/`
- `src/ui/components/ability/`
- `src/features/item-use/`
- `src/core/workflow/`

Preserve:

- persistent card state;
- backward-compatible flag normalization;
- executed roll results;
- roll intents such as `generic`, `damage`, and `healing`;
- separation between state, ViewModel, renderer, actions, and system mutation.

Do not reroll a persisted result when an assisted action applies damage or healing.

Do not resolve chat actions against whatever token happens to be targeted at click time when the original target can be persisted.

---

## Assisted actions

Assisted actions must remain manual unless a task explicitly changes that policy.

A rendered button must not contain the domain mutation itself.

Prefer:

```text
UI action
→ controller/handler
→ service/use case
→ core engine
→ adapter
```

Persist action state when the card is persistent.

Protect against accidental duplicate execution.

Reuse existing permission policies and action infrastructure before introducing ability-specific equivalents.

---

## Damage and healing

Reuse existing Toolkit infrastructure before creating feature-specific implementations.

For damage, inspect:

- `src/core/damage/`
- existing Ordem damage adapters
- current ritual assisted damage flow

Do not call system damage APIs directly from UI components.

For healing, inspect the current ritual implementation before introducing a new abstraction.

If healing is currently too ritual-specific, prefer a small extraction into reusable core infrastructure instead of duplicating it under abilities.

---

## Targets

Use shared workflow target abstractions where practical.

`ItemUseContext` already carries resolved targets.

Do not create a second independent target-selection mechanism for abilities if the existing item-use context already contains the required information.

Runtime Foundry Documents such as `Actor` or `TokenDocument` must not be serialized directly into ChatMessage flags.

Persist only serializable target references required for:

- display;
- rehydration;
- resolving the original Actor safely.

---

## UI components

Renderers in `src/ui/` should remain as pure as practical.

Do not:

- update Actors;
- roll dice;
- mutate ChatMessages;
- resolve Documents;
- perform business rules

inside a renderer.

The renderer should receive a ViewModel and return presentation.

---

## Flags and persistence

Toolkit-owned behavior should use Toolkit-owned flags.

When changing a persisted schema:

- preserve backward compatibility when practical;
- normalize old states defensively;
- do not invalidate existing chat cards unnecessarily;
- do not persist Foundry Document instances;
- keep schema/version changes explicit.

Malformed persisted data should fail safely without destroying the original chat content.

---

## Testing

Before considering implementation complete, run:

```bash
npm run typecheck
npm run test
npm run build
```

Prefer the full validation command when available:

```bash
npm run check
```

Add or update tests for behavior changes.

Important regressions should receive a dedicated test.

Do not add browser/DOM dependencies to otherwise pure unit tests merely to solve a small parsing problem unless there is a strong architectural reason.

---

## Documentation

Inspect existing documentation before creating new architecture documentation.

Important references may include:

- `README.md`
- `docs/ROADMAP.md`
- architecture documents under `docs/`

Update documentation when a change affects:

- public behavior;
- configuration;
- architecture decisions;
- roadmap state.

Avoid duplicating the same documentation across several files.

---

## Versions

For a release change, keep version metadata consistent across the repository.

Check the actual current version before deciding the next one.

When applicable, keep in sync:

- `module.json`
- `package.json`
- `package-lock.json`

Use semantic versioning based on the actual scope:

- patch for fixes;
- minor for new backward-compatible features;
- major only for intentional breaking releases.

Do not bump versions during planning-only tasks unless explicitly requested.

---

## Generated files

Follow the repository's current tracking policy for generated build artifacts.

Do not add generated files to Git merely because a build produced them.

Check the repository state before changing this policy.

---

## Git

Prefer Conventional Commits in English.

Examples:

```text
feat(abilities): add assisted damage actions
fix(rituals): preserve HTML entities in descriptions
refactor(item-use): extract shared target resolver
test(abilities): cover persisted target actions
```

Keep commits focused when implementing larger features.

---

## Planning tasks

When the user asks for a plan:

- inspect the real current code first;
- do not implement;
- identify existing abstractions before proposing new ones;
- list likely modified files;
- list genuinely necessary new files;
- identify migration/backward-compatibility concerns;
- identify tests;
- call out architectural risks;
- explicitly mention when the real repository contradicts assumptions in the request.

Do not invent files just to make the plan look complete.

---

## Implementation discipline

Before adding a new abstraction, search for an existing one.

Before accessing an Ordem path, verify it.

Before adding a dependency, justify why repository-native APIs are insufficient.

Before growing a workflow significantly, consider extracting responsibility.

Prefer a small safe increment over a large rewrite.
