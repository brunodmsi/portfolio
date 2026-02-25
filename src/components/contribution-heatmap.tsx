"use client";

import { useState, useRef, Fragment } from "react";
import type { ContributionData } from "../lib/github";

interface Props {
  data: ContributionData;
}

export function ContributionHeatmap({ data }: Props) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const weeks = data.weeks.slice(-14);

  const allCounts = weeks.flatMap((w) =>
    w.contributionDays.map((d) => d.contributionCount)
  );
  const max = Math.max(...allCounts, 1);

  let peakDay = { date: "", contributionCount: 0 };
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > peakDay.contributionCount) {
        peakDay = day;
      }
    }
  }

  function getOpacity(count: number): number {
    if (count === 0) return 0;
    const ratio = count / max;
    if (ratio <= 0.25) return 0.2;
    if (ratio <= 0.5) return 0.4;
    if (ratio <= 0.75) return 0.65;
    return 0.9;
  }

  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const month = new Date(firstDay.date + "T00:00:00").getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          label: new Date(firstDay.date + "T00:00:00").toLocaleDateString(
            "en-US",
            { month: "short" }
          ),
          col: i,
        });
        lastMonth = month;
      }
    }
  });

  const dayLabels: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  function handleMouseEnter(
    e: React.MouseEvent<HTMLDivElement>,
    day: { date: string; contributionCount: number }
  ) {
    if (!gridRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const gridRect = gridRef.current.getBoundingClientRect();
    setTooltip({
      text: `${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""} — ${formatDate(day.date)}`,
      x: rect.left - gridRect.left + rect.width / 2,
      y: rect.top - gridRect.top,
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-baseline gap-3 flex-wrap">
        <span className="font-mono text-sm text-secondary">
          <span className="stat-number font-bold">
            {data.totalContributions.toLocaleString()}
          </span>{" "}
          contributions
        </span>
        {peakDay.contributionCount > 0 && (
          <span className="font-mono text-[10px] text-secondary">
            peak: {peakDay.contributionCount} on {formatDate(peakDay.date)}
          </span>
        )}
      </div>

      {/* Grid wrapper */}
      <div ref={gridRef} className="relative">
        {/* Month labels row */}
        <div
          className="grid gap-[3px] mb-1"
          style={{
            gridTemplateColumns: `28px repeat(${weeks.length}, minmax(0, 24px))`,
          }}
        >
          <div /> {/* spacer for day labels column */}
          {weeks.map((_, i) => {
            const ml = monthLabels.find((m) => m.col === i);
            return (
              <div key={i} className="font-mono text-[9px] text-secondary truncate">
                {ml?.label || ""}
              </div>
            );
          })}
        </div>

        {/* Day grid: 7 rows x N+1 cols */}
        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateColumns: `28px repeat(${weeks.length}, minmax(0, 24px))`,
            gridTemplateRows: "repeat(7, minmax(0, 24px))",
          }}
        >
          {Array.from({ length: 7 }, (_, row) => (
            <Fragment key={`row-${row}`}>
              {/* Day label */}
              <div
                className="flex items-center font-mono text-[9px] text-secondary"
              >
                {dayLabels[row] || ""}
              </div>
              {/* Cells for this row across all weeks */}
              {weeks.map((week, wi) => {
                const day = week.contributionDays[row];
                if (!day) return <div key={`empty-${wi}-${row}`} />;
                return (
                  <div
                    key={day.date}
                    className="aspect-square w-full rounded-[3px] cursor-crosshair"
                    style={{
                      backgroundColor:
                        day.contributionCount === 0
                          ? "var(--card-border)"
                          : `color-mix(in srgb, var(--accent) ${getOpacity(day.contributionCount) * 100}%, transparent)`,
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute rounded-md border border-[var(--card-border)] bg-[var(--card)] px-2.5 py-1.5 font-mono text-[10px] text-secondary whitespace-nowrap shadow-lg backdrop-blur-md"
            style={{
              zIndex: 50,
              left: Math.max(80, Math.min(tooltip.x, gridRef.current ? gridRef.current.offsetWidth - 80 : tooltip.x)),
              top: tooltip.y - 6,
              transform: "translate(-50%, -100%)",
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
}
