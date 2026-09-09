/** Editorial snapshot of demasi.dev, observed 2026-09-09. No live API calls. */
export const biography = "I'm Bruno De Masi, a software engineer specializing in diverse languages like Rust and TypeScript. I enjoy crafting tools that streamline workflows, like my CLI for managing git worktrees.";

export const projects = [
  { id: "buggy", name: "Buggy", category: "TypeScript", description: "Bug tracking platform with built-in exception catcher to auto-open issues and allow developers to work with it", url: "https://github.com/brunodmsi/Buggy", destination: "View on GitHub", material: "silver" },
  { id: "wt", name: "wt", category: "Shell", description: "CLI tool for managing git worktrees with tmux integration, automatic port allocation, and per-project setup automation", url: "https://github.com/brunodmsi/wt", destination: "View on GitHub", material: "phosphor" },
  { id: "pi-platform", name: "pi-platform", category: "TypeScript", description: null, url: "https://github.com/brunodmsi/pi-platform", destination: "View on GitHub", material: "cobalt" },
  { id: "flight-tracker", name: "Flight Tracker", category: "Travel", description: "Real-time flight tracking and travel planning tool", url: "https://iastravel.com/", destination: "Visit website", material: "pearl" },
] as const;

export type Project = (typeof projects)[number];

export const languages = ["C", "C#", "HTML", "Java", "JavaScript", "Lua", "Nix", "PHP", "Python", "Rust", "Shell", "TypeScript"] as const;

/** Positions are compositional, not proficiency, hierarchy, or dependencies. */
export const languagePositions = [
  [17, 29], [41, 14], [71, 22], [83, 46], [69, 76], [37, 86],
  [12, 66], [35, 43], [55, 57], [58, 32], [31, 65], [82, 64],
] as const;

export const organizations = ["show-karma", "WormLayer", "orqbase", "The-RFP-Hub"] as const;
export const socials = [
  { name: "GitHub", href: "https://github.com/brunodmsi" },
  { name: "LinkedIn", href: "https://linkedin.com/in/brunodemasi" },
  { name: "Twitter", href: "https://twitter.com/brunodmsi" },
] as const;

export const chapters = [
  { id: "surface", label: "Surface" },
  { id: "current", label: "About" },
  { id: "reef", label: "Work" },
  { id: "spectrum", label: "Languages" },
  { id: "portal", label: "Contact" },
] as const;
