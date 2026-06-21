import { describe, it, expect } from "vitest";
import { planReorder, type Positioned } from "@/lib/queueOrdering";

// A small fixture builder keeps each test focused on the one thing it checks
function queue(): Positioned[] {
  return [
    { id: "a", position: 0 },
    { id: "b", position: 1 },
    { id: "c", position: 2 },
  ];
}

describe("planReorder", () => {
  it("swaps a middle item with the one above it when moving up", () => {
    expect(planReorder(queue(), "b", "up")).toEqual([
      { id: "b", position: 0 },
      { id: "a", position: 1 },
    ]);
  });

  it("swaps a middle item with the one below it when moving down", () => {
    expect(planReorder(queue(), "b", "down")).toEqual([
      { id: "b", position: 2 },
      { id: "c", position: 1 },
    ]);
  });

  // The edge cases are the whole reason this function exists
  it("returns null when moving the first item up", () => {
    expect(planReorder(queue(), "a", "up")).toBeNull();
  });

  it("returns null when moving the last item down", () => {
    expect(planReorder(queue(), "c", "down")).toBeNull();
  });

  it("returns null for an item that is not in the queue", () => {
    expect(planReorder(queue(), "does-not-exist", "up")).toBeNull();
  });

  it("returns null for an empty queue", () => {
    expect(planReorder([], "a", "up")).toBeNull();
  });
});
