"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

const BALL_SIZE = 320;
type WRef = RefObject<HTMLDivElement | null>;

export default function InversionCircleScrollAnimation({ children }: { children?: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Styles />
      <div ref={wrapperRef} className="icsa-wrap">
        <HeroSection wrapperRef={wrapperRef} />
        {children}
      </div>
    </>
  );
}

function HeroSection({ wrapperRef }: { wrapperRef: WRef }) {
  const [scrollY, setScrollY] = useState(0);
  const [viewH, setViewH] = useState(600);
  const [viewW, setViewW] = useState(800);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      setViewH(el.clientHeight);
      setViewW(el.clientWidth);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const onScroll = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [wrapperRef]);

  const progress = clamp(scrollY / (viewH * 2));
  const easedScale = progress < 0.5
    ? 4 * progress ** 3
    : 1 - (-2 * progress + 2) ** 3 / 2;
  const coverSize = Math.max(viewW, viewH) * 2.8;
  const ballSize = BALL_SIZE + easedScale * (coverSize - BALL_SIZE);
  const clipRadius = ballSize / 2;

  return (
    <div className="icsa-track">
      <section className="icsa-hero" aria-labelledby="hero-title">
        <div
          className="icsa-ball"
          aria-hidden="true"
          style={{
            width: ballSize,
            height: ballSize,
            transform: 'translate(-50%, -50%)',
          }}
        />

        <div className="icsa-layer icsa-dark">
          <h1 id="hero-title">Design that moves.</h1>
          <p>Scroll to reveal the future.</p>
        </div>

        <div
          className="icsa-layer icsa-light"
          aria-hidden="true"
          style={{
            clipPath: `circle(${clipRadius}px at ${viewW / 2}px ${viewH / 2}px)`,
          }}
        >
          <h1>Design that moves.</h1>
          <p>Scroll to reveal the future.</p>
        </div>
      </section>
    </div>
  );
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function Styles() {
  return (
    <style>{`
      .icsa-wrap *, .icsa-wrap *::before, .icsa-wrap *::after {
        box-sizing: border-box; margin: 0; padding: 0;
      }
      .icsa-wrap {
        width: 100%; height: 100svh;
        overflow-y: auto; overflow-x: clip;
        overscroll-behavior: contain;
        font-family: Inter, sans-serif;
        background: #fff;
      }
      .icsa-track { height: 300vh; position: relative; }
      .icsa-hero {
        position: sticky; top: 0;
        height: 100svh; overflow: hidden;
      }
      .icsa-ball {
        position: absolute; top: 50%; left: 50%;
        border-radius: 50%; background: #000;
        will-change: transform, width, height;
      }
      .icsa-layer {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        text-align: center; padding: 0 2rem;
        pointer-events: none;
      }
      .icsa-dark { color: #000; z-index: 2; }
      .icsa-light { color: #fff; z-index: 3; will-change: clip-path; }
      .icsa-layer h1 {
        color: inherit;
        font-size: clamp(2.5rem, 7vw, 6rem);
        font-weight: 900; letter-spacing: -0.03em; line-height: 1.05;
      }
      .icsa-layer p {
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        font-weight: 400; margin-top: 1.25rem; opacity: .7;
      }
    `}</style>
  );
}
