type MinimizableApplication = {
  element?: unknown;
  document?: unknown;
  object?: unknown;
  minimized?: unknown;
  minimize: () => Promise<unknown> | unknown;
  maximize: () => Promise<unknown> | unknown;
};

type ElementLike = {
  ownerDocument: Document;
  isConnected?: boolean;
};

type ApplicationCollectionLike =
  | Map<unknown, unknown>
  | Set<unknown>
  | unknown[]
  | Record<string, unknown>;

export type CanvasPlacementWindowRestoreHandle = {
  restore(): Promise<void>;
};

export class CanvasPlacementWindowManager {
  async minimizeForPlacement(): Promise<CanvasPlacementWindowRestoreHandle> {
    const minimizedApps: MinimizableApplication[] = [];

    for (const app of collectBlockingSheetApplications()) {
      if (await minimizeApplication(app)) {
        minimizedApps.push(app);
      }
    }

    return {
      restore: async () => {
        for (const app of [...minimizedApps].reverse()) {
          await restoreApplication(app);
        }
      },
    };
  }
}

async function minimizeApplication(app: MinimizableApplication): Promise<boolean> {
  if (isApplicationMinimized(app)) return false;
  if (!isBlockingMainDocumentApplication(app)) return false;

  try {
    await app.minimize();
    return true;
  } catch (error) {
    console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", error);
    return false;
  }
}

async function restoreApplication(app: MinimizableApplication): Promise<void> {
  if (!isApplicationMinimized(app)) return;

  try {
    await app.maximize();
  } catch (error) {
    console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", error);
  }
}

function collectBlockingSheetApplications(): MinimizableApplication[] {
  const applications = new Set<MinimizableApplication>();

  for (const app of collectApplicationCandidates()) {
    if (!isMinimizableApplication(app)) continue;
    if (!isActorOrItemSheetApplication(app)) continue;
    applications.add(app);
  }

  return [...applications];
}

function collectApplicationCandidates(): unknown[] {
  return [
    ...readApplicationCollection(getUiWindows()),
    ...readApplicationCollection(getApplicationV2Instances()),
  ];
}

function readApplicationCollection(collection: unknown): unknown[] {
  if (!collection) return [];

  if (collection instanceof Map || collection instanceof Set) {
    return [...collection.values()];
  }

  if (Array.isArray(collection)) return collection;

  if (typeof collection === "object") {
    return Object.values(collection as Record<string, unknown>);
  }

  return [];
}

function getUiWindows(): ApplicationCollectionLike | null {
  const uiLike = globalThis as typeof globalThis & {
    ui?: { windows?: ApplicationCollectionLike };
  };

  return uiLike.ui?.windows ?? null;
}

function getApplicationV2Instances(): ApplicationCollectionLike | null {
  const foundryLike = globalThis as typeof globalThis & {
    foundry?: { applications?: { instances?: ApplicationCollectionLike } };
  };

  return foundryLike.foundry?.applications?.instances ?? null;
}

function isMinimizableApplication(value: unknown): value is MinimizableApplication {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as { minimize?: unknown }).minimize === "function" &&
      typeof (value as { maximize?: unknown }).maximize === "function",
  );
}

function isActorOrItemSheetApplication(app: MinimizableApplication): boolean {
  const document = getSheetDocument(app);
  const documentName = getDocumentName(document);

  return documentName === "Actor" || documentName === "Item";
}

function getSheetDocument(app: MinimizableApplication): unknown {
  return app.document ?? app.object ?? null;
}

function getDocumentName(document: unknown): string | null {
  if (!document || typeof document !== "object") return null;

  const candidate = document as {
    documentName?: unknown;
    constructor?: { documentName?: unknown; name?: unknown };
  };

  if (typeof candidate.documentName === "string") return candidate.documentName;
  if (typeof candidate.constructor?.documentName === "string") return candidate.constructor.documentName;

  const constructorName = candidate.constructor?.name;
  if (constructorName === "Actor" || constructorName === "Item") return constructorName;

  return null;
}

function isBlockingMainDocumentApplication(app: MinimizableApplication): boolean {
  const element = getApplicationElement(app);
  if (!element) return false;
  if (element.isConnected === false) return false;

  const mainDocument = globalThis.document;
  if (!mainDocument) return false;

  return element.ownerDocument === mainDocument;
}

function getApplicationElement(app: MinimizableApplication): ElementLike | null {
  const element = app.element;
  if (isElementLike(element)) return element;

  if (element && typeof element === "object") {
    const firstElement = (element as { 0?: unknown })[0];
    if (isElementLike(firstElement)) return firstElement;
  }

  return null;
}

function isElementLike(value: unknown): value is ElementLike {
  return Boolean(
    value &&
      typeof value === "object" &&
      "ownerDocument" in value &&
      (value as { ownerDocument?: unknown }).ownerDocument,
  );
}

function isApplicationMinimized(app: MinimizableApplication): boolean {
  return app.minimized === true;
}
