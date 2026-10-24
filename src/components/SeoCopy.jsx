"use client"

import { useEffect, useRef, useState } from "react"
import { Ubuntu_Mono } from "next/font/google"
import { CALENDLY_URL, openCalendly } from "@/lib/calendly"
import { CONTACT, SITE_NAME, SITE_TAGLINE } from "@/lib/site"
import { CARDS } from "@/lib/cards"
import { PROJECTS } from "@/lib/projects"

const ubuntuMono = Ubuntu_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
})

const LAST_LINE = "echo \"Ready to build something bold? Let's talk.\""

function Prompt() {
  return (
    <span className="term-prompt">
      <span className="term-user">gautam@ubuntu</span>
      <span className="term-host">:</span>
      <span className="term-path">~</span>
      <span className="term-hash">$ </span>
    </span>
  )
}

function scrollCrtToBottom(el) {
  if (!el) return
  el.scrollTop = el.scrollHeight
}

export default function SeoCopy() {
  const sectionRef = useRef(null)
  const crtRef = useRef(null)
  const dragRef = useRef(null)
  const pinnedToBottomRef = useRef(true)
  const [started, setStarted] = useState(false)
  const [typed, setTyped] = useState("")
  const [done, setDone] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setStarted(true)
      setTyped(LAST_LINE)
      setDone(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!started || done) return
    if (typed.length >= LAST_LINE.length) {
      setDone(true)
      return
    }
    const t = window.setTimeout(
      () => setTyped(LAST_LINE.slice(0, typed.length + 1)),
      22 + Math.random() * 28,
    )
    return () => window.clearTimeout(t)
  }, [started, typed, done])

  // Default (and while typing) stay pinned to the bottom unless the user scrolls up.
  useEffect(() => {
    const el = crtRef.current
    if (!el) return

    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
      pinnedToBottomRef.current = distanceFromBottom < 28
    }

    el.addEventListener("scroll", onScroll, { passive: true })
    scrollCrtToBottom(el)
    const id = window.requestAnimationFrame(() => scrollCrtToBottom(el))

    return () => {
      el.removeEventListener("scroll", onScroll)
      window.cancelAnimationFrame(id)
    }
  }, [])

  useEffect(() => {
    if (!pinnedToBottomRef.current) return
    scrollCrtToBottom(crtRef.current)
  }, [started, typed, done])

  useEffect(() => {
    const el = crtRef.current
    if (!el) return

    const onPointerDown = (event) => {
      if (event.button !== 0) return
      // Keep native link / text interaction; drag only from empty chrome.
      if (event.target.closest("a, button, input, textarea")) return

      dragRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startScroll: el.scrollTop,
        moved: false,
      }
      el.setPointerCapture(event.pointerId)
      setDragging(true)
    }

    const onPointerMove = (event) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      const dy = event.clientY - drag.startY
      if (Math.abs(dy) > 2) drag.moved = true
      el.scrollTop = drag.startScroll - dy
    }

    const endDrag = (event) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      dragRef.current = null
      setDragging(false)
      try {
        el.releasePointerCapture(event.pointerId)
      } catch {
        /* already released */
      }
    }

    el.addEventListener("pointerdown", onPointerDown)
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", endDrag)
    el.addEventListener("pointercancel", endDrag)

    return () => {
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", endDrag)
      el.removeEventListener("pointercancel", endDrag)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`seo-terminal ${ubuntuMono.className}`}
      aria-labelledby="seo-about-heading"
    >
      <div className="term-shell">
        <div className="term-window">
          <div className="term-chrome">
            <div className="term-dots" aria-hidden>
              <span className="term-dot term-dot-close" />
              <span className="term-dot term-dot-min" />
              <span className="term-dot term-dot-max" />
            </div>
            <p className="term-title">gautam@ubuntu: ~/portfolio — bash · scroll or drag</p>
            <span className="term-chrome-spacer" aria-hidden />
          </div>

          <div className="term-bezel">
            <div
              ref={crtRef}
              className={`term-crt${dragging ? " is-dragging" : ""}`}
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              tabIndex={0}
              role="region"
              aria-label="Portfolio terminal — scroll to read full copy"
            >
              <div className="term-scanlines" aria-hidden />
              <div className="term-flicker" aria-hidden />
              <div className="term-vignette" aria-hidden />

              <div className="term-body">
                <div className="term-line">
                  <Prompt />
                  <span className="term-cmd">cat about.txt</span>
                </div>

                <h2 id="seo-about-heading" className="term-heading">
                  About {SITE_NAME}
                </h2>
                <p className="term-line term-out term-prose">
                  {SITE_TAGLINE} Based in India and available for remote client work worldwide. Reach
                  out via{" "}
                  <a href={CONTACT.emailHref}>{CONTACT.email}</a>
                  {", "}
                  <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                  {", or "}
                  <a href={CALENDLY_URL} onClick={openCalendly}>
                    book a 30-minute call
                  </a>
                  .
                </p>

                <div className="term-line term-gap">
                  <Prompt />
                  <span className="term-cmd">ls services/</span>
                </div>
                <h2 className="term-heading">Services</h2>
                <ul className="term-ul">
                  {CARDS.map((card) => (
                    <li key={card.title}>
                      <h3 className="term-item-title">{card.title}</h3>
                      <p className="term-item-copy">{card.subtitle}</p>
                    </li>
                  ))}
                </ul>

                <div className="term-line term-gap">
                  <Prompt />
                  <span className="term-cmd">ls work/</span>
                </div>
                <h2 className="term-heading">Selected work</h2>
                <ul className="term-ul">
                  {PROJECTS.map((project) => (
                    <li key={project.id}>
                      <h3 className="term-item-title">
                        {project.title}{" "}
                        <span className="term-item-meta">· {project.subtitle}</span>
                      </h3>
                      <p className="term-item-copy">{project.detail}</p>
                    </li>
                  ))}
                </ul>

                <div className="term-line term-gap">
                  <Prompt />
                  <span className="term-cmd">
                    {started ? typed : ""}
                    <span
                      className={`term-cursor ${done ? "term-cursor-blink" : ""}`}
                      aria-hidden
                    />
                  </span>
                </div>
                {done ? (
                  <p className="term-line term-out">Ready to build something bold? Let&apos;s talk.</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <p className="term-caption">
          <span className="term-caption-key">tty</span> wheel · drag · scrollbar — starts at bottom
        </p>
      </div>
    </section>
  )
}
