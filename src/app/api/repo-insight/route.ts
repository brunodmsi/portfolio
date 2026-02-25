import { NextRequest, NextResponse } from "next/server";

const GITHUB_USERNAME = "brunodmsi";

interface CachedInsight {
  insight: string;
  tags: string[];
  ts: number;
}

// In-memory cache (persists across requests in the same server instance)
const cache = new Map<string, CachedInsight>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

async function fetchReadme(repo: string): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/readme`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    }
  );
  if (!res.ok) return "";
  const text = await res.text();
  return text.slice(0, 2000);
}

async function fetchRepoMeta(
  repo: string
): Promise<{ description: string; language: string; topics: string[] }> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    }
  );
  if (!res.ok) return { description: "", language: "", topics: [] };
  const data = await res.json();
  return {
    description: data.description || "",
    language: data.language || "",
    topics: data.topics || [],
  };
}

export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get("repo");
  if (!repo) {
    return NextResponse.json({ error: "repo is required" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 }
    );
  }

  // Check cache
  const cached = cache.get(repo);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({
      insight: cached.insight,
      tags: cached.tags,
    });
  }

  const [readme, meta] = await Promise.all([
    fetchReadme(repo),
    fetchRepoMeta(repo),
  ]);

  const prompt = `You are analyzing a GitHub repository for a developer portfolio. Be concise and technical.

Repository: ${repo}
Language: ${meta.language}
Description: ${meta.description}
Topics: ${meta.topics.join(", ")}
README (truncated):
${readme}

Respond in EXACTLY this JSON format, no markdown fences:
{"insight":"<2 short sentences: what it does + most interesting technical aspect>","tags":["<tag1>","<tag2>","<tag3>"]}

For tags: pick 2-3 short labels (1-2 words each) that describe the project nature. Examples: "production", "DeFi", "solo project", "CLI tool", "full-stack", "API", "open source", "hackathon", "DevOps", "mobile", "real-time", "data pipeline". Be specific to this repo.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "OpenAI request failed" },
      { status: 502 }
    );
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || "";

  let insight = "";
  let tags: string[] = [];

  try {
    const parsed = JSON.parse(raw);
    insight = parsed.insight || "";
    tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 3) : [];
  } catch {
    // Fallback: treat entire response as insight text
    insight = raw;
  }

  cache.set(repo, { insight, tags, ts: Date.now() });

  return NextResponse.json({ insight, tags });
}
