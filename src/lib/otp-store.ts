import { createHash, randomInt } from "crypto";
import { mkdir, writeFile, readFile, rm } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { OTP } from "./config";

export type LeadSession = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  caseDescription: string;
  otpHash: string;
  attempts: number;
  createdAt: number;
  expiresAt: number;
  lastOtpSentAt: number;
  verified: boolean;
};

const memory = new Map<string, LeadSession>();
const STORE_DIR = path.join(process.cwd(), ".data", "sessions");

function hashOtp(otp: string, sessionId: string) {
  return createHash("sha256").update(`${sessionId}:${otp}`).digest("hex");
}

export function generateOtp() {
  const max = 10 ** OTP.length;
  return String(randomInt(0, max)).padStart(OTP.length, "0");
}

async function ensureDir() {
  await mkdir(STORE_DIR, { recursive: true });
}

async function persist(session: LeadSession) {
  memory.set(session.id, session);
  await ensureDir();
  await writeFile(
    path.join(STORE_DIR, `${session.id}.json`),
    JSON.stringify(session),
    "utf8",
  );
}

async function load(sessionId: string): Promise<LeadSession | null> {
  const cached = memory.get(sessionId);
  if (cached) {
    if (Date.now() > cached.expiresAt) {
      await destroySession(sessionId);
      return null;
    }
    return cached;
  }

  try {
    const raw = await readFile(path.join(STORE_DIR, `${sessionId}.json`), "utf8");
    const session = JSON.parse(raw) as LeadSession;
    if (Date.now() > session.expiresAt) {
      await destroySession(sessionId);
      return null;
    }
    memory.set(sessionId, session);
    return session;
  } catch {
    return null;
  }
}

export async function createLeadSession(input: {
  name: string;
  mobile: string;
  email: string;
  caseDescription: string;
}) {
  const id = nanoid(24);
  const otp = generateOtp();
  const now = Date.now();

  const session: LeadSession = {
    id,
    name: input.name,
    mobile: input.mobile,
    email: input.email,
    caseDescription: input.caseDescription,
    otpHash: hashOtp(otp, id),
    attempts: 0,
    createdAt: now,
    expiresAt: now + OTP.ttlMs,
    lastOtpSentAt: now,
    verified: false,
  };

  await persist(session);
  return { sessionId: id, otp };
}

export async function refreshLeadOtp(sessionId: string) {
  const session = await load(sessionId);
  if (!session) {
    return { ok: false as const, error: "Session expired. Please submit the form again." };
  }
  if (session.verified) {
    return { ok: false as const, error: "This request was already submitted." };
  }

  const waitMs = OTP.resendCooldownMs - (Date.now() - (session.lastOtpSentAt || 0));
  if (waitMs > 0) {
    return {
      ok: false as const,
      error: `Please wait ${Math.ceil(waitMs / 1000)}s before requesting another OTP.`,
      retryAfterSec: Math.ceil(waitMs / 1000),
    };
  }

  const otp = generateOtp();
  const now = Date.now();
  session.otpHash = hashOtp(otp, session.id);
  session.attempts = 0;
  session.lastOtpSentAt = now;
  session.expiresAt = now + OTP.ttlMs;
  await persist(session);

  return { ok: true as const, session, otp };
}

export async function verifyLeadOtp(sessionId: string, otp: string) {
  const session = await load(sessionId);
  if (!session) {
    return { ok: false as const, error: "OTP expired or session not found. Please submit again." };
  }
  if (session.verified) {
    return { ok: false as const, error: "This request was already submitted." };
  }
  if (session.attempts >= OTP.maxAttempts) {
    await destroySession(sessionId);
    return { ok: false as const, error: "Too many attempts. Please submit the form again." };
  }

  session.attempts += 1;
  await persist(session);

  if (hashOtp(otp, sessionId) !== session.otpHash) {
    return {
      ok: false as const,
      error: `Invalid OTP. ${OTP.maxAttempts - session.attempts} attempts left.`,
    };
  }

  session.verified = true;
  await persist(session);
  return { ok: true as const, session };
}

export async function destroySession(sessionId: string) {
  memory.delete(sessionId);
  try {
    await rm(path.join(STORE_DIR, sessionId), { recursive: true, force: true });
    await rm(path.join(STORE_DIR, `${sessionId}.json`), { force: true });
  } catch {
    // ignore cleanup errors
  }
}
