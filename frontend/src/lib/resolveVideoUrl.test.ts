import { describe, it, expect } from "vitest";
import { resolveVideoUrl } from "@/lib/resolveVideoUrl";

describe("resolveVideoUrl", () => {
  it("resolves a YouTube link to its canonical watch URL", () => {
    const result = resolveVideoUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(result).toEqual({
      resolvedUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      urlType: "youtube",
      title: "Untitled Video",
    });
  });

  it("rewrites a Google Drive file link to the /preview embed", () => {
    const result = resolveVideoUrl(
      "https://drive.google.com/file/d/ABC123/view"
    );
    expect(result.urlType).toBe("gdrive");
    expect(result.resolvedUrl).toBe(
      "https://drive.google.com/file/d/ABC123/preview"
    );
  });

  it("derives a human title by URL-decoding the filename of a direct .mp4 link", () => {
    const result = resolveVideoUrl("https://cdn.example.com/My%20Movie.mp4");
    // Behavior is: decode the filename, keep the extension (it is not stripped)
    expect(result).toMatchObject({ urlType: "direct", title: "My Movie.mp4" });
  });

  it("falls back to a placeholder title when the path has no filename", () => {
    const result = resolveVideoUrl("https://cdn.example.com/folder/video.webm");
    expect(result.title).toBe("video.webm");
  });

  // Each storage provider gets its own urlType — one assertion per branch
  it.each([
    ["Backblaze B2", "https://f000.backblazeb2.com/file/bucket/clip.bin", "b2"],
    ["Cloudflare R2", "https://pub-abc.r2.dev/clip.bin", "r2"],
    ["Storj", "https://link.storjshare.io/s/clip.bin", "storj"],
  ])("classifies a %s host", (_label, input, expectedType) => {
    expect(resolveVideoUrl(input).urlType).toBe(expectedType);
  });

  // Every throw branch in the resolver is a case worth pinning down
  it.each([
    ["empty / whitespace input", "   "],
    ["a string that is not a URL", "just some text"],
    ["a non-http(s) protocol", "ftp://example.com/video.mp4"],
    ["an unsupported host with no video extension", "https://example.com/page.html"],
  ])("rejects %s", (_label, input) => {
    expect(() => resolveVideoUrl(input)).toThrow(/not supported/);
  });
});
