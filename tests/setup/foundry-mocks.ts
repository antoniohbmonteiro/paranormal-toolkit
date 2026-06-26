type PropertyPath = string;

function getProperty(source: unknown, path: PropertyPath): unknown {
  if (!source || path.length === 0) return undefined;

  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, source);
}

Object.defineProperty(globalThis, "foundry", {
  configurable: true,
  value: {
    utils: {
      getProperty
    }
  },
  writable: true
});
