/** Order is the carousel order. Nearest slots show the first services; the rest wait off-screen.
 * Odd cards (1-based: 1,3,5,7) drive the left panel; even cards drive the right.
 * `menu` is the side-panel list; each item’s `description` shows when that row is hovered. */
export const CARDS = [
  {
    title: "AI Automation",
    subtitle: "Workflows that run while you sleep.",
    accent: "#94A3B8",
    wash: "#64748B",
    wide: true,
    meta: "Service / Systems · 2026",
    menu: [
      {
        title: "Agent workflows",
        meta: "Orchestration",
        href: "#footer",
        description: "Multi-step agents that plan, call tools, and finish the job without babysitting.",
      },
      {
        title: "Data pipelines",
        meta: "Ingest · Sync",
        href: "#footer",
        description: "Reliable ingest and sync so models and products always see fresh, clean data.",
      },
      {
        title: "Ops copilots",
        meta: "Internal tools",
        href: "#footer",
        description: "Assistants embedded in your ops stack to cut repetitive tickets and handoffs.",
      },
      {
        title: "LLM integrations",
        meta: "APIs · RAG",
        href: "#footer",
        description: "Grounded chat and APIs with retrieval, guardrails, and production logging.",
      },
    ],
  },
  {
    title: "Full Stack Development",
    subtitle: "From the interface down to the database.",
    accent: "#A8B4C4",
    wash: "#6B7788",
    wide: true,
    meta: "Service / Product · 2026",
    menu: [
      {
        title: "Product platforms",
        meta: "End-to-end",
        href: "#footer",
        description: "Ship the full product surface—UI, API, data—built to grow with you.",
      },
      {
        title: "API & backends",
        meta: "Node · Edge",
        href: "#footer",
        description: "Fast, typed services on Node and the edge with clear contracts and auth.",
      },
      {
        title: "Realtime systems",
        meta: "Sockets · Sync",
        href: "#footer",
        description: "Live updates, presence, and sync that feel instant without melting the server.",
      },
      {
        title: "Auth & billing",
        meta: "Growth stack",
        href: "#footer",
        description: "Login, roles, and payments wired so you can charge and onboard without drama.",
      },
    ],
  },
  {
    title: "Mobile App Development",
    subtitle: "Apps for iOS and Android that feel at home.",
    accent: "#8B97A8",
    wash: "#5B6675",
    wide: true,
    meta: "Service / Apps · 2026",
    menu: [
      {
        title: "iOS apps",
        meta: "Swift · RN",
        href: "#footer",
        description: "Native-feeling iOS builds with attention to motion, haptics, and platform norms.",
      },
      {
        title: "Android apps",
        meta: "Kotlin · RN",
        href: "#footer",
        description: "Solid Android experiences that respect Material patterns and device variety.",
      },
      {
        title: "Cross-platform",
        meta: "One codebase",
        href: "#footer",
        description: "One React Native codebase that still feels right on each platform.",
      },
      {
        title: "App store polish",
        meta: "Launch ready",
        href: "#footer",
        description: "Store assets, review prep, and release flows so launch day is boring—in a good way.",
      },
    ],
  },
  {
    title: "Design",
    subtitle: "Interfaces with a point of view.",
    accent: "#9AA6B5",
    wash: "#616B79",
    wide: false,
    meta: "Service / Identity · 2026",
    menu: [
      {
        title: "Product UI",
        meta: "Flows · Screens",
        href: "#footer",
        description: "Screens and flows that make complex products feel obvious on first use.",
      },
      {
        title: "Brand systems",
        meta: "Identity",
        href: "#footer",
        description: "Type, color, and voice that hold together across product and marketing.",
      },
      {
        title: "Motion craft",
        meta: "Micro · Macro",
        href: "#footer",
        description: "Motion that clarifies hierarchy and delight without slowing the work down.",
      },
      {
        title: "Design systems",
        meta: "Tokens · Kits",
        href: "#footer",
        description: "Tokens and components so design and engineering stay in lockstep.",
      },
    ],
  },
  {
    title: "SaaS",
    subtitle: "Products people keep coming back to.",
    accent: "#90A0B2",
    wash: "#5E6A7A",
    wide: false,
    meta: "Service / Product · 2026",
    menu: [
      {
        title: "MVP builds",
        meta: "0 → 1",
        href: "#footer",
        description: "A focused first version you can put in front of users and learn from fast.",
      },
      {
        title: "Multi-tenant",
        meta: "Scale ready",
        href: "#footer",
        description: "Tenant isolation, roles, and billing patterns ready for real customers.",
      },
      {
        title: "Dashboards",
        meta: "Insight UI",
        href: "#footer",
        description: "Clear metrics surfaces so teams see what matters without drowning in charts.",
      },
      {
        title: "Growth loops",
        meta: "Onboard · Retain",
        href: "#footer",
        description: "Onboarding and retention paths that turn first sessions into habits.",
      },
    ],
  },
  {
    title: "Web Apps",
    subtitle: "Browser tools that feel like real software.",
    accent: "#A3AEBD",
    wash: "#667180",
    wide: false,
    meta: "Service / Build · 2026",
    menu: [
      {
        title: "SPA / SSR apps",
        meta: "Next · React",
        href: "#footer",
        description: "Modern React and Next apps with the right mix of client and server rendering.",
      },
      {
        title: "Admin tools",
        meta: "Internal",
        href: "#footer",
        description: "Internal consoles your team actually wants to use—fast, dense, dependable.",
      },
      {
        title: "Editor surfaces",
        meta: "Canvas · Docs",
        href: "#footer",
        description: "Document and canvas UIs for creating, not just browsing content.",
      },
      {
        title: "Performance",
        meta: "Core Web Vitals",
        href: "#footer",
        description: "Load, interactivity, and stability tuned so the product feels sharp everywhere.",
      },
    ],
  },
  {
    title: "Desktop Apps",
    subtitle: "Focused apps for macOS and Windows.",
    accent: "#8794A5",
    wash: "#556070",
    wide: true,
    meta: "Service / Software · 2026",
    menu: [
      {
        title: "macOS apps",
        meta: "Native feel",
        href: "#footer",
        description: "Desktop tools that respect macOS conventions and feel like they belong.",
      },
      {
        title: "Windows apps",
        meta: "Desktop ready",
        href: "#footer",
        description: "Windows builds that install cleanly and behave like proper desktop software.",
      },
      {
        title: "Electron / Tauri",
        meta: "Cross-desktop",
        href: "#footer",
        description: "Cross-desktop shells when one codebase needs to live on every machine.",
      },
      {
        title: "System integrations",
        meta: "OS hooks",
        href: "#footer",
        description: "Menus, trays, filesystem, and notifications wired into the host OS.",
      },
    ],
  },
  {
    title: "Games",
    subtitle: "Playable worlds with a pulse.",
    accent: "#97A3B3",
    wash: "#5F6A78",
    wide: false,
    meta: "Service / Play · 2026",
    menu: [
      {
        title: "Web games",
        meta: "Browser play",
        href: "#footer",
        description: "Browser-playable games with tight loops and zero install friction.",
      },
      {
        title: "Prototypes",
        meta: "Feel first",
        href: "#footer",
        description: "Quick playable sketches to prove the feel before you commit to production.",
      },
      {
        title: "Game UI",
        meta: "HUD · Menus",
        href: "#footer",
        description: "HUDs and menus that stay readable in motion and support the play.",
      },
      {
        title: "Playable demos",
        meta: "Pitch ready",
        href: "#footer",
        description: "Short demos you can send to players, partners, or investors with confidence.",
      },
    ],
  },
]

/** 1-based odd cards update left; even update right. */
export function panelSideForIndex(index) {
  return index % 2 === 0 ? "left" : "right"
}

/** Normalize idle service cards and live menu rows into one list shape. */
export function panelItemsFor(side, card) {
  if (card?.menu) {
    return card.menu.map((item) => ({
      title: item.title,
      meta: item.meta,
      href: item.href,
      description: item.description,
    }))
  }

  return CARDS.reduce((list, service, index) => {
    if (panelSideForIndex(index) !== side) return list
    list.push({
      title: service.title,
      meta: service.meta,
      description: service.subtitle,
      number: index + 1,
    })
    return list
  }, [])
}
