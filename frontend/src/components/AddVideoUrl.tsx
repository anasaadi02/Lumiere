"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/Icons";

type Props = {
  onResolved: (resolvedUrl: string, title: string) => void;
  disabled?: boolean;
};

export function AddVideoUrl({ onResolved, disabled = false }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = value.trim();
    if (!url || loading || disabled) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/resolve-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = (await res.json()) as
        | { valid: true; resolvedUrl: string; title: string }
        | { error: string };

      if (!res.ok || !("valid" in data) || !data.valid) {
        const msg =
          "error" in data && typeof data.error === "string"
            ? data.error
            : "Could not validate this URL.";
        setError(msg);
        return;
      }

      onResolved(data.resolvedUrl, data.title);
      setValue("");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-video-url">
      <form className="room-queue-add" onSubmit={handleSubmit}>
        <input
          className="room-queue-input"
          type="url"
          inputMode="url"
          placeholder="Paste a video link…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading || disabled}
          autoComplete="off"
        />
        <button
          type="submit"
          className="room-queue-btn"
          title="Add to queue"
          disabled={loading || disabled || !value.trim()}
        >
          <PlusIcon size={14} />
        </button>
      </form>
      {error && <p className="add-video-url-error">{error}</p>}

      <div className="add-video-url-help">
        <button
          type="button"
          className="add-video-url-help-toggle"
          onClick={() => setHelpOpen((o) => !o)}
          aria-expanded={helpOpen}
        >
          <span>Supported platforms</span>
          <span className="add-video-url-help-caret">{helpOpen ? "▴" : "▾"}</span>
        </button>
        {helpOpen && (
          <div className="add-video-url-help-list">
            {[
              { name: "YouTube", desc: "Any youtube.com or youtu.be link." },
              { name: "Google Drive", desc: "File → Share link — resolved server-side to a direct download URL." },
              { name: "Backblaze B2", desc: <>Public URL on <span className="avc">*.backblazeb2.com</span> — paste as-is.</> },
              { name: "Cloudflare R2", desc: <>Public <span className="avc">*.r2.dev</span> URL (object must be publicly readable).</> },
              { name: "Storj", desc: <>Public share link, e.g. <span className="avc">link.storjshare.io</span>.</> },
              { name: "Direct file", desc: <>Link ending in <span className="avc">.mp4</span>, <span className="avc">.webm</span>, <span className="avc">.mkv</span>, or <span className="avc">.m3u8</span>.</> },
            ].map(({ name, desc }) => (
              <div key={name} className="add-video-url-help-row">
                <span className="add-video-url-help-name">{name}</span>
                <span className="add-video-url-help-desc">{desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
