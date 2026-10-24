/** Central site identity for metadata, sitemap, and structured data. */

export const SITE_NAME = "Gautam Swami"
export const SITE_SHORT_NAME = "Gautam"
export const SITE_TAGLINE =
  "Full-stack developer & product engineer for web apps, mobile apps, AI automation, and design-led builds."

export const SITE_DESCRIPTION =
  "Hire Gautam Swami for full-stack development, mobile apps, AI automation, SaaS products, and product design. Portfolio of shipped client work — book a call to start your next project."

export const SITE_KEYWORDS = [
  "Gautam Swami",
  "full stack developer",
  "freelance developer",
  "mobile app developer",
  "React developer",
  "Next.js developer",
  "AI automation",
  "SaaS development",
  "product design",
  "hire developer India",
  "portfolio",
  "web app development",
]

export const CONTACT = {
  name: SITE_NAME,
  email: "gautams5974@gmail.com",
  emailHref: "mailto:gautams5974@gmail.com",
  phone: "+91 77429008001",
  phoneHref: "tel:+9177429008001",
  linkedin: "https://www.linkedin.com/in/gautamswami/",
  calendly: "https://calendly.com/gautams5974/30min",
  resume: "/Gautam%20swami%20resume.pdf",
  jobTitle: "Full-Stack Developer & Product Engineer",
  sameAs: ["https://www.linkedin.com/in/gautamswami/"],
}

/**
 * Absolute site origin. Set NEXT_PUBLIC_SITE_URL in production
 * (e.g. https://gautamswami.com) so canonicals and OG URLs are correct.
 */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercelProd) return `https://${vercelProd.replace(/^https?:\/\//, "")}`

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`

  return "http://localhost:3000"
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl()
  if (!path || path === "/") return base
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
