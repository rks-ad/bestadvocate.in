"use client";

import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Step = "form" | "otp" | "success";

type ApiOk = {
  ok: true;
  sessionId?: string;
  emailHint?: string;
  message?: string;
};

type ApiErr = { error: string };

const ACCEPTED =
  ".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,application/pdf,image/png,image/jpeg,image/webp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function LeadForm({ variant = "hero" }: { variant?: "hero" | "panel" }) {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [otp, setOtp] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const dark = variant === "hero";

  const fileLabel = useMemo(() => {
    if (!files.length) return "Add case documents (optional, max 5)";
    return `${files.length} file${files.length > 1 ? "s" : ""} selected`;
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

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            onSubmit={onSubmitForm}
            className="grid gap-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className={`text-xs tracking-[0.14em] uppercase ${dark ? "text-brass-soft/90" : "text-muted"}`}>
                  Full name
                </span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  className={`field ${dark ? "field-dark" : ""}`}
                />
              </label>
              <label className="grid gap-1.5">
                <span className={`text-xs tracking-[0.14em] uppercase ${dark ? "text-brass-soft/90" : "text-muted"}`}>
                  Mobile number
                </span>
                <input
                  required
                  name="mobile"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                  className={`field ${dark ? "field-dark" : ""}`}
                />
              </label>
            </div>

            <label className="grid gap-1.5">
              <span className={`text-xs tracking-[0.14em] uppercase ${dark ? "text-brass-soft/90" : "text-muted"}`}>
                Email ID
              </span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`field ${dark ? "field-dark" : ""}`}
              />
            </label>

            <label className="grid gap-1.5">
              <span className={`text-xs tracking-[0.14em] uppercase ${dark ? "text-brass-soft/90" : "text-muted"}`}>
                Case description
              </span>
              <textarea
                required
                name="caseDescription"
                rows={4}
                placeholder="Briefly explain your legal matter, city, and urgency..."
                className={`field resize-y min-h-28 ${dark ? "field-dark" : ""}`}
              />
            </label>

            <label
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-[14px] border border-dashed px-4 py-3 transition ${
                dark
                  ? "border-white/20 bg-white/5 text-white/80 hover:border-brass-soft/50"
                  : "border-navy/15 bg-white text-slate hover:border-brass/50"
              }`}
            >
              <span className="text-sm">{fileLabel}</span>
              <span className={`text-xs tracking-wide ${dark ? "text-brass-soft" : "text-brass"}`}>
                Browse
              </span>
              <input
                type="file"
                multiple
                accept={ACCEPTED}
                className="sr-only"
                onChange={(e) => {
                  const next = Array.from(e.target.files || []).slice(0, 5);
                  setFiles(next);
                }}
              />
            </label>

            {error ? (
              <p
                className={`rounded-xl px-3 py-2 text-sm ${
                  dark ? "bg-red-500/15 text-red-200" : "bg-red-50 text-red-700"
                }`}
              >
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={loading} className="btn-primary mt-1 w-full sm:w-auto">
              {loading ? "Sending OTP..." : "Verify email & submit case"}
            </button>
            <p className={`text-xs leading-relaxed ${dark ? "text-white/55" : "text-muted"}`}>
              We verify your email with a one-time password, then our team calls you about your matter.
            </p>
          </motion.form>
        )}

        {step === "otp" && (
          <motion.form
            key="otp"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            onSubmit={onVerifyOtp}
            className="grid gap-4"
          >
            <div>
              <p className={`font-display text-3xl ${dark ? "text-white" : "text-ink"}`}>
                Enter OTP
              </p>
              <p className={`mt-2 text-sm ${dark ? "text-white/65" : "text-muted"}`}>
                We sent a 6-digit code to <strong>{emailHint}</strong>
              </p>
            </div>
            <input
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              className={`field text-center text-2xl tracking-[0.4em] ${dark ? "field-dark" : ""}`}
            />
            {error ? (
              <p
                className={`rounded-xl px-3 py-2 text-sm ${
                  dark ? "bg-red-500/15 text-red-200" : "bg-red-50 text-red-700"
                }`}
              >
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary">
                {loading ? "Verifying..." : "Confirm & submit"}
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm ${dark ? "text-white/70 hover:text-white" : "text-muted hover:text-ink"}`}
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
            className="grid gap-3 py-2 text-center sm:text-left"
          >
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full sm:mx-0 ${dark ? "bg-brass/20 text-brass-soft" : "bg-brass/15 text-brass"}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className={`font-display text-3xl ${dark ? "text-white" : "text-ink"}`}>
              Enquiry received
            </p>
            <p className={`text-sm leading-relaxed ${dark ? "text-white/70" : "text-muted"}`}>
              Thank you. Your case details are with our team. A Best Advocate associate will call you shortly to discuss the next steps.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
