import type { AutomationFlagSource } from "../automation/automation-binder";
import type { WorkflowTarget } from "../workflow/workflow-context";

export type PublicRitualEventVersion = 1;

export type PublicAutomationSourceSnapshot = {
  type: "preset" | "manual" | "generic" | "unknown";
  presetId: string | null;
  presetVersion: string | null;
  label: string | null;
  fxEligible: boolean;
};

export type RitualAutomationSourceInput = AutomationFlagSource | { type: "generic" } | { type: "unknown" };

export type PublicRitualForm = "standard" | "student" | "true";

export type PublicRitualMetadata = {
  name: string;
  slug: string | null;
  presetId: string | null;
  presetVersion: string | null;
  element: string | null;
  circle: number | string | null;
  form: PublicRitualForm;
  formLabel: string;
};

export type PublicRitualPoint = {
  x: number;
  y: number;
};

export type PublicRitualArea = {
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
  center: PublicRitualPoint;
  ray: {
    start: PublicRitualPoint | null;
    end: PublicRitualPoint | null;
  };
  source: "lineArea";
  targetingMode: "lineArea";
};

export type PublicActorRef = {
  id: string | null;
  uuid: string | null;
  name: string | null;
};

export type PublicTokenRef = {
  id: string | null;
  actorId: string | null;
  sceneId: string | null;
  name: string | null;
};

export type PublicItemRef = {
  id: string | null;
  uuid: string | null;
  name: string;
  type: string;
};

export type PublicWorkflowTargetSnapshot = Pick<
  WorkflowTarget,
  "tokenId" | "actorId" | "sceneId" | "name"
>;

export type PublicRitualDocuments = {
  actor?: Actor | null;
  token?: TokenLike | null;
  item?: Item | null;
};

export type PublicRitualEventBase = {
  version: 1;
  castId: string;
  sceneId: string | null;
  timestamp: number;
  automation: PublicAutomationSourceSnapshot;
  caster: {
    actor: PublicActorRef;
    token: PublicTokenRef | null;
  };
  item: PublicItemRef;
  ritual: PublicRitualMetadata;
  targets: PublicWorkflowTargetSnapshot[];
  documents?: PublicRitualDocuments;
};

export type RitualCastStartedEvent = PublicRitualEventBase & {
  type: "ritual.cast.started";
};

export type RitualAreaResolvedEvent = PublicRitualEventBase & {
  type: "ritual.area.resolved";
  area: PublicRitualArea;
};

export type RitualCastFinishedStatus =
  | "completed-without-actions"
  | "ready"
  | "cancelled"
  | "failed";

export type RitualCastFinishedEvent = PublicRitualEventBase & {
  type: "ritual.cast.finished";
  status: RitualCastFinishedStatus;
  reason?: string;
  message?: string;
};
