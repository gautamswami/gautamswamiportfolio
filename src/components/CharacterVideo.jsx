"use client"

import { useEffect } from "react"

const LOOP_DIP_SECONDS = 0.15
const LOOP_DIP_FLOOR = 0.86

export default function CharacterVideo({ videoRef, scaleRef, onReady }) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    video.muted = true
    video.defaultMuted = true

    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      onReady?.()
    }

    if (video.readyState >= 3) reveal()
    video.addEventListener("canplay", reveal)
    video.addEventListener("error", reveal)

    const playAttempt = video.play()
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {})
    }

    const fallback = window.setTimeout(reveal, 2800)

    const onTimeUpdate = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return
      const remaining = video.duration - video.currentTime
      let opacity = 1
      if (remaining < LOOP_DIP_SECONDS) {
        opacity = LOOP_DIP_FLOOR + (1 - LOOP_DIP_FLOOR) * (remaining / LOOP_DIP_SECONDS)
      } else if (video.currentTime < LOOP_DIP_SECONDS) {
        opacity = LOOP_DIP_FLOOR + (1 - LOOP_DIP_FLOOR) * (video.currentTime / LOOP_DIP_SECONDS)
      }
      video.style.opacity = String(opacity)
    }

    video.addEventListener("timeupdate", onTimeUpdate)

    return () => {
      window.clearTimeout(fallback)
      video.removeEventListener("canplay", reveal)
      video.removeEventListener("error", reveal)
      video.removeEventListener("timeupdate", onTimeUpdate)
    }
  }, [onReady, videoRef])

  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
      <div ref={scaleRef} className="origin-center will-change-transform">
        <video
          ref={videoRef}
          className="character-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/video/poster.jpg"
          aria-label="Character vibing with a drink"
        >
          <source src="/video/char.mov" type='video/quicktime; codecs="hvc1"' />
          <source src="/video/char.webm" type="video/webm" />
          <source src="/video/char.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
