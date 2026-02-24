"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   TERMINAL LOG STREAMS — 4 columns of realistic terminal output
   ═══════════════════════════════════════════════════════════════════════ */

const S1 = [
  "[14:32:01] git push origin main",
  "[14:32:03] → Enumerating objects: 47, done.",
  "[14:32:04] → Compressing objects: 100% (23/23)",
  "[14:32:05] → Writing objects: 100% (47/47)",
  "[14:32:06] → Total 47 (delta 19), reused 0",
  "[14:32:08] docker build -t app:latest .",
  "[14:32:09] Step 1/12 : FROM node:20-alpine",
  "[14:32:10] Step 2/12 : WORKDIR /app",
  "[14:32:11] Step 3/12 : COPY package*.json ./",
  "[14:32:13] Step 4/12 : RUN npm ci --production",
  "[14:32:15] npm run build",
  "[14:32:16] ✓ Compiled successfully in 1.34s",
  "[14:32:17] ✓ Generating static pages (6/6)",
  "[14:32:19] ✓ Finalizing page optimization",
  "[14:32:20] kubectl apply -f deployment.yaml",
  "[14:32:21] deployment.apps/api configured",
  "[14:32:22] service/api-svc unchanged",
  "[14:32:23] pod/api-7d4b8c Running",
  "[14:32:25] CPU: 12% | MEM: 234MB / 512MB",
  "[14:32:27] eth0: rx 1.2GB tx 890MB",
  "[14:32:29] uptime: 47d 12h 33m",
  "[14:32:31] commit a1b2c3d (HEAD → main)",
  "[14:32:33] Author: brunodmsi",
  "[14:32:35] feat: update portfolio layout",
];

const S2 = [
  "$ ssh deploy@prod-01",
  "Last login: Mon Feb 24 08:12:33",
  "$ systemctl status nginx",
  "● nginx.service — active (running)",
  "  Main PID: 1234 (nginx)",
  "$ tail -f /var/log/app.log",
  "INFO  GET /api/health 200 12ms",
  "INFO  Cache hit ratio: 94.2%",
  "DEBUG Pool: 8/20 connections active",
  "INFO  WebSocket clients: 142",
  "$ redis-cli info memory",
  "used_memory_human: 12.4M",
  "mem_fragmentation_ratio: 1.02",
  "$ pg_stat_activity",
  "active: 23 | idle: 7 | waiting: 0",
  "$ cargo build --release",
  "Compiling api v0.1.0 (/app)",
  "Finished release [optimized]",
  "$ hardhat compile",
  "Compiled 12 Solidity files",
  "$ k9s — CONTEXT: prod-cluster",
  "NAMESPACE: default",
  "PODS: 14 running, 0 pending",
];

const S3 = [
  "GET  /api/repos     200  45ms",
  "GET  /api/user      200  23ms",
  "POST /api/contact   201  89ms",
  "CACHE HIT /repos [ttl:3600]",
  "DNS api.github.com resolved",
  "TLS handshake (23ms)",
  "X-RateLimit: 4832 remaining",
  "Content-Type: application/json",
  "WORKER pid=2847 mem=45.2MB",
  "GC pause: 1.2ms (minor)",
  "Event loop lag: 0.3ms avg",
  "▲ Next.js 16.1.6 (Turbopack)",
  "Creating optimized build...",
  "✓ Compiled in 1.5s",
  "Route /  revalidate: 1h",
  "○ (Static) prerendered",
  "$ git log --oneline -5",
  "a1b2c3d feat: contact form",
  "e4f5g6h fix: org visibility",
  "i7j8k9l refactor: use lucide",
  "m0n1o2p feat: bento grid",
  "q3r4s5t init: nextjs project",
];

const S4 = [
  "λ bun install v1.2.3",
  "+ next@16.1.6",
  "+ react@19.2.3",
  "+ lucide-react@0.447.0",
  "147 packages [2.1s]",
  "PASS tests/api.test.ts",
  "✓ fetch user data (120ms)",
  "✓ fetch repos (89ms)",
  "✓ language stats (12ms)",
  "✓ org endpoint (34ms)",
  "Tests: 12 passed, 12 total",
  "Time: 2.3s",
  "Coverage: 94% statements",
  "  branches: 87%",
  "  functions: 96%",
  "  lines: 94%",
  "tsconfig paths resolved ✓",
  "eslint: 0 errors, 0 warnings",
  "prettier: all formatted",
  "→ route / 200 in 145ms",
  "→ route /api 200 in 23ms",
  "→ sitemap.xml 200 in 3ms",
];

const STREAMS = [
  { lines: S1, duration: 48, left: "3%", opacity: 0.04 },
  { lines: S2, duration: 36, left: "28%", opacity: 0.035 },
  { lines: S3, duration: 55, left: "58%", opacity: 0.04 },
  { lines: S4, duration: 40, left: "83%", opacity: 0.03 },
];

/* ═══════════════════════════════════════════════════════════════════════ */

export default function Background() {
  useEffect(() => {
    let ticking = false;

    const onMouse = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const s = document.documentElement.style;
          s.setProperty("--mx", `${e.clientX}px`);
          s.setProperty("--my", `${e.clientY}px`);
          ticking = false;
        });
        ticking = true;
      }
    };

    const onScroll = () => {
      document.documentElement.style.setProperty(
        "--sy",
        `${window.scrollY}`
      );
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* ── Embedded styles for all background animations ── */}
      <style>{`
        /* ═ PARALLAX GRID LAYERS ═══════════════════════════════════ */
        .pg-1, .pg-2, .pg-3 {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        .pg-1 {
          top: -20%; height: 140%;
          background-image:
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px);
          background-size: 120px 120px;
          transform: translateY(calc(var(--sy, 0) * 0.02px));
        }
        .pg-2 {
          top: -10%; height: 120%;
          background-image:
            linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: translateY(calc(var(--sy, 0) * 0.06px));
        }
        .pg-3 {
          top: -15%; height: 130%;
          background-image:
            linear-gradient(rgba(34,197,94,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.035) 1px, transparent 1px);
          background-size: 30px 30px;
          transform: translateY(calc(var(--sy, 0) * 0.12px));
        }

        /* ═ TERMINAL SCROLL ════════════════════════════════════════ */
        @keyframes terminal-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .term-col {
          animation: terminal-up var(--dur) linear infinite;
          will-change: transform;
        }

        /* ═ CIRCUIT MASK — reveals near mouse ═════════════════════ */
        .circuit-mask {
          -webkit-mask-image: radial-gradient(
            400px circle at var(--mx, -500px) var(--my, -500px),
            black, transparent 70%
          );
          mask-image: radial-gradient(
            400px circle at var(--mx, -500px) var(--my, -500px),
            black, transparent 70%
          );
        }

        /* Circuit path pulse */
        @keyframes circuit-pulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.8; }
        }
        .circuit-trace {
          animation: circuit-pulse 4s ease-in-out infinite;
        }
        .circuit-trace:nth-child(2n) { animation-delay: -1.3s; }
        .circuit-trace:nth-child(3n) { animation-delay: -2.7s; }

        /* ═ SCANLINES ══════════════════════════════════════════════ */
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            var(--scanline-color) 2px,
            var(--scanline-color) 4px
          );
          opacity: var(--scanline-opacity);
          transition: opacity 0.4s ease;
        }

        /* ═ GLITCH — irregular chromatic aberration ═══════════════ */
        @keyframes glitch-r {
          0%,100%  { clip-path: inset(0 0 100% 0); }
          14.0%    { clip-path: inset(0 0 100% 0); }
          14.2%    { clip-path: inset(15% 0 55% 0); transform: translate(-3px,0); }
          14.5%    { clip-path: inset(60% 0 8% 0);  transform: translate(4px,0); }
          14.8%    { clip-path: inset(0 0 100% 0);  transform: none; }
          41.0%    { clip-path: inset(0 0 100% 0); }
          41.2%    { clip-path: inset(40% 0 25% 0); transform: translate(2px,0) skewX(1deg); }
          41.5%    { clip-path: inset(8% 0 70% 0);  transform: translate(-3px,0); }
          41.7%    { clip-path: inset(0 0 100% 0);  transform: none; }
          72.0%    { clip-path: inset(0 0 100% 0); }
          72.1%    { clip-path: inset(25% 0 40% 0); transform: translate(-2px,0); }
          72.3%    { clip-path: inset(0 0 100% 0);  transform: none; }
          91.0%    { clip-path: inset(0 0 100% 0); }
          91.2%    { clip-path: inset(5% 0 65% 0);  transform: translate(3px,0) skewX(-1deg); }
          91.5%    { clip-path: inset(50% 0 15% 0); transform: translate(-2px,0); }
          91.7%    { clip-path: inset(0 0 100% 0);  transform: none; }
        }
        @keyframes glitch-c {
          0%,100%  { clip-path: inset(0 0 100% 0); }
          14.2%    { clip-path: inset(55% 0 15% 0); transform: translate(3px,0); }
          14.5%    { clip-path: inset(8% 0 60% 0);  transform: translate(-4px,0); }
          14.8%    { clip-path: inset(0 0 100% 0);  transform: none; }
          41.2%    { clip-path: inset(25% 0 40% 0); transform: translate(-2px,0) skewX(-1deg); }
          41.5%    { clip-path: inset(70% 0 8% 0);  transform: translate(3px,0); }
          41.7%    { clip-path: inset(0 0 100% 0);  transform: none; }
          72.1%    { clip-path: inset(40% 0 25% 0); transform: translate(2px,0); }
          72.3%    { clip-path: inset(0 0 100% 0);  transform: none; }
          91.2%    { clip-path: inset(65% 0 5% 0);  transform: translate(-3px,0) skewX(1deg); }
          91.5%    { clip-path: inset(15% 0 50% 0); transform: translate(2px,0); }
          91.7%    { clip-path: inset(0 0 100% 0);  transform: none; }
        }
        .glitch-layer-r {
          position: absolute; inset: 0;
          background: rgba(255,20,60,0.04);
          animation: glitch-r 14s infinite;
          will-change: clip-path, transform;
          mix-blend-mode: screen;
        }
        .glitch-layer-c {
          position: absolute; inset: 0;
          background: rgba(0,255,200,0.04);
          animation: glitch-c 14s infinite;
          will-change: clip-path, transform;
          mix-blend-mode: screen;
        }

        /* ═ VIGNETTE — subtle edge darkening ══════════════════════ */
        .vignette {
          background: radial-gradient(
            ellipse at 50% 50%,
            transparent 50%,
            rgba(0,0,0,0.4) 100%
          );
        }
      `}</style>

      <div
        className="fixed inset-0 overflow-hidden pointer-events-none select-none"
        style={{ zIndex: 0, opacity: "var(--bg-effects-opacity)" }}
        aria-hidden="true"
      >
        {/* ── Layer 1: Parallax Grids ── */}
        <div className="pg-1" />
        <div className="pg-2" />
        <div className="pg-3" />

        {/* ── Layer 2: Terminal Columns ── */}
        {STREAMS.map((stream, i) => (
          <div
            key={i}
            className="absolute top-0 overflow-hidden hidden lg:block"
            style={{
              left: stream.left,
              width: "16%",
              height: "100%",
              opacity: stream.opacity,
            }}
          >
            <div
              className="term-col font-mono text-[10px] leading-[20px] whitespace-nowrap"
              style={{ color: "var(--accent)", "--dur": `${stream.duration}s` } as React.CSSProperties}
            >
              {/* Duplicate for seamless infinite scroll */}
              {[...stream.lines, ...stream.lines].map((line, j) => (
                <div key={j}>{line}</div>
              ))}
            </div>
          </div>
        ))}

        {/* ── Layer 3: Interactive Circuitry ── */}
        <svg
          className="circuit-mask absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="pcb"
              width="160"
              height="160"
              patternUnits="userSpaceOnUse"
            >
              {/* Horizontal traces */}
              <path
                className="circuit-trace"
                d="M0,40 H50 V20 H110 V40 H160"
                fill="none"
                stroke="#22c55e"
                strokeWidth="0.5"
              />
              <path
                className="circuit-trace"
                d="M0,80 H30 V60 H80 V100 H130 V80 H160"
                fill="none"
                stroke="#22c55e"
                strokeWidth="0.5"
              />
              <path
                className="circuit-trace"
                d="M0,120 H60 V140 H100 V120 H160"
                fill="none"
                stroke="#22c55e"
                strokeWidth="0.5"
              />
              {/* Vertical traces */}
              <path
                className="circuit-trace"
                d="M50,0 V20"
                fill="none"
                stroke="#22c55e"
                strokeWidth="0.5"
              />
              <path
                className="circuit-trace"
                d="M110,40 V80"
                fill="none"
                stroke="#22c55e"
                strokeWidth="0.5"
              />
              <path
                className="circuit-trace"
                d="M80,100 V160"
                fill="none"
                stroke="#22c55e"
                strokeWidth="0.5"
              />
              {/* Via pads / nodes */}
              <circle cx="50" cy="40" r="2.5" fill="#22c55e" opacity="0.6" />
              <circle cx="110" cy="40" r="2.5" fill="#22c55e" opacity="0.6" />
              <circle cx="80" cy="80" r="2" fill="#22c55e" opacity="0.5" />
              <circle cx="130" cy="80" r="2" fill="#22c55e" opacity="0.5" />
              <circle cx="60" cy="120" r="2.5" fill="#22c55e" opacity="0.6" />
              <circle cx="100" cy="120" r="2.5" fill="#22c55e" opacity="0.6" />
              <circle cx="80" cy="100" r="1.5" fill="#22c55e" opacity="0.4" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#pcb)"
            opacity="0.18"
          />
        </svg>

        {/* ── Layer 5: Chromatic Aberration Glitch ── */}
        <div className="glitch-layer-r" />
        <div className="glitch-layer-c" />

        {/* ── Layer 6: Vignette ── */}
        <div className="absolute inset-0 vignette" style={{ opacity: "var(--vignette-opacity)" }} />
      </div>

      {/* ── CRT Scanlines — outside opacity wrapper for theme independence ── */}
      <div
        className="fixed inset-0 scanlines pointer-events-none select-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
    </>
  );
}
