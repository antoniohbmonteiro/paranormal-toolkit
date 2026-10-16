export function isJsonData(value: unknown, depth = 0): boolean {
  if (depth > 64) return false;
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(entry => isJsonData(entry, depth + 1));
  if (!value || typeof value !== "object" || Object.prototype.toString.call(value) !== "[object Object]") return false;
  return Object.entries(value).every(([key, child]) => !["__proto__", "constructor", "prototype"].includes(key) && isJsonData(child, depth + 1));
}
