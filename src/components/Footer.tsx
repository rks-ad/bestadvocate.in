import Image from "next/image";
import { SITE } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[#f7f4ee]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <Image
              src={SITE.logoUrl}
              alt="Best Advocate logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg bg-white object-contain p-0.5"
            />
            <span className="font-display text-2xl text-ink">Best Advocate</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Lead intake for clients seeking the best advocate in Jaipur, Rajasthan, and across India.
            Verified enquiries are reviewed by our team for a prompt callback.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-12">
          <div>
            <p className="text-xs tracking-[0.18em] text-brass uppercase">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate">
              <li>
                <a className="seo-link" href="mailto:help@bestadvocate.in">
                  help@bestadvocate.in
                </a>
              </li>
              <li>
                <a className="seo-link" href="https://bestadvocate.in">
                  bestadvocate.in
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.18em] text-brass uppercase">Popular searches</p>
            <ul className="mt-3 space-y-2 text-sm text-slate">
              <li>Best advocate in Jaipur</li>
              <li>Best vakil nearby</li>
              <li>Famous advocate nearby</li>
              <li>Best lawyer in Rajasthan</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-5 text-center text-xs text-muted sm:px-8">
        © {new Date().getFullYear()} Best Advocate. All rights reserved.
      </div>
    </footer>
  );
}
