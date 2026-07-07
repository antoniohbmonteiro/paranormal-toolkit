import { FoundryRegionAdapter } from "./foundry-region-adapter";

const REGION_CLEANUP_FAILED_MESSAGE =
  "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";

export class RegionCleanupService {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  async deleteCreatedRegion(region: RegionDocumentLike | RegionObjectLike): Promise<void> {
    const document = getRegionDocument(region);

    if (typeof document?.delete !== "function") {
      this.foundryAdapter.warn(REGION_CLEANUP_FAILED_MESSAGE);
      return;
    }

    try {
      await document.delete();
    } catch {
      this.foundryAdapter.warn(REGION_CLEANUP_FAILED_MESSAGE);
    }
  }
}

function getRegionDocument(region: RegionDocumentLike | RegionObjectLike): RegionDocumentLike | null {
  return isRegionObject(region) ? region.document ?? null : region;
}

function isRegionObject(region: RegionDocumentLike | RegionObjectLike): region is RegionObjectLike {
  return "bounds" in region;
}
