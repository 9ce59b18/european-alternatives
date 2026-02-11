import type { Alternative } from '../types';
import { manualAlternatives } from './manualAlternatives';
import { researchAlternatives } from './researchAlternatives';
import { reservationsById } from './trustOverrides';
import { calculateTrustScore } from '../utils/trustScore';
import { buildUSVendorComparisons } from './usVendors';

function mergeCatalogue(): Alternative[] {
  const deduped = new Map<string, Alternative>();

  for (const alternative of [...manualAlternatives, ...researchAlternatives]) {
    // Manual entries win if IDs collide in future updates.
    if (!deduped.has(alternative.id)) {
      deduped.set(alternative.id, alternative);
    }
  }

  const merged = Array.from(deduped.values()).map((alternative) => {
    const reservations = alternative.reservations ?? reservationsById[alternative.id] ?? [];
    const trustScore = calculateTrustScore({
      country: alternative.country,
      isOpenSource: alternative.isOpenSource,
      openSourceLevel: alternative.openSourceLevel,
      tags: alternative.tags,
      reservations,
    });

    return {
      ...alternative,
      logo: alternative.logo ?? `/logos/${alternative.id}.svg`,
      reservations,
      usVendorComparisons: buildUSVendorComparisons(alternative.replacesUS),
      trustScoreStatus: 'pending' as const,
      trustScoreBreakdown: trustScore.breakdown,
    };
  });

  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

export const alternatives: Alternative[] = mergeCatalogue();
