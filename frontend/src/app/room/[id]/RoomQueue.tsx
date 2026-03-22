"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { QueueIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from "@/components/Icons";
import { AddVideoUrl } from "@/components/AddVideoUrl";

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
  isHost?: boolean;
};

const LABELS: Record<number, string> = {
  0: "Now Playing",
  1: "Up Next",
};

function getLabel(position: number): string {
  return LABELS[position] ?? "Queued";
}

export function RoomQueue({ roomId, isHost = false }: Props) {
  const [items, setItems] = useState<QueueItem[]>([]);

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
          event: "*",
          schema: "public",
          table: "queue_items",
          filter: `room_id=eq.${roomId}`,
        },
        () => fetchQueue()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  async function addToQueue(url: string, title: string) {
    const tempId = `pending-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      {
        id: tempId,
        room_id: roomId,
        title,
        src: url,
        position: prev.length,
        created_at: new Date().toISOString(),
      },
    ]);

    const supabase = createClient();
    const { error } = await supabase.from("queue_items").insert({
      room_id: roomId,
      title,
      src: url,
    });

    if (error) {
      setItems((prev) => prev.filter((i) => i.id !== tempId));
    }
  }

  async function handleRemove(itemId: string) {
    if (!isHost) return;
    const isPending = itemId.startsWith("pending-");
    const prevItems = [...items];
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    if (isPending) return;
    const supabase = createClient();
    const { error } = await supabase.from("queue_items").delete().eq("id", itemId);
    if (error) {
      setItems(prevItems);
      console.error("[queue] delete failed:", error.message);
    }
  }

  async function handleMoveUp(item: QueueItem) {
    if (!isHost) return;
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx <= 0) return;
    const prev = items[idx - 1];
    const supabase = createClient();
    await supabase
      .from("queue_items")
      .update({ position: prev.position })
      .eq("id", item.id);
    await supabase
      .from("queue_items")
      .update({ position: item.position })
      .eq("id", prev.id);
  }

  async function handleMoveDown(item: QueueItem) {
    if (!isHost) return;
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx < 0 || idx >= items.length - 1) return;
    const next = items[idx + 1];
    const supabase = createClient();
    await supabase
      .from("queue_items")
      .update({ position: next.position })
      .eq("id", item.id);
    await supabase
      .from("queue_items")
      .update({ position: item.position })
      .eq("id", next.id);
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
          items.map((item, idx) => (
            <li
              key={item.id}
              className={`room-queue-item${idx === 0 ? " room-queue-item--active" : ""}`}
            >
              <div className="room-queue-dot" />
              <div className="room-queue-info">
                <span className="room-queue-label">
                  {getLabel(idx)}
                </span>
                <span className="room-queue-src">{item.title}</span>
              </div>
              {isHost && (
                <div className="room-queue-actions">
                  <button
                    type="button"
                    className="room-queue-action-btn"
                    title="Move up"
                    onClick={() => handleMoveUp(item)}
                    disabled={items.findIndex((i) => i.id === item.id) <= 0}
                  >
                    <ChevronUpIcon size={12} />
                  </button>
                  <button
                    type="button"
                    className="room-queue-action-btn"
                    title="Move down"
                    onClick={() => handleMoveDown(item)}
                    disabled={items.findIndex((i) => i.id === item.id) >= items.length - 1}
                  >
                    <ChevronDownIcon size={12} />
                  </button>
                  <button
                    type="button"
                    className="room-queue-action-btn room-queue-action-btn--danger"
                    title="Remove"
                    onClick={() => handleRemove(item.id)}
                  >
                    <TrashIcon size={12} />
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>

      {isHost && (
        <AddVideoUrl onResolved={(resolvedUrl, title) => void addToQueue(resolvedUrl, title)} />
      )}
      {!isHost && (
        <p className="room-queue-hint">Only the host can manage the queue</p>
      )}
    </>
  );
}
