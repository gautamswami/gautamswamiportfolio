export const CALENDLY_URL = "https://calendly.com/gautams5974/30min"

/** Dark slate embed colors aligned with the site footer / loader. */
export const CALENDLY_EMBED_URL =
  `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=070708&text_color=e2e8f0&primary_color=94a3b8`

export function openCalendly(event) {
  event?.preventDefault?.()
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("calendly:open"))
}
