"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function Card({ card, index, cardRef, active, onActivate, onDeactivate }) {
  const localRef = useRef(null)

  const setRefs = (node) => {
    localRef.current = node
    if (typeof cardRef === "function") cardRef(node)
    else if (cardRef) cardRef.current = node
  }

  // Toggle active via classList so React never rewrites the full className and
  // accidentally strips GSAP-managed is-packing.
  useEffect(() => {
    localRef.current?.classList.toggle("is-menu-active", Boolean(active))
  }, [active])

  return (
    <article
      ref={setRefs}
      style={{
        "--accent": card.accent,
        "--wash": card.wash,
      }}
      className="card-shell pointer-events-auto absolute top-1/2 left-1/2 h-[230px] w-[160px] opacity-0 will-change-transform md:h-[300px] md:w-[220px] lg:h-[380px] lg:w-[280px]"
      data-wide={card.wide ? "true" : "false"}
      data-card-index={index}
      onPointerEnter={() => onActivate?.(index)}
      onPointerLeave={() => onDeactivate?.(index)}
      onFocus={() => onActivate?.(index)}
      onBlur={() => onDeactivate?.(index)}
    >
      <div data-face="poster" className="card-face group relative flex h-full flex-col justify-between p-4 transition-transform duration-300 ease-out hover:-translate-y-1.5 md:p-6">
        <span aria-hidden className="card-glow" />
        <span aria-hidden className="card-glow-alt" />
        <span aria-hidden className="card-sheen" />
        <span
          aria-hidden
          className="absolute inset-x-5 top-0 z-10 h-1 rounded-full md:inset-x-6"
          style={{
            background: `linear-gradient(90deg, transparent, ${card.accent}, ${card.wash}, transparent)`,
          }}
        />
        <span
          className="relative z-10 text-[2rem] leading-none font-medium tracking-tight md:text-5xl"
          style={{ color: card.accent, textShadow: `0 8px 24px ${card.accent}` }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative z-10">
          {card.image ? (
            <Image
              src={card.image}
              alt={`${card.title} — ${card.subtitle}`}
              width={280}
              height={112}
              className="mb-4 h-16 w-full rounded-2xl object-cover md:h-24"
            />
          ) : null}
          <h2 className="text-sm leading-tight font-medium tracking-tight text-white md:text-2xl">
            {card.title}
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-white/80 md:text-sm">{card.subtitle}</p>
        </div>
      </div>
      <div data-face="compact" className="card-compact" aria-hidden="true">
        <span style={{ color: card.accent }}>{String(index + 1).padStart(2, "0")}</span>
        <h2>{card.title}</h2>
        <p>{card.subtitle}</p>
      </div>
    </article>
  )
}
