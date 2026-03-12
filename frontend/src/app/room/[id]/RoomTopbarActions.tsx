"use client";

import { useState } from "react";
import Link from "next/link";
import { ShareIcon, LeaveIcon } from "@/components/Icons";

type Props = {
  roomId: string;
};

export function RoomTopbarActions({ roomId }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <button
        type="button"
        className="room-topbar-btn"
        title="Share room"
        onClick={handleShare}
      >
        <ShareIcon size={16} />
        <span>{copied ? "Copied!" : "Share"}</span>
      </button>
      <Link
        href="/"
        className="room-topbar-btn room-topbar-btn--leave"
        title="Leave room"
      >
        <LeaveIcon size={16} />
        <span>Leave</span>
      </Link>
    </>
  );
}
