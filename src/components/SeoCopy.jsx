import { CONTACT, SITE_NAME, SITE_TAGLINE } from "@/lib/site"
import { CARDS } from "@/lib/cards"
import { PROJECTS } from "@/lib/projects"

/**
 * Crawlable copy that mirrors what the animated UI shows.
 * Kept visually minimal so design stays intact while search engines
 * can index name, services, and project themes.
 */
export default function SeoCopy() {
  return (
    <section
      className="seo-copy mx-auto max-w-[1400px] px-6 py-16 text-white/80 md:px-10 md:py-20 lg:px-14"
      aria-labelledby="seo-about-heading"
    >
      <h2 id="seo-about-heading" className="text-2xl font-medium tracking-tight text-white md:text-3xl">
        About {SITE_NAME}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed md:text-base">
        {SITE_TAGLINE} Based in India and available for remote client work worldwide. Reach out via{" "}
        <a className="underline decoration-white/30 underline-offset-4 hover:text-white" href={CONTACT.emailHref}>
          {CONTACT.email}
        </a>
        ,{" "}
        <a
          className="underline decoration-white/30 underline-offset-4 hover:text-white"
          href={CONTACT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        , or{" "}
        <a className="underline decoration-white/30 underline-offset-4 hover:text-white" href={CONTACT.calendly}>
          book a 30-minute call
        </a>
        .
      </p>

      <h2 className="mt-12 text-xl font-medium tracking-tight text-white md:text-2xl">Services</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <li key={card.title}>
            <h3 className="text-sm font-medium text-white">{card.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/60">{card.subtitle}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-medium tracking-tight text-white md:text-2xl">Selected work</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <li key={project.id}>
            <h3 className="text-sm font-medium text-white">
              {project.title}{" "}
              <span className="font-normal text-white/45">· {project.subtitle}</span>
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-white/60">{project.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
