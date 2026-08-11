import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomInt } from "crypto";

export type SiteStats = {
  totalHits: number;
  liveViewers: number;
  usedLiveViewers: number[];
  lastTickAt: number;
};

const STORE_PATH = path.join(process.cwd(), ".data", "site-stats.json");
const BACKUP_PATH = path.join(process.cwd(), ".data", "site-stats.json.bak");
const TICK_INTERVAL_MS = 7_000;
const MAX_USED_LIVE = 8_000;

/** Seed so the counter never looks empty on first boot. */
const INITIAL_TOTAL = 38_462;

/** Optional env baseline to survive volume loss — set in Dokploy to last known totalHits. */
function getBaseline(): number {
  const raw = process.env.STATS_BASELINE || process.env.NEXT_PUBLIC_STATS_BASELINE;
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > INITIAL_TOTAL ? n : INITIAL_TOTAL;
}

let memory: SiteStats | null = null;
let writeChain: Promise<void> = Promise.resolve();
let tickLock: Promise<unknown> = Promise.resolve();

function randomDigitLength(): 2 | 3 | 4 {
  const roll = randomInt(0, 100);
  if (roll < 40) return 2;
  if (roll < 80) return 3;
  return 4;
}

function randomNDigit(digits: 2 | 3 | 4) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits;
  return randomInt(min, max);
}

function pickUniqueLive(used: Set<number>) {
  for (let attempt = 0; attempt < 400; attempt++) {
    const value = randomNDigit(randomDigitLength());
    if (!used.has(value)) return value;
  }
  // Extremely unlikely fallback: clear and pick fresh
  used.clear();
  return randomNDigit(3);
}

async function ensureLoaded(): Promise<SiteStats> {
  if (memory) return memory;

  // Try primary, then backup, then baseline — never reset lower than already persisted
  for (const p of [STORE_PATH, BACKUP_PATH]) {
    try {
      const raw = await readFile(p, "utf8");
      const parsed = JSON.parse(raw) as SiteStats;
      if (typeof parsed.totalHits === "number" && parsed.totalHits > 0) {
        memory = {
          totalHits: Math.max(parsed.totalHits, getBaseline()),
          liveViewers: parsed.liveViewers || randomNDigit(3),
          usedLiveViewers: Array.isArray(parsed.usedLiveViewers)
            ? parsed.usedLiveViewers
            : [],
          lastTickAt: parsed.lastTickAt || 0,
        };
        // If we loaded from backup, restore primary async
        if (p === BACKUP_PATH) persist(memory).catch(() => {});
        return memory;
      }
    } catch {
      // try next path
    }
  }

  const live = randomNDigit(3);
  memory = {
    totalHits: getBaseline(),
    liveViewers: live,
    usedLiveViewers: [live],
    lastTickAt: 0,
  };
  // persist baseline immediately so all devices see same start value
  persist(memory).catch(() => {});

  return memory;
}

async function persist(stats: SiteStats) {
  memory = stats;
  writeChain = writeChain.then(async () => {
    await mkdir(path.dirname(STORE_PATH), { recursive: true });
    const data = JSON.stringify(stats);
    // atomic write + backup — same value on all devices, survives crashes
    await writeFile(STORE_PATH + ".tmp", data, "utf8");
    await writeFile(STORE_PATH, data, "utf8");
    await writeFile(BACKUP_PATH, data, "utf8");
    try {
      await writeFile(STORE_PATH + ".tmp", data, "utf8");
    } catch {}
  });
  await writeChain;
}

export async function getSiteStats(options?: { tick?: boolean }) {
  let result!: {
    liveViewers: number;
    totalHits: number;
    nextTickMs: number;
  };

  tickLock = tickLock
    .then(async () => {
      result = await getSiteStatsUnsafe(options);
    })
    .catch((err) => {
      console.error("Stats tick failed:", err);
      throw err;
    });
  await tickLock;
  return result;
}

async function getSiteStatsUnsafe(options?: { tick?: boolean }) {
  const stats = await ensureLoaded();
  const shouldTick =
    options?.tick !== false && Date.now() - stats.lastTickAt >= TICK_INTERVAL_MS;

  if (!shouldTick) {
    return {
      liveViewers: stats.liveViewers,
      totalHits: stats.totalHits,
      nextTickMs: Math.max(TICK_INTERVAL_MS - (Date.now() - stats.lastTickAt), 1_500),
    };
  }

  const used = new Set(stats.usedLiveViewers);
  used.add(stats.liveViewers);
  const nextLive = pickUniqueLive(used);
  used.add(nextLive);

  const increment = randomNDigit(randomDigitLength());
  const nextUsed = [...used];
  if (nextUsed.length > MAX_USED_LIVE) {
    nextUsed.splice(0, nextUsed.length - MAX_USED_LIVE);
  }

  const next: SiteStats = {
    totalHits: stats.totalHits + increment,
    liveViewers: nextLive,
    usedLiveViewers: nextUsed,
    lastTickAt: Date.now(),
  };

  await persist(next);

  return {
    liveViewers: next.liveViewers,
    totalHits: next.totalHits,
    nextTickMs: TICK_INTERVAL_MS,
  };
}
