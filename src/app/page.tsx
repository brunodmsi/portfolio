export const dynamic = "force-dynamic";

import Image from "next/image";
import {
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  MapPin,
  GraduationCap,
  Hexagon,
  Mail,
  Users,
  Plane,
} from "lucide-react";
import {
  getGitHubUser,
  getGitHubRepos,
  getGitHubOrgs,
  getTopRepos,
  getTotalCommits,
  getContributions,
  getAiBio,
  LANGUAGE_COLORS,
} from "../lib/github";
import { ContactForm } from "../components/contact-form";
import { ContributionHeatmap } from "../components/contribution-heatmap";
import { ProjectCard } from "../components/project-card";

export default async function Home() {
  const [user, repos, orgs, totalCommits, contributions] = await Promise.all([
    getGitHubUser(),
    getGitHubRepos(),
    getGitHubOrgs(),
    getTotalCommits(),
    getContributions(),
  ]);

  const [recentRepos, aiBio] = await Promise.all([
    getTopRepos(repos),
    getAiBio(user, repos, orgs),
  ]);
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
    knowsAbout: ["TypeScript", "JavaScript", "Rust", "Python", "Web3"],
  };

  const uniqueLangs = new Set(repos.filter((r) => !r.fork && r.language).map((r) => r.language)).size;

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
              <p className="mt-0.5 text-sm text-secondary">{aiBio}</p>
            </div>
          </div>

          {/* ── Stat: Total commits ── */}
          <div
            className="card flex flex-col justify-center animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            <span className="stat-number font-mono text-3xl font-bold">
              {totalCommits.toLocaleString()}
            </span>
            <span className="mt-1 font-mono text-[10px] text-secondary">commits</span>
          </div>

          {/* ── Stat: Repos count ── */}
          <div
            className="card flex flex-col justify-center animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <span className="stat-number font-mono text-3xl font-bold">
              {user.public_repos}
            </span>
            <span className="mt-1 font-mono text-[10px] text-secondary">repositories</span>
          </div>

          {/* ── Profile-derived cards ── */}

          {/* Location */}
          <div
            className="card flex flex-col items-center justify-center text-center animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            <MapPin size={28} className="text-accent/40" strokeWidth={1.5} />
            <span className="mt-3 block text-sm font-medium text-primary">
              Brazil
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

          {/* Web3 */}
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

          {/* Languages count + tooltip */}
          <div
            className="group card flex flex-col justify-center animate-fade-up overflow-visible"
            style={{ animationDelay: "200ms" }}
          >
            <span className="stat-number font-mono text-3xl font-bold">
              {uniqueLangs}
            </span>
            <span className="mt-1 font-mono text-[10px] text-secondary">languages</span>
            <div className="lang-tooltip">
              {[...new Set(repos.filter((r) => !r.fork && r.language).map((r) => r.language!))]
                .sort((a, b) => a.localeCompare(b))
                .map((lang) => (
                  <span key={lang}>{lang}</span>
                ))}
            </div>
          </div>

          {/* ── GitHub Orgs ── */}
          {orgs.length > 0 && (
            <div
              className="card col-span-2 lg:col-span-4 animate-fade-up"
              style={{ animationDelay: "240ms" }}
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

          {/* ── Top Projects ── */}
          {recentRepos.map((repo, i) => (
            <ProjectCard
              key={repo.name}
              name={repo.name}
              url={repo.html_url}
              language={repo.language}
              languageColor={LANGUAGE_COLORS[repo.language || ""] || "#555"}
              description={repo.description}
              animationDelay={`${280 + i * 60}ms`}
            />
          ))}

          {/* ── Flight Tracker ── */}
          <a
            href="https://iastravel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="card card-interactive arrow-link animate-fade-up col-span-2 lg:col-span-2"
            style={{ animationDelay: `${280 + recentRepos.length * 60}ms` }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane size={14} className="text-accent/40" />
                <span className="text-[11px] text-secondary">Travel</span>
              </div>
              <ArrowUpRight size={14} className="arrow" />
            </div>
            <h3 className="font-medium tracking-tight text-primary">
              Flight Tracker
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-secondary">
              Real-time flight tracking and travel planning tool
            </p>
          </a>

          {/* ── Contribution Heatmap ── */}
          <div
            className="card col-span-2 lg:col-span-3 animate-fade-up overflow-visible"
            style={{ animationDelay: `${340 + recentRepos.length * 60}ms` }}
          >
            <ContributionHeatmap data={contributions} />
          </div>

          {/* ── Links ── */}
          <div
            className="card col-span-2 lg:col-span-1 flex flex-col justify-center gap-3 animate-fade-up"
            style={{ animationDelay: `${400 + recentRepos.length * 60}ms` }}
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
          </div>

          {/* ── Contact Form ── */}
          <div
            className="card col-span-2 lg:col-span-4 animate-fade-up"
            style={{ animationDelay: `${520 + recentRepos.length * 60}ms` }}
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
