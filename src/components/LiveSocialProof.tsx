"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, PanInfo, useMotionValue } from "framer-motion";
import { buildUniqueNamePool } from "@/lib/indian-names";
import { AnimatedCount } from "./AnimatedCount";

type ToastItem = {
  id: string;
  name: string;
};

export function useSiteStats() {
  const [liveViewers, setLiveViewers] = useState<number | null>(null);
  const [totalHits, setTotalHits] = useState<number | null>(null);
  const seenLiveRef = useRef<Set<number>>(new Set());

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

  return { liveViewers, totalHits };
}

export function LiveViewerBadge({ liveViewers }: { liveViewers: number | null }) {
  return (
    <div className="pointer-events-none absolute top-4 right-4 z-20 sm:top-5 sm:right-6">
      <div className="rounded-2xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-right shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <div className="mb-0.5 flex items-center justify-end gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-hot opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-hot" />
          </span>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-mint uppercase">
            Live on site
          </p>
        </div>
        <p className="font-display text-xl font-bold text-white sm:text-2xl">
          <AnimatedCount value={liveViewers} />
          <span className="ml-1.5 text-xs font-semibold tracking-normal text-white/55">
            viewing
          </span>
        </p>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export function SiteFooter({
  totalHits,
  toastsPaused,
}: {
  totalHits: number | null;
  toastsPaused: boolean;
}) {
  return (
    <footer className="relative z-40 mt-auto shrink-0 pt-1">
      <ConsultationToasts paused={toastsPaused} />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/10 pt-2 pb-1 text-[10px] tracking-wide text-white/40">
        <p>© {new Date().getFullYear()} Best Advocate</p>
        <p className="inline-flex items-center gap-1.5 text-mint/80">
          <span className="tracking-[0.12em] uppercase">Total hits till date</span>
          <AnimatedCount
            value={totalHits}
            className="font-display text-sm font-bold text-mint-hot"
          />
        </p>
      </div>
    </footer>
  );
}

function ConsultationToasts({ paused }: { paused: boolean }) {
=======
export function TotalHitsFooter({ totalHits }: { totalHits: number | null }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pb-1 text-[10px] tracking-wide text-white/40">
      <p>© {new Date().getFullYear()} Best Advocate</p>
      <p className="inline-flex items-center gap-1.5 text-mint/80">
        <span className="tracking-[0.12em] uppercase">Total hits till date</span>
        <AnimatedCount
          value={totalHits}
          className="font-display text-sm font-bold text-mint-hot"
        />
      </p>
    </div>
  );
}

export function ConsultationToasts({ paused }: { paused: boolean }) {
>>>>>>> origin/main
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const namesRef = useRef<string[]>([]);
  const nameIndexRef = useRef(0);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) setToasts([]);
  }, [paused]);

  useEffect(() => {
    namesRef.current = buildUniqueNamePool();
  }, []);

  useEffect(() => {
    let cancelled = false;

    function nextName() {
      const pool = namesRef.current;
      if (!pool.length || nameIndexRef.current >= pool.length) return null;
      const name = pool[nameIndexRef.current];
      nameIndexRef.current += 1;
      return name;
    }

    function pushToast() {
      if (pausedRef.current || cancelled) return;
<<<<<<< HEAD
      const name = nextName();
      if (!name) return;
      const id = `${Date.now()}-${nameIndexRef.current}`;
      setToasts((prev) => [{ id, name }, ...prev].slice(0, 1));
    }

    const first = window.setTimeout(pushToast, 3500);
    const interval = window.setInterval(pushToast, 8000);
=======
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
        return;
      }
      const name = nextName();
      if (!name) return;
      const id = `${Date.now()}-${nameIndexRef.current}`;
      setToasts((prev) => [{ id, name }, ...prev].slice(0, 2));
    }

    const first = window.setTimeout(pushToast, 4500);
    const interval = window.setInterval(pushToast, 9000);
>>>>>>> origin/main

    return () => {
      cancelled = true;
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, []);

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

<<<<<<< HEAD
  return (
    <div className="pointer-events-none mb-2 min-h-0">
      <AnimatePresence initial={false}>
        {!paused &&
          toasts.map((toast) => (
            <SwipeToast key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
=======
  if (paused) return null;

  return (
    <div className="pointer-events-none absolute bottom-24 left-4 z-20 hidden w-[min(100%-2rem,260px)] flex-col gap-2 lg:flex">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <SwipeToast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
>>>>>>> origin/main
      </AnimatePresence>
    </div>
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
<<<<<<< HEAD
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 400) {
=======
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 450) {
>>>>>>> origin/main
      onDismiss(toast.id);
    }
  }

  useEffect(() => {
<<<<<<< HEAD
    const timer = window.setTimeout(() => onDismiss(toast.id), 5000);
=======
    const timer = window.setTimeout(() => onDismiss(toast.id), 5500);
>>>>>>> origin/main
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
<<<<<<< HEAD
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      drag="x"
      dragConstraints={{ left: -140, right: 40 }}
      dragElastic={0.18}
      style={{ x }}
      onDragEnd={onDragEnd}
      className="pointer-events-auto mx-auto w-full max-w-md cursor-grab active:cursor-grabbing rounded-xl border border-white/15 bg-white/95 px-3 py-2 text-ink shadow-[0_10px_28px_rgba(0,0,0,0.25)] backdrop-blur sm:mx-0"
=======
      initial={{ opacity: 0, x: -28, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -48, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      drag="x"
      dragConstraints={{ left: -160, right: 24 }}
      dragElastic={0.18}
      style={{ x }}
      onDragEnd={onDragEnd}
      className="pointer-events-auto cursor-grab active:cursor-grabbing rounded-2xl border border-white/10 bg-white/95 px-3.5 py-3 text-ink shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur"
>>>>>>> origin/main
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/15 text-xs font-bold text-teal">
          {toast.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{toast.name}</p>
          <p className="text-[11px] leading-snug text-muted">
            booked a consultation just now · swipe to dismiss
          </p>
<<<<<<< HEAD
=======
          <p className="mt-1 text-[10px] tracking-wide text-teal/70">Swipe to dismiss</p>
>>>>>>> origin/main
        </div>
      </div>
    </motion.div>
  );
}
