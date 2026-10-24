"use client"

import { useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PROJECTS } from "@/lib/projects"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

/** Share of the pin spent on the ribbon. The rest settles into the grid. */
const SPIN_END = 0.72
/** Spacing along the ribbon between successive cards (0–1 of one orbit). */
const SPACING = 0.085
/** Progress after which the grid is interactive. */
const SETTLED_AT = 0.94
/** Delay before clearing hover so card→card moves never flash through idle. */
const HOVER_LEAVE_MS = 60
const HOVER_SCALE_FOCUS = 1.08
const HOVER_SCALE_DIM = 0.94
const inEase = gsap.parseEase("power3.out")
const settleEase = gsap.parseEase("power2.inOut")

function bezier(t, a, b, c, d) {
  const m = 1 - t
  return m * m * m * a + 3 * m * m * t * b + 3 * m * t * t * c + t * t * t * d
}

function bezierSlope(t, a, b, c, d) {
  const m = 1 - t
  return 3 * m * m * (b - a) + 6 * m * t * (c - b) + 3 * t * t * (d - c)
}

/**
 * Ribbon path matching the reference frames:
 * bottom-left → center-right (largest) → top arc → exit upper-left.
 */
function arcPose(u, width, height) {
  const t = gsap.utils.clamp(0, 1, u)
  const xs = [0.02 * width, 0.38 * width, 0.92 * width, 0.32 * width]
  const ys = [1.05 * height, 0.72 * height, 0.38 * height, 0.02 * height]
  const x = bezier(t, xs[0], xs[1], xs[2], xs[3])
  const y = bezier(t, ys[0], ys[1], ys[2], ys[3])
  const dx = bezierSlope(t, xs[0], xs[1], xs[2], xs[3])
  const dy = bezierSlope(t, ys[0], ys[1], ys[2], ys[3])
  const tangent = Math.atan2(dy, dx)
  const front = Math.sin(Math.PI * Math.min(1, t * 1.05))
  const near = Math.pow(front, 0.65)
  return {
    x,
    y,
    scale: 0.34 + near * 0.95,
    rotateX: -Math.sin(tangent) * 14 + (1 - near) * 6,
    rotateY: -48 + near * 56 + (t - 0.45) * 70,
    rotateZ: ((tangent * 180) / Math.PI) * 0.55,
    z: near,
  }
}

/** Desktop 4×2, mobile 2×4 — keep tiles large with room under the bottom row. */
function gridPose(index, count, width, height) {
  const cols = width < 720 ? 2 : 4
  const rows = Math.ceil(count / cols)
  const gap = Math.max(18, width * 0.016)
  const cardW = Math.min(
    width < 720 ? 300 : 380,
    (width * 0.94 - gap * (cols - 1)) / cols,
  )
  const cardH = cardW * 0.78
  const col = index % cols
  const row = Math.floor(index / cols)
  const totalW = cols * cardW + (cols - 1) * gap
  const totalH = rows * cardH + (rows - 1) * gap
  const topPad = Math.max(28, height * 0.05)
  const bottomPad = Math.max(72, height * 0.11)
  const availableH = Math.max(totalH, height - topPad - bottomPad)
  const left = (width - totalW) / 2
  const top = topPad + Math.max(0, (availableH - totalH) / 2)

  return {
    x: left + col * (cardW + gap) + cardW / 2,
    y: top + row * (cardH + gap) + cardH / 2,
    w: cardW,
    h: cardH,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    z: 0.2,
  }
}

function hoverScale(index, focus) {
  if (focus < 0) return 1
  if (focus === index) return HOVER_SCALE_FOCUS
  return HOVER_SCALE_DIM
}

export default function Reel() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const orbitRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const captionRef = useRef(null)
  const cardRefs = useRef([])
  const hoverRef = useRef(-1)
  const settledRef = useRef(false)
  const leaveTimerRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const cards = () => cardRefs.current.filter(Boolean)

      const measure = () => {
        const stage = stageRef.current
        if (!stage) return { width: 1, height: 1, cardW: 240, cardH: 168 }
        const width = stage.offsetWidth
        const height = stage.offsetHeight
        const sample = gridPose(0, PROJECTS.length, width, height)
        return { width, height, cardW: sample.w, cardH: sample.h }
      }

      const paint = (el, pose, opacity) => {
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          x: pose.x,
          y: pose.y,
          scale: pose.scale,
          rotationX: pose.rotateX,
          rotationY: pose.rotateY,
          rotation: pose.rotateZ,
          transformPerspective: 1200,
          transformOrigin: "50% 50%",
          zIndex: Math.round(6 + pose.z * 50),
          opacity,
          force3D: true,
        })
        el.style.setProperty("--bend", `${pose.rotateY.toFixed(2)}deg`)
      }

      const syncFocusClasses = (focus) => {
        cards().forEach((el, index) => {
          el.classList.toggle("is-focused", focus === index)
          el.classList.toggle("is-dimmed", focus >= 0 && focus !== index)
        })
      }

      const clearLeaveTimer = () => {
        if (leaveTimerRef.current != null) {
          window.clearTimeout(leaveTimerRef.current)
          leaveTimerRef.current = null
        }
      }

      /** Only tween scale / z / opacity — never x/y/width/height (avoids grid jumps). */
      const applyHover = (focus) => {
        if (hoverRef.current === focus) return
        hoverRef.current = focus
        syncFocusClasses(focus)
        cards().forEach((el, index) => {
          const focused = focus === index
          const dimmed = focus >= 0 && !focused
          gsap.to(el, {
            scale: hoverScale(index, focus),
            opacity: dimmed ? 0.72 : 1,
            zIndex: focused ? 60 : 16,
            duration: 0.42,
            ease: "power2.out",
            overwrite: "auto",
          })
        })
      }

      const setSettled = (next) => {
        if (settledRef.current === next) return
        settledRef.current = next
        stageRef.current?.classList.toggle("is-settled", next)
        cards().forEach((el) => {
          el.classList.toggle("is-interactive", next)
          el.style.pointerEvents = next ? "auto" : "none"
        })
        if (!next) {
          clearLeaveTimer()
          hoverRef.current = -1
          syncFocusClasses(-1)
        }
      }

      const placeGrid = () => {
        const { width, height, cardW, cardH } = measure()
        const focus = hoverRef.current
        cards().forEach((el, index) => {
          const pose = gridPose(index, PROJECTS.length, width, height)
          gsap.set(el, { width: cardW, height: cardH })
          paint(el, { ...pose, scale: hoverScale(index, focus), z: focus === index ? 1 : 0.2 }, 1)
        })
        syncFocusClasses(focus)
        gsap.set(leftRef.current, { opacity: 0 })
        gsap.set(rightRef.current, { opacity: 0 })
        gsap.set(captionRef.current, { opacity: 0 })
      }

      const bindHover = () => {
        const orbit = orbitRef.current
        if (!orbit) return () => {}

        const onOver = (event) => {
          if (!settledRef.current) return
          const card = event.target.closest?.("[data-project-index]")
          if (!card || !orbit.contains(card)) return
          const index = Number(card.dataset.projectIndex)
          if (Number.isNaN(index)) return
          clearLeaveTimer()
          applyHover(index)
        }

        const onOut = (event) => {
          if (!settledRef.current) return
          const next = event.relatedTarget
          // Still over a project card inside the orbit — card→card, do nothing here.
          if (next && orbit.contains(next) && next.closest?.("[data-project-index]")) return
          clearLeaveTimer()
          leaveTimerRef.current = window.setTimeout(() => {
            leaveTimerRef.current = null
            applyHover(-1)
          }, HOVER_LEAVE_MS)
        }

        const onFocusIn = (event) => {
          if (!settledRef.current) return
          const card = event.target.closest?.("[data-project-index]")
          if (!card || !orbit.contains(card)) return
          const index = Number(card.dataset.projectIndex)
          if (Number.isNaN(index)) return
          clearLeaveTimer()
          applyHover(index)
        }

        const onFocusOut = (event) => {
          if (!settledRef.current) return
          const next = event.relatedTarget
          if (next && orbit.contains(next) && next.closest?.("[data-project-index]")) return
          clearLeaveTimer()
          leaveTimerRef.current = window.setTimeout(() => {
            leaveTimerRef.current = null
            applyHover(-1)
          }, HOVER_LEAVE_MS)
        }

        orbit.addEventListener("pointerover", onOver)
        orbit.addEventListener("pointerout", onOut)
        orbit.addEventListener("focusin", onFocusIn)
        orbit.addEventListener("focusout", onFocusOut)
        return () => {
          clearLeaveTimer()
          orbit.removeEventListener("pointerover", onOver)
          orbit.removeEventListener("pointerout", onOut)
          orbit.removeEventListener("focusin", onFocusIn)
          orbit.removeEventListener("focusout", onFocusOut)
        }
      }

      mm.add("(prefers-reduced-motion: reduce)", () => {
        placeGrid()
        setSettled(true)
        const onResize = () => placeGrid()
        window.addEventListener("resize", onResize)
        const unbind = bindHover()
        return () => {
          window.removeEventListener("resize", onResize)
          unbind()
        }
      })

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nodes = cards()
        let size = measure()
        nodes.forEach((el) => gsap.set(el, { width: size.cardW, height: size.cardH, pointerEvents: "none" }))

        const layout = (progress) => {
          if (stageRef.current) stageRef.current.dataset.reel = progress.toFixed(3)

          size = measure()
          const { width, height } = size
          const count = nodes.length
          const travel = 1 + (count - 1) * SPACING
          const spin = gsap.utils.clamp(0, 1, progress / SPIN_END)
          const head = spin * travel
          const focus = hoverRef.current

          setSettled(progress >= SETTLED_AT)

          nodes.forEach((el, index) => {
            const u = head - index * SPACING
            const arc = arcPose(u, width, height)
            const grid = gridPose(index, count, width, height)
            const finishAt = ((1 + index * SPACING) / travel) * SPIN_END
            const settle = settleEase(gsap.utils.clamp(0, 1, (progress - finishAt) / 0.2))

            if (progress >= SETTLED_AT) {
              // Position/size only — leave scale/opacity to hover tweens while active.
              const hovering = focus >= 0 || gsap.isTweening(el)
              gsap.set(el, {
                width: size.cardW,
                height: size.cardH,
                xPercent: -50,
                yPercent: -50,
                x: grid.x,
                y: grid.y,
                rotationX: 0,
                rotationY: 0,
                rotation: 0,
                transformPerspective: 1200,
                transformOrigin: "50% 50%",
                force3D: true,
                ...(hovering
                  ? {}
                  : { scale: 1, opacity: 1, zIndex: 16 }),
              })
              el.style.setProperty("--bend", "0deg")
              return
            }

            const pose = {
              x: arc.x + (grid.x - arc.x) * settle,
              y: arc.y + (grid.y - arc.y) * settle,
              scale: arc.scale + (grid.scale - arc.scale) * settle,
              rotateX: arc.rotateX * (1 - settle),
              rotateY: arc.rotateY * (1 - settle),
              rotateZ: arc.rotateZ * (1 - settle),
              z: arc.z * (1 - settle) + 0.2,
            }
            const shown = u > -0.03 || settle > 0.02
            gsap.set(el, { width: size.cardW, height: size.cardH })
            paint(el, pose, shown ? 1 : 0)
            el.classList.remove("is-focused", "is-dimmed")
          })

          const intro = inEase(gsap.utils.clamp(0, 1, progress / 0.14))
          const gather = inEase(gsap.utils.clamp(0, 1, (progress - 0.12) / 0.3))
          const bye = gsap.utils.clamp(0, 1, (progress - 0.52) / 0.14)
          gsap.set(leftRef.current, {
            xPercent: -50,
            yPercent: -50,
            x: width * (-0.08 + 0.34 * intro + 0.04 * gather - 0.42 * bye),
            y: height * (0.32 - 0.02 * gather),
            opacity: intro * (1 - bye),
          })
          gsap.set(rightRef.current, {
            xPercent: -50,
            yPercent: -50,
            x: width * (1.08 - 0.34 * intro - 0.04 * gather + 0.42 * bye),
            y: height * (0.62 + 0.02 * gather),
            opacity: intro * (1 - bye),
          })
          gsap.set(captionRef.current, {
            opacity: intro * (1 - bye) * 0.9,
            y: (1 - intro) * 18,
          })
        }

        const refresh = () => {
          size = measure()
          if (!settledRef.current) {
            nodes.forEach((el) => gsap.set(el, { width: size.cardW, height: size.cardH }))
          }
        }
        ScrollTrigger.addEventListener("refreshInit", refresh)

        const trigger = ScrollTrigger.create({
          trigger: stageRef.current,
          start: "top top",
          end: "+=620%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => layout(self.progress),
        })

        const unbind = bindHover()

        layout(0)
        stageRef.current.__reelLayout = layout
        stageRef.current.__reelTrigger = trigger

        return () => {
          trigger.kill()
          ScrollTrigger.removeEventListener("refreshInit", refresh)
          unbind()
          clearLeaveTimer()
          if (stageRef.current) {
            delete stageRef.current.__reelLayout
            delete stageRef.current.__reelTrigger
          }
        }
      })
    },
    { scope: sectionRef },
  )

  return (
    <section id="reel" ref={sectionRef} className="reel" aria-label="Work in motion">
      <div ref={stageRef} className="reel-stage">
        <svg className="reel-rings" viewBox="0 0 1440 900" aria-hidden="true">
          <ellipse cx="980" cy="-20" rx="760" ry="600" />
          <ellipse cx="120" cy="980" rx="680" ry="500" />
        </svg>

        <p ref={captionRef} className="reel-caption">
          Exploring ideas through daily practice
        </p>
        <h2 className="m-0 contents">
          <span ref={leftRef} className="reel-word">
            WORK IN
          </span>
          <span ref={rightRef} className="reel-word reel-word-right">
            MOTION
          </span>
        </h2>

        <div ref={orbitRef} className="reel-orbit">
          {PROJECTS.map((project, index) => (
            <article
              key={project.id}
              ref={(node) => {
                cardRefs.current[index] = node
              }}
              className="reel-card"
              data-project-index={index}
              tabIndex={0}
            >
              <div className="reel-card-media">
                <Image
                  src={project.image}
                  alt={`${project.title} — ${project.subtitle}. ${project.detail}`}
                  fill
                  sizes="(max-width: 720px) 48vw, 32vw"
                  className="reel-card-image"
                  priority={index < 4}
                />
              </div>
              <span className="reel-card-scrim" aria-hidden="true" />
              <span className="reel-card-bend" aria-hidden="true" />
              <span className="reel-card-sheen" aria-hidden="true" />
              <div className="reel-card-copy">
                <span className="reel-card-index">{String(index + 1).padStart(2, "0")}</span>
                <p className="reel-card-meta">{project.subtitle}</p>
                <h3>{project.title}</h3>
                <p className="reel-card-detail">{project.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
