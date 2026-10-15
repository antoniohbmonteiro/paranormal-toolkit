export type EffectChange = { key: string; type: string; phase: string; priority: number | null; value: unknown };
export type AllyEffectTemplate = {
  name: string; type: string; img: string; description: string;
  system: Record<string, unknown> & { changes: EffectChange[] };
  statuses: string[]; tint: string; showIcon: number;
  duration: { value: number | null; units: string; expiry: string | null };
};

function serializable(value: unknown): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(serializable);
  if (!value || typeof value !== "object") return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  return Object.entries(value).every(([key, child]) => !["__proto__", "prototype", "constructor"].includes(key) && serializable(child));
}

export function readEffectTemplate(value: unknown): AllyEffectTemplate | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, any>;
  if (typeof data.name !== "string" || !data.name.trim() || typeof data.type !== "string" || !data.type
    || !data.system || Array.isArray(data.system) || !Array.isArray(data.system.changes) || !serializable(data.system)) return null;
  const changes: EffectChange[] = [];
  for (const change of data.system.changes) {
    if (!change || typeof change.key !== "string" || !change.key.trim()
      || change.key === "system"
      || change.key.split(".").some((part: string) => !part || part.startsWith("_") || ["prototype", "constructor"].includes(part))
      || /^(?:ownership|permission|type|flags|parent|items|effects|id|uuid|sheet|prototypeToken|documentName)(?:\.|$)/.test(change.key)
      || typeof change.type !== "string" || !/^(?:[a-z0-9]+(?:\.[a-z0-9]+)*|custom\.-?\d+)$/i.test(change.type)
      || typeof change.phase !== "string" || !change.phase
      || (change.priority != null && (typeof change.priority !== "number" || !Number.isFinite(change.priority)))
      || !serializable(change.value)) return null;
    const numeric = typeof change.value === "string" && change.value.trim() !== "" && Number.isFinite(Number(change.value));
    changes.push({ key: change.key, type: change.type, phase: change.phase, priority: change.priority ?? null,
      value: numeric ? Number(change.value) : structuredClone(change.value) });
  }
  if (data.statuses !== undefined && (!Array.isArray(data.statuses) || !data.statuses.every((id: unknown) => typeof id === "string"))) return null;
  const duration = data.duration ?? {};
  if (duration.value != null && (typeof duration.value !== "number" || !Number.isFinite(duration.value) || duration.value < 0)) return null;
  return { name: data.name, type: data.type, img: typeof data.img === "string" ? data.img : "icons/svg/aura.svg",
    description: typeof data.description === "string" ? data.description : "",
    system: { ...structuredClone(data.system), changes }, statuses: [...new Set<string>(data.statuses ?? [])].sort(),
    tint: typeof data.tint === "string" ? data.tint : "#ffffff", showIcon: typeof data.showIcon === "number" ? data.showIcon : 1,
    duration: { value: duration.value ?? null, units: typeof duration.units === "string" ? duration.units : "seconds",
      expiry: typeof duration.expiry === "string" ? duration.expiry : null } };
}

export function stableEffectFingerprint(value: unknown): string {
  const canonical = (entry: any): any => Array.isArray(entry) ? entry.map(canonical)
    : entry && typeof entry === "object" ? Object.fromEntries(Object.keys(entry).sort().map(key => [key, canonical(entry[key])])) : entry;
  return JSON.stringify(canonical(value));
}

export function effectMechanics(template: AllyEffectTemplate): string {
  return stableEffectFingerprint({ type: template.type, system: template.system, statuses: template.statuses, duration: template.duration });
}
