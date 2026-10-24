"use client"

import { useCallback, useEffect, useState } from "react"
import { CALENDLY_EMBED_URL, CALENDLY_URL } from "@/lib/calendly"

export default function CalendlyModal() {
  const [open, setOpen] = useState(false)
  const [booted, setBooted] = useState(false)

  const close = useCallback(() => {
    setOpen(false)
    document.body.style.overflow = ""
    window.dispatchEvent(new CustomEvent("scroll:unlock"))
  }, [])

  const openModal = useCallback(() => {
    setBooted(true)
    setOpen(true)
    document.body.style.overflow = "hidden"
    window.dispatchEvent(new CustomEvent("scroll:lock"))
  }, [])

  useEffect(() => {
    const onOpen = () => openModal()
    const onClose = () => close()
    window.addEventListener("calendly:open", onOpen)
    window.addEventListener("calendly:close", onClose)
    return () => {
      window.removeEventListener("calendly:open", onOpen)
      window.removeEventListener("calendly:close", onClose)
    }
  }, [openModal, close])

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, close])

  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== "https://calendly.com") return
      if (event.data?.event === "calendly.event_scheduled") close()
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [close])

  if (!open) return null

  return (
    <div className="calendly-modal" role="dialog" aria-modal="true" aria-labelledby="calendly-modal-title">
      <button type="button" className="calendly-modal-backdrop" aria-label="Close booking dialog" onClick={close} />
      <div className="calendly-modal-panel">
        <div aria-hidden className="footer-atmosphere absolute inset-0 rounded-[inherit]" />
        <header className="calendly-modal-header">
          <div>
            <p id="calendly-modal-title" className="text-[11px] tracking-[0.32em] text-white/55 uppercase">
              Book a meeting
            </p>
            <p className="mt-1 text-sm text-white/80">30 minutes · pick a time that works</p>
          </div>
          <button type="button" className="calendly-modal-close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <div className="calendly-modal-frame">
          {booted ? (
            <iframe
              title="Schedule a meeting with Gautam"
              src={CALENDLY_EMBED_URL}
              loading="lazy"
            />
          ) : null}
        </div>
        <p className="calendly-modal-fallback">
          Having trouble?{" "}
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
            Open Calendly
          </a>
        </p>
      </div>
    </div>
  )
}
