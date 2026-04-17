const MAX_REMEMBERED = 6;

/**
 * Update quickbar history when inventory changes.
 * Pushes `itemId` to front, dedupes, keeps 6.
 * If an item is fully used up (qty=0), it stays in history
 * but won't be shown (UI filters by qty > 0).
 */
export function pushToQuickbar(quickbar: string[], itemId: string): string[] {
  const filtered = quickbar.filter((id) => id !== itemId);
  return [itemId, ...filtered].slice(0, MAX_REMEMBERED);
}

/**
 * Get visible quickbar items (top 3 that are still in inventory).
 */
export function visibleQuickbar(
  quickbar: string[],
  inventory: Record<string, number>,
): string[] {
  return quickbar
    .filter((id) => (inventory[id] ?? 0) > 0)
    .slice(0, 3);
}
