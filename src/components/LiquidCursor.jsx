"use client"

import { useEffect, useRef } from "react"

const LIFE = 1.35
const DROP_LIFE = 0.85
const MAX_STAMPS = 90
const MAX_DROPS = 48

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function inkAt(stage, x, y) {
  const folder = stage.querySelector(".folder-frame-sky")
  if (!folder) return "black"
  const stageBox = stage.getBoundingClientRect()
  const folderBox = folder.getBoundingClientRect()
  const left = folderBox.left - stageBox.left
  const top = folderBox.top - stageBox.top
  const overFolder =
    x >= left && x <= left + folderBox.width && y >= top && y <= top + folderBox.height
  return overFolder ? "white" : "black"
}

function pointInBox(x, y, box) {
  return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h
}

function quietZones(stage) {
  const split = stage.querySelector(".work-split")
  if (!split) return []
  const splitStyle = getComputedStyle(split)
  if (Number.parseFloat(splitStyle.opacity) < 0.2 || splitStyle.visibility === "hidden") return []

  const stageBox = stage.getBoundingClientRect()
  const pad = 10
  return [...split.querySelectorAll(".work-list")].map((panel) => {
    const box = panel.getBoundingClientRect()
    return {
      x: box.left - stageBox.left - pad,
      y: box.top - stageBox.top - pad,
      w: box.width + pad * 2,
      h: box.height + pad * 2,
    }
  })
}

function paintLump(ctx, x, y, radius, angle, stretch) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.fillStyle = "#000"
  ctx.beginPath()
  ctx.ellipse(0, 0, Math.max(1, radius * stretch), Math.max(1, radius * 0.86), 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export default function LiquidCursor() {
  const layerRef = useRef(null)
  const blackRef = useRef(null)
  const whiteRef = useRef(null)

  useEffect(() => {
    const layer = layerRef.current
    const blackCanvas = blackRef.current
    const whiteCanvas = whiteRef.current
    const stage = layer?.parentElement
    if (!layer || !blackCanvas || !whiteCanvas || !stage) return undefined

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!fine.matches || reduce.matches) return undefined

    const blackCtx = blackCanvas.getContext("2d", { alpha: true })
    const whiteCtx = whiteCanvas.getContext("2d", { alpha: true })
    const blackBlur = document.getElementById("liquid-goo-black-blur")
    const whiteBlur = document.getElementById("liquid-goo-white-blur")
    if (!blackCtx || !whiteCtx) return undefined

    const layers = { black: blackCtx, white: whiteCtx }
    const stamps = []
    const drops = []
    const pointer = { x: 0, y: 0, inside: false }
    const head = { x: 0, y: 0 }
    const prev = { x: 0, y: 0 }
    let primed = false
    let trailTime = 0
    let running = false
    let raf = 0
    let last = 0
    let width = 1
    let height = 1

    const resize = () => {
      const box = stage.getBoundingClientRect()
      width = Math.max(1, box.width)
      height = Math.max(1, box.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      ;[blackCanvas, whiteCanvas].forEach((canvas) => {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
      })
      blackCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      whiteCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const unit = Math.min(width, height)
      const blur = unit * 0.02
      blackBlur?.setStdDeviation(blur, blur)
      whiteBlur?.setStdDeviation(blur, blur)
    }

    const radiusFor = (speed) => {
      const unit = Math.min(width, height)
      const t = clamp(speed / 1500, 0, 1)
      return unit * (0.1 - t * 0.034)
    }

    const pushDrop = (x, y, vx, vy, radius, color) => {
      drops.push({ x, y, vx, vy, radius, color, life: 0.7 + Math.random() * 0.4 })
      if (drops.length > MAX_DROPS) drops.shift()
    }

    const inQuietZone = (x, y, zones) => zones.some((box) => pointInBox(x, y, box))

    const pushStamp = (x, y, vx, vy, speed, zones) => {
      if (inQuietZone(x, y, zones)) return

      const radius = radiusFor(speed)
      const pulse = 0.72 + Math.sin(stamps.length * 0.62) * 0.22 + Math.sin(stamps.length * 1.65) * 0.12
      const mag = Math.hypot(vx, vy) || 1
      const side = Math.sin(stamps.length * 0.85)
      stamps.push({
        x: x + (-vy / mag) * side * radius * 0.22,
        y: y + (vx / mag) * side * radius * 0.22,
        angle: Math.atan2(vy, vx) || 0,
        radius: radius * pulse,
        stretch: 1 + clamp(speed / 800, 0, 2.2),
        color: inkAt(stage, x, y),
        life: 1,
        shed: false,
      })
      if (stamps.length > MAX_STAMPS) stamps.shift()

      if (speed > 650 && Math.random() < 0.6) {
        const splash = Math.random() < 0.5 ? 1 : -1
        const nx = (-vy / mag) * splash
        const ny = (vx / mag) * splash
        const dx = x + nx * radius * (0.7 + Math.random() * 0.8)
        const dy = y + ny * radius * (0.7 + Math.random() * 0.8)
        if (inQuietZone(dx, dy, zones)) return
        pushDrop(
          dx,
          dy,
          nx * (50 + Math.random() * 110) - vx * 0.12,
          ny * (50 + Math.random() * 110) - vy * 0.12,
          radius * (0.14 + Math.random() * 0.28),
          inkAt(stage, x, y),
        )
      }
    }

    const grow = (life) => {
      const age = 1 - life
      const swell = age < 0.18 ? 1 + age * 1.6 : 1
      return swell * Math.pow(Math.max(life, 0), 0.72)
    }

    const draw = (now) => {
      const zones = quietZones(stage)
      blackCtx.clearRect(0, 0, width, height)
      whiteCtx.clearRect(0, 0, width, height)

      for (let i = 0; i < stamps.length; i += 1) {
        const stamp = stamps[i]
        if (inQuietZone(stamp.x, stamp.y, zones)) continue
        const radius = stamp.radius * grow(stamp.life)
        if (radius < 1) continue
        paintLump(layers[stamp.color], stamp.x, stamp.y, radius, stamp.angle, stamp.stretch)
      }

      if (pointer.inside && !inQuietZone(pointer.x, pointer.y, zones) && !inQuietZone(head.x, head.y, zones)) {
        const unit = Math.min(width, height)
        const aim = Math.atan2(pointer.y - head.y, pointer.x - head.x)
        const body = unit * 0.092
        const wobble = now * 0.001
        const ctx = layers[inkAt(stage, head.x, head.y)]
        paintLump(ctx, head.x, head.y, body, aim + wobble * 0.2, 1.12)
        paintLump(
          ctx,
          head.x + Math.cos(wobble) * body * 0.28,
          head.y + Math.sin(wobble * 1.37) * body * 0.2,
          body * 0.66,
          aim - 0.6,
          0.86,
        )
        paintLump(
          layers[inkAt(stage, (pointer.x + head.x) / 2, (pointer.y + head.y) / 2)],
          (pointer.x + head.x) / 2,
          (pointer.y + head.y) / 2,
          body * 0.62,
          aim,
          1.55,
        )
        paintLump(
          layers[inkAt(stage, pointer.x, pointer.y)],
          pointer.x,
          pointer.y,
          unit * 0.04,
          aim,
          1.25,
        )
      }

      for (let i = 0; i < drops.length; i += 1) {
        const drop = drops[i]
        if (inQuietZone(drop.x, drop.y, zones)) continue
        const radius = drop.radius * grow(Math.min(1, drop.life))
        if (radius < 1) continue
        paintLump(layers[drop.color], drop.x, drop.y, radius, 0, 1)
      }

      for (let i = 0; i < zones.length; i += 1) {
        const box = zones[i]
        blackCtx.clearRect(box.x, box.y, box.w, box.h)
        whiteCtx.clearRect(box.x, box.y, box.w, box.h)
      }
    }

    const trace = (now) => {
      if (!pointer.inside) return
      if (!primed) {
        head.x = pointer.x
        head.y = pointer.y
        prev.x = pointer.x
        prev.y = pointer.y
        primed = true
        trailTime = now
        return
      }

      const dt = Math.min(0.05, (now - trailTime) / 1000 || 0.016)
      trailTime = now
      head.x += (pointer.x - head.x) * 0.45
      head.y += (pointer.y - head.y) * 0.45

      const vx = (pointer.x - prev.x) / dt
      const vy = (pointer.y - prev.y) / dt
      const dist = Math.hypot(pointer.x - prev.x, pointer.y - prev.y)
      const speed = Math.hypot(vx, vy)
      const spacing = Math.max(8, radiusFor(speed) * 0.22)
      if (dist < spacing) return

      const zones = quietZones(stage)
      if (inQuietZone(pointer.x, pointer.y, zones)) {
        prev.x = pointer.x
        prev.y = pointer.y
        return
      }

      const steps = Math.ceil(dist / spacing)
      for (let step = 1; step <= steps; step += 1) {
        const t = step / steps
        pushStamp(
          prev.x + (pointer.x - prev.x) * t,
          prev.y + (pointer.y - prev.y) * t,
          vx,
          vy,
          speed,
          zones,
        )
      }
      prev.x = pointer.x
      prev.y = pointer.y
    }

    const tick = (now) => {
      const dt = Math.min(0.034, (now - last) / 1000 || 0.016)
      last = now
      trace(now)

      for (let i = stamps.length - 1; i >= 0; i -= 1) {
        const stamp = stamps[i]
        stamp.life -= dt / LIFE
        stamp.stretch += (1 - stamp.stretch) * Math.min(1, dt * 2.4)
        if (!stamp.shed && stamp.life < 0.55) {
          stamp.shed = true
          if (Math.random() < 0.7) {
            const angle = Math.random() * Math.PI * 2
            const kick = 36 + Math.random() * 90
            pushDrop(
              stamp.x + Math.cos(angle) * stamp.radius * 0.35,
              stamp.y + Math.sin(angle) * stamp.radius * 0.35,
              Math.cos(angle) * kick,
              Math.sin(angle) * kick,
              stamp.radius * (0.16 + Math.random() * 0.24),
              stamp.color,
            )
          }
        }
        if (stamp.life <= 0) stamps.splice(i, 1)
      }

      for (let i = drops.length - 1; i >= 0; i -= 1) {
        const drop = drops[i]
        drop.x += drop.vx * dt
        drop.y += drop.vy * dt
        const drag = Math.pow(0.08, dt)
        drop.vx *= drag
        drop.vy *= drag
        drop.life -= dt / DROP_LIFE
        if (drop.life <= 0) drops.splice(i, 1)
      }

      draw(now)

      if (!pointer.inside && stamps.length === 0 && drops.length === 0) {
        running = false
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const place = (event) => {
      const box = stage.getBoundingClientRect()
      pointer.x = event.clientX - box.left
      pointer.y = event.clientY - box.top
      pointer.inside =
        pointer.x >= 0 && pointer.y >= 0 && pointer.x <= box.width && pointer.y <= box.height
      if (!pointer.inside) primed = false
      if (pointer.inside) {
        trace(performance.now())
        start()
      }
    }

    const leaveWindow = (event) => {
      if (event.relatedTarget) return
      pointer.inside = false
      primed = false
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    window.addEventListener("pointermove", place, { passive: true })
    window.addEventListener("pointerdown", place, { passive: true })
    window.addEventListener("pointerout", leaveWindow)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener("pointermove", place)
      window.removeEventListener("pointerdown", place)
      window.removeEventListener("pointerout", leaveWindow)
    }
  }, [])

  return (
    <div ref={layerRef} className="liquid-cursor-layer" aria-hidden="true">
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <filter id="liquid-goo-black" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur id="liquid-goo-black-blur" in="SourceGraphic" stdDeviation="14" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 28 -13" />
        </filter>
        <filter id="liquid-goo-white" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur id="liquid-goo-white-blur" in="SourceGraphic" stdDeviation="14" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 28 -13" />
        </filter>
      </svg>
      <canvas ref={blackRef} className="liquid-cursor liquid-cursor-black" aria-hidden="true" />
      <canvas ref={whiteRef} className="liquid-cursor liquid-cursor-white" aria-hidden="true" />
    </div>
  )
}
