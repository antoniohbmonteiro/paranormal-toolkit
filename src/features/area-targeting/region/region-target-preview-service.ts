import { FoundryRegionAdapter } from "./foundry-region-adapter";

export type RegionTargetPreviewSnapshot = {
  targetIds: string[];
};

export class RegionTargetPreviewService {
  private lastAppliedTargetIds: string[] | null = null;

  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  captureCurrentTargets(): RegionTargetPreviewSnapshot {
    const targetIds = this.foundryAdapter.getUserTargetIds();
    this.lastAppliedTargetIds = targetIds;

    return { targetIds };
  }

  previewTargets(tokens: TokenLike[]): void {
    this.applyTargets(getTokenIds(tokens));
  }

  keepPreviewTargets(tokens: TokenLike[]): void {
    this.applyTargets(getTokenIds(tokens));
  }

  restorePreviousTargets(snapshot: RegionTargetPreviewSnapshot): void {
    this.applyTargets(snapshot.targetIds);
    this.lastAppliedTargetIds = null;
  }

  private applyTargets(targetIds: string[]): void {
    const uniqueTargetIds = uniqueIds(targetIds);
    if (areSameIds(this.lastAppliedTargetIds, uniqueTargetIds)) return;

    this.lastAppliedTargetIds = uniqueTargetIds;
    this.foundryAdapter.updateUserTargets(uniqueTargetIds);
  }
}

function getTokenIds(tokens: TokenLike[]): string[] {
  return tokens.flatMap((token) => {
    const id = token.id ?? token.document?.id ?? null;
    return id ? [id] : [];
  });
}

function uniqueIds(ids: string[]): string[] {
  return Array.from(new Set(ids));
}

function areSameIds(left: string[] | null, right: string[]): boolean {
  if (!left) return false;
  if (left.length !== right.length) return false;

  return left.every((id, index) => id === right[index]);
}
