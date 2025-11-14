export const APP_ROUTES = {
  // Marketing
  home: "/",
  login: "/auth/login",
  signup: "/auth/signup",

  // Main App
  playground: "/playground",
  observatory: "/observatory",
  council: "/council",
  memory: "/memory",
  multiverse: "/multiverse",
  universeMap: "/universe-map",
  studio: "/persona-editor",
  marketplace: "/marketplace",
  marketplaceSage: (slug: string) => `/marketplace/${slug}`,

  // API
  api: {
    chat: "/api/chat",
    agents: "/api/agents",
    feed: "/api/feed",
    artifacts: "/api/artifacts",
  },
} as const

// Route metadata for documentation
export const ROUTE_STATUS = {
  [APP_ROUTES.playground]: { implemented: true, needsPreSeededSession: false },
  [APP_ROUTES.observatory]: { implemented: true, needsAPI: true },
  [APP_ROUTES.council]: { implemented: true, needsAPI: true },
  [APP_ROUTES.memory]: { implemented: true, needsAPI: true },
  [APP_ROUTES.multiverse]: { implemented: true, needsMigration: false },
  [APP_ROUTES.universeMap]: { implemented: true, needsMigration: false },
  [APP_ROUTES.studio]: { implemented: true, needsAPI: true },
  [APP_ROUTES.marketplace]: { implemented: true, needsAPI: false },
}
