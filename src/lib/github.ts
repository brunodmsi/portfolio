export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  blog: string;
  location: string | null;
  company: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubOrg {
  login: string;
  avatar_url: string;
  description: string | null;
  url: string;
}

const GITHUB_USERNAME = "brunodmsi";

function ghHeaders(): HeadersInit {
  const h: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

export async function getGitHubUser(): Promise<GitHubUser> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
    headers: ghHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch GitHub user");
  return res.json();
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
    { headers: ghHeaders(), next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Failed to fetch GitHub repos");
  return res.json();
}

export async function getGitHubOrgs(): Promise<GitHubOrg[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/orgs`,
    { headers: ghHeaders(), next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  Shell: "#89e051",
  Lua: "#2C2D72",
  Java: "#b07219",
  "C#": "#178600",
  Python: "#3572A5",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  PHP: "#4F5D95",
};

export interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

export function getLanguageStats(repos: GitHubRepo[]): LanguageStat[] {
  const counts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({
      language: lang,
      count,
      percentage: (count / total) * 100,
      color: LANGUAGE_COLORS[lang] || "#555555",
    }));
}

export async function getTotalCommits(): Promise<number> {
  const res = await fetch(
    `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}`,
    { headers: ghHeaders(), next: { revalidate: 3600 } }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data.total_count ?? 0;
}

async function getCommitCount(repo: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/commits?per_page=1`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return 0;
    const link = res.headers.get("link");
    if (!link) return 1;
    const match = link.match(/page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1], 10) : 1;
  } catch {
    return 0;
  }
}

export async function getTopRepos(repos: GitHubRepo[]): Promise<GitHubRepo[]> {
  const nonFork = repos.filter((r) => !r.fork);
  const counts = await Promise.all(
    nonFork.map(async (r) => ({
      repo: r,
      commits: await getCommitCount(r.name),
    }))
  );
  return counts
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 3)
    .map((c) => c.repo);
}
