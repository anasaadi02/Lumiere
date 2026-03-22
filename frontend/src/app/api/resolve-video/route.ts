import { NextResponse } from "next/server";
import { resolveVideoUrl, type ResolvedVideo } from "@/lib/resolveVideoUrl";

const UNSUPPORTED_MSG =
  "This URL is not supported. Please use a direct video link or a supported platform.";

function isHttpOrHttps(u: string): boolean {
  try {
    const { protocol } = new URL(u);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

function isAllowedVideoContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  const base = contentType.toLowerCase().split(";")[0]?.trim() ?? "";
  if (base.startsWith("video/")) return true;
  if (base === "application/octet-stream") return true;
  if (base === "application/vnd.apple.mpegurl") return true;
  if (base === "application/x-mpegurl") return true;
  return false;
}

const DRIVE_QUOTA_SNIPPETS = [
  "quota exceeded",
  "download quota",
  "too many users have viewed",
  "cannot download",
];

function looksLikeDriveQuotaHtml(body: string): boolean {
  const lower = body.toLowerCase();
  return DRIVE_QUOTA_SNIPPETS.some((s) => lower.includes(s));
}

async function fetchYouTubeOembedTitle(watchUrl: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`
    );
    if (!res.ok) return "Untitled Video";
    const data = (await res.json()) as { title?: string };
    return data.title?.trim() || "Untitled Video";
  } catch {
    return "Untitled Video";
  }
}

async function probeUrl(resolvedUrl: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  if (!isHttpOrHttps(resolvedUrl)) {
    return { ok: false, error: "URL must use http or https." };
  }

  let res = await fetch(resolvedUrl, {
    method: "HEAD",
    redirect: "follow",
    headers: { Accept: "*/*" },
  }).catch(() => null);

  if (!res) {
    return {
      ok: false,
      error: "Could not reach this URL. Check the link and try again.",
    };
  }

  if (res.status === 405 || res.status === 501) {
    res = await fetch(resolvedUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "*/*",
        Range: "bytes=0-0",
      },
    }).catch(() => null);

    if (!res) {
      return {
        ok: false,
        error: "Could not reach this URL. Check the link and try again.",
      };
    }
  }

  if (res.status === 404 || res.status === 403) {
    return {
      ok: false,
      error: "This URL is unreachable or access was denied.",
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      error: "This URL is unreachable or access was denied.",
    };
  }

  let ct = res.headers.get("content-type");

  if (ct?.toLowerCase().includes("text/html")) {
    const full = await fetch(resolvedUrl, {
      method: "GET",
      redirect: "follow",
      headers: { Accept: "text/html,*/*" },
    }).catch(() => null);

    if (full?.ok) {
      const text = await full.text().catch(() => "");
      if (looksLikeDriveQuotaHtml(text)) {
        return {
          ok: false,
          error:
            "Google Drive download quota may be exceeded for this file. Try another link or host.",
        };
      }
    }
    return {
      ok: false,
      error:
        "The server returned a web page instead of a video. Check sharing settings or use a direct file URL.",
    };
  }

  if (!isAllowedVideoTypeOrUnknown(ct)) {
    const rangeProbe = await fetch(resolvedUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "*/*",
        Range: "bytes=0-0",
      },
    }).catch(() => null);

    const ct2 = rangeProbe?.headers.get("content-type") ?? null;
    if (rangeProbe?.ok && isAllowedVideoTypeOrUnknown(ct2)) {
      return { ok: true };
    }

    return {
      ok: false,
      error:
        "The server did not return a playable video type. Use a direct video or stream URL.",
    };
  }

  return { ok: true };
}

function isAllowedVideoTypeOrUnknown(ct: string | null): boolean {
  if (!ct) return true;
  return isAllowedVideoContentType(ct);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const url =
    typeof body === "object" &&
    body !== null &&
    "url" in body &&
    typeof (body as { url: unknown }).url === "string"
      ? (body as { url: string }).url.trim()
      : "";

  if (!url) {
    return NextResponse.json({ error: "Missing url in request body." }, { status: 400 });
  }

  let resolved: ResolvedVideo;
  try {
    resolved = resolveVideoUrl(url);
  } catch (e) {
    const message = e instanceof Error ? e.message : UNSUPPORTED_MSG;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!isHttpOrHttps(resolved.resolvedUrl)) {
    return NextResponse.json(
      { error: "URL must use http or https." },
      { status: 400 }
    );
  }

  if (resolved.urlType === "youtube") {
    const title = await fetchYouTubeOembedTitle(resolved.resolvedUrl);
    return NextResponse.json({
      resolvedUrl: resolved.resolvedUrl,
      urlType: resolved.urlType,
      title,
      valid: true as const,
    });
  }

  // Google Drive preview iframes can't be HEAD-probed — the /preview endpoint returns HTML
  // by design and is only meaningful inside a browser iframe. Skip probing like YouTube.
  if (resolved.urlType === "gdrive") {
    return NextResponse.json({
      resolvedUrl: resolved.resolvedUrl,
      urlType: resolved.urlType,
      title: resolved.title,
      valid: true as const,
    });
  }

  const probe = await probeUrl(resolved.resolvedUrl);
  if (!probe.ok) {
    return NextResponse.json({ error: probe.error }, { status: 400 });
  }

  return NextResponse.json({
    resolvedUrl: resolved.resolvedUrl,
    urlType: resolved.urlType,
    title: resolved.title,
    valid: true as const,
  });
}
