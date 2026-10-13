"use client";

import dynamic from "next/dynamic";
import { ArrowDown, ArrowUp, ArrowUpRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { biography, chapters, company, languagePositions, languages, organizations, socials } from "@/lib/portfolio";
import { StaticFilaments } from "./static-filaments";
import { ConductorExperience } from "../conductor/experience";
import type { WorldInput } from "./types";

const World = dynamic(() => import("./world"), { ssr: false });
let sessionMotion: boolean | undefined;

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  window.addEventListener("sinapse-motion", callback);
  window.addEventListener("storage", callback);
  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener("sinapse-motion", callback);
    window.removeEventListener("storage", callback);
  };
}

function getMotion() {
  if (sessionMotion !== undefined) return sessionMotion;
  try {
    const stored = localStorage.getItem("sinapse-motion");
    if (stored) return stored === "on";
  } catch { /* System preference remains available without storage. */ }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeFine(callback: () => void) {
  const media = window.matchMedia("(pointer: fine) and (hover: hover)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

const getFine = () => window.matchMedia("(pointer: fine) and (hover: hover)").matches && !(navigator.maxTouchPoints > 0 && window.innerWidth < 700);
const staticSnapshot = () => false;

export function Portfolio() {
  const requestedMotion = useSyncExternalStore(subscribeMotion, getMotion, staticSnapshot);
  const finePointer = useSyncExternalStore(subscribeFine, getFine, staticSnapshot);
  const [renderer, setRenderer] = useState<"loading" | "ready" | "unavailable" | "context-lost" | "still-budget">("loading");
  const [quality, setQuality] = useState("pending");
  const [gameEngaged, setGameEngaged] = useState(false);
  const rendererFailed = renderer === "unavailable" || renderer === "context-lost" || renderer === "still-budget";
  const effectiveMotion = requestedMotion && !rendererFailed && !gameEngaged;
  const animating = effectiveMotion && renderer === "ready";
  const [chapter, setChapter] = useState(0);
  const [language, setLanguage] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const currentChapter = useRef(0);
  const gameWasActive = useRef(false);
  const world = useRef<WorldInput>({ progress: 0, pointer: [0, 0], pulse: -100, velocity: 0, language: null, languageAnchors: [] });

  const onGameActiveChange = useCallback((active: boolean) => {
    setGameEngaged((current) => current === active ? current : active);
  }, []);

  // The conductor owns the only live canvas while playing. Its exit creates a
  // clean background attempt without letting a stale renderer callback loop.
  useEffect(() => {
    if (gameEngaged) {
      gameWasActive.current = true;
      return;
    }
    if (!gameWasActive.current) return;
    gameWasActive.current = false;
    if (!requestedMotion) return;
    setRenderer((current) => current === "loading" ? current : "loading");
    setQuality((current) => current === "pending" ? current : "pending");
  }, [gameEngaged, requestedMotion]);

  const onReady = useCallback(() => setRenderer((current) => current === "loading" ? "ready" : current), []);
  const onUnavailable = useCallback((reason: "unavailable" | "context-lost" = "unavailable") => setRenderer(reason), []);
  const onBudgetFallback = useCallback(() => setRenderer("still-budget"), []);

  useEffect(() => {
    const languageElements = Array.from(document.querySelectorAll<HTMLElement>("[data-language-anchor]"));
    let scheduled = 0;
    const measure = () => {
      scheduled = 0;
      const scroll = window.scrollY;
      // The conductor is client-only; resolve chapter elements on each measure
      // so its reef anchor joins the depth system as soon as it hydrates.
      const starts = chapters.map(({ id }) => {
        const element = document.getElementById(id);
        return (element?.getBoundingClientRect().top ?? 0) + scroll;
      });
      let current = 0;
      for (let i = 0; i < starts.length; i++) if (scroll >= starts[i] - 1) current = i;
      const end = starts[current + 1] ?? document.documentElement.scrollHeight;
      const offset = Math.max(0, (scroll - starts[current]) / Math.max(1, end - starts[current]));
      world.current.progress = current + Math.min(offset, current === 4 ? .45 : 1);
      world.current.languageAnchors = languageElements.map((element) => element.getBoundingClientRect());
      if (currentChapter.current !== current) {
        currentChapter.current = current;
        setChapter(current);
      }
    };
    const schedule = () => { if (!scheduled) scheduled = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.fonts.ready.then(schedule);
    const resize = new ResizeObserver(schedule);
    if (root.current) resize.observe(root.current);
    return () => {
      cancelAnimationFrame(scheduled);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!animating || !finePointer) return;
    let frame = 0;
    let disposed = false;
    let destroy = () => {};
    import("lenis").then(({ default: Lenis }) => {
      if (disposed) return;
      const lenis = new Lenis({ duration: 1.2, smoothWheel: true, syncTouch: false, anchors: { offset: 0 } });
      const tick = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(tick); };
      const visibility = () => {
        cancelAnimationFrame(frame);
        if (document.hidden) lenis.stop();
        else { lenis.start(); frame = requestAnimationFrame(tick); }
      };
      visibility();
      document.addEventListener("visibilitychange", visibility);
      destroy = () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", visibility); lenis.destroy(); };
    });
    return () => { disposed = true; destroy(); };
  }, [animating, finePointer]);

  useEffect(() => {
    if (!animating) return;
    const pointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      world.current.velocity = Math.min(1, Math.hypot(x - world.current.pointer[0], y - world.current.pointer[1]) * 12);
      world.current.pointer = [x, y];
    };
    const pulse = () => { world.current.pulse = performance.now() / 1000; };
    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("pointerdown", pulse, { passive: true });
    return () => { window.removeEventListener("pointermove", pointerMove); window.removeEventListener("pointerdown", pulse); };
  }, [animating]);

  useEffect(() => {
    if (!animating || !finePointer) return;
    let frame = 0;
    let targetX = -100, targetY = -100, x = -100, y = -100;
    let magnetic: HTMLElement | null = null;
    const pointer = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      magnetic = (event.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");
      if (cursor.current) cursor.current.style.opacity = "1";
    };
    const leave = () => { if (cursor.current) cursor.current.style.opacity = "0"; };
    const tick = () => {
      let tx = targetX, ty = targetY;
      if (magnetic) {
        const bounds = magnetic.getBoundingClientRect();
        tx += (bounds.left + bounds.width / 2 - tx) * .23;
        ty += (bounds.top + bounds.height / 2 - ty) * .23;
      }
      x += (tx - x) * .18;
      y += (ty - y) * .18;
      if (cursor.current) cursor.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${magnetic ? 1.65 : 1})`;
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => { cancelAnimationFrame(frame); if (!document.hidden) frame = requestAnimationFrame(tick); };
    window.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    const cursorElement = cursor.current;
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", pointer);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      if (cursorElement) cursorElement.style.opacity = "0";
    };
  }, [animating, finePointer]);

  const toggleMotion = () => {
    const enable = rendererFailed ? true : !requestedMotion;
    sessionMotion = enable;
    try { localStorage.setItem("sinapse-motion", enable ? "on" : "off"); } catch { /* The in-memory preference supports browsers without storage. */ }
    if (enable) {
      setRenderer((current) => current === "loading" ? current : "loading");
      setQuality("pending");
      world.current.velocity = 0;
      world.current.pulse = -100;
    }
    window.dispatchEvent(new Event("sinapse-motion"));
  };

  const illuminate = (index: number) => {
    const next = language === index ? null : index;
    setLanguage(next);
    world.current.language = next;
    world.current.pulse = performance.now() / 1000;
  };

  const sceneState = requestedMotion ? renderer : "static";
  const rendererState = gameEngaged ? "suspended" : sceneState;
  const motionLabel = requestedMotion && rendererFailed && !gameEngaged ? "Retry motion" : requestedMotion ? "Motion on" : "Motion off";
  const motionAction = rendererFailed && !gameEngaged ? "try animation again" : requestedMotion ? "pause animation" : "enable animation";
  const motionReason = !requestedMotion ? "preference" : renderer === "still-budget" ? "performance" : rendererFailed ? "renderer" : "enabled";
  const reportedQuality = gameEngaged ? "suspended" : effectiveMotion ? quality : sceneState === "still-budget" ? "still-budget" : "static";

  return <div ref={root} className="sinapse" data-mode={effectiveMotion || (gameEngaged && requestedMotion) ? "motion" : "static"} data-motion-reason={motionReason} data-renderer={rendererState} data-quality={reportedQuality} data-pointer={finePointer ? "fine" : "coarse"} data-scene-ready={rendererState === "ready" ? "true" : "false"}>
    <a href="#current" className="skip-link">Skip to content</a>
    <div className="world-layer" aria-hidden="true"><StaticFilaments />{effectiveMotion && <World input={world} eventSource={root} onReady={onReady} onUnavailable={onUnavailable} onBudgetFallback={onBudgetFallback} onQuality={setQuality} />}</div>
    <div className="edge-light" aria-hidden="true" />
    <div ref={cursor} className="magnetic-cursor" aria-hidden="true" />

    <header className="site-header flex items-center justify-between">
      <a className="identity" href="#surface" aria-label="bdm. — Bruno De Masi, back to surface" data-magnetic>bdm<span aria-hidden="true">.</span></a>
      <nav aria-label="Main navigation" className="desktop-nav flex items-center gap-8">{chapters.slice(1).map(({ id, label }, i) => <a key={id} href={`#${id}`} aria-current={chapter === i + 1 ? "location" : undefined} data-magnetic>{label}</a>)}</nav>
      <button className="motion-toggle flex items-center gap-2" onClick={toggleMotion} aria-label={`${motionLabel} — ${motionAction}`} aria-pressed={requestedMotion} data-magnetic>{requestedMotion ? <Pause size={12} /> : <Play size={12} />}<span>{motionLabel}</span></button>
    </header>

    <main>
      <section className="hero chapter" id="surface" aria-labelledby="name">
        <div className="hero-position"><span className="live-dot" aria-hidden="true" />Senior Software Engineer</div>
        <h1 id="name" className="hero-name"><span>Bruno</span>{" "}<span className="surname">De Masi</span></h1>
        <div className="hero-bottom flex items-end justify-between"><a href="#current" className="journey-link flex items-center gap-4" data-magnetic><span className="circle-arrow"><ArrowDown size={20} strokeWidth={1.4} /></span><span>Scroll to connect</span></a><p className="interaction-hint">{animating ? (finePointer ? "Move to tension. Click to pulse." : "Touch to send a pulse.") : "Follow the connections."}</p></div>
        <div className="formation" role="status" aria-live="polite">{rendererState === "loading" ? <><span className="formation-strands" aria-hidden="true"><i /><i /><i /></span><span>Connecting the strands</span></> : rendererState === "still-budget" ? <span>Motion paused to keep this page responsive.</span> : rendererState === "unavailable" || rendererState === "context-lost" ? <span>Still view · Retry motion to reconnect.</span> : null}</div>
      </section>

      <section className="current chapter" id="current" aria-labelledby="about-heading">
        <div className="current-heading"><h2 id="about-heading">A little<br /><span>about me.</span></h2><a href="#reef" className="text-link" data-magnetic>Enter the current <ArrowDown size={17} /></a></div>
        <div className="biography"><p>{biography}</p><div className="bio-facts flex flex-wrap gap-x-8 gap-y-3"><span>Brazil</span><span>Computer Science</span><span>Web3</span></div><div className="organizations"><h3>Organizations</h3><div className="flex flex-wrap gap-x-7 gap-y-4">{organizations.map((org) => <a key={org} href={`https://github.com/${org}`} target="_blank" rel="noopener noreferrer" data-magnetic>{org}<ArrowUpRight size={13} /></a>)}</div></div></div>
      </section>

      <ConductorExperience key={requestedMotion ? "motion" : "still"} motionEnabled={requestedMotion} onActiveChange={onGameActiveChange} />

      <section className="spectrum chapter" id="spectrum" aria-labelledby="languages-heading">
        <div className="section-top flex items-end justify-between"><h2 id="languages-heading">Many<br /><span>languages.</span></h2><p>A constellation of tools.</p></div>
        <div className="language-map" role="group" aria-label="Twelve languages"><div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" /><div className="orbit orbit-three" aria-hidden="true" />{languages.map((name, i) => <button key={name} className="language" data-language-anchor={i} aria-label={`Illuminate ${name}`} aria-pressed={language === i} onClick={() => illuminate(i)} style={{ "--x": `${languagePositions[i][0]}%`, "--y": `${languagePositions[i][1]}%` } as CSSProperties} data-magnetic><span className="language-particle" aria-hidden="true" />{name}</button>)}</div>
      </section>

      <section className="portal chapter" id="portal" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Get in<br /><span>touch.</span></h2>
        <a className="email-link flex items-center justify-between" href="mailto:bruno@demasi.dev" data-magnetic><span>bruno@demasi.dev</span><ArrowUpRight strokeWidth={1.2} /></a>
        <div className="social-links flex flex-wrap gap-x-10 gap-y-5">{socials.map(({ name, href }) => <a href={href} key={name} target="_blank" rel="noopener noreferrer" data-magnetic>{name}<ArrowUpRight size={17} /></a>)}</div>
        <footer className="site-footer flex items-center justify-between"><span className="site-company">Bruno De Masi<small>{company.name} · {company.registry} · {company.place}</small></span><a href="#surface" className="flex items-center gap-3" data-magnetic>Back to surface<ArrowUp size={16} /></a></footer>
      </section>
    </main>

    <nav className="mobile-nav" aria-label="Mobile navigation">{chapters.slice(1).map(({ id, label }, i) => <a key={id} href={`#${id}`} aria-current={chapter === i + 1 ? "location" : undefined}>{label}</a>)}</nav>
    <div className="depth-track" aria-hidden="true"><span style={{ transform: `translateY(${chapter * 23}px)` }} />{chapters.map(({ id }) => <i key={id} />)}</div>
    <noscript><style>{`.formation,.motion-toggle,.interaction-hint{display:none!important}`}</style></noscript>
  </div>;
}
