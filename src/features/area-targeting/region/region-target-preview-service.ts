import { FoundryRegionAdapter } from "./foundry-region-adapter";

export type RegionTargetPreviewSnapshot = {
  targetIds: string[];
};

export class RegionTargetPreviewService {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  captureCurrentTargets(): RegionTargetPreviewSnapshot {
    return {
      targetIds: this.foundryAdapter.getUserTargetIds(),
    };
  }

  previewTargets(tokens: TokenLike[]): void {
    this.foundryAdapter.updateUserTargets(getTokenIds(tokens));
  }

  keepPreviewTargets(tokens: TokenLike[]): void {
    this.previewTargets(tokens);
  }

  restorePreviousTargets(snapshot: RegionTargetPreviewSnapshot): void {
    this.foundryAdapter.updateUserTargets(snapshot.targetIds);
  }
}

function getTokenIds(tokens: TokenLike[]): string[] {
  return tokens.flatMap((token) => {
    const id = token.id ?? token.document?.id ?? null;
    return id ? [id] : [];
  });
}
