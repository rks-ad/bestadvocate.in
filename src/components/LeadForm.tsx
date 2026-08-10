"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Step = "form" | "otp" | "success";

type ApiOk = {
  ok: true;
  sessionId?: string;
  emailHint?: string;
  message?: string;
};

type ApiErr = { error: string; retryAfterSec?: number };

const ACCEPTED =
  ".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,application/pdf,image/png,image/jpeg,image/webp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const RESEND_COOLDOWN = 45;

export function LeadForm() {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [otp, setOtp] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const fileLabel = useMemo(() => {
    if (!files.length) return "Attach documents (optional)";
    return `${files.length} file${files.length > 1 ? "s" : ""} attached`;
  }, [files]);

  async function onSubmitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = e.currentTarget;
      const data = new FormData(form);
      data.delete("attachments");
      for (const file of files) data.append("attachments", file);

      const res = await fetch("/api/otp/send", { method: "POST", body: data });
      const json = (await res.json()) as ApiOk | ApiErr;
      if (!res.ok || !("ok" in json)) {
        throw new Error("error" in json ? json.error : "Unable to send OTP");
      }

      setSessionId(json.sessionId || "");
      setEmailHint(json.emailHint || "");
      setCooldown(RESEND_COOLDOWN);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, otp }),
      });
      const json = (await res.json()) as ApiOk | ApiErr;
      if (!res.ok || !("ok" in json)) {
        throw new Error("error" in json ? json.error : "OTP verification failed");
      }
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onResendOtp() {
    if (!sessionId || cooldown > 0 || resending) return;
    setError("");
    setResending(true);

    try {
      const res = await fetch("/api/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const json = (await res.json()) as ApiOk | ApiErr;
      if (!res.ok || !("ok" in json)) {
        if ("retryAfterSec" in json && json.retryAfterSec) {
          setCooldown(json.retryAfterSec);
        }
        throw new Error("error" in json ? json.error : "Unable to resend OTP");
      }
      setCooldown(RESEND_COOLDOWN);
      setOtp("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            onSubmit={onSubmitForm}
            className="compact-gap grid gap-2.5"
          >
            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-[11px] font-bold tracking-[0.12em] text-teal uppercase">
                  Full name
                </span>
                <input required name="name" autoComplete="name" placeholder="Rahul Sharma" className="field" />
              </label>
              <label className="grid gap-1">
                <span className="text-[11px] font-bold tracking-[0.12em] text-teal uppercase">
                  Mobile
                </span>
                <input
                  required
                  name="mobile"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="98765 43210"
                  className="field"
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-[11px] font-bold tracking-[0.12em] text-teal uppercase">
                Email ID
              </span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@email.com"
                className="field"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-[11px] font-bold tracking-[0.12em] text-teal uppercase">
                Case description
              </span>
              <textarea
                required
                name="caseDescription"
                rows={3}
                placeholder="What happened? City? How urgent is this?"
                className="field min-h-[72px] resize-none"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink/80 transition hover:border-teal/50">
              <span>{fileLabel}</span>
              <span className="text-xs font-bold tracking-wide text-teal">Upload</span>
              <input
                type="file"
                multiple
                accept={ACCEPTED}
                className="sr-only"
                onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
              />
            </label>

            {error ? (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
            ) : null}

            <button type="submit" disabled={loading} className="btn-cta mt-0.5">
              {loading ? "Sending OTP..." : "Get free callback →"}
            </button>
            <p className="text-center text-[11px] leading-relaxed text-muted">
              We verify your email with OTP, then our team calls you.
            </p>
          </motion.form>
        )}

        {step === "otp" && (
          <motion.form
            key="otp"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            onSubmit={onVerifyOtp}
            className="grid gap-3"
          >
            <div>
              <p className="font-display text-2xl font-bold text-ink">Enter OTP</p>
              <p className="mt-1 text-sm text-muted">
                Code sent to <strong className="text-ink">{emailHint}</strong>
              </p>
            </div>

            <input
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              className="field text-center text-2xl tracking-[0.45em]"
            />

            {error ? (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
            ) : null}

            <button type="submit" disabled={loading || otp.length !== 6} className="btn-cta">
              {loading ? "Submitting..." : "Verify & submit case"}
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <button
                type="button"
                className="link-quiet"
                disabled={resending || cooldown > 0}
                onClick={onResendOtp}
              >
                {resending
                  ? "Resending..."
                  : cooldown > 0
                    ? `Resend OTP in ${cooldown}s`
                    : "Resend OTP"}
              </button>
              <button
                type="button"
                className="text-muted hover:text-ink"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setError("");
                }}
              >
                Edit details
              </button>
            </div>
          </motion.form>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid place-items-center gap-3 py-6 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint/20 text-teal">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="font-display text-3xl font-bold text-ink">You're all set</p>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Case received. Our team will call you shortly to discuss the next steps.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
