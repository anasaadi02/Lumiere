import { describe, it, expect } from "vitest";
import {
  getYouTubeVideoId,
  isYouTubeUrl,
  toYouTubeWatchUrl,
} from "@/lib/videoUtils";

describe("getYouTubeVideoId", () => {
  // Table-driven: each row is a documented happy-path case
  it.each([
    ["watch URL", "https://youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["short URL", "https://youtu.be/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["embed URL", "https://youtube.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    [
      "watch URL with extra params",
      "https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s",
      "dQw4w9WgXcQ",
    ],
    ["URL surrounded by whitespace", "  https://youtu.be/dQw4w9WgXcQ  ", "dQw4w9WgXcQ"],
  ])("extracts the id from a %s", (_label, input, expected) => {
    expect(getYouTubeVideoId(input)).toBe(expected);
  });

  // The negative cases are where the real bugs hide
  it.each([
    ["empty string", ""],
    ["non-URL text", "not a url"],
    ["a non-YouTube link", "https://vimeo.com/12345"],
    ["an id that is too short", "https://youtu.be/abc"],
  ])("returns null for %s", (_label, input) => {
    expect(getYouTubeVideoId(input)).toBeNull();
  });

  it("returns null for non-string input", () => {
    // @ts-expect-error — deliberately violating the type to exercise the runtime guard
    expect(getYouTubeVideoId(null)).toBeNull();
  });
});

describe("isYouTubeUrl", () => {
  it("is true for a recognizable YouTube URL", () => {
    expect(isYouTubeUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
  });

  it("is false for anything that is not a YouTube URL", () => {
    expect(isYouTubeUrl("https://vimeo.com/12345")).toBe(false);
  });
});

describe("toYouTubeWatchUrl", () => {
  it("normalizes any YouTube form to a canonical watch URL", () => {
    expect(toYouTubeWatchUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
  });

  it("returns null when the input is not a YouTube URL", () => {
    expect(toYouTubeWatchUrl("https://example.com/video.mp4")).toBeNull();
  });
});
