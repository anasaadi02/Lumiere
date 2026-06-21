import { describe, it, expect } from "vitest";
import { getLabel } from "@/lib/queueLabels";

describe("getLabel", () => {
  it("labels position 0 as Now Playing", () => {
    expect(getLabel(0)).toBe("Now Playing");
  });

  it("labels position 1 as Up Next", () => {
    expect(getLabel(1)).toBe("Up Next");
  });

  it("labels any later position as Queued", () => {
    expect(getLabel(5)).toBe("Queued");
  });
});