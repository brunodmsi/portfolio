/** Editorial snapshot of demasi.dev, observed 2026-09-09. No live API calls. */
export const biography = "I'm Bruno De Masi, a software engineer specializing in diverse languages like Rust and TypeScript. I enjoy crafting tools that streamline workflows, like my CLI for managing git worktrees.";

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
  { id: "reef", label: "Play" },
  { id: "spectrum", label: "Languages" },
  { id: "portal", label: "Contact" },
] as const;
