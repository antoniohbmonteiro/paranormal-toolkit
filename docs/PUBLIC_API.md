# Public API

Paranormal Toolkit exposes versioned ritual lifecycle hooks for other modules to observe casting workflow data. These are ritual lifecycle hooks, not animation hooks.

Toolkit emits data only. It does not call animations, sounds, Sequencer, JB2A, macros, or visual effects, and it does not provide FX settings or FX presets.

## Hook names

```ts
ParanormalToolkit.hooks.ritual.castStarted;
ParanormalToolkit.hooks.ritual.areaResolved;
ParanormalToolkit.hooks.ritual.castFinished;
```

String values:

- `paranormal-toolkit.ritual.cast.started`
- `paranormal-toolkit.ritual.area.resolved`
- `paranormal-toolkit.ritual.cast.finished`

## Automation source and FX eligibility

Every public ritual event includes an `automation` snapshot:

```ts
type PublicAutomationSourceSnapshot = {
  type: "preset" | "manual" | "generic" | "unknown";
  presetId: string | null;
  presetVersion: string | null;
  label: string | null;
  fxEligible: boolean;
};
```

`automation.fxEligible` is `true` only when the automation came from a Toolkit preset and has a non-empty `presetId`.

This means:

- preset automation with a valid `presetId`: `fxEligible: true`
- manual automation: `fxEligible: false`
- generic runtime ritual automation: `fxEligible: false`
- unknown source: `fxEligible: false`

`fxEligible` does not mean Toolkit performs FX. It only means external modules such as Paranormal FX may choose to react to this preset-based ritual event.

External integrations should prefer `event.automation.presetId` or `event.ritual.presetId` as the stable integration key. Do not route integrations by item name. `event.ritual.slug` is secondary/fallback metadata only.

## Event timing

### `paranormal-toolkit.ritual.cast.started`

Fires after:

- a caster actor exists;
- cast options are confirmed;
- ritual form is resolved.

Fires before:

- area targeting;
- ritual cost/casting check;
- automation execution.

If the cast dialog is cancelled before this point, no public lifecycle event is emitted.

### `paranormal-toolkit.ritual.area.resolved`

Fires after line area targeting is confirmed and final targets are resolved.

This event is emitted only when an area exists. It includes `event.area` as a plain snapshot captured before Toolkit cleans up its temporary Scene Region.

### `paranormal-toolkit.ritual.cast.finished`

Fires for terminal statuses after `cast.started` has fired:

- `completed-without-actions`
- `ready`
- `cancelled`
- `failed`

Missing actor failures before the public lifecycle starts do not emit public lifecycle events.

## Shared event shape

All payloads are versioned with `version: 1`. The stable contract is the plain-data payload. Optional Foundry documents under `documents` are convenience references only.

```ts
type PublicRitualEventBase = {
  version: 1;
  castId: string;
  sceneId: string | null;
  timestamp: number;

  automation: PublicAutomationSourceSnapshot;

  caster: {
    actor: {
      id: string | null;
      uuid: string | null;
      name: string | null;
    };
    token: {
      id: string | null;
      actorId: string | null;
      sceneId: string | null;
      name: string | null;
    } | null;
  };

  item: {
    id: string | null;
    uuid: string | null;
    name: string;
    type: string;
  };

  ritual: {
    name: string;
    slug: string | null;
    presetId: string | null;
    presetVersion: string | null;
    element: string | null;
    circle: number | string | null;
    form: "standard" | "student" | "true";
    formLabel: string;
  };

  targets: Array<{
    tokenId: string | null;
    actorId: string | null;
    sceneId: string | null;
    name: string;
  }>;

  documents?: {
    actor?: Actor | null;
    token?: TokenLike | null;
    item?: Item | null;
  };
};
```

## Area shape

`ritual.area.resolved` exposes the public area as `event.area`:

```ts
type PublicRitualArea = {
  type: "rectangleRay";
  sceneId: string | null;
  regionId: string | null;
  gridSize: number | null;

  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  shape: {
    x: number;
    y: number;
    width: number;
    height: number;
    direction: number;
    elevation: number | null;
  };

  center: {
    x: number;
    y: number;
  };

  ray: {
    start: { x: number; y: number } | null;
    end: { x: number; y: number } | null;
  };

  source: "lineArea";
  targetingMode: "lineArea";
};
```

`ray.start` and `ray.end` are currently `null` when Toolkit cannot safely derive them from Foundry Region data. Consumers should use `bounds`, `shape`, and `center` for the stable rectangle snapshot.

## Example listener for Paranormal FX

```ts
Hooks.on("paranormal-toolkit.ritual.area.resolved", (event) => {
  if (!event.automation.fxEligible) return;
  if (event.automation.presetId !== "ritual.eletrocussao") return;
  if (event.ritual.form !== "student") return;
  if (event.area.type !== "rectangleRay") return;

  // Paranormal FX will play the visual effect here.
});
```

Paranormal FX and other external modules should ignore events where `event.automation.fxEligible` is false.
