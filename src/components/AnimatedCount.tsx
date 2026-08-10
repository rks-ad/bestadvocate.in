"use client";

import { useEffect, useRef, useState } from "react";

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

/** Smooth odometer-style tween between values with a flash on change. */
export function AnimatedCount({
  value,
  className,
}: {
  value: number | null;
  className?: string;
}) {
  const [display, setDisplay] = useState(value ?? 0);
  const [flash, setFlash] = useState(false);
  const fromRef = useRef(value ?? 0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === null) return;

    const from = fromRef.current;
    const to = value;
    if (from === to) {
      setDisplay(to);
      return;
    }

    setFlash(true);
    const flashTimer = window.setTimeout(() => setFlash(false), 450);

    const duration = Math.min(1400, Math.max(650, Math.abs(to - from) / 12));
    const start = performance.now();

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo-ish
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        setDisplay(to);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      window.clearTimeout(flashTimer);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  if (value === null) {
    return <span className={className}>—</span>;
  }

  return (
    <span
      className={`${className || ""} inline-block tabular-nums transition-[transform,filter] duration-300 ${
        flash ? "scale-110 brightness-125" : "scale-100"
      }`}
    >
      {formatCount(display)}
    </span>
  );
}
