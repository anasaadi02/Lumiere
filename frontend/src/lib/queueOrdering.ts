/**
 * Pure queue-ordering logic — no React, no Supabase, no I/O.
 * These functions decide *what* should change; the component is responsible
 * for actually persisting the result. That split is what makes them testable.
 */

export type Positioned = { id: string; position: number };

/**
 * Work out how to move an item one step up or down in the queue.
 *
 * Returns the two position updates to persist (the item and its neighbour swap
 * positions), or `null` when the move is impossible — unknown id, or already at
 * the top/bottom. Returning null instead of throwing lets callers treat a no-op
 * as "do nothing".
 */
export function planReorder(
  items: Positioned[],
  itemId: string,
  direction: "up" | "down"
): Array<{ id: string; position: number }> | null {
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx < 0) return null;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= items.length) return null;

  const item = items[idx];
  const neighbour = items[swapIdx];
  return [
    { id: item.id, position: neighbour.position },
    { id: neighbour.id, position: item.position },
  ];
}
