import type { WorkflowTarget } from "../../../core/workflow/workflow-context";
import { createWorkflowTargetFromToken } from "../../automation/workflow-target-resolver";
import { FoundryRegionAdapter } from "./foundry-region-adapter";
import type {
  RegionPlacementChange,
  RegionTargetResolutionResult,
  RegionTargetTokenResolutionResult,
} from "./region-targeting-types";

const DEBUG_REGION_TARGETING = false;

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
    return this.resolveFirstRegionCandidate(getPreviewRegionCandidates(change), "preview");
  }

  resolveTargetTokens(region: RegionDocumentLike | RegionObjectLike): RegionTargetTokenResolutionResult {
    return this.resolveFirstRegionCandidate(getFinalRegionCandidates(region), "final");
  }

  private resolveFirstRegionCandidate(
    candidates: RegionCandidate[],
    phase: "preview" | "final",
  ): RegionTargetTokenResolutionResult {
    debugRegionTargeting("Region targeting candidates.", {
      phase,
      candidates: candidates.map((candidate) => ({
        source: candidate.source,
        hasBounds: hasBounds(candidate.region),
      })),
    });

    for (const candidate of candidates) {
      if (!hasBounds(candidate.region)) continue;

      const result = this.resolveRegionObjectTargetTokens(candidate.region);
      debugRegionTargeting("Region targeting resolved candidate.", {
        phase,
        source: candidate.source,
        targetCount: result.tokens.length,
      });
      return result;
    }

    return { tokens: [], source: "regionObjectUnavailable" };
  }

  private resolveRegionObjectTargetTokens(region: RegionObjectLike | RegionDocumentLike): RegionTargetTokenResolutionResult {
    if (!region.bounds) return { tokens: [], source: "regionObjectUnavailable" };

    const candidates = this.foundryAdapter.getTokensInBounds(region.bounds);
    const tokens = uniqueTokens(
      candidates.filter((token) => {
        if (!token.actor) return false;
        if (typeof token.document?.testInsideRegion !== "function") return false;

        return token.document.testInsideRegion(region);
      }),
    );

    debugRegionTargeting("Region targeting quadtree result.", {
      candidateCount: candidates.length,
      targetCount: tokens.length,
    });

    return { tokens, source: "regionObject" };
  }
}

type RegionCandidate = {
  source: string;
  region: RegionObjectLike | RegionDocumentLike | null;
};

function getPreviewRegionCandidates(change: RegionPlacementChange): RegionCandidate[] {
  return [
    { source: "document", region: getBoundsRegionCandidate(change.document) },
    { source: "document.object", region: getBoundsRegionCandidate(change.document.object) },
    { source: "preview", region: getBoundsRegionCandidate(change.preview) },
    { source: "preview.document.object", region: getBoundsRegionCandidate(change.preview?.document?.object) },
  ];
}

function getFinalRegionCandidates(region: RegionDocumentLike | RegionObjectLike): RegionCandidate[] {
  return [
    { source: "input", region: getBoundsRegionCandidate(region) },
    { source: "input.object", region: isRegionDocument(region) ? getBoundsRegionCandidate(region.object) : null },
    { source: "input.document.object", region: isRegionObject(region) ? getBoundsRegionCandidate(region.document?.object) : null },
  ];
}

function getBoundsRegionCandidate(value: unknown): RegionObjectLike | RegionDocumentLike | null {
  return hasBounds(value) ? value : null;
}

function hasBounds(value: unknown): value is RegionObjectLike | RegionDocumentLike {
  if (!value || typeof value !== "object") return false;
  const bounds = (value as { bounds?: unknown }).bounds;
  if (!bounds || typeof bounds !== "object") return false;

  const candidate = bounds as Partial<BoundsLike>;
  return (
    isFiniteNumber(candidate.x) &&
    isFiniteNumber(candidate.y) &&
    isFiniteNumber(candidate.width) &&
    isFiniteNumber(candidate.height)
  );
}

function isRegionObject(region: RegionObjectLike | RegionDocumentLike): region is RegionObjectLike {
  return "document" in region && "bounds" in region;
}

function isRegionDocument(region: RegionObjectLike | RegionDocumentLike): region is RegionDocumentLike {
  return !isRegionObject(region);
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

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function debugRegionTargeting(message: string, data: Record<string, unknown>): void {
  if (!DEBUG_REGION_TARGETING) return;
  console.debug(`Paranormal Toolkit: ${message}`, data);
}
