"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { QueueIcon, PlusIcon } from "@/components/Icons";

type QueueItem = {
  id: string;
  room_id: string;
  title: string;
  src: string;
  position: number;
  created_at: string;
};

type Props = {
  roomId: string;
};

const LABELS: Record<number, string> = {
  0: "Now Playing",
  1: "Up Next",
};

function getLabel(position: number): string {
  return LABELS[position] ?? "Queued";
}

export function RoomQueue({ roomId }: Props) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const fetchQueue = async () => {
      const { data } = await supabase
        .from("queue_items")
        .select("id, room_id, title, src, position, created_at")
        .eq("room_id", roomId)
        .order("position", { ascending: true });
      setItems(data ?? []);
    };

    fetchQueue();

    const channel = supabase
      .channel(`queue:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "queue_items",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newItem = payload.new as QueueItem;
          if (!newItem) return;
          setItems((prev) => {
            const exists = prev.some((i) => i.id === newItem.id);
            if (exists) return prev;
            const idx = prev.findIndex(
              (i) => i.id.startsWith("pending-") && i.title === newItem.title
            );
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = newItem;
              return updated.sort((a, b) => a.position - b.position);
            }
            return [...prev, newItem].sort((a, b) => a.position - b.position);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value || adding) return;

    setAdding(true);
    const tempId = `pending-${Date.now()}`;

    setItems((prev) => [
      ...prev,
      {
        id: tempId,
        room_id: roomId,
        title: value,
        src: value,
        position: prev.length,
        created_at: new Date().toISOString(),
      },
    ]);
    setInput("");

    const supabase = createClient();
    const { error } = await supabase.from("queue_items").insert({
      room_id: roomId,
      title: value,
      src: value,
    });

    setAdding(false);
    if (error) {
      setItems((prev) => prev.filter((i) => i.id !== tempId));
    }
  }

  return (
    <>
      <div className="room-sidebar-header">
        <QueueIcon size={14} />
        <span>Queue</span>
      </div>

      <ul className="room-queue">
        {items.length === 0 ? (
          <li className="room-queue-empty">Queue is empty</li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className={`room-queue-item${item.position === 0 ? " room-queue-item--active" : ""}`}
            >
              <div className="room-queue-dot" />
              <div className="room-queue-info">
                <span className="room-queue-label">
                  {getLabel(item.position)}
                </span>
                <span className="room-queue-src">{item.title}</span>
              </div>
            </li>
          ))
        )}
      </ul>

      <form className="room-queue-add" onSubmit={handleAdd}>
        <input
          className="room-queue-input"
          type="text"
          placeholder="Paste a link or title..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={adding}
          autoComplete="off"
        />
        <button
          type="submit"
          className="room-queue-btn"
          title="Add to queue"
          disabled={adding || !input.trim()}
        >
          <PlusIcon size={14} />
        </button>
      </form>
    </>
  );
}
