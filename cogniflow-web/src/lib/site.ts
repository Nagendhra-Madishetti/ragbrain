export const site = {
  name: "Cogniflow",
  tagline: "The auditable, self-hostable belief ledger for agents.",
  repo: "https://github.com/Nagendhra-web/cogniflow",
  nav: [
    { href: "/playground", label: "Playground" },
    { href: "/plugins", label: "Plugins" },
    { href: "/benchmark", label: "Benchmark" },
    { href: "/use-cases", label: "Use cases" },
    { href: "/docs", label: "Docs" },
  ],
} as const;

export const chartColors = {
  brand: "#35e6c0",   // Cogniflow
  brand2: "#7c74ff",
  plain: "#8b93a5",   // the "other" system - neutral slate, distinct from brand mint
  win: "#56d39a",
  warn: "#e2c04b",
  miss: "#5b6472",
  danger: "#e0707e",
  grid: "#232b38",
  text: "#97a1b2",
} as const;
