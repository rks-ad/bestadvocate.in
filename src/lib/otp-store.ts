import { createHash, randomInt } from "crypto";
import { mkdir, writeFile, readFile, rm } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { OTP, UPLOAD } from "./config";

export type StoredAttachment = {
  filename: string;
  contentType: string;
  size: number;
  path: string;
};

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
  verified: boolean;
  attachments: StoredAttachment[];
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
  const { attachments, ...meta } = session;
  await writeFile(
    path.join(STORE_DIR, `${session.id}.json`),
    JSON.stringify({ ...meta, attachments }),
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
  files: { filename: string; contentType: string; buffer: Buffer }[];
}) {
  const id = nanoid(24);
  const otp = generateOtp();
  const dir = path.join(STORE_DIR, id);
  await mkdir(dir, { recursive: true });

  let total = 0;
  const attachments: StoredAttachment[] = [];

  for (const file of input.files.slice(0, UPLOAD.maxFiles)) {
    if (file.buffer.byteLength > UPLOAD.maxFileBytes) {
      throw new Error(`File "${file.filename}" exceeds the 4MB limit`);
    }
    if (!(UPLOAD.allowedMime as readonly string[]).includes(file.contentType)) {
      throw new Error(`File type not allowed: ${file.filename}`);
    }
    total += file.buffer.byteLength;
    if (total > UPLOAD.maxTotalBytes) {
      throw new Error("Total attachments exceed 10MB");
    }
    const safeName = file.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    const filePath = path.join(dir, safeName);
    await writeFile(filePath, file.buffer);
    attachments.push({
      filename: safeName,
      contentType: file.contentType,
      size: file.buffer.byteLength,
      path: filePath,
    });
  }

  const session: LeadSession = {
    id,
    name: input.name,
    mobile: input.mobile,
    email: input.email,
    caseDescription: input.caseDescription,
    otpHash: hashOtp(otp, id),
    attempts: 0,
    createdAt: Date.now(),
    expiresAt: Date.now() + OTP.ttlMs,
    verified: false,
    attachments,
  };

  await persist(session);
  return { sessionId: id, otp };
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

export async function readAttachmentBuffers(session: LeadSession) {
  return Promise.all(
    session.attachments.map(async (file) => ({
      filename: file.filename,
      contentType: file.contentType,
      content: await readFile(file.path),
    })),
  );
}
