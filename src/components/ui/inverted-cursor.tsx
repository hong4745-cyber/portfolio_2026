"use client";

import { useEffect, useRef, useState } from "react";

interface CursorProps { size?: number }

export function Cursor({ size = 60 }: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: -size, y: -size });
  const targetRef = useRef({ x: -size, y: -size });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const handleMouseMove = (event: MouseEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      setVisible(true);
    };
    const handleMouseLeave = () => setVisible(false);
    let frame = 0;
    const animate = () => {
      const current = positionRef.current;
      const target = targetRef.current;
      current.x += (target.x - size / 2 - current.x) * 0.2;
      current.y += (target.y - size / 2 - current.y) * 0.2;
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${current.x}px, ${current.y}px)`;
      frame = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.body.style.cursor = "none";
    frame = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.body.style.cursor = "auto";
      cancelAnimationFrame(frame);
    };
  }, [size]);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-white mix-blend-difference transition-opacity duration-300"
      style={{ width: size, height: size, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}

export default Cursor;
