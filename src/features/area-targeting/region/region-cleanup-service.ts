import { FoundryRegionAdapter } from "./foundry-region-adapter";

const REGION_CLEANUP_FAILED_MESSAGE =
  "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";

export class RegionCleanupService {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  async deleteCreatedRegion(region: RegionDocumentLike): Promise<void> {
    if (typeof region.delete !== "function") {
      this.foundryAdapter.warn(REGION_CLEANUP_FAILED_MESSAGE);
      return;
    }

    try {
      await region.delete();
    } catch {
      this.foundryAdapter.warn(REGION_CLEANUP_FAILED_MESSAGE);
    }
  }
}
