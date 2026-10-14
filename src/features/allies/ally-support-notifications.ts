import type { AllySupportState } from "../../core/allies/ally-support-state";

export type AllyNoticeSnapshot = {
  beneficiaryId: string | null;
  status: AllySupportState["status"];
  benefits: { sourceKey: string; value: number }[];
};
export type AllySupportChange = {
  allyId: string; before: AllyNoticeSnapshot; after: AllyNoticeSnapshot;
  events: ("activated" | "deactivated" | "beneficiaryChanged" | "benefitsChanged" | "transitionCompleted")[];
};

export function buildAllySupportChange(
  allyId: string, before: AllyNoticeSnapshot | null, after: AllyNoticeSnapshot,
): AllySupportChange | null {
  if (!before) return null;
  const events: AllySupportChange["events"] = [];
  if (before.beneficiaryId !== after.beneficiaryId) events.push("beneficiaryChanged");
  if (before.status !== "active" && after.status === "active") {
    events.push(before.status === "pending" ? "transitionCompleted" : "activated");
  }
  if (before.status !== "inactive" && after.status === "inactive") events.push("deactivated");
  if (before.status === "active" && after.status === "active" && before.beneficiaryId === after.beneficiaryId
    && JSON.stringify(before.benefits) !== JSON.stringify(after.benefits)) events.push("benefitsChanged");
  return events.length ? { allyId, before, after, events } : null;
}

export function isAllyNoticeSnapshot(value: unknown): value is AllyNoticeSnapshot {
  if (!value || typeof value !== "object") return false;
  const data = value as AllyNoticeSnapshot;
  return (data.beneficiaryId === null || typeof data.beneficiaryId === "string")
    && ["inactive", "active", "pending"].includes(data.status)
    && Array.isArray(data.benefits) && data.benefits.every(benefit => benefit
      && typeof benefit.sourceKey === "string" && typeof benefit.value === "number" && Number.isFinite(benefit.value))
    && new Set(data.benefits.map(benefit => benefit.sourceKey)).size === data.benefits.length;
}
