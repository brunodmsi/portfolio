"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface Props {
  name: string;
  url: string;
  language: string | null;
  languageColor: string;
  description: string | null;
  animationDelay: string;
}

interface InsightData {
  insight: string;
  tags: string[];
}

const insightCache = new Map<string, InsightData>();

export function ProjectCard({
  name,
  url,
  language,
  languageColor,
  description,
  animationDelay,
}: Props) {
  const [data, setData] = useState<InsightData | null>(
    insightCache.get(name) ?? null
  );
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedRef = useRef(false);

  const handleEnter = useCallback(() => {
    setShow(true);

    if (insightCache.has(name)) {
      setData(insightCache.get(name)!);
      return;
    }

    if (fetchedRef.current) return;

    timerRef.current = setTimeout(async () => {
      fetchedRef.current = true;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/repo-insight?repo=${encodeURIComponent(name)}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.insight) {
            const d: InsightData = {
              insight: json.insight,
              tags: json.tags || [],
            };
            insightCache.set(name, d);
            setData(d);
          }
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [name]);

  const handleLeave = useCallback(() => {
    setShow(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-interactive arrow-link animate-fade-up col-span-2 lg:col-span-2"
      style={{ animationDelay }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: languageColor }}
          />
          <span className="text-[11px] text-secondary">{language}</span>
        </div>
        <ArrowUpRight size={14} className="arrow" />
      </div>
      <h3 className="font-medium tracking-tight text-primary">{name}</h3>
      {description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-secondary">
          {description}
        </p>
      )}

      {/* AI Insight */}
      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: show && (data || loading) ? "1fr" : "0fr",
          opacity: show && (data || loading) ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-3 border-t border-[var(--card-border)] pt-3">
            {/* Tags */}
            {data?.tags && data.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--accent)]/20 bg-[var(--accent-dim)] px-2 py-0.5 font-mono text-[9px] text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Insight text */}
            <div className="flex items-start gap-2">
              <Sparkles
                size={12}
                className={`mt-0.5 shrink-0 text-accent/50 ${loading ? "animate-pulse" : ""}`}
              />
              {loading && !data ? (
                <span className="font-mono text-[10px] text-secondary animate-pulse">
                  analyzing...
                </span>
              ) : data?.insight ? (
                <p className="font-mono text-[10px] leading-relaxed text-secondary">
                  {data.insight}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
