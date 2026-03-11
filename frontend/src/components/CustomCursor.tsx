"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0,
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
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const expand = () => {
      cursor.style.width = "16px";
      cursor.style.height = "16px";
      ring.style.width = "52px";
      ring.style.height = "52px";
    };

    const shrink = () => {
      cursor.style.width = "10px";
      cursor.style.height = "10px";
      ring.style.width = "36px";
      ring.style.height = "36px";
    };

    const attach = () => {
      document
        .querySelectorAll("a, button, .feature-card")
        .forEach((el) => {
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
      document.querySelectorAll("a, button, .feature-card").forEach((el) => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
