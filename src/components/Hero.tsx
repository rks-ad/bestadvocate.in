"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LeadForm } from "./LeadForm";
import { SITE } from "@/lib/config";

export function Hero() {
  return (
    <header className="hero-plane text-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-5 pb-14 pt-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between gap-4 animate-rise">
          <a href="#top" className="flex items-center gap-3 no-underline">
            <Image
              src={SITE.logoUrl}
              alt="Best Advocate logo"
              width={48}
              height={48}
              priority
              className="h-12 w-12 rounded-xl bg-white object-contain p-1 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            />
            <span className="font-display text-2xl tracking-wide text-white">
              Best Advocate
            </span>
          </a>
          <a
            href="#case-form"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm text-white/85 no-underline transition hover:border-brass-soft/60 hover:text-white sm:inline-flex"
          >
            Submit your case
          </a>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-xs font-medium tracking-[0.24em] text-brass-soft uppercase"
            >
              Jaipur · Rajasthan · India
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="font-display text-[clamp(3.2rem,8vw,5.8rem)] leading-[0.92] font-semibold tracking-tight text-white"
            >
              Best Advocate
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg"
            >
              Share your legal matter in minutes. Our team reviews your enquiry and calls you with clear next steps.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a href="#case-form" className="btn-primary no-underline">
                Start free consultation request
              </a>
              <a
                href="#coverage"
                className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm text-white/80 no-underline transition hover:border-brass-soft/50 hover:text-white"
              >
                Where we help
              </a>
            </motion.div>
          </div>

          <motion.div
            id="case-form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-7"
          >
            <p className="mb-1 text-xs tracking-[0.2em] text-brass-soft uppercase">
              Case intake
            </p>
            <h2 className="font-display mb-5 text-3xl text-white">Tell us about your case</h2>
            <LeadForm variant="hero" />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
