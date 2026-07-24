import { MODULE_ID } from "../../constants";

const STYLESHEET_ATTRIBUTE = "data-paranormal-toolkit-stylesheet";

type FoundryUtilsWithRoute = typeof foundry.utils & {
  getRoute?: (path: string) => string;
};

type ModuleVersionSource = {
  version?: unknown;
  manifest?: {
    version?: unknown;
  };
};

export function ensureModuleStylesheet(assetPath: string): HTMLLinkElement {
  const normalizedPath = normalizeAssetPath(assetPath);
  const route = resolveModuleAssetRoute(normalizedPath);
  const versionedRoute = appendVersion(route);
  const existing = findExistingStylesheet(route, normalizedPath);
  if (existing) {
    existing.href = versionedRoute;
    existing.setAttribute(STYLESHEET_ATTRIBUTE, normalizedPath);
    return existing;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = versionedRoute;
  link.setAttribute(STYLESHEET_ATTRIBUTE, normalizedPath);
  document.head.append(link);
  return link;
}

function resolveModuleAssetRoute(normalizedPath: string): string {
  const assetRoute = `modules/${MODULE_ID}/${normalizedPath}`;
  const utils = foundry.utils as FoundryUtilsWithRoute;
  const getRoute = utils.getRoute;

  return typeof getRoute === "function"
    ? getRoute.call(utils, assetRoute)
    : assetRoute;
}

function findExistingStylesheet(
  route: string,
  normalizedPath: string,
): HTMLLinkElement | null {
  const expectedPathname = resolvePathname(route);

  for (const stylesheet of Array.from(
    document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  )) {
    if (
      stylesheet.getAttribute(STYLESHEET_ATTRIBUTE) === normalizedPath ||
      resolvePathname(stylesheet.href) === expectedPathname
    ) {
      return stylesheet;
    }
  }

  return null;
}

function appendVersion(route: string): string {
  const moduleVersion = resolveModuleVersion();
  if (!moduleVersion) return route;

  const separator = route.includes("?") ? "&" : "?";
  return `${route}${separator}v=${encodeURIComponent(moduleVersion)}`;
}

function resolveModuleVersion(): string | null {
  const installedModule = game.modules.get(MODULE_ID) as unknown as
    | ModuleVersionSource
    | undefined;
  const candidate = installedModule?.version ?? installedModule?.manifest?.version;

  return typeof candidate === "string" && candidate.trim().length > 0
    ? candidate.trim()
    : null;
}

function resolvePathname(value: string): string {
  try {
    return new URL(value, document.baseURI).pathname;
  } catch {
    return value;
  }
}

function normalizeAssetPath(assetPath: string): string {
  return assetPath.trim().replace(/^\/+|\/+$/gu, "");
}
