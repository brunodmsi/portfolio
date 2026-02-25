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

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export async function getContributions(): Promise<ContributionData> {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        username: GITHUB_USERNAME,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return { totalContributions: 0, weeks: [] };
  }

  const json = await res.json();
  const calendar =
    json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) {
    return { totalContributions: 0, weeks: [] };
  }

  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks,
  };
}

export async function getTotalCommits(): Promise<number> {
  if (!process.env.GITHUB_TOKEN) {
    const res = await fetch(
      `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total_count ?? 0;
  }

  // Use GraphQL to include private commit contributions across all years
  const created = 2019; // GitHub account creation year
  const currentYear = new Date().getFullYear();
  let total = 0;

  for (let year = created; year <= currentYear; year++) {
    const from = `${year}-01-01T00:00:00Z`;
    const to = year === currentYear
      ? new Date().toISOString()
      : `${year + 1}-01-01T00:00:00Z`;

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            restrictedContributionsCount
          }
        }
      }
    `;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME, from, to },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) continue;
    const json = await res.json();
    const c = json.data?.user?.contributionsCollection;
    if (c) {
      total += (c.totalCommitContributions ?? 0) + (c.restrictedContributionsCount ?? 0);
    }
  }

  return total;
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

export async function getAiBio(
  user: GitHubUser,
  repos: GitHubRepo[],
  orgs: GitHubOrg[]
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) return user.bio;

  const nonFork = repos.filter((r) => !r.fork);
  const languages = [
    ...new Set(nonFork.filter((r) => r.language).map((r) => r.language)),
  ];
  const topRepos = nonFork
    .slice(0, 8)
    .map(
      (r) =>
        `${r.name}${r.language ? ` (${r.language})` : ""}${r.description ? `: ${r.description}` : ""}`
    )
    .join("; ");
  const orgNames = orgs.map((o) => o.login).join(", ");

  const prompt = `Write a 2-sentence bio for a developer portfolio. It should feel personal and confident, not corporate or generic.

Name: ${user.name}
Current GitHub bio: ${user.bio || "none"}
Location: ${user.location || "unknown"}
Public repos: ${user.public_repos}
Languages: ${languages.join(", ")}
Organizations: ${orgNames || "none"}
Notable projects: ${topRepos}

Rules:
- First sentence: who they are and what they do (role, focus areas)
- Second sentence: what makes them interesting (specific tech, project types, or approach)
- Sound human, not like a LinkedIn summary
- No emojis, no buzzwords like "passionate" or "innovative"
- Keep it under 30 words total
- Plain text, no markdown`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 80,
        temperature: 0.5,
      }),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return user.bio;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || user.bio;
  } catch {
    return user.bio;
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
