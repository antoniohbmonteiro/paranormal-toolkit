import { FoundryRegionAdapter } from "./foundry-region-adapter";

const REGION_CLEANUP_FAILED_MESSAGE =
  "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
const DEBUG_REGION_TARGETING = false;

export class RegionCleanupService {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  async deleteCreatedRegion(region: RegionDocumentLike | RegionObjectLike): Promise<void> {
    const attempts = createCleanupAttempts(region, this.foundryAdapter);

    for (const attempt of attempts) {
      try {
        await attempt.run();
        debugRegionTargeting("Region cleanup succeeded.", { method: attempt.method });
        return;
      } catch (error) {
        debugRegionTargeting("Region cleanup attempt failed.", {
          method: attempt.method,
          error,
        });
      }
    }

    this.foundryAdapter.warn(REGION_CLEANUP_FAILED_MESSAGE);
  }
}

type CleanupAttempt = {
  method: string;
  run: () => Promise<unknown>;
};

function createCleanupAttempts(
  region: RegionDocumentLike | RegionObjectLike,
  foundryAdapter: FoundryRegionAdapter,
): CleanupAttempt[] {
  const attempts: CleanupAttempt[] = [];
  const document = getRegionDocument(region);
  const documentId = getRegionId(document);
  const regionId = getRegionId(region);

  if (typeof document?.delete === "function") {
    const deleteDocument = document.delete.bind(document);
    attempts.push({ method: "document.delete", run: deleteDocument });
  }

  if (typeof region.delete === "function") {
    const deleteRegion = region.delete.bind(region);
    attempts.push({ method: "region.delete", run: deleteRegion });
  }

  if (documentId) {
    attempts.push({
      method: "scene.deleteEmbeddedDocuments(document.id)",
      run: () => foundryAdapter.deleteRegionDocumentById(documentId),
    });
  }

  if (regionId && regionId !== documentId) {
    attempts.push({
      method: "scene.deleteEmbeddedDocuments(region.id)",
      run: () => foundryAdapter.deleteRegionDocumentById(regionId),
    });
  }

  return attempts;
}

function getRegionDocument(region: RegionDocumentLike | RegionObjectLike): RegionDocumentLike | null {
  return isRegionObject(region) ? region.document ?? null : region;
}

function isRegionObject(region: RegionDocumentLike | RegionObjectLike): region is RegionObjectLike {
  return "bounds" in region;
}

function getRegionId(region: RegionDocumentLike | RegionObjectLike | null): string | null {
  return typeof region?.id === "string" && region.id.length > 0 ? region.id : null;
}

function debugRegionTargeting(message: string, data: Record<string, unknown>): void {
  if (!DEBUG_REGION_TARGETING) return;
  console.debug(`Paranormal Toolkit: ${message}`, data);
}
