"use client";

import { motion } from "framer-motion";

const areas = [
  "Best advocate in Jaipur",
  "Best advocate in Rajasthan",
  "Best advocate in India",
  "Best vakil nearby",
  "Famous advocate nearby",
  "Best lawyer near me",
  "Top criminal lawyer Jaipur",
  "Civil advocate Rajasthan",
  "Family lawyer Jaipur",
  "Property dispute advocate",
  "High Court advocate Jaipur",
  "Corporate lawyer India",
];

const practice = [
  {
    title: "Criminal & bail matters",
    copy: "FIR, bail, trial strategy, and urgent criminal defence support across Jaipur and Rajasthan.",
  },
  {
    title: "Civil & property disputes",
    copy: "Title conflicts, possession, injunctions, recovery suits, and court representation.",
  },
  {
    title: "Family & matrimonial law",
    copy: "Divorce, maintenance, custody, domestic disputes, and negotiated settlements.",
  },
  {
    title: "Business & documentation",
    copy: "Contracts, notices, cheque bounce, company issues, and commercial dispute handling.",
  },
];

export function SeoContent() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:px-10">
      <motion.section
        id="coverage"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
        className="max-w-3xl"
      >
        <div className="section-rule mb-5" />
        <h2 className="font-display text-4xl text-ink sm:text-5xl">
          Legal help people search for — delivered with clarity
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Best Advocate connects people looking for a trusted vakil, lawyer, or advocate nearby with a
          responsive intake team. Whether you need the best advocate in Jaipur, a reputed counsel in
          Rajasthan, or guidance anywhere in India, start with one verified enquiry and we will call you back.
        </p>
      </motion.section>

      <section className="mt-14 grid gap-8 md:grid-cols-2">
        {practice.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="border-t border-[var(--line)] pt-6"
          >
            <h3 className="font-display text-2xl text-navy">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{item.copy}</p>
          </motion.article>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
        className="mt-20"
      >
        <h2 className="font-display text-3xl text-ink sm:text-4xl">
          Searched terms we proudly serve
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          From “best advocate near me” to “famous advocate nearby” and specialised counsel across courts —
          Best Advocate is built to be found when legal help is urgent.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
          {areas.map((item) => (
            <li key={item}>
              <a href="#case-form" className="seo-link text-sm sm:text-base">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.1fr]"
      >
        <div>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            How the Best Advocate enquiry works
          </h2>
          <p className="mt-3 text-muted">
            A simple funnel designed for busy clients who need a reliable advocate without endless searching.
          </p>
        </div>
        <ol className="grid gap-5">
          {[
            "Submit your name, mobile, email, case summary, and optional documents.",
            "Verify your email with the OTP sent from noreply@notify.bestadvocate.in.",
            "Our team receives your enquiry at help@bestadvocate.in and calls you for next steps.",
          ].map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="font-display text-3xl text-brass">{String(i + 1).padStart(2, "0")}</span>
              <p className="pt-2 text-base leading-relaxed text-slate">{step}</p>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45 }}
        className="mt-20 rounded-[28px] bg-ink px-6 py-10 text-white sm:px-10"
      >
        <h2 className="font-display text-3xl sm:text-4xl">
          Looking for the best vakil in Jaipur or across India?
        </h2>
        <p className="mt-4 max-w-3xl text-white/70">
          Best Advocate helps people find dependable legal support for criminal, civil, family, property,
          and commercial matters. If you searched for a top advocate in Rajasthan, a High Court lawyer in
          Jaipur, or a trusted counsel nearby — send your case details and let our team guide the first call.
        </p>
        <a href="#case-form" className="btn-primary mt-7 inline-flex no-underline">
          Request a callback
        </a>
      </motion.section>
    </div>
  );
}
