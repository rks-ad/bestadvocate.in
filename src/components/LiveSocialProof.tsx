"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, PanInfo, useMotionValue } from "framer-motion";
import { buildUniqueNamePool } from "@/lib/indian-names";

type ToastItem = {
  id: string;
  name: string;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function LiveSocialProof() {
  const [liveViewers, setLiveViewers] = useState<number | null>(null);
  const [totalHits, setTotalHits] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const namesRef = useRef<string[]>([]);
  const nameIndexRef = useRef(0);
  const seenLiveRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    namesRef.current = buildUniqueNamePool();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function poll() {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        const json = (await res.json()) as {
          ok?: boolean;
          liveViewers?: number;
          totalHits?: number;
          nextTickMs?: number;
        };
        if (!cancelled && json.ok && typeof json.totalHits === "number") {
          setTotalHits(json.totalHits);
          if (typeof json.liveViewers === "number") {
            seenLiveRef.current.add(json.liveViewers);
            setLiveViewers(json.liveViewers);
          }
        }
        const wait = Math.max(json.nextTickMs || 7000, 4000);
        if (!cancelled) timer = setTimeout(poll, wait);
      } catch {
        if (!cancelled) timer = setTimeout(poll, 8000);
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    function nextName() {
      const pool = namesRef.current;
      if (!pool.length) return null;
      if (nameIndexRef.current >= pool.length) return null;
      const name = pool[nameIndexRef.current];
      nameIndexRef.current += 1;
      return name;
    }

    function pushToast() {
      const name = nextName();
      if (!name || cancelled) return;
      const id = `${Date.now()}-${nameIndexRef.current}`;
      setToasts((prev) => [{ id, name }, ...prev].slice(0, 3));
    }

    const first = window.setTimeout(pushToast, 1800);
    const interval = window.setInterval(pushToast, 6500);

    return () => {
      cancelled = true;
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, []);

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <>
      <div className="pointer-events-none absolute top-4 right-4 z-20 flex flex-col items-end gap-2 sm:top-5 sm:right-6">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-black/35 px-3 py-2 text-right shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-mint uppercase">
            Live on site
          </p>
          <p className="font-display text-xl font-bold text-white tabular-nums sm:text-2xl">
            {liveViewers === null ? "—" : formatCount(liveViewers)}
            <span className="ml-1 text-xs font-semibold tracking-normal text-white/55">
              viewing
            </span>
          </p>
        </div>
        <div className="pointer-events-auto rounded-2xl border border-mint/25 bg-mint/10 px-3 py-2 text-right shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-mint-hot uppercase">
            Total hits till date
          </p>
          <p className="font-display text-xl font-bold text-mint-hot tabular-nums sm:text-2xl">
            {totalHits === null ? "—" : formatCount(totalHits)}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-16 left-3 z-30 flex w-[min(100%-1.5rem,280px)] flex-col gap-2 sm:bottom-20 sm:left-6">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <SwipeToast key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function SwipeToast({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const x = useMotionValue(0);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) {
      onDismiss(toast.id);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 7000);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      drag="x"
      dragConstraints={{ left: -160, right: 40 }}
      dragElastic={0.2}
      style={{ x }}
      onDragEnd={onDragEnd}
      className="pointer-events-auto cursor-grab active:cursor-grabbing rounded-2xl border border-white/10 bg-white px-3.5 py-3 text-ink shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/15 text-sm font-bold text-teal">
          {toast.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{toast.name}</p>
          <p className="text-xs leading-snug text-muted">
            booked a consultation just now
          </p>
          <p className="mt-1 text-[10px] tracking-wide text-teal/80">Swipe to dismiss</p>
        </div>
      </div>
    </motion.div>
  );
}
