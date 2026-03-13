"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mx = 0,
      my = 0,
      active = true;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    document.addEventListener("mousemove", onMouseMove);

    const tick = () => {
      if (!active) return;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const expand = () => {
      cursor.style.width = "16px";
      cursor.style.height = "16px";
    };

    const shrink = () => {
      cursor.style.width = "10px";
      cursor.style.height = "10px";
    };

    const selector =
      "a, button, input, textarea, select, label, [role='button'], .feature-card, .dash-action-card, .room-progress-bar, .room-volume-slider";

    const attach = () => {
      document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener("mouseenter", expand);
        el.addEventListener("mouseleave", shrink);
      });
    };

    attach();

    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      active = false;
      document.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      document.querySelectorAll(selector).forEach((el) => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return <div ref={cursorRef} className="cursor" />;
}
