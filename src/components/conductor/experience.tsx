"use client";

import dynamic from "next/dynamic";
import { ArrowDown, ArrowUp, ArrowUpRight, Move, Pause, Play, Radio, RotateCcw, X } from "lucide-react";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { createGameState, getGameSnapshot, SPARKS, TRACKS, type GameInput, type GameSnapshot } from "./engine";

const GameWorld = dynamic(() => import("./world"), { ssr: false });
type Status = "idle" | "loading" | "playing" | "paused" | "complete" | "unavailable";
const movementKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]);

class GameBoundary extends Component<{ children: ReactNode; onFailure: (cause: string) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure("unavailable"); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** A geometric plan of the actual level, available before JS and without WebGL. */
function CircuitStudy() {
  return <svg className="conductor-study" viewBox="-17 -11 38 23" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="conductor-study-metal" x1="-12" y1="-7" x2="14" y2="7" gradientUnits="userSpaceOnUse">
        <stop stopColor="#395d4b" /><stop offset=".3" stopColor="#a8dac0" /><stop offset=".57" stopColor="#43797c" /><stop offset=".85" stopColor="#b5f0cf" /><stop offset="1" stopColor="#314f42" />
      </linearGradient>
    </defs>
    <g transform="translate(0 -1) skewY(-12) scale(1 .72)">
      {TRACKS.map(track => <g key={track.id} opacity={track.letter ? .85 : .3}>
        <polyline points={track.points.map(point => `${point.x},${point.z}`).join(" ")} stroke="#0b2015" strokeWidth={track.width + .3} strokeLinecap="round" strokeLinejoin="round" />
        {[-.34, -.17, 0, .17, .34].map(offset => <polyline key={offset} transform={`translate(${offset} ${offset * .5})`} points={track.points.map(point => `${point.x},${point.z}`).join(" ")} stroke="url(#conductor-study-metal)" strokeWidth=".035" strokeLinecap="round" strokeLinejoin="round" />)}
      </g>)}
      <circle cx="-9" cy="5" r=".19" fill="#b9ffcf" />
      <circle cx="-9" cy="5" r=".46" stroke="#b9ffcf" strokeWidth=".025" />
    </g>
  </svg>;
}

export function ConductorExperience({ motionEnabled, onActiveChange }: {
  motionEnabled: boolean;
  onActiveChange: (active: boolean) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [attempt, setAttempt] = useState(0);
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => getGameSnapshot(createGameState()));
  const [reason, setReason] = useState("");
  const [pulseNotice, setPulseNotice] = useState("");
  const stage = useRef<HTMLDivElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const knob = useRef<HTMLSpanElement>(null);
  const keys = useRef(new Set<string>());
  const joystick = useRef({ x: 0, z: 0, pointer: -1 });
  const input = useRef<GameInput>({ x: 0, z: 0, pulse: 0 });
  const state = useRef(createGameState());
  const liveStatus = useRef<Status>("idle");
  const mounted = status === "loading" || status === "playing" || status === "paused" || status === "complete";
  const running = status === "playing" || status === "complete";

  const clearInput = useCallback(() => {
    keys.current.clear();
    joystick.current = { x: 0, z: 0, pointer: -1 };
    input.current.x = 0; input.current.z = 0;
    if (knob.current) knob.current.style.transform = "translate(0,0)";
  }, []);

  const changeStatus = useCallback((next: Status) => {
    liveStatus.current = next;
    setStatus(next);
  }, []);

  const exit = useCallback((restoreFocus = true) => {
    clearInput();
    changeStatus("idle");
    setReason("");
    onActiveChange(false);
    if (restoreFocus) requestAnimationFrame(() => playButton.current?.focus({ preventScroll: true }));
  }, [changeStatus, clearInput, onActiveChange]);

  const pause = useCallback((message = "Take your time. The circuit will wait.") => {
    if (liveStatus.current !== "playing") return;
    clearInput();
    changeStatus("paused");
    setReason(message);
  }, [changeStatus, clearInput]);

  useEffect(() => {
    const visibility = () => { if (document.hidden) pause("Paused while this tab is away."); };
    const blur = () => pause("Paused while the window is away.");
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) pause("Paused while you explore the page.");
    }, { threshold: 0 });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", blur);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", blur);
      clearInput();
      onActiveChange(false);
    };
  }, [clearInput, onActiveChange, pause]);

  const start = () => {
    if (!motionEnabled) return;
    clearInput();
    state.current = createGameState();
    input.current.pulse = 0;
    setSnapshot(getGameSnapshot(state.current));
    setReason(""); setPulseNotice("");
    setAttempt(value => value + 1);
    onActiveChange(true);
    changeStatus("loading");
    requestAnimationFrame(() => {
      stage.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      stage.current?.focus({ preventScroll: true });
    });
  };

  const ready = useCallback(() => {
    if (liveStatus.current === "loading") changeStatus("playing");
  }, [changeStatus]);

  const unavailable = useCallback((cause: string) => {
    clearInput();
    changeStatus("unavailable");
    onActiveChange(false);
    setReason(cause === "budget" ? "The moving world exceeded this device’s frame budget. The still study is here instead." : cause === "context-lost" ? "The graphics connection was interrupted. Your page is still here." : "This browser could not open the 3D world. The still study remains available.");
  }, [changeStatus, clearInput, onActiveChange]);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => unavailable("unavailable"), 16000);
    return () => window.clearTimeout(timer);
  }, [status, unavailable]);

  const onSnapshot = useCallback((next: GameSnapshot) => {
    setSnapshot(next);
    setPulseNotice("");
    if (next.phase === "complete") { clearInput(); changeStatus("complete"); }
  }, [changeStatus, clearInput]);

  const resume = () => {
    clearInput(); changeStatus("playing"); setReason("");
    stage.current?.focus({ preventScroll: true });
  };

  const emitPulse = () => {
    if (liveStatus.current !== "playing") return;
    input.current.pulse++;
    if (state.current.nearGate === null) setPulseNotice("Follow the lit strands to the broken connection.");
    // Native button activation remains intact; subsequent WASD belongs to the
    // stage again, including after a pointer/touch press on the Pulse control.
    stage.current?.focus({ preventScroll: true });
  };

  const updateAxes = () => {
    const down = (a: string, b: string) => Number(keys.current.has(a) || keys.current.has(b));
    input.current.x = down("KeyD", "ArrowRight") - down("KeyA", "ArrowLeft") + joystick.current.x;
    input.current.z = down("KeyS", "ArrowDown") - down("KeyW", "ArrowUp") + joystick.current.z;
  };

  const keyDown = (event: KeyboardEvent<HTMLElement>, joystickControl = false) => {
    if (!mounted) return;
    if (event.code === "Escape") { event.preventDefault(); exit(); return; }
    if (!joystickControl && (event.target as HTMLElement).closest("button, a")) return;
    if (liveStatus.current !== "playing") return;
    if (movementKeys.has(event.code)) { event.preventDefault(); keys.current.add(event.code); updateAxes(); }
    if (event.code === "Space") { event.preventDefault(); if (!event.repeat) emitPulse(); }
    if (event.code === "KeyP") { event.preventDefault(); pause(); }
  };

  const keyUp = (event: KeyboardEvent<HTMLElement>) => {
    if (movementKeys.has(event.code)) { keys.current.delete(event.code); updateAxes(); }
  };

  const moveStick = (event: PointerEvent<HTMLButtonElement>) => {
    if (joystick.current.pointer !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    let x = (event.clientX - bounds.left - bounds.width / 2) / 38;
    let z = (event.clientY - bounds.top - bounds.height / 2) / 38;
    const distance = Math.hypot(x, z);
    if (distance > 1) { x /= distance; z /= distance; }
    joystick.current.x = Math.abs(x) < .08 ? 0 : x;
    joystick.current.z = Math.abs(z) < .08 ? 0 : z;
    if (knob.current) knob.current.style.transform = `translate(${x * 30}px,${z * 30}px)`;
    updateAxes();
  };

  const releaseStick = () => { joystick.current = { x: 0, z: 0, pointer: -1 }; if (knob.current) knob.current.style.transform = "translate(0,0)"; updateAxes(); };
  const announcement = status === "complete" ? "All three connections restored. The circuit is alive." : snapshot.phase === "forming" && mounted ? "A drop becomes a conductor." : pulseNotice || (snapshot.nearGate !== null ? "A connection is within reach. Send a pulse." : "Follow the strands. Find the broken connection.");

  return <section className="conductor chapter" id="reef" aria-labelledby="conductor-heading">
    <div className="section-top conductor-heading flex items-end justify-between">
      <h2 id="conductor-heading">The<br /><span>Conductor.</span></h2>
      <p>A small world to inhabit.<br />Three connections to restore.</p>
    </div>
    <div ref={stage} className="conductor-stage" tabIndex={0} role="group" aria-label="The Conductor playable world" aria-describedby="conductor-instructions" data-game-status={status} data-connections={snapshot.connections} data-sparks={snapshot.sparks} data-reward={snapshot.rewardAt >= 0 ? "earned" : "locked"}
      onKeyDown={keyDown} onKeyUp={keyUp}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) pause("Paused. Come back whenever you like."); }}
      onPointerDown={event => { if ((event.target as HTMLElement).tagName === "CANVAS") stage.current?.focus({ preventScroll: true }); }}>
      <CircuitStudy />
      {mounted && motionEnabled && <GameBoundary key={attempt} onFailure={unavailable}><GameWorld state={state} input={input} running={running} onReady={ready} onUnavailable={unavailable} onSnapshot={onSnapshot} /></GameBoundary>}
      <div className="conductor-vignette" aria-hidden="true" />

      {!mounted ? <div className="conductor-invitation">
        <p className="conductor-invitation-title">Walk the current.<br /><span>Wake the connections.</span></p>
        {status === "unavailable" && <p className="conductor-message" role="status">{reason}</p>}
        <div className="conductor-invitation-actions">
          {motionEnabled ? <button ref={playButton} className="conductor-enter" onClick={start} data-magnetic><span className="circle-arrow"><Play size={20} /></span><span>{status === "unavailable" ? "Retry the world" : "Play the Conductor"}</span></button> : <p className="conductor-message conductor-still-hint">A study in stillness. Enable motion above to play.</p>}
          <a className="conductor-bypass" href="#spectrum" onClick={() => exit(false)}>{motionEnabled ? "Continue without playing" : "Continue exploring"}<ArrowDown size={15} /></a>
        </div>
        <p className="conductor-optional">Seven loose sparks. One entirely useless reward.<br />A short, optional journey. No rush.</p>
        <noscript><p className="conductor-message">The still study is yours to explore. Playing requires JavaScript.</p><style>{`.conductor-enter,.conductor-still-hint{display:none!important}`}</style></noscript>
      </div> : <>
        <div className="conductor-hud">
          <div className="conductor-progress">
            <div className="conductor-circuit-status" aria-label={`${snapshot.connections} of 3 connections restored`}><span className="conductor-lights" aria-hidden="true">{[0, 1, 2].map(index => <i key={index} data-lit={snapshot.connections > index} />)}</span><span>{snapshot.connections} / 3 connected</span></div>
            <div className="conductor-spark-count" aria-label={`${snapshot.sparks} of ${SPARKS.length} loose sparks collected`}><svg width="19" height="14" viewBox="0 0 19 14" fill="none" aria-hidden="true"><ellipse cx="9.5" cy="7" rx="7" ry="3.8" transform="rotate(-18 9.5 7)" stroke="currentColor" /><circle cx="15.7" cy="3.6" r="1.2" fill="currentColor" /></svg><span>{snapshot.sparks} / {SPARKS.length} sparks</span></div>
          </div>
          <div className="conductor-actions">
            {status === "playing" && <button onClick={() => pause()}><Pause size={15} /><span>Pause</span></button>}
            <button onClick={() => exit()} aria-label="Exit game and return to page"><X size={18} /><span>Exit</span></button>
          </div>
        </div>
        <p className="conductor-announcement" role="status" aria-live="polite">{status === "loading" ? "Gathering the silver…" : status === "paused" ? "The circuit is waiting." : announcement}</p>
        {status === "playing" && <span className="conductor-bearing" aria-hidden="true"><ArrowUp size={17} strokeWidth={1.2} /></span>}
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{snapshot.rewardAt >= 0 ? "All seven sparks collected. Employee of the void. A crooked halo is yours. Salary: absolutely nothing." : snapshot.sparks > 0 ? `${snapshot.sparks} of ${SPARKS.length} loose sparks collected.` : "Walk into the loose sparks to collect them. Seven earn a purely cosmetic halo."}</p>
        {(status === "playing" || status === "complete") && <div className="conductor-reward" data-earned={snapshot.rewardAt >= 0}>
          {snapshot.rewardAt >= 0 ? <><p>Employee of the void.</p><span>Salary: absolutely nothing.</span></> : status === "playing" ? <span>Walk into the loose sparks.<br />Seven earn a gloriously useless halo.</span> : <span>{snapshot.sparks} / {SPARKS.length} sparks. The useless halo awaits another walk.</span>}
        </div>}
        {status === "loading" && <div className="conductor-loading" aria-hidden="true"><i /><i /><i /></div>}
        {status === "paused" && <div className="conductor-pause"><h3>A moment<br /><span>of stillness.</span></h3><p>{reason}</p><button className="conductor-enter" onClick={resume}><span className="circle-arrow"><Play size={20} /></span>Resume the journey</button></div>}
        {status === "complete" && <div className="conductor-complete"><h3>Circuit <span>alive.</span></h3><div><button onClick={start}><RotateCcw size={17} />Walk again</button><a href="#portal" onClick={() => exit(false)}>Say hello<ArrowUpRight size={18} /></a></div></div>}
        {status === "playing" && <div className="conductor-controls">
          <button className="conductor-joystick" aria-label="Movement joystick. Use arrow keys to walk with a keyboard" onKeyDown={event => { event.stopPropagation(); keyDown(event, true); }} onKeyUp={keyUp}
            onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); joystick.current.pointer = event.pointerId; stage.current?.focus({ preventScroll: true }); moveStick(event); }}
            onPointerMove={moveStick} onPointerUp={releaseStick} onPointerCancel={releaseStick} onLostPointerCapture={releaseStick}>
            <span className="conductor-stick-guide" aria-hidden="true"><Move size={60} strokeWidth={.65} /></span><span ref={knob} className="conductor-stick-knob" aria-hidden="true" />
          </button>
          <div className="conductor-key-hint" aria-hidden="true"><span>W A S D <span> / arrows</span></span><span>walk the strands</span></div>
          <button className="conductor-pulse" onClick={emitPulse} data-ready={snapshot.nearGate !== null}><Radio size={26} strokeWidth={1.2} /><span>Pulse</span><small aria-hidden="true">space</small></button>
        </div>}
      </>}
    </div>
    <div className="conductor-after">
      <p id="conductor-instructions">WASD or arrow keys to walk. Space to pulse. On touch, use the joystick and Pulse. Walk into loose sparks to collect them. Escape exits. You can scroll away at any time.</p>
      <a href="#spectrum" className="text-link" onClick={() => exit(false)} data-magnetic>Continue exploring<ArrowDown size={17} /></a>
    </div>
  </section>;
}
