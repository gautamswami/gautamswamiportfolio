"use client"

import { CALENDLY_URL, openCalendly } from "@/lib/calendly"
import { CONTACT } from "@/lib/site"

export default function Footer() {
  return (
    <footer id="footer" className="footer-section relative overflow-hidden text-white">
      <div aria-hidden className="footer-atmosphere" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col px-6 pt-16 md:px-10 md:pt-24 lg:px-14">
        <div className="flex flex-col gap-3 border-b border-white/15 pb-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] tracking-[0.32em] text-white/55 uppercase">
            Let&apos;s build work that inspires
          </p>
          <a
            href={CALENDLY_URL}
            onClick={openCalendly}
            className="inline-flex w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-[11px] font-medium tracking-[0.18em] text-[#12081f] uppercase transition-transform duration-300 hover:-translate-y-0.5"
          >
            Let&apos;s talk
          </a>
        </div>

        <div className="grid gap-12 py-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-16 md:py-16 lg:gap-24">
          <div>
            <h2 className="max-w-xl text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[0.95] font-medium tracking-[-0.04em]">
              Ready to build something bold?
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 md:text-base">
              Open to product builds, mobile apps, and design-led engineering partnerships. Hire{" "}
              {CONTACT.name} for full-stack development, AI automation, SaaS, and product design.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-action"
              >
                LinkedIn
                <span aria-hidden>→</span>
              </a>
              <a href={CONTACT.phoneHref} className="footer-action">
                Call {CONTACT.phone}
                <span aria-hidden>→</span>
              </a>
              <a href={CONTACT.emailHref} className="footer-action">
                Mail me
                <span aria-hidden>→</span>
              </a>
              <a href={CONTACT.resume} download className="footer-action">
                Download resume
                <span aria-hidden>→</span>
              </a>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[11px] tracking-[0.28em] text-white/40 uppercase">Business enquiry</p>
                <a
                  href={CONTACT.emailHref}
                  className="mt-3 block text-sm text-white/85 transition-colors hover:text-white"
                >
                  {CONTACT.email}
                </a>
                <a
                  href={CONTACT.phoneHref}
                  className="mt-2 block text-sm text-white/85 transition-colors hover:text-white"
                >
                  {CONTACT.phone}
                </a>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.28em] text-white/40 uppercase">Social</p>
                <a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-sm text-white/85 transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="pb-6 text-xs tracking-[0.18em] text-white/35">@GAUTAM© 2026</p>
      </div>

      <div className="footer-mega-wrap" aria-hidden="true">
        <p className="footer-mega">GAUTAM</p>
      </div>
    </footer>
  )
}
