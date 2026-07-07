import type { AutomationRitualFormId } from "../automation/automation-definition";
import type { WorkflowTarget, WorkflowTokenRef } from "../workflow/workflow-context";
import type {
  PublicAutomationSourceSnapshot,
  PublicRitualArea,
  PublicRitualEventBase,
  PublicRitualForm,
  PublicRitualMetadata,
  PublicWorkflowTargetSnapshot,
  RitualAreaResolvedEvent,
  RitualAutomationSourceInput,
  RitualCastFinishedEvent,
  RitualCastFinishedStatus,
  RitualCastStartedEvent,
} from "./ritual-event-types";

export type RitualEventBuildInput = {
  castId: string;
  context: {
    actor: Actor | null;
    token: WorkflowTokenRef | null;
    item: Item;
    targets: WorkflowTarget[];
  };
  automationSource: RitualAutomationSourceInput;
  form: AutomationRitualFormId;
  formLabel: string;
  targets?: WorkflowTarget[];
};

export function createRitualCastId(): string {
  const cryptoObject = globalThis.crypto as { randomUUID?: () => string } | undefined;

  if (cryptoObject?.randomUUID) return cryptoObject.randomUUID();

  return `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createRitualCastStartedEvent(input: RitualEventBuildInput): RitualCastStartedEvent {
  return {
    ...createRitualEventBase(input),
    type: "ritual.cast.started",
  };
}

export function createRitualAreaResolvedEvent(
  input: RitualEventBuildInput & { area: PublicRitualArea },
): RitualAreaResolvedEvent {
  return {
    ...createRitualEventBase(input),
    type: "ritual.area.resolved",
    area: input.area,
  };
}

export function createRitualCastFinishedEvent(
  input: RitualEventBuildInput & {
    status: RitualCastFinishedStatus;
    reason?: string;
    message?: string;
  },
): RitualCastFinishedEvent {
  return {
    ...createRitualEventBase(input),
    type: "ritual.cast.finished",
    status: input.status,
    ...(input.reason ? { reason: input.reason } : {}),
    ...(input.message ? { message: input.message } : {}),
  };
}

export function createAutomationSourceSnapshot(
  source: RitualAutomationSourceInput,
): PublicAutomationSourceSnapshot {
  if (source.type === "preset") {
    const presetId = normalizeOptionalString(source.presetId);

    return {
      type: "preset",
      presetId,
      presetVersion: normalizeOptionalString(source.presetVersion),
      label: null,
      fxEligible: presetId !== null,
    };
  }

  if (source.type === "manual") {
    return {
      type: "manual",
      presetId: null,
      presetVersion: null,
      label: normalizeOptionalString(source.label),
      fxEligible: false,
    };
  }

  if (source.type === "generic") {
    return {
      type: "generic",
      presetId: null,
      presetVersion: null,
      label: null,
      fxEligible: false,
    };
  }

  return {
    type: "unknown",
    presetId: null,
    presetVersion: null,
    label: null,
    fxEligible: false,
  };
}

export function createRectangleRayAreaSnapshot(region: RegionDocumentLike | RegionObjectLike): PublicRitualArea {
  const regionDocument = getRegionDocument(region);
  const candidates = getRegionCandidates(region);
  const bounds = getBounds(candidates) ?? { x: 0, y: 0, width: 0, height: 0 };
  const shape = getRectangleShape(candidates) ?? createShapeFromBounds(bounds);
  const gridSize = getPositiveNumber(canvas?.grid?.size);

  return {
    type: "rectangleRay",
    sceneId: getSceneId(region, regionDocument),
    regionId: getStringId(regionDocument?.id) ?? getStringId(region.id),
    gridSize,
    bounds: {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    },
    shape: {
      x: getNumber(shape.x) ?? 0,
      y: getNumber(shape.y) ?? 0,
      width: getNumber(shape.width) ?? bounds.width,
      height: getNumber(shape.height) ?? bounds.height,
      direction: getNumber(shape.direction) ?? 0,
      elevation: getNumber(shape.elevation),
    },
    center: {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    },
    ray: {
      start: null,
      end: null,
    },
    source: "lineArea",
    targetingMode: "lineArea",
  };
}

function createRitualEventBase(input: RitualEventBuildInput): PublicRitualEventBase {
  const automation = createAutomationSourceSnapshot(input.automationSource);
  const targets = input.targets ?? input.context.targets;

  return {
    version: 1,
    castId: input.castId,
    sceneId: input.context.token?.sceneId ?? canvas?.scene?.id ?? null,
    timestamp: Date.now(),
    automation,
    caster: {
      actor: {
        id: input.context.actor?.id ?? null,
        uuid: input.context.actor?.uuid ?? null,
        name: input.context.actor?.name ?? null,
      },
      token: createTokenRef(input.context.token),
    },
    item: {
      id: input.context.item.id ?? null,
      uuid: input.context.item.uuid ?? null,
      name: input.context.item.name,
      type: input.context.item.type,
    },
    ritual: createRitualMetadata(input.context.item, input.form, input.formLabel, automation),
    targets: targets.map(createTargetSnapshot),
    documents: {
      actor: input.context.actor,
      token: null,
      item: input.context.item,
    },
  };
}

function createRitualMetadata(
  item: Item,
  form: AutomationRitualFormId,
  formLabel: string,
  automation: PublicAutomationSourceSnapshot,
): PublicRitualMetadata {
  return {
    name: item.name,
    slug: readStringProperty(item, "system.slug") ?? readStringProperty(item, "slug"),
    presetId: automation.presetId,
    presetVersion: automation.presetVersion,
    element: readStringProperty(item, "system.element"),
    circle: readCircle(item),
    form: toPublicRitualForm(form),
    formLabel,
  };
}

function toPublicRitualForm(form: AutomationRitualFormId): PublicRitualForm {
  switch (form) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}

function createTokenRef(token: WorkflowTokenRef | null) {
  if (!token) return null;

  return {
    id: token.tokenId,
    actorId: token.actorId,
    sceneId: token.sceneId,
    name: token.name,
  };
}

function createTargetSnapshot(target: WorkflowTarget): PublicWorkflowTargetSnapshot {
  return {
    tokenId: target.tokenId,
    actorId: target.actorId,
    sceneId: target.sceneId,
    name: target.name,
  };
}

function readCircle(item: Item): number | string | null {
  const value = foundry.utils.getProperty(item, "system.circle") ?? foundry.utils.getProperty(item, "system.ritual.circle");

  if (typeof value === "number" && Number.isFinite(value)) return value;
  return normalizeOptionalString(value);
}

function readStringProperty(item: Item, path: string): string | null {
  return normalizeOptionalString(foundry.utils.getProperty(item, path));
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getRegionDocument(region: RegionDocumentLike | RegionObjectLike): RegionDocumentLike | null {
  if ("document" in region && region.document) return region.document;
  return region as RegionDocumentLike;
}

function getRegionCandidates(region: RegionDocumentLike | RegionObjectLike): Array<RegionDocumentLike | RegionObjectLike> {
  const candidates: Array<RegionDocumentLike | RegionObjectLike | null | undefined> = [
    region,
    getRegionObject(region),
    "document" in region ? region.document : null,
    "document" in region ? region.document?.object : null,
  ];

  return candidates.filter(isRegionCandidate);
}

function getRegionObject(region: RegionDocumentLike | RegionObjectLike): RegionObjectLike | null {
  if ("object" in region) return isRegionCandidate(region.object) ? region.object : null;
  return null;
}

function isRegionCandidate(value: unknown): value is RegionDocumentLike | RegionObjectLike {
  return Boolean(value && typeof value === "object");
}

function getBounds(candidates: Array<RegionDocumentLike | RegionObjectLike>): BoundsLike | null {
  const boundsCandidates = candidates.map((candidate) => candidate.bounds);

  for (const candidate of boundsCandidates) {
    if (!candidate) continue;

    const x = getNumber(candidate.x);
    const y = getNumber(candidate.y);
    const width = getNumber(candidate.width);
    const height = getNumber(candidate.height);

    if (x === null || y === null || width === null || height === null) continue;

    return { x, y, width, height };
  }

  return null;
}

function getRectangleShape(candidates: Array<RegionDocumentLike | RegionObjectLike>): RegionShapeDataLike | null {
  for (const candidate of candidates) {
    const shape = getShapes(candidate).find((shape) => shape.type === "rectangle") ?? null;
    if (shape) return shape;
  }

  return null;
}

function getShapes(value: unknown): RegionShapeDataLike[] {
  if (!value || typeof value !== "object") return [];

  const directShapes = (value as { shapes?: unknown }).shapes;
  if (Array.isArray(directShapes)) return directShapes.filter(isRegionShapeDataLike);

  const toObject = (value as { toObject?: unknown }).toObject;
  if (typeof toObject !== "function") return [];

  const data = toObject.call(value) as { shapes?: unknown } | null;
  return Array.isArray(data?.shapes) ? data.shapes.filter(isRegionShapeDataLike) : [];
}

function isRegionShapeDataLike(value: unknown): value is RegionShapeDataLike {
  return Boolean(value && typeof value === "object" && typeof (value as { type?: unknown }).type === "string");
}

function createShapeFromBounds(bounds: BoundsLike): RegionShapeDataLike {
  return {
    type: "rectangle",
    x: 0,
    y: 0,
    width: bounds.width,
    height: bounds.height,
    direction: 0,
    elevation: null,
  };
}

function getSceneId(region: RegionDocumentLike | RegionObjectLike, regionDocument: RegionDocumentLike | null): string | null {
  return (
    readNestedString(region, "parent.id") ??
    readNestedString(region, "document.parent.id") ??
    readNestedString(regionDocument, "parent.id") ??
    canvas?.scene?.id ??
    null
  );
}

function readNestedString(value: unknown, path: string): string | null {
  return normalizeOptionalString(foundry.utils.getProperty(value, path));
}

function getStringId(value: unknown): string | null {
  return normalizeOptionalString(value);
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getPositiveNumber(value: unknown): number | null {
  const numberValue = getNumber(value);
  return numberValue !== null && numberValue > 0 ? numberValue : null;
}
