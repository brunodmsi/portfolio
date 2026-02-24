export const dynamic = "force-dynamic";

import Image from "next/image";
import {
  Github,
  Globe,
  Linkedin,
  Twitter,
  ArrowUpRight,
  MapPin,
  GraduationCap,
  Hexagon,
  Container,
  Languages,
  Mail,
  Users,
} from "lucide-react";
import {
  getGitHubUser,
  getGitHubRepos,
  getGitHubOrgs,
  getLanguageStats,
  getTopRepos,
  LANGUAGE_COLORS,
} from "../lib/github";
import { ContactForm } from "../components/contact-form";

export default async function Home() {
  const [user, repos, orgs] = await Promise.all([
    getGitHubUser(),
    getGitHubRepos(),
    getGitHubOrgs(),
  ]);

  const languageStats = getLanguageStats(repos);
  const recentRepos = await getTopRepos(repos);
  const yearsSince =
    new Date().getFullYear() - new Date(user.created_at).getFullYear();

  // Derive Web3 repo count from GitHub
  const web3Repos = repos.filter(
    (r) =>
      !r.fork &&
      (r.name.toLowerCase().includes("web3") ||
        r.name.toLowerCase().includes("crypto") ||
        r.name.toLowerCase().includes("marketplace") ||
        r.name.toLowerCase().includes("hedgey") ||
        r.name.toLowerCase().includes("smart-contract") ||
        (r.description &&
          /web3|crypto|blockchain|solidity|smart.?contract/i.test(
            r.description
          )))
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name,
    jobTitle: "Senior Software Engineer",
    url: `https://${user.blog}`,
    sameAs: [
      user.html_url,
      "https://linkedin.com/in/brunodemasi",
      "https://twitter.com/brunodmsi",
    ],
    image: user.avatar_url,
    knowsAbout: ["TypeScript", "Rust", "Web3", "DevOps", "Software Architecture"],
  };

  const spanPattern = [1, 1, 2, 2, 1, 1];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen px-4 py-8 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {/* ── Profile ── */}
          <div
            className="card col-span-2 flex items-center gap-5 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <Image
              src={user.avatar_url}
              alt={user.name}
              width={80}
              height={80}
              priority
              className="avatar-glow rounded-full"
            />
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-primary">
                {user.name}
              </h1>
              <p className="mt-0.5 text-sm text-secondary">{user.bio}</p>
            </div>
          </div>

          {/* ── Repos count ── */}
          <div
            className="card flex flex-col justify-center animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            <span className="stat-number font-mono text-3xl font-bold">
              {user.public_repos}
            </span>
            <span className="mt-1 font-mono text-[10px] text-secondary">repositories</span>
          </div>

          {/* ── Years on GitHub ── */}
          <div
            className="card flex flex-col justify-center animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <span className="stat-number font-mono text-3xl font-bold">
              {yearsSince}
            </span>
            <span className="mt-1 font-mono text-[10px] text-secondary">years on github</span>
          </div>

          {/* ── Profile-derived cards ── */}

          {/* Location — from LinkedIn (Belém, Pará, Brazil) */}
          <div
            className="card flex flex-col items-center justify-center text-center animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            <MapPin size={28} className="text-accent/40" strokeWidth={1.5} />
            <span className="mt-3 block text-sm font-medium text-primary">
              Belém, Brazil
            </span>
          </div>

          {/* Education */}
          <div
            className="card flex flex-col items-center justify-center text-center animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            <GraduationCap size={28} className="text-accent/40" strokeWidth={1.5} />
            <span className="mt-3 block text-sm font-medium text-primary">
              Computer Science
            </span>
          </div>

          {/* Web3 — from GitHub (3 repos) */}
          {web3Repos.length > 0 && (
            <div
              className="card flex flex-col items-center justify-center text-center animate-fade-up"
              style={{ animationDelay: "180ms" }}
            >
              <Hexagon size={28} className="text-accent/40" strokeWidth={1.5} />
              <span className="mt-3 block text-sm font-medium text-primary">
                Web3
              </span>
              <span className="mt-0.5 text-[11px] text-secondary">
                {web3Repos.length} project{web3Repos.length !== 1 && "s"}
              </span>
            </div>
          )}

          {/* DevOps — from LinkedIn skills (K8s, Docker, Serverless) */}
          <div
            className="card flex flex-col items-center justify-center text-center animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <Container size={28} className="text-accent/40" strokeWidth={1.5} />
            <span className="mt-3 block text-sm font-medium text-primary">
              DevOps & Cloud
            </span>
          </div>

          {/* ── Languages ── */}
          <div
            className="card col-span-2 lg:col-span-3 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <div className="mb-5 flex h-2.5 overflow-hidden rounded-full bg-[#111]">
              {languageStats.map((stat) => (
                <div
                  key={stat.language}
                  className="lang-bar-segment"
                  style={{
                    flexGrow: stat.percentage,
                    backgroundColor: stat.color,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {languageStats.slice(0, 8).map((stat) => (
                <div key={stat.language} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="text-xs text-secondary">{stat.language}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Links ── */}
          <div
            className="card col-span-2 lg:col-span-1 flex flex-col justify-center gap-3 animate-fade-up"
            style={{ animationDelay: "280ms" }}
          >
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-link flex items-center gap-2.5 text-sm text-secondary transition-colors hover:text-accent"
            >
              <Github size={18} />
              <span className="flex-1">GitHub</span>
              <ArrowUpRight size={14} className="arrow" />
            </a>
            <a
              href="https://linkedin.com/in/brunodemasi"
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-link flex items-center gap-2.5 text-sm text-secondary transition-colors hover:text-accent"
            >
              <Linkedin size={18} />
              <span className="flex-1">LinkedIn</span>
              <ArrowUpRight size={14} className="arrow" />
            </a>
            <a
              href="https://twitter.com/brunodmsi"
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-link flex items-center gap-2.5 text-sm text-secondary transition-colors hover:text-accent"
            >
              <Twitter size={18} />
              <span className="flex-1">Twitter</span>
              <ArrowUpRight size={14} className="arrow" />
            </a>
            {user.blog && (
              <a
                href={
                  user.blog.startsWith("http")
                    ? user.blog
                    : `https://${user.blog}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="arrow-link flex items-center gap-2.5 text-sm text-secondary transition-colors hover:text-accent"
              >
                <Globe size={18} />
                <span className="flex-1">Website</span>
                <ArrowUpRight size={14} className="arrow" />
              </a>
            )}
          </div>

          {/* ── GitHub Orgs ── */}
          {orgs.length > 0 && (
            <div
              className="card col-span-2 lg:col-span-4 animate-fade-up"
              style={{ animationDelay: "310ms" }}
            >
              <div className="mb-4 flex items-center gap-2.5">
                <Users size={16} className="text-accent/40" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                  organizations
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {orgs.map((org) => (
                  <a
                    key={org.login}
                    href={`https://github.com/${org.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="org-chip"
                  >
                    <Image
                      src={org.avatar_url}
                      alt={org.login}
                      width={24}
                      height={24}
                      className="rounded-md"
                    />
                    <span className="text-sm text-primary">{org.login}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Recent Projects ── */}
          {recentRepos.map((repo, i) => (
            <a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`card card-interactive arrow-link animate-fade-up ${
                spanPattern[i] === 2 ? "col-span-2" : "col-span-1"
              }`}
              style={{ animationDelay: `${340 + i * 60}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        LANGUAGE_COLORS[repo.language || ""] || "#555",
                    }}
                  />
                  <span className="text-[11px] text-secondary">
                    {repo.language}
                  </span>
                </div>
                <ArrowUpRight size={14} className="arrow" />
              </div>
              <h3 className="font-medium tracking-tight text-primary">
                {repo.name}
              </h3>
              {repo.description && (
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-secondary">
                  {repo.description}
                </p>
              )}
            </a>
          ))}

          {/* ── Contact Form ── */}
          <div
            className="card col-span-2 lg:col-span-4 animate-fade-up"
            style={{ animationDelay: "700ms" }}
          >
            <div className="mb-5 flex items-center gap-2.5">
              <Mail size={18} className="text-accent/40" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                get in touch
              </span>
            </div>
            <ContactForm />
          </div>
        </div>
      </main>
    </>
  );
}
