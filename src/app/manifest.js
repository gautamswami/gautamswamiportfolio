import { SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME } from "@/lib/site"

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#12081f",
    theme_color: "#12081f",
    lang: "en",
    categories: ["business", "productivity", "portfolio"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
