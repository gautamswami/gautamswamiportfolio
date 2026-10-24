"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "lenis/dist/lenis.css"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis
    let ticker
    let cancelled = false

    const detach = () => {
      if (ticker) {
        gsap.ticker.remove(ticker)
        ticker = undefined
      }
      if (lenis) {
        lenis.destroy()
        lenis = undefined
      }
    }

    const attach = () => {
      detach()
      if (cancelled || query.matches) return

      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
      })

      lenis.on("scroll", ScrollTrigger.update)

      ticker = (time) => {
        lenis.raf(time * 1000)
      }

      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)
      ScrollTrigger.refresh()
    }

    const lockScroll = () => lenis?.stop()
    const unlockScroll = () => lenis?.start()

    attach()
    query.addEventListener("change", attach)
    window.addEventListener("scroll:lock", lockScroll)
    window.addEventListener("scroll:unlock", unlockScroll)

    return () => {
      cancelled = true
      query.removeEventListener("change", attach)
      window.removeEventListener("scroll:lock", lockScroll)
      window.removeEventListener("scroll:unlock", unlockScroll)
      detach()
    }
  }, [])

  return children
}
