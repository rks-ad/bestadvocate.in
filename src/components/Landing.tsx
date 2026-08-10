"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LeadForm } from "./LeadForm";
import {
  LiveViewerBadge,
  SiteFooter,
  useSiteStats,
} from "./LiveSocialProof";
import { SITE } from "@/lib/config";

export function Landing() {
  const { liveViewers, totalHits } = useSiteStats();
  const [formActive, setFormActive] = useState(false);

  const onFormFocus = useCallback(() => setFormActive(true), []);
  const onFormBlur = useCallback((e: React.FocusEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setFormActive(false);
  }, []);

  return (
    <div className="page-shell">
      <div className="orb orb-a" aria-hidden />
      <div className="orb orb-b" aria-hidden />
      <LiveViewerBadge liveViewers={liveViewers} />

      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex max-w-[calc(100%-9.5rem)] items-center gap-3 sm:max-w-none"
        >
          <Image
            src={SITE.logoUrl}
            alt="Best Advocate logo"
            width={44}
            height={44}
            priority
            className="h-11 w-11 rounded-xl bg-white object-contain p-1 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          />
          <div>
            <p className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              Best Advocate
            </p>
            <p className="text-[11px] tracking-[0.18em] text-mint uppercase">
              Callback in minutes
            </p>
          </div>
        </motion.div>

        <div className="grid min-h-0 flex-1 items-center gap-5 py-3 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="max-w-xl"
          >
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-mint-hot uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint-hot" />
              Get consultation from Best Advocate now
            </p>
            <h1 className="compact-title font-display text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.95] font-extrabold tracking-tight text-white">
              Best Advocate
              <span className="block text-mint-hot">for your case</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              Tell us what you need. Verify your email. Our team calls you back with clear next steps.
            </p>

            <ul className="mt-5 hidden gap-3 text-sm text-white/75 lg:grid">
              {[
                "Verified email intake — spam-free",
                "Quick form — name, mobile, case details",
                "Human callback from our legal desk",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-mint/20 text-[10px] text-mint-hot">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="lead-card compact-pad relative z-30 max-h-full overflow-auto p-4 sm:p-6"
            aria-label="Submit your case"
            onFocusCapture={onFormFocus}
            onBlurCapture={onFormBlur}
            onPointerDownCapture={onFormFocus}
          >
            <div className="mb-4">
              <p className="text-[11px] font-bold tracking-[0.16em] text-teal uppercase">
                Start here
              </p>
              <h2 className="font-display mt-1 text-2xl font-bold text-ink sm:text-[1.7rem]">
                Submit your case details
              </h2>
            </div>
            <LeadForm />
          </motion.section>
        </div>

        <SiteFooter totalHits={totalHits} toastsPaused={formActive} />
      </div>
    </div>
  );
}
