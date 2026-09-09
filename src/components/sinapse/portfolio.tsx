"use client";

import dynamic from "next/dynamic";
import { ArrowDown, ArrowUpRight, ArrowRight, X, Pause, Play, ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { biography, chapters, languagePositions, languages, organizations, projects, socials } from "@/lib/portfolio";
import { StaticFilaments, StaticNode } from "./static-filaments";
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
  const rendererFailed = renderer === "unavailable" || renderer === "context-lost" || renderer === "still-budget";
  const effectiveMotion = requestedMotion && !rendererFailed;
  const animating = effectiveMotion && renderer === "ready";
  const [chapter, setChapter] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [language, setLanguage] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const currentChapter = useRef(0);
  const world = useRef<WorldInput>({ progress: 0, pointer: [0, 0], pulse: -100, velocity: 0, project: null, language: null, projectAnchors: [], languageAnchors: [] });

  const openProject = useCallback((index: number) => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    world.current.project = index;
    world.current.pulse = performance.now() / 1000;
    setSelected(index);
  }, []);

  const closeProject = useCallback(() => {
    world.current.project = null;
    setSelected(null);
  }, []);

  // A last in-flight frame must not reactivate a renderer after it has failed.
  const onReady = useCallback(() => setRenderer((current) => current === "loading" ? "ready" : current), []);
  const onUnavailable = useCallback((reason: "unavailable" | "context-lost" = "unavailable") => setRenderer(reason), []);
  const onBudgetFallback = useCallback(() => setRenderer("still-budget"), []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (selected !== null) {
      element.showModal();
      document.body.style.overflow = "hidden";
      closeButton.current?.focus({ preventScroll: true });
    } else {
      element.close();
      document.body.style.overflow = "";
      previousFocus.current?.focus({ preventScroll: true });
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  useEffect(() => {
    const sectionElements = chapters.map(({ id }) => document.getElementById(id));
    const projectElements = Array.from(document.querySelectorAll<HTMLElement>("[data-project-anchor]"));
    const languageElements = Array.from(document.querySelectorAll<HTMLElement>("[data-language-anchor]"));
    let scheduled = 0;
    const measure = () => {
      scheduled = 0;
      const scroll = window.scrollY;
      const starts = sectionElements.map((element) => (element?.getBoundingClientRect().top ?? 0) + scroll);
      let current = 0;
      for (let i = 0; i < starts.length; i++) if (scroll >= starts[i] - 1) current = i;
      const end = starts[current + 1] ?? document.documentElement.scrollHeight;
      const offset = Math.max(0, (scroll - starts[current]) / Math.max(1, end - starts[current]));
      world.current.progress = current + Math.min(offset, current === 4 ? .45 : 1);
      world.current.projectAnchors = projectElements.map((element) => element.getBoundingClientRect());
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
    // Lenis enhances desktop wheel input. Touch scrolling stays browser-native.
    import("lenis").then(({ default: Lenis }) => {
      if (disposed) return;
      const lenis = new Lenis({ duration: 1.2, smoothWheel: true, syncTouch: false, anchors: { offset: 0 }, prevent: (node) => node.tagName === "DIALOG" });
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
    const enable = !effectiveMotion;
    sessionMotion = enable;
    // Only an explicit visitor choice is persisted. Device/renderer failures
    // remain local to this attempt and can never overwrite their preference.
    try { localStorage.setItem("sinapse-motion", enable ? "on" : "off"); } catch { /* The in-memory preference supports browsers without storage. */ }
    if (enable) {
      setRenderer("loading");
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

  const activeProject = selected === null ? null : projects[selected];
  const sceneState = requestedMotion ? renderer : "static";
  const motionLabel = requestedMotion && rendererFailed ? "Retry motion" : effectiveMotion ? "Motion on" : "Motion off";
  const motionAction = effectiveMotion ? "pause animation" : rendererFailed ? "try animation again" : "enable animation";
  const motionReason = !requestedMotion ? "preference" : renderer === "still-budget" ? "performance" : rendererFailed ? "renderer" : "enabled";
  const reportedQuality = effectiveMotion ? quality : sceneState === "still-budget" ? "still-budget" : "static";

  return (
    <div ref={root} className="sinapse" data-mode={effectiveMotion ? "motion" : "static"} data-motion-reason={motionReason} data-renderer={sceneState} data-quality={reportedQuality} data-pointer={finePointer ? "fine" : "coarse"} data-scene-ready={sceneState === "ready" ? "true" : "false"}>
      <a href="#current" className="skip-link">Skip to content</a>
      <div className="world-layer" aria-hidden="true">
        <StaticFilaments />
        {effectiveMotion && <World input={world} eventSource={root} onReady={onReady} onUnavailable={onUnavailable} onBudgetFallback={onBudgetFallback} onQuality={setQuality} onProject={openProject} />}
      </div>
      <div className="edge-light" aria-hidden="true" />
      <div ref={cursor} className="magnetic-cursor" aria-hidden="true" />

      <header className="site-header flex items-center justify-between">
        <a className="identity flex items-center gap-3" href="#surface" aria-label="demasi.dev — Bruno De Masi, back to surface" data-magnetic>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M3 22 10 6l8 16L25 6M7 14h15" stroke="currentColor" strokeWidth="1.5" /></svg>
          <span>demasi.dev</span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav flex items-center gap-8">
          {chapters.slice(1).map(({ id, label }, i) => <a key={id} href={`#${id}`} aria-current={chapter === i + 1 ? "location" : undefined} data-magnetic>{label}</a>)}
        </nav>
        <button className="motion-toggle flex items-center gap-2" onClick={toggleMotion} aria-label={`${motionLabel} — ${motionAction}`} aria-pressed={effectiveMotion} data-magnetic>
          {effectiveMotion ? <Pause size={12} /> : <Play size={12} />}<span>{motionLabel}</span>
        </button>
      </header>

      <main>
        <section className="hero chapter" id="surface" aria-labelledby="name">
          <div className="hero-position"><span className="live-dot" aria-hidden="true" />Senior Software Engineer</div>
          <h1 id="name" className="hero-name"><span>Bruno</span>{" "}<span className="surname">De Masi</span></h1>
          <div className="hero-bottom flex items-end justify-between">
            <a href="#current" className="journey-link flex items-center gap-4" data-magnetic><span className="circle-arrow"><ArrowDown size={20} strokeWidth={1.4} /></span><span>Scroll to connect</span></a>
            <p className="interaction-hint">{animating ? (finePointer ? "Move to tension. Click to pulse." : "Touch to send a pulse.") : "Follow the connections."}</p>
          </div>
          <div className="formation" role="status" aria-live="polite">{sceneState === "loading" ? <><span className="formation-strands" aria-hidden="true"><i /><i /><i /></span><span>Connecting the strands</span></> : sceneState === "still-budget" ? <span>Motion paused to keep this page responsive.</span> : sceneState === "unavailable" || sceneState === "context-lost" ? <span>Still view · Retry motion to reconnect.</span> : null}</div>
        </section>

        <section className="current chapter" id="current" aria-labelledby="about-heading">
          <div className="current-heading"><h2 id="about-heading">A little<br /><span>about me.</span></h2><a href="#reef" className="text-link" data-magnetic>Follow the work <ArrowDown size={17} /></a></div>
          <div className="biography"><p>{biography}</p><div className="bio-facts flex flex-wrap gap-x-8 gap-y-3"><span>Brazil</span><span>Computer Science</span><span>Web3</span></div>
            <div className="organizations"><h3>Organizations</h3><div className="flex flex-wrap gap-x-7 gap-y-4">{organizations.map((org) => <a key={org} href={`https://github.com/${org}`} target="_blank" rel="noopener noreferrer" data-magnetic>{org}<ArrowUpRight size={13} /></a>)}</div></div>
          </div>
        </section>

        <section className="reef chapter" id="reef" aria-labelledby="work-heading">
          <div className="section-top flex items-end justify-between"><h2 id="work-heading">Selected<br /><span>work.</span></h2><p>Four points of connection.<br />Choose one to look closer.</p></div>
          <div className="project-field">
            {projects.map((project, i) => (
              <article key={project.id} className={`project project-${i}`} aria-labelledby={`project-${project.id}`}>
                <button className="project-node" data-project-anchor={i} onClick={() => openProject(i)} aria-label={`Inspect ${project.name}`} aria-haspopup="dialog" data-magnetic><StaticNode index={i} /><span className="node-cross" aria-hidden="true"><span /><span /></span><span className="node-action">Inspect <ArrowUpRight size={13} /></span></button>
                <div className="project-copy"><span className="project-category">{project.category}</span><h3 id={`project-${project.id}`}><button onClick={() => openProject(i)} aria-label={`Open ${project.name} details`} aria-haspopup="dialog" data-magnetic>{project.name}<ArrowUpRight aria-hidden="true" /></button></h3>{project.description && <p>{project.description}</p>}<a href={project.url} target="_blank" rel="noopener noreferrer" className="project-destination" data-magnetic>{project.destination}<ArrowUpRight size={14} /></a></div>
              </article>
            ))}
          </div>
        </section>

        <section className="spectrum chapter" id="spectrum" aria-labelledby="languages-heading">
          <div className="section-top flex items-end justify-between"><h2 id="languages-heading">Many<br /><span>languages.</span></h2><p>A constellation of tools.</p></div>
          <div className="language-map" role="group" aria-label="Twelve languages">
            <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" /><div className="orbit orbit-three" aria-hidden="true" />
            {languages.map((name, i) => <button key={name} className="language" data-language-anchor={i} aria-label={`Illuminate ${name}`} aria-pressed={language === i} onClick={() => illuminate(i)} style={{ "--x": `${languagePositions[i][0]}%`, "--y": `${languagePositions[i][1]}%` } as CSSProperties} data-magnetic><span className="language-particle" aria-hidden="true" />{name}</button>)}
          </div>
        </section>

        <section className="portal chapter" id="portal" aria-labelledby="contact-heading">
          <h2 id="contact-heading">Get in<br /><span>touch.</span></h2>
          <a className="email-link flex items-center justify-between" href="mailto:bruno@demasi.dev" data-magnetic><span>bruno@demasi.dev</span><ArrowUpRight strokeWidth={1.2} /></a>
          <div className="social-links flex flex-wrap gap-x-10 gap-y-5">{socials.map(({ name, href }) => <a href={href} key={name} target="_blank" rel="noopener noreferrer" data-magnetic>{name}<ArrowUpRight size={17} /></a>)}</div>
          <footer className="site-footer flex items-center justify-between"><span>Bruno De Masi</span><a href="#surface" className="flex items-center gap-3" data-magnetic>Back to surface<ArrowUp size={16} /></a></footer>
        </section>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">{chapters.slice(1).map(({ id, label }, i) => <a key={id} href={`#${id}`} aria-current={chapter === i + 1 ? "location" : undefined}>{label}</a>)}</nav>
      <div className="depth-track" aria-hidden="true"><span style={{ transform: `translateY(${chapter * 23}px)` }} />{chapters.map(({ id }) => <i key={id} />)}</div>

      <dialog ref={dialog} className="project-dialog" aria-labelledby="detail-heading" aria-describedby={activeProject?.description ? "detail-description" : undefined} onCancel={(event) => { event.preventDefault(); closeProject(); }} onClick={(event) => { if (event.target === event.currentTarget) closeProject(); }} onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }}>
        {activeProject && <><div className="dialog-static-node" aria-hidden="true"><StaticNode index={selected ?? 0} /></div><article className="detail-panel"><button ref={closeButton} className="detail-close flex items-center gap-3" onClick={closeProject} aria-label="Close project details" data-magnetic>Close<X size={21} strokeWidth={1.3} /></button><p className="project-category">{activeProject.category}</p><h2 id="detail-heading">{activeProject.name}</h2>{activeProject.description && <p id="detail-description">{activeProject.description}</p>}<a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="detail-destination flex items-center justify-between" data-magnetic>{activeProject.destination}<ArrowUpRight size={24} /></a><button className="return-link" onClick={closeProject} data-magnetic><ArrowRight size={16} />Return to the connections</button></article></>}
      </dialog>
      <noscript><style>{`.formation,.motion-toggle,.node-action,.interaction-hint{display:none!important}.project-node,.project-copy h3 button{pointer-events:none}.project-destination{font-size:15px!important}`}</style></noscript>
    </div>
  );
}
