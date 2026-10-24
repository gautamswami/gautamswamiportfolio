import { PROJECTS } from "@/lib/projects"
import { absoluteUrl, getSiteUrl } from "@/lib/site"

export default function sitemap() {
  const siteUrl = getSiteUrl()
  const projectImages = PROJECTS.map((project) => absoluteUrl(project.image))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: projectImages,
    },
  ]
}
