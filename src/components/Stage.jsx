"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CARDS, panelItemsFor, panelSideForIndex } from "@/lib/cards"
import { CALENDLY_URL, openCalendly } from "@/lib/calendly"
import Card from "./Card"
import CharacterVideo from "./CharacterVideo"
import LiquidCursor from "./LiquidCursor"
import Loader from "./Loader"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

// Tweak the scroll choreography from here.
const CARD_COUNT = { desktop: 8, tablet: 8, mobile: 8 }
const STAGGER = 0.04
const PHASE_SPLITS = { emerge: 0.6, drift: 0.9, hold: 1 }
/** Share of the pin used by the hero. The rest packs the frame. */
const HERO_END = 0.46
const PACK_END = 0.74
const CARD_WIDTH = { desktop: 280, tablet: 220, mobile: 160 }
const CARD_HEIGHT = { desktop: 380, tablet: 300, mobile: 230 }
const GAP = { desktop: 20, tablet: 16, mobile: 12 }
const CAROUSEL_TRAVEL = 2.5
const LOOP_BIAS = 2
const SLIDE_SECONDS = 1
const ROW_CENTER = { desktop: 0.45, tablet: 0.42, mobile: 0.46 }
const CLEARANCE = { desktop: 0.28, tablet: 0.28, mobile: 0.1 }
const VIDEO_VISUAL = { desktop: 0.58, tablet: 0.5, mobile: 0.44 }
const GRID_COLS = { desktop: 2, tablet: 2, mobile: 2 }
/** Grace so the pointer can travel from a center card into its side panel. */
const MENU_LEAVE_MS = 160
const revealEase = gsap.parseEase("power3.out")
const slideEase = gsap.parseEase("power2.inOut")
const packEase = gsap.parseEase("power3.inOut")

function WorkPanel({ side, card, cardIndex, onEnter, onLeave }) {
  const [hotIndex, setHotIndex] = useState(null)
  const items = panelItemsFor(side, card)
  const live = Boolean(card)
  const heading = card?.title ?? (side === "left" ? "Browse left" : "Browse right")
  const hotItem = hotIndex != null ? items[hotIndex] : null
  const description =
    hotItem?.description ??
    (live ? card.subtitle : "Hover a center card, then a row here for details.")

  useEffect(() => {
    setHotIndex(null)
  }, [cardIndex, side])

  return (
    <div
      className={`work-list work-list-${side}${live ? " is-live" : ""}${hotItem ? " is-detail" : ""}`}
      data-side={side}
      aria-label={live ? `${card.title} links` : `${side} services`}
      data-active-index={cardIndex ?? undefined}
      onMouseEnter={onEnter}
      onMouseLeave={() => {
        setHotIndex(null)
        onLeave()
      }}
    >
      <p className="work-list-heading">{heading}</p>
      <ol>
        {items.map((item, index) => {
          const num = item.number ?? index + 1
          const hot = hotIndex === index
          const Row = item.href ? "a" : "div"
          const rowProps = item.href
            ? { href: item.href, className: `work-row${hot ? " is-hot" : ""}` }
            : { className: `work-row${hot ? " is-hot" : ""}`, role: "presentation" }

          return (
            <li key={`${side}-${item.title}`}>
              <Row
                {...rowProps}
                onMouseEnter={() => setHotIndex(index)}
                onMouseLeave={() => setHotIndex((current) => (current === index ? null : current))}
                onFocus={() => setHotIndex(index)}
                onBlur={() => setHotIndex((current) => (current === index ? null : current))}
              >
                <span className="work-index">{String(num).padStart(2, "0")}/</span>
                <span className="work-title">{item.title}</span>
                <span className="work-meta">{item.meta}</span>
              </Row>
            </li>
          )
        })}
      </ol>
      <div className="work-detail" aria-live="polite">
        {hotItem ? <p className="work-detail-label">{hotItem.title}</p> : null}
        <p className="work-detail-copy">{description}</p>
      </div>
    </div>
  )
}

function createSlider(shiftProxy, onFrame, isActive) {
  let target = 0
  let raf = 0

  const go = (direction) => {
    if (!isActive()) return
    target += direction
    const from = shiftProxy.value
    const to = target
    const distance = Math.abs(to - from)
    cancelAnimationFrame(raf)
    if (distance < 0.0001) return
    const duration = SLIDE_SECONDS * 1000 * distance
    const start = performance.now()
    const tick = (now) => {
      if (!isActive()) return
      const t = Math.min(1, (now - start) / duration)
      shiftProxy.value = from + (to - from) * slideEase(t)
      onFrame()
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  }

  return {
    go,
    reset() {
      cancelAnimationFrame(raf)
      target = 0
      shiftProxy.value = 0
    },
    stop() {
      cancelAnimationFrame(raf)
    },
  }
}

function modeFromViewport() {
  if (window.matchMedia("(min-width: 1024px)").matches) return "desktop"
  if (window.matchMedia("(min-width: 768px)").matches) return "tablet"
  return "mobile"
}

function wrapCenter(value, length) {
  const wrapped = ((value % length) + length) % length
  return wrapped > length / 2 ? wrapped - length : wrapped
}

function slotX(slot, state) {
  const step = state.cardW + state.gap
  const base = state.half + state.gap + state.cardW * 0.5
  if (slot >= 0) return base + slot * step
  return -(base + (-slot - 1) * step)
}

/** Linear between slots, so a card crossing the character glides through the middle. */
function lerpSlot(t, state) {
  const lower = Math.floor(t)
  const frac = t - lower
  if (frac === 0) return slotX(lower, state)
  const from = slotX(lower, state)
  const to = slotX(lower + 1, state)
  return from + (to - from) * frac
}

function homeSlot(index, length) {
  return wrapCenter(index - LOOP_BIAS, length)
}

function xFor(index, shift, state, length, wrap) {
  const raw = homeSlot(index, length) - shift
  return lerpSlot(wrap ? wrapCenter(raw, length) : raw, state)
}

function scrollShift(progress) {
  if (progress <= 0 || progress >= PHASE_SPLITS.emerge) return 0
  const t = progress / PHASE_SPLITS.emerge
  return Math.sin(t * Math.PI) * CAROUSEL_TRAVEL
}

function splitProgress(progress) {
  const hero = gsap.utils.clamp(0, 1, progress / HERO_END)
  const pack = gsap.utils.clamp(0, 1, (progress - HERO_END) / (PACK_END - HERO_END))
  return { hero, pack }
}

function coverFor(stage, frame) {
  const W = stage.offsetWidth
  const H = stage.offsetHeight
  const w = frame.offsetWidth
  const h = frame.offsetHeight
  const originX = frame.offsetLeft + w / 2
  const originY = frame.offsetTop + h / 2
  return {
    scaleX: (W / w) * 1.02,
    scaleY: (H / h) * 1.02,
    x: W / 2 - originX,
    y: H / 2 - originY,
  }
}

function gridTargets(count, frame, stageW, stageH, cols) {
  const rows = Math.ceil(count / cols)
  // Short mobile folder needs extra inset so the tab clip doesn't eat cards.
  const compact = frame.h < stageH * 0.65
  const insetX = Math.max(compact ? 18 : 16, frame.w * (compact ? 0.11 : 0.09))
  const insetTop = Math.max(compact ? 32 : 24, frame.h * (compact ? 0.12 : 0.1))
  const insetBottom = Math.max(compact ? 18 : 16, frame.h * (compact ? 0.09 : 0.07))
  const gap = Math.max(compact ? 8 : 10, Math.min(frame.w, frame.h) * (compact ? 0.02 : 0.024))
  const spanW = frame.w - insetX * 2
  const spanH = frame.h - insetTop - insetBottom
  const cellW = (spanW - gap * (cols - 1)) / cols
  const cellH = (spanH - gap * (rows - 1)) / rows
  const targets = []
  for (let index = 0; index < count; index += 1) {
    const col = index % cols
    const row = Math.floor(index / cols)
    const x = frame.left + insetX + col * (cellW + gap)
    const y = frame.top + insetTop + row * (cellH + gap)
    targets[index] = {
      x: x + cellW / 2 - stageW / 2,
      y: y + cellH / 2 - stageH / 2,
      w: cellW,
      h: cellH,
      scale: 1,
    }
  }
  return targets
}

export default function Stage() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const frameRef = useRef(null)
  const characterLayerRef = useRef(null)
  const labelRef = useRef(null)
  const titleRef = useRef(null)
  const listRef = useRef(null)
  const scaleRef = useRef(null)
  const videoRef = useRef(null)
  const cardRefs = useRef([])
  const hintRef = useRef(null)
  const arrowsRef = useRef(null)
  const contactRef = useRef(null)
  const brandRef = useRef(null)
  const apiRef = useRef({ prev: () => {}, next: () => {} })
  const leaveTimers = useRef({ left: 0, right: 0 })
  const menuLiveRef = useRef(false)
  const hoverIndexRef = useRef(null)
  const hitRectsRef = useRef([])
  const [ready, setReady] = useState(false)
  const [leftIndex, setLeftIndex] = useState(null)
  const [rightIndex, setRightIndex] = useState(null)
  const [clock, setClock] = useState("00,00,00")

  const onReady = useCallback(() => {
    setReady(true)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [])

  useEffect(() => {
    const format = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, "0")
      const mm = String(now.getMinutes()).padStart(2, "0")
      const ss = String(now.getSeconds()).padStart(2, "0")
      return `${hh},${mm},${ss}`
    }
    setClock(format())
    const id = window.setInterval(() => setClock(format()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const clearLeave = useCallback((side) => {
    window.clearTimeout(leaveTimers.current[side])
    leaveTimers.current[side] = 0
  }, [])

  const activateCard = useCallback(
    (index) => {
      const side = panelSideForIndex(index)
      clearLeave(side)
      if (side === "left") setLeftIndex(index)
      else setRightIndex(index)
    },
    [clearLeave],
  )

  const scheduleClear = useCallback(
    (side) => {
      clearLeave(side)
      leaveTimers.current[side] = window.setTimeout(() => {
        if (side === "left") setLeftIndex(null)
        else setRightIndex(null)
        leaveTimers.current[side] = 0
      }, MENU_LEAVE_MS)
    },
    [clearLeave],
  )

  const deactivateCard = useCallback(
    (index) => {
      scheduleClear(panelSideForIndex(index))
    },
    [scheduleClear],
  )

  const enterPanel = useCallback(
    (side) => {
      clearLeave(side)
    },
    [clearLeave],
  )

  const leavePanel = useCallback(
    (side) => {
      // Touch keeps a sticky card pick; clearing on panel leave would wipe it.
      if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return
      scheduleClear(side)
    },
    [scheduleClear],
  )

  /**
   * Hero→grid cards keep 3D transforms; native hit-testing on those layers is
   * unreliable. Once side menus are live, resolve hover from card DOM rects
   * (and animation hit rects as fallback) on window pointermove. Touch uses
   * sticky pointerdown so taps update the side lists without hover.
   */
  useEffect(() => {
    const menusAreLive = () =>
      menuLiveRef.current || Boolean(listRef.current?.classList.contains("is-interactive"))

    const hitIndexAt = (clientX, clientY) => {
      const nodes = cardRefs.current
      for (let i = 0; i < nodes.length; i += 1) {
        const el = nodes[i]
        if (!el) continue
        const opacity = Number.parseFloat(el.style.opacity || "1")
        if (opacity < 0.5) continue
        const rect = el.getBoundingClientRect()
        if (rect.width < 2 || rect.height < 2) continue
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          return i
        }
      }

      if (!stageRef.current) return -1
      const stageBox = stageRef.current.getBoundingClientRect()
      const localX = clientX - stageBox.left - stageBox.width / 2
      const localY = clientY - stageBox.top - stageBox.height / 2
      const rects = hitRectsRef.current
      for (let i = 0; i < rects.length; i += 1) {
        const rect = rects[i]
        if (!rect) continue
        const halfW = rect.w * 0.5
        const halfH = rect.h * 0.5
        if (
          localX >= rect.x - halfW &&
          localX <= rect.x + halfW &&
          localY >= rect.y - halfH &&
          localY <= rect.y + halfH
        ) {
          return i
        }
      }
      return -1
    }

    const overWorkPanel = (event) => {
      const path = typeof event.composedPath === "function" ? event.composedPath() : []
      return path.find((node) => node instanceof Element && node.classList?.contains("work-list"))
    }

    const selectHit = (event) => {
      if (overWorkPanel(event)) return -1
      return hitIndexAt(event.clientX, event.clientY)
    }

    const onMove = (event) => {
      if (!menusAreLive()) return
      // Touch/pen use sticky tap selection — hover clearing would wipe the pick.
      if (event.pointerType && event.pointerType !== "mouse") return

      const panel = overWorkPanel(event)
      if (panel) {
        const side = panel.getAttribute("data-side")
        if (side === "left" || side === "right") enterPanel(side)
        return
      }

      const hit = selectHit(event)
      if (hit >= 0) {
        if (hoverIndexRef.current !== hit) {
          hoverIndexRef.current = hit
          activateCard(hit)
        }
        return
      }

      if (hoverIndexRef.current != null) {
        const prev = hoverIndexRef.current
        hoverIndexRef.current = null
        deactivateCard(prev)
      }
    }

    const onPointerDown = (event) => {
      if (!menusAreLive()) return
      if (event.pointerType === "mouse" && event.button !== 0) return

      const panel = overWorkPanel(event)
      if (panel) {
        const side = panel.getAttribute("data-side")
        if (side === "left" || side === "right") enterPanel(side)
        return
      }

      const hit = selectHit(event)
      if (hit < 0) return
      hoverIndexRef.current = hit
      activateCard(hit)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onPointerDown, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onPointerDown)
    }
  }, [activateCard, deactivateCard, enterPanel])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      ScrollTrigger.config({ ignoreMobileResize: true })

      const cards = () => cardRefs.current.filter(Boolean)

      const layoutFor = (mode, cardCount = CARD_COUNT[mode]) => {
        const state = {
          half: 0,
          cardW: CARD_WIDTH[mode],
          cardH: CARD_HEIGHT[mode],
          y: 0,
          gap: GAP[mode],
          frame: { left: 0, top: 0, w: 1, h: 1 },
          stageW: 1,
          stageH: 1,
          cover: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
          heroCharScale: 1,
          targets: [],
          laneX: 0,
          laneYs: [],
        }

        const measure = () => {
          const stage = stageRef.current
          const frame = frameRef.current
          const video = videoRef.current
          const first = cardRefs.current[0]
          if (!stage || !frame) return state
          state.stageW = stage.offsetWidth
          state.stageH = stage.offsetHeight
          state.frame = {
            left: frame.offsetLeft,
            top: frame.offsetTop,
            w: frame.offsetWidth,
            h: frame.offsetHeight,
          }
          state.cover = coverFor(stage, frame)
          state.cardW = first?.offsetWidth || CARD_WIDTH[mode]
          state.cardH = first?.offsetHeight || CARD_HEIGHT[mode]
          state.y = (ROW_CENTER[mode] - 0.5) * state.stageH
          state.gap = GAP[mode]
          const visualVideo = state.stageH * VIDEO_VISUAL[mode]
          state.half = visualVideo * CLEARANCE[mode]
          const finalLocal = state.frame.h * 0.7
          state.heroCharScale =
            finalLocal > 0 && state.cover.scaleX > 0 ? visualVideo / (state.cover.scaleX * finalLocal) : 1
          const count = Math.min(cardCount, cards().length)
          state.targets = gridTargets(count, state.frame, state.stageW, state.stageH, GRID_COLS[mode])
          state.laneX = state.frame.left + state.frame.w * 0.5 - state.stageW / 2
          state.laneYs = state.targets.map((_, index) => {
            const t = count <= 1 ? 0.5 : index / (count - 1)
            return state.frame.top + state.frame.h * (0.18 + t * 0.64) - state.stageH / 2
          })
          if (video) {
            const size = `${Math.round(finalLocal)}px`
            if (video.dataset.fit !== size) {
              video.style.width = size
              video.style.height = size
              video.dataset.fit = size
            }
          }
          return state
        }

        measure()
        return { state, measure }
      }

      const sizeProps = (mode) => ({
        width: CARD_WIDTH[mode],
        height: CARD_HEIGHT[mode],
      })

      const paintCardStatic = (el, pose) => {
        gsap.set(el, {
          width: pose.w,
          height: pose.h,
          xPercent: -50,
          yPercent: -50,
          x: pose.x,
          y: pose.y,
          scaleX: pose.scaleX ?? pose.scale ?? 1,
          scaleY: pose.scaleY ?? pose.scale ?? 1,
          opacity: pose.opacity,
          rotation: pose.rotation || 0,
          rotationY: pose.rotationY || 0,
          transformPerspective: 1100,
          force3D: true,
          pointerEvents: pose.opacity > 0.5 ? "auto" : "none",
        })
        el.style.setProperty("--poster", String(1 - (pose.face || 0)))
        el.style.setProperty("--compact", String(pose.face || 0))
        el.classList.toggle("is-packing", (pose.face || 0) > 0.02)
      }

      const placeBoard = (mode, state) => {
        const targets = state.targets.length
          ? state.targets
          : gridTargets(cards().length, state.frame, state.stageW, state.stageH, GRID_COLS[mode])
        gsap.set([frameRef.current, characterLayerRef.current], {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          transformOrigin: "50% 50%",
          force3D: true,
        })
        ;[frameRef.current, characterLayerRef.current].forEach((el) => {
          if (!el) return
          el.style.borderRadius = "32px 80px 32px 32px"
          el.style.clipPath = "url(#folder-shape)"
        })
        gsap.set(characterLayerRef.current, { zIndex: 15, opacity: 0 })
        gsap.set(scaleRef.current, { scaleX: 1, scaleY: 1, y: 0, transformOrigin: "50% 50%" })
        gsap.set(labelRef.current, { opacity: 0 })
        if (brandRef.current) gsap.set(brandRef.current, { opacity: 0 })
        if (videoRef.current && !videoRef.current.paused) videoRef.current.pause()
        gsap.set(titleRef.current, { opacity: 0 })
        gsap.set(listRef.current, { opacity: 1, y: 0 })
        listRef.current?.classList.add("is-interactive")
        gsap.set(arrowsRef.current, { opacity: 0 })
        gsap.set(hintRef.current, { autoAlpha: 0 })
        const hits = []
        cards().forEach((el, index) => {
          const target = targets[index]
          if (!target) return
          gsap.set(el, { visibility: "visible" })
          paintCardStatic(el, {
            ...target,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            face: 1,
            rotation: 0,
            rotationY: 0,
          })
          hits[index] = { x: target.x, y: target.y, w: target.w, h: target.h }
        })
        hitRectsRef.current = hits
        menuLiveRef.current = true
      }

      const placeStatic = (mode) => {
        const { state, measure } = layoutFor(mode)
        measure()
        placeBoard(mode, state)
        apiRef.current = { prev: () => {}, next: () => {} }
        return () => {}
      }

      const play = (mode) => {
        const count = Math.min(CARD_COUNT[mode], cards().length)
        const { state, measure } = layoutFor(mode, count)
        const nodes = cards().slice(0, count)
        const hidden = cards().slice(count)
        const tweenDur = Math.max(0.18, PHASE_SPLITS.emerge - STAGGER * (count - 1))
        const packStagger = 0.04
        const packDenom = Math.max(0.001, 1 - (count - 1) * packStagger)
        const rotations = nodes.map(() => gsap.utils.random(-6, 6))
        const shiftProxy = { value: 0 }
        const progressRef = { current: 0 }
        let slider
        let clipped = false
        let videoHeld = false
        let charZ = 40
        let brandDark = false
        let contactDark = false

        const frameSet = {
          x: gsap.quickSetter(frameRef.current, "x", "px"),
          y: gsap.quickSetter(frameRef.current, "y", "px"),
          scaleX: gsap.quickSetter(frameRef.current, "scaleX"),
          scaleY: gsap.quickSetter(frameRef.current, "scaleY"),
        }
        const charSet = {
          x: gsap.quickSetter(characterLayerRef.current, "x", "px"),
          y: gsap.quickSetter(characterLayerRef.current, "y", "px"),
          scaleX: gsap.quickSetter(characterLayerRef.current, "scaleX"),
          scaleY: gsap.quickSetter(characterLayerRef.current, "scaleY"),
          opacity: gsap.quickSetter(characterLayerRef.current, "opacity"),
        }
        // quickSetter("scale") is unreliable; set scaleX/scaleY explicitly.
        const scaleSet = {
          scaleX: gsap.quickSetter(scaleRef.current, "scaleX"),
          scaleY: gsap.quickSetter(scaleRef.current, "scaleY"),
          y: gsap.quickSetter(scaleRef.current, "y", "px"),
        }
        const titleOpacity = gsap.quickSetter(titleRef.current, "opacity")
        const labelOpacity = gsap.quickSetter(labelRef.current, "opacity")
        const hintOpacity = gsap.quickSetter(hintRef.current, "opacity")
        const hintY = gsap.quickSetter(hintRef.current, "y", "px")
        const listOpacity = gsap.quickSetter(listRef.current, "opacity")
        const listY = gsap.quickSetter(listRef.current, "y", "px")
        const arrowsOpacity = gsap.quickSetter(arrowsRef.current, "opacity")

        hitRectsRef.current = []
        menuLiveRef.current = false
        hoverIndexRef.current = null

        const cardFx = nodes.map((el) => {
          el.classList.remove("is-packing")
          return {
            el,
            x: gsap.quickSetter(el, "x", "px"),
            y: gsap.quickSetter(el, "y", "px"),
            scaleX: gsap.quickSetter(el, "scaleX"),
            scaleY: gsap.quickSetter(el, "scaleY"),
            rotation: gsap.quickSetter(el, "rotation", "deg"),
            rotationY: gsap.quickSetter(el, "rotationY", "deg"),
            opacity: gsap.quickSetter(el, "opacity"),
            face: -1,
            packing: false,
            pointer: "",
            settled: false,
          }
        })

        if (hidden.length) gsap.set(hidden, { autoAlpha: 0 })
        nodes.forEach((el, index) => {
          gsap.set(el, {
            ...sizeProps(mode),
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            scaleX: 0.15,
            scaleY: 0.15,
            opacity: 0,
            rotation: rotations[index],
            rotationY: 0,
            transformPerspective: 1100,
            force3D: true,
            visibility: "visible",
          })
        })
        gsap.set([frameRef.current, characterLayerRef.current], {
          transformOrigin: "50% 50%",
          force3D: true,
        })
        gsap.set(scaleRef.current, { transformOrigin: "50% 50%", force3D: true })
        gsap.set(arrowsRef.current, { opacity: 0, visibility: "visible" })
        gsap.set(hintRef.current, { opacity: 1, y: 0 })
        gsap.set(listRef.current, { opacity: 0, y: 28 })
        gsap.set(labelRef.current, { opacity: 0 })
        gsap.set(titleRef.current, { opacity: 1 })
        measure()

        const settleCard = (fx, target) => {
          if (fx.settled) return
          fx.settled = true
          gsap.set(fx.el, {
            width: target.w,
            height: target.h,
            scaleX: 1,
            scaleY: 1,
          })
        }

        const unsettleCard = (fx) => {
          if (!fx.settled) return
          fx.settled = false
          gsap.set(fx.el, {
            width: state.cardW,
            height: state.cardH,
          })
        }

        const layout = (progress) => {
          const { hero, pack } = splitProgress(progress)
          const emerged = hero >= PHASE_SPLITS.emerge
          const shift = scrollShift(hero) + (emerged ? shiftProxy.value : 0)
          const targets = state.targets
          const packed = packEase(pack)
          const frameX = state.cover.x * (1 - packed)
          const frameY = state.cover.y * (1 - packed)
          const frameScaleX = state.cover.scaleX + (1 - state.cover.scaleX) * packed
          const frameScaleY = state.cover.scaleY + (1 - state.cover.scaleY) * packed
          const radius = Math.round(32 * packed)

          frameSet.x(frameX)
          frameSet.y(frameY)
          frameSet.scaleX(frameScaleX)
          frameSet.scaleY(frameScaleY)
          charSet.x(frameX)
          charSet.y(frameY)
          charSet.scaleX(frameScaleX)
          charSet.scaleY(frameScaleX)

          const radiusCss = `${radius}px ${radius * 2.5}px ${radius}px ${radius}px`
          const shouldClip = pack > 0.78
          if (frameRef.current) frameRef.current.style.borderRadius = radiusCss
          if (characterLayerRef.current) characterLayerRef.current.style.borderRadius = radiusCss
          if (shouldClip !== clipped) {
            clipped = shouldClip
            const clip = clipped ? "url(#folder-shape)" : "none"
            if (frameRef.current) frameRef.current.style.clipPath = clip
            if (characterLayerRef.current) characterLayerRef.current.style.clipPath = clip
          }

          const videoFade = 1 - gsap.utils.clamp(0, 1, (pack - 0.78) / 0.16)
          charSet.opacity(videoFade)
          const nextZ = pack > 0.48 ? 15 : 40
          if (nextZ !== charZ && characterLayerRef.current) {
            charZ = nextZ
            characterLayerRef.current.style.zIndex = String(charZ)
          }

          if (videoRef.current) {
            if (pack > 0.92) {
              if (!videoHeld) {
                videoHeld = true
                if (!videoRef.current.paused) videoRef.current.pause()
              }
            } else if (videoHeld) {
              videoHeld = false
              const playAttempt = videoRef.current.play()
              if (playAttempt && typeof playAttempt.catch === "function") playAttempt.catch(() => {})
            }
          }

          // Counter the folder cover-scale in hero; ease back to 1 as the frame packs down.
          const charScale = state.heroCharScale + (1 - state.heroCharScale) * packed
          scaleSet.scaleX(charScale)
          scaleSet.scaleY(charScale)
          scaleSet.y(0)

          const packingPhase = pack > 0.001
          const cardW = state.cardW
          const cardH = state.cardH
          const laneX = state.laneX

          for (let index = 0; index < cardFx.length; index += 1) {
            const fx = cardFx[index]
            const start = index * STAGGER
            const raw = gsap.utils.clamp(0, 1, (hero - start) / tweenDur)
            const eased = revealEase(raw)
            const shown = raw > 0 || pack > 0
            const fromScale = 0.15 + 0.85 * eased
            const fromX = xFor(index, shift, state, count, emerged) * eased
            const fromY = state.y * eased
            const fromRot = rotations[index] * (1 - eased)
            const travel = gsap.utils.clamp(0, 1, (pack - index * packStagger) / packDenom)
            const glide = slideEase(travel)
            const bump = Math.sin(Math.PI * travel)
            const target = targets[index]
            if (!target) continue

            if (glide >= 0.999) {
              settleCard(fx, target)
              fx.x(target.x)
              fx.y(target.y)
              fx.scaleX(1)
              fx.scaleY(1)
              fx.rotation(0)
              fx.rotationY(0)
              hitRectsRef.current[index] = { x: target.x, y: target.y, w: target.w, h: target.h }
            } else {
              unsettleCard(fx)
              hitRectsRef.current[index] = null
              const endScaleX = target.w / cardW
              const endScaleY = target.h / cardH
              const laneY = state.laneYs[index] ?? fromY
              const blendedX = fromX + (target.x - fromX) * glide
              const blendedY = fromY + (target.y - fromY) * glide
              fx.x(blendedX + (laneX - blendedX) * bump * 0.8)
              fx.y(blendedY + (laneY - blendedY) * bump * 0.8)
              fx.scaleX(fromScale + (endScaleX - fromScale) * glide)
              fx.scaleY(fromScale + (endScaleY - fromScale) * glide)
              fx.rotation(fromRot * (1 - glide))
              fx.rotationY(Math.sin(travel * Math.PI) * -170)
            }

            fx.opacity(shown ? 1 : 0)

            const face = glide
            if (Math.abs(face - fx.face) > 0.01) {
              fx.face = face
              fx.el.style.setProperty("--poster", String(1 - face))
              fx.el.style.setProperty("--compact", String(face))
            }

            const packing = packingPhase || face > 0.02
            if (packing !== fx.packing) {
              fx.packing = packing
              fx.el.classList.toggle("is-packing", packing)
            }

            // Original carousel hit rules. Packed-menu hover uses geometric hit-testing
            // (window pointermove) so we never need to flatten 3D or force pointer-events.
            const pointer = shown && face < 0.5 ? "auto" : "none"
            if (pointer !== fx.pointer) {
              fx.pointer = pointer
              fx.el.style.pointerEvents = pointer
            }
          }

          const arrowIn = emerged ? gsap.utils.clamp(0, 1, (hero - PHASE_SPLITS.emerge) / 0.12) : 0
          const arrowOut = 1 - gsap.utils.clamp(0, 1, pack / 0.22)
          const arrowsAlpha = arrowIn * arrowOut
          arrowsOpacity(arrowsAlpha)
          if (arrowsRef.current) {
            arrowsRef.current.style.pointerEvents = arrowsAlpha > 0.05 ? "auto" : "none"
          }
          if (hero < 0.1) {
            hintOpacity(1 - hero / 0.1)
            hintY(-16 * (hero / 0.1))
          } else {
            hintOpacity(0)
            hintY(-16)
          }
          const chromeOut = 1 - gsap.utils.clamp(0, 1, (pack - 0.78) / 0.16)
          titleOpacity((1 - gsap.utils.clamp(0, 1, pack / 0.38)) * chromeOut)
          labelOpacity(gsap.utils.clamp(0, 1, (pack - 0.4) / 0.22) * chromeOut)
          if (brandRef.current) {
            brandRef.current.style.opacity = String(chromeOut)
            const dark = pack > 0.12
            if (dark !== brandDark) {
              brandDark = dark
              brandRef.current.style.color = dark ? "#14120f" : "#ffffff"
            }
          }
          const listIn = gsap.utils.clamp(0, 1, (pack - 0.32) / 0.42)
          listOpacity(listIn)
          listY((1 - listIn) * 36)
          // Enable menu hover only once the pack flip is essentially done, so we
          // never couple interaction state to mid-fold transforms.
          const menusLive = pack > 0.92 && listIn > 0.6
          if (menuLiveRef.current && !menusLive) {
            hoverIndexRef.current = null
            clearLeave("left")
            clearLeave("right")
            setLeftIndex(null)
            setRightIndex(null)
          }
          menuLiveRef.current = menusLive
          if (listRef.current) {
            listRef.current.classList.toggle("is-interactive", menusLive)
          }
          if (contactRef.current) {
            const dark = pack > 0.18
            if (dark !== contactDark) {
              contactDark = dark
              contactRef.current.style.color = dark ? "#14120f" : "rgba(255, 255, 255, 0.8)"
            }
          }
        }

        slider = createSlider(
          shiftProxy,
          () => layout(progressRef.current),
          () => {
            const { hero, pack } = splitProgress(progressRef.current)
            return hero >= PHASE_SPLITS.emerge - 0.001 && pack < 0.02
          },
        )

        apiRef.current = { prev: () => slider.go(-1), next: () => slider.go(1) }

        const onRefreshInit = () => measure()
        ScrollTrigger.addEventListener("refreshInit", onRefreshInit)

        const tl = gsap.timeline({
          defaults: { force3D: true, overwrite: false },
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: "+=860%",
            pin: true,
            // Lenis already smooths scroll; a long scrub lag is what felt like hangs/catch-up.
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progressRef.current = self.progress
              if (self.progress / HERO_END < PHASE_SPLITS.emerge) slider.reset()
              layout(self.progress)
            },
          },
        })

        tl.set({}, {}, 1)
        layout(0)

        return () => {
          slider.stop()
          ScrollTrigger.removeEventListener("refreshInit", onRefreshInit)
        }
      }

      mm.add("(prefers-reduced-motion: reduce)", () => {
        let stop = placeStatic(modeFromViewport())
        const apply = () => {
          stop?.()
          stop = placeStatic(modeFromViewport())
        }
        window.addEventListener("resize", apply)
        return () => {
          window.removeEventListener("resize", apply)
          stop?.()
        }
      })

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        return play("desktop")
      })

      mm.add(
        "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => play("tablet"),
      )

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        return play("mobile")
      })

      let resizeTimer
      const onResize = () => {
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
      }
      window.addEventListener("resize", onResize)

      return () => {
        window.clearTimeout(resizeTimer)
        window.removeEventListener("resize", onResize)
        mm.revert()
      }
    },
    { scope: sectionRef },
  )

  useEffect(
    () => () => {
      window.clearTimeout(leaveTimers.current.left)
      window.clearTimeout(leaveTimers.current.right)
    },
    [],
  )

  return (
    <section
      id="stage"
      ref={sectionRef}
      className="relative bg-white"
      aria-label="Gautam Swami portfolio hero and services"
    >
      <Loader visible={!ready} />
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden bg-white">
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <clipPath id="folder-shape" clipPathUnits="objectBoundingBox">
              <path d="M0.07 0.02H0.7C0.75 0.02 0.77 0.055 0.8 0.085C0.84 0.125 0.88 0.1 0.92 0.14C0.97 0.19 0.985 0.18 0.985 0.25V0.9C0.985 0.955 0.95 0.98 0.9 0.98H0.09C0.04 0.98 0.018 0.95 0.018 0.89V0.11C0.018 0.05 0.04 0.02 0.07 0.02Z" />
            </clipPath>
          </defs>
        </svg>

        <div ref={frameRef} className="folder-frame folder-frame-sky">
          <div className="stage-sky absolute inset-0" />
          <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />
          <span ref={labelRef} className="folder-label" style={{ top: "4.6rem", left: "1.35rem" }}>
            YOOOO
          </span>
        </div>

        <LiquidCursor />

        <div className="stage-front">
          <p
            ref={titleRef}
            className="vibe-title pointer-events-none absolute inset-x-0 top-[24%] z-[2] m-0 text-center text-[clamp(2.75rem,12vw,10.5rem)] leading-[0.82] md:top-[27%] md:text-[clamp(3.25rem,13vw,10.5rem)]"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Local time"
          >
            {clock}
          </p>

          <div className="pointer-events-none absolute inset-0 z-[3] [perspective:1400px]">
            {CARDS.map((card, index) => (
              <Card
                key={card.title}
                card={card}
                index={index}
                active={leftIndex === index || rightIndex === index}
                onActivate={activateCard}
                onDeactivate={deactivateCard}
                cardRef={(node) => {
                  cardRefs.current[index] = node
                }}
              />
            ))}
          </div>

          <div ref={characterLayerRef} className="folder-frame folder-frame-character">
            <CharacterVideo videoRef={videoRef} scaleRef={scaleRef} onReady={onReady} />
          </div>

          <header className="pointer-events-none absolute inset-x-0 top-0 z-[5] flex items-center justify-between px-5 py-5 md:px-10">
            <h1 className="m-0 text-[11px] font-normal tracking-[0.32em] text-white">
              <a ref={brandRef} href="#stage" className="pointer-events-auto text-inherit no-underline">
                <span aria-hidden="true">GAUTAM</span>
                <span className="sr-only">
                  Gautam Swami — Full-Stack Developer &amp; Product Engineer for web apps, mobile
                  apps, AI automation, and design
                </span>
              </a>
            </h1>
            <a
              ref={contactRef}
              href={CALENDLY_URL}
              onClick={openCalendly}
              className="pointer-events-auto text-sm text-white/80"
            >
              Contact
            </a>
          </header>

          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[60] flex items-center justify-center md:bottom-6">
            <div ref={arrowsRef} className="flex items-center justify-center gap-3 opacity-0">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => apiRef.current.prev()}
                className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-black/45 text-white shadow-[0_10px_40px_rgba(255,77,141,0.35)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5 md:h-12 md:w-12"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M14.5 6.5 9 12l5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => apiRef.current.next()}
                className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-black/45 text-white shadow-[0_10px_40px_rgba(61,220,255,0.35)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5 md:h-12 md:w-12"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M9.5 6.5 15 12l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-8 left-1/2 z-[50] -translate-x-1/2">
            <div ref={hintRef} className="flex flex-col items-center gap-3">
              <span className="text-[11px] tracking-[0.38em] text-white/85">Scroll</span>
              <span className="scroll-cue block h-10 w-px" />
            </div>
          </div>

          <aside ref={listRef} className="work-split" aria-label="Services">
            <WorkPanel
              side="left"
              card={leftIndex != null ? CARDS[leftIndex] : null}
              cardIndex={leftIndex}
              onEnter={() => enterPanel("left")}
              onLeave={() => leavePanel("left")}
            />
            <WorkPanel
              side="right"
              card={rightIndex != null ? CARDS[rightIndex] : null}
              cardIndex={rightIndex}
              onEnter={() => enterPanel("right")}
              onLeave={() => leavePanel("right")}
            />
          </aside>
        </div>
      </div>
    </section>
  )
}
