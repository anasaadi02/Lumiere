import { getYouTubeVideoId, toYouTubeWatchUrl } from "@/lib/videoUtils";

export type ResolvedVideo = {
  resolvedUrl: string;
  urlType: "youtube" | "direct" | "gdrive" | "b2" | "r2" | "storj" | "unknown";
  title: string;
};

function titleFromUrl(url: URL): string {
  const segments = url.pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last) return "Untitled Video";
  if (!last.includes(".")) return "Untitled Video";
  try {
    const decoded = decodeURIComponent(last.split("?")[0] ?? last);
    return decoded.trim() || "Untitled Video";
  } catch {
    return last || "Untitled Video";
  }
}

/**
 * Pure URL resolver — no I/O. Maps pasted URLs to a canonical stream URL and metadata.
 */
export function resolveVideoUrl(input: string): ResolvedVideo {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error(
      "This URL is not supported. Please use a direct video link or a supported platform."
    );
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(
      "This URL is not supported. Please use a direct video link or a supported platform."
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      "This URL is not supported. Please use a direct video link or a supported platform."
    );
  }

  const href = url.href;
  const host = url.hostname.toLowerCase();
  const pathLower = url.pathname.toLowerCase();

  const ytId = getYouTubeVideoId(trimmed);
  if (ytId) {
    const watch = toYouTubeWatchUrl(trimmed);
    if (!watch) {
      throw new Error(
        "This URL is not supported. Please use a direct video link or a supported platform."
      );
    }
    return {
      resolvedUrl: watch,
      urlType: "youtube",
      title: "Untitled Video",
    };
  }

  if (host === "drive.google.com" || host.endsWith(".drive.google.com")) {
    const m = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m) {
      const id = m[1];
      return {
        // /preview embeds Google's own player via iframe — avoids CORS and virus-warning pages
        resolvedUrl: `https://drive.google.com/file/d/${id}/preview`,
        urlType: "gdrive",
        title: "Google Drive Video",
      };
    }
  }

  if (/\.(mp4|webm|mkv|m3u8)$/i.test(pathLower)) {
    return {
      resolvedUrl: href,
      urlType: "direct",
      title: titleFromUrl(url),
    };
  }

  if (
    host === "backblazeb2.com" ||
    host.endsWith(".backblazeb2.com")
  ) {
    return {
      resolvedUrl: href,
      urlType: "b2",
      title: titleFromUrl(url),
    };
  }

  if (host.endsWith(".r2.dev") || host.endsWith(".r2.cloudflarestorage.com")) {
    return {
      resolvedUrl: href,
      urlType: "r2",
      title: titleFromUrl(url),
    };
  }

  if (host.includes("storjshare.io") || host.includes("storj")) {
    return {
      resolvedUrl: href,
      urlType: "storj",
      title: titleFromUrl(url),
    };
  }

  throw new Error(
    "This URL is not supported. Please use a direct video link or a supported platform."
  );
}
