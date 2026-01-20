export const TIER_ORDER = [
  "Starter Sync",
  "Builder Sync",
  "Operator Sync",
  "Empire Sync",
];

export function tierRank(tier) {
  const idx = TIER_ORDER.indexOf(tier);
  return idx === -1 ? 0 : idx;
}

export function hasTierAccess(userTier, requiredTier) {
  return tierRank(userTier) >= tierRank(requiredTier);
}
