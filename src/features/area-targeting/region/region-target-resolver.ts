import type { WorkflowTarget } from "../../../core/workflow/workflow-context";
import { createWorkflowTargetFromToken } from "../../automation/workflow-target-resolver";
import { FoundryRegionAdapter } from "./foundry-region-adapter";
import type {
  RegionPlacementChange,
  RegionTargetResolutionResult,
  RegionTargetTokenResolutionResult,
} from "./region-targeting-types";

export class RegionTargetResolver {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  resolveTargets(region: RegionDocumentLike | RegionObjectLike): RegionTargetResolutionResult {
    const resolution = this.resolveTargetTokens(region);

    return {
      ...resolution,
      targets: resolution.tokens.map(createWorkflowTargetFromToken),
    };
  }

  resolvePreviewTargetTokens(change: RegionPlacementChange): RegionTargetTokenResolutionResult {
    if (change.preview?.bounds) {
      return this.resolveRegionObjectTargetTokens(change.preview);
    }

    const documentObject = change.document.object ?? null;
    return documentObject
      ? this.resolveRegionObjectTargetTokens(documentObject)
      : { tokens: [], source: "regionObjectUnavailable" };
  }

  resolveTargetTokens(region: RegionDocumentLike | RegionObjectLike): RegionTargetTokenResolutionResult {
    const regionObject = getRegionObject(region);

    return regionObject
      ? this.resolveRegionObjectTargetTokens(regionObject)
      : { tokens: [], source: "regionObjectUnavailable" };
  }

  private resolveRegionObjectTargetTokens(region: RegionObjectLike): RegionTargetTokenResolutionResult {
    if (!region.bounds) return { tokens: [], source: "regionObjectUnavailable" };

    return {
      tokens: uniqueTokens(
        this.foundryAdapter.getTokensInBounds(region.bounds).filter((token) => {
          if (!token.actor) return false;
          if (typeof token.document?.testInsideRegion !== "function") return false;

          return token.document.testInsideRegion(region);
        }),
      ),
      source: "regionObject",
    };
  }
}

function getRegionObject(region: RegionDocumentLike | RegionObjectLike): RegionObjectLike | null {
  return isRegionObject(region) ? region : region.object ?? null;
}

function isRegionObject(region: RegionDocumentLike | RegionObjectLike): region is RegionObjectLike {
  return "bounds" in region;
}

function uniqueTokens(tokens: TokenLike[]): TokenLike[] {
  const seen = new Set<string>();

  return tokens.filter((token) => {
    const key = token.uuid ?? token.id ?? token.document?.uuid ?? token.document?.id ?? token.name;
    if (!key) return true;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}
