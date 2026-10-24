import { ImageResponse } from "next/og"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site"

export const alt = `${SITE_NAME} — Full-Stack Developer & Product Engineer`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(145deg, #0B0614 0%, #1A0F2E 55%, #12081f 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Portfolio · Available for hire
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 650,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              width: 140,
              height: 4,
              borderRadius: 999,
              background: "linear-gradient(90deg, #FF8A3D, #3DDCFF)",
            }}
          />
          <div
            style={{
              display: "flex",
              maxWidth: 820,
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>Web · Mobile · AI · Design</span>
          <span>Book a project call</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
