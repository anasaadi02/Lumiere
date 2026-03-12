"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { SendIcon } from "@/components/Icons";

type Message = {
  id: string;
  room_id: string;
  nickname: string;
  content: string;
  created_at: string;
};

type Props = {
  roomId: string;
  nickname: string;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function RoomChat({ roomId, nickname }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, room_id, nickname, content, created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      setMessages(data ?? []);
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (!newMsg) return;
          setMessages((prev) => {
            const idx = prev.findIndex(
              (m) =>
                m.id.startsWith("pending-") &&
                m.content === newMsg.content &&
                m.nickname === newMsg.nickname
            );
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = newMsg;
              return updated;
            }
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    const displayName = nickname || "Anonymous";
    const tempId = `pending-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        room_id: roomId,
        nickname: displayName,
        content: text,
        created_at: new Date().toISOString(),
      },
    ]);
    setInput("");

    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      room_id: roomId,
      nickname: displayName,
      content: text,
    });

    setSending(false);
    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  }

  return (
    <>
      <div className="room-sidebar-header">
        <span>Chat</span>
      </div>
      <div className="room-chat-messages">
        {messages.length === 0 ? (
          <p className="room-chat-empty">No messages yet. Say something!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="room-chat-msg">
              <span className="room-chat-user">{msg.nickname}</span>
              <span className="room-chat-time">{formatTime(msg.created_at)}</span>
              <p className="room-chat-text">{msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="room-chat-form" onSubmit={handleSubmit}>
        <input
          className="room-chat-input"
          type="text"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          autoComplete="off"
        />
        <button
          type="submit"
          className="room-chat-send"
          title="Send"
          disabled={sending || !input.trim()}
        >
          <SendIcon size={14} />
        </button>
      </form>
    </>
  );
}
