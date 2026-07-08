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

type RectangleRaySnapshotOptions = {
  candidates?: unknown[];
  shape?: RegionShapeDataLike | null;
};

type RectangleRayShapeSnapshot = {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: number;
  elevation: number | null;
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

export function createRectangleRayAreaSnapshot(
  region: RegionDocumentLike | RegionObjectLike,
  options: RectangleRaySnapshotOptions = {},
): PublicRitualArea {
  const regionDocument = getRegionDocument(region);
  const candidates = [
    ...getRegionCandidatesFromUnknown(options.candidates ?? []),
    ...getRegionCandidates(region),
  ];
  const bounds = getBounds(candidates) ?? { x: 0, y: 0, width: 0, height: 0 };
  const shape = getRectangleShapeFromOptions(options) ?? getRectangleShape(candidates) ?? createShapeFromBounds(bounds);
  const gridSize = getPositiveNumber(canvas?.grid?.size);
  const shapeSnapshot = createRectangleRayShapeSnapshot(shape, bounds, candidates);
  const explicitRay = getExplicitRay(candidates);
  const inferredRay = createRayFromRectangleShape(shapeSnapshot);

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
    shape: shapeSnapshot,
    center: {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    },
    ray: explicitRay ?? inferredRay ?? {
      start: null,
      end: null,
    },
    source: "lineArea",
    targetingMode: "lineArea",
  };
}

function createRectangleRayShapeSnapshot(
  shape: RegionShapeDataLike,
  bounds: BoundsLike,
  candidates: Array<RegionDocumentLike | RegionObjectLike>,
): RectangleRayShapeSnapshot {
  const baseShape = {
    x: getNumber(shape.x) ?? 0,
    y: getNumber(shape.y) ?? 0,
    width: getNumber(shape.width) ?? bounds.width,
    height: getNumber(shape.height) ?? bounds.height,
    direction: getNumber(shape.direction) ?? 0,
    elevation: getNumber(shape.elevation),
  };

  return {
    ...baseShape,
    direction: resolveRectangleRayDirection(baseShape, bounds, candidates),
  };
}

function resolveRectangleRayDirection(
  shape: RectangleRayShapeSnapshot,
  bounds: BoundsLike,
  candidates: Array<RegionDocumentLike | RegionObjectLike>,
): number {
  const candidateDirection = getCandidateDirection(candidates);
  if (candidateDirection !== null) return candidateDirection;

  return inferDirectionFromRotatedBounds(shape, bounds) ?? shape.direction;
}

function getCandidateDirection(candidates: Array<RegionDocumentLike | RegionObjectLike>): number | null {
  const paths = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction",
  ];

  for (const candidate of candidates) {
    for (const path of paths) {
      const value = getNumber(foundry.utils.getProperty(candidate, path));
      if (value !== null && Math.abs(normalizeDirectionDegrees(value)) > 0.001) {
        return normalizeDirectionDegrees(value);
      }
    }

    const toObject = (candidate as { toObject?: unknown }).toObject;
    if (typeof toObject !== "function") continue;

    const data = toObject.call(candidate) as object | null;
    for (const path of paths) {
      const value = getNumber(foundry.utils.getProperty(data, path));
      if (value !== null && Math.abs(normalizeDirectionDegrees(value)) > 0.001) {
        return normalizeDirectionDegrees(value);
      }
    }
  }

  return null;
}

function inferDirectionFromRotatedBounds(
  shape: RectangleRayShapeSnapshot,
  bounds: BoundsLike,
): number | null {
  if (shape.width <= 0 || shape.height < 0 || bounds.width <= 0 || bounds.height <= 0) return null;

  const unrotatedError = getBoundsError(createRectangleBounds(shape, shape.direction), bounds);
  const acuteDirection = solveAcuteDirectionFromBounds(shape, bounds);
  if (acuteDirection === null) return null;

  const candidateDirections = uniqueDirections([
    acuteDirection,
    -acuteDirection,
    180 - acuteDirection,
    180 + acuteDirection,
    0,
    90,
    180,
    270,
  ]);
  const best = candidateDirections
    .map((direction) => ({
      direction,
      error: getBoundsError(createRectangleBounds(shape, direction), bounds),
    }))
    .sort((a, b) => a.error - b.error)[0];

  if (!best || best.error >= unrotatedError) return null;

  const tolerance = Math.max(1, Math.min(shape.width, Math.max(shape.height, 1)) * 0.05);
  return best.error <= tolerance ? normalizeDirectionDegrees(best.direction) : null;
}

function solveAcuteDirectionFromBounds(shape: RectangleRayShapeSnapshot, bounds: BoundsLike): number | null {
  const length = shape.width;
  const width = shape.height;
  const denominator = length ** 2 - width ** 2;

  if (Math.abs(denominator) < 0.001) return null;

  const cos = (length * bounds.width - width * bounds.height) / denominator;
  const sin = (length * bounds.height - width * bounds.width) / denominator;
  const clampedCos = clamp(cos, 0, 1);
  const clampedSin = clamp(sin, 0, 1);

  if (!Number.isFinite(clampedCos) || !Number.isFinite(clampedSin)) return null;

  return radiansToDegrees(Math.atan2(clampedSin, clampedCos));
}

function createRectangleBounds(shape: RectangleRayShapeSnapshot, direction: number): BoundsLike {
  const radians = degreesToRadians(direction);
  const lengthVector = {
    x: Math.cos(radians),
    y: Math.sin(radians),
  };
  const widthVector = {
    x: -Math.sin(radians),
    y: Math.cos(radians),
  };
  const corners = [
    { x: shape.x, y: shape.y },
    {
      x: shape.x + lengthVector.x * shape.width,
      y: shape.y + lengthVector.y * shape.width,
    },
    {
      x: shape.x + widthVector.x * shape.height,
      y: shape.y + widthVector.y * shape.height,
    },
    {
      x: shape.x + lengthVector.x * shape.width + widthVector.x * shape.height,
      y: shape.y + lengthVector.y * shape.width + widthVector.y * shape.height,
    },
  ];
  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function getBoundsError(actual: BoundsLike, expected: BoundsLike): number {
  return Math.abs(actual.x - expected.x) +
    Math.abs(actual.y - expected.y) +
    Math.abs(actual.width - expected.width) +
    Math.abs(actual.height - expected.height);
}

function uniqueDirections(values: number[]): number[] {
  const directions = new Set<number>();

  for (const value of values) {
    const normalized = normalizeDirectionDegrees(value);
    directions.add(Math.round(normalized * 1000) / 1000);
  }

  return [...directions];
}

function createRayFromRectangleShape(shape: RectangleRayShapeSnapshot): PublicRitualArea["ray"] | null {
  if (shape.width <= 0 || shape.height < 0) return null;

  const radians = degreesToRadians(shape.direction);
  const lengthVector = {
    x: Math.cos(radians),
    y: Math.sin(radians),
  };
  const perpendicularVector = {
    x: -Math.sin(radians),
    y: Math.cos(radians),
  };
  const halfWidth = shape.height / 2;
  const start = {
    x: shape.x + perpendicularVector.x * halfWidth,
    y: shape.y + perpendicularVector.y * halfWidth,
  };

  return {
    start,
    end: {
      x: start.x + lengthVector.x * shape.width,
      y: start.y + lengthVector.y * shape.width,
    },
  };
}

function getExplicitRay(candidates: Array<RegionDocumentLike | RegionObjectLike>): PublicRitualArea["ray"] | null {
  for (const candidate of candidates) {
    const start = readPoint(candidate, "ray.start");
    const end = readPoint(candidate, "ray.end");

    if (start && end) return { start, end };
  }

  return null;
}

function readPoint(candidate: unknown, path: string): PublicRitualArea["ray"]["start"] {
  const value = foundry.utils.getProperty(candidate, path);
  const x = getNumber(foundry.utils.getProperty(value, "x"));
  const y = getNumber(foundry.utils.getProperty(value, "y"));

  if (x === null || y === null) return null;

  return { x, y };
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

function getRectangleShapeFromOptions(options: RectangleRaySnapshotOptions): RegionShapeDataLike | null {
  return options.shape && isRegionShapeDataLike(options.shape) ? options.shape : null;
}

function getRegionCandidatesFromUnknown(values: unknown[]): Array<RegionDocumentLike | RegionObjectLike> {
  return values.filter(isRegionCandidate);
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

function degreesToRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function radiansToDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

function normalizeDirectionDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
