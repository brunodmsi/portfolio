"use client";

/* eslint-disable react-hooks/immutability -- R3F's simulation and uniforms are an imperative render graph. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, ShaderMaterial, Vector2, Vector3, Vector4 } from "three";
import { ConductorCharacter } from "./character";
import { LooseSparks } from "./collectibles";
import { GATES, TRACKS, getGameSnapshot, stepGame, type GameInput, type GameSnapshot, type GameState, type Track } from "./engine";
import { strandFragment, strandVertex, trailFragment, trailVertex } from "./shaders";

type Props = {
  state: RefObject<GameState>;
  input: RefObject<GameInput>;
  running: boolean;
  onReady: () => void;
  onUnavailable: (cause: string) => void;
  onSnapshot: (snapshot: GameSnapshot) => void;
};

class GraphicsBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const JOIN_SEGMENTS = 18;

/** Only b/d revisit their stem, so only their two contact neighborhoods need a shared field. */
function joinField(track: Track) {
  const applicable = track.id === "b" || track.id === "d";
  const segments = Array.from({ length: JOIN_SEGMENTS }, () => new Vector4());
  const centers = [new Vector4(), new Vector4()];
  if (!applicable) return { enabled: 0, segments, centers };
  for (let index = 1; index < track.points.length && index <= JOIN_SEGMENTS; index++) {
    const from = track.points[index - 1], to = track.points[index];
    segments[index - 1].set(from.x, from.z, to.x, to.z);
  }
  const lower = track.points[1], upper = track.points[track.points.length - 2];
  // The solid core contains every overlapping ribbon face. The shader feathers
  // only after the overlap has ended, where its inexpensive local field is safe.
  // Include the diagonal miter extent, not only the .65 half-width.
  centers[0].set(lower.x, lower.z, 1.12, 1.5);
  centers[1].set(upper.x, upper.z, 1.12, 1.5);
  return { enabled: 1, segments, centers };
}

function ribbonGeometry(track: Track) {
  // The authored dot is smaller than a walkable ribbon's half-width. Treating
  // it as an offset loop inverts its inner edge; a filled radial mesh retains
  // the same filament language without a folded band or open seam.
  if (track.id === "dot") {
    const points = track.points.slice(0, -1);
    const center = points.reduce((sum, point) => ({ x: sum.x + point.x, z: sum.z + point.z }), { x: 0, z: 0 });
    center.x /= points.length; center.z /= points.length;
    const rings = 8, segments = 48, radius = track.width * .5;
    const positions = [center.x, 0, center.z], uv = [.5, 0], indices: number[] = [];
    for (let ring = 1; ring <= rings; ring++) {
      for (let segment = 0; segment < segments; segment++) {
        const angle = segment / segments * Math.PI * 2;
        const scale = radius * ring / rings;
        positions.push(center.x + Math.cos(angle) * scale, 0, center.z + Math.sin(angle) * scale);
        // A periodic coordinate keeps the concentric filaments continuous at
        // the angular wrap instead of introducing a radial color seam.
        uv.push(ring / rings, Math.sin(angle) * radius);
        const current = 1 + (ring - 1) * segments + segment;
        const next = 1 + (ring - 1) * segments + (segment + 1) % segments;
        if (ring === 1) indices.push(0, next, current);
        else {
          const inner = current - segments, innerNext = next - segments;
          indices.push(inner, innerNext, current, current, innerNext, next);
        }
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();
    return geometry;
  }

  const samples: { x: number; z: number; distance: number }[] = [];
  let distance = 0;
  for (let i = 1; i < track.points.length; i++) {
    const a = track.points[i-1], b = track.points[i];
    const length = Math.hypot(b.x-a.x,b.z-a.z);
    const steps = Math.max(1,Math.ceil(length/.23));
    for (let j = i === 1 ? 0 : 1; j <= steps; j++) samples.push({ x: a.x+(b.x-a.x)*j/steps, z: a.z+(b.z-a.z)*j/steps, distance: distance+length*j/steps });
    distance += length;
  }
  const across = 8, positions: number[] = [], uv: number[] = [], indices: number[] = [];
  samples.forEach((point, i) => {
    const previous = samples[Math.max(0, i - 1)], next = samples[Math.min(samples.length - 1, i + 1)];
    const previousLength = Math.hypot(point.x - previous.x, point.z - previous.z) || 1;
    const nextLength = Math.hypot(next.x - point.x, next.z - point.z) || 1;
    const previousNormal = { x: -(point.z - previous.z) / previousLength, z: (point.x - previous.x) / previousLength };
    const nextNormal = { x: -(next.z - point.z) / nextLength, z: (next.x - point.x) / nextLength };
    let miterX = i === 0 ? nextNormal.x : i === samples.length - 1 ? previousNormal.x : previousNormal.x + nextNormal.x;
    let miterZ = i === 0 ? nextNormal.z : i === samples.length - 1 ? previousNormal.z : previousNormal.z + nextNormal.z;
    const miterLength = Math.hypot(miterX, miterZ) || 1;
    miterX /= miterLength; miterZ /= miterLength;
    const denominator = Math.abs(miterX * nextNormal.x + miterZ * nextNormal.z);
    // A bounded miter joins every sampled curve continuously without allowing
    // acute turns to shoot a spike through a neighboring part of the letter.
    const halfWidth = track.width * .5;
    const miter = i === 0 || i === samples.length - 1 ? halfWidth : Math.min(halfWidth / Math.max(denominator, .58), halfWidth * 1.45);
    for (let j = 0; j <= across; j++) {
      const offset = (j / across * 2 - 1) * miter;
      positions.push(point.x + miterX * offset, 0, point.z + miterZ * offset);
      uv.push(j/across,point.distance);
      if (i < samples.length-1 && j < across) {
        const a = i*(across+1)+j, b = a+across+1;
        indices.push(a,b,a+1,a+1,b,b+1);
      }
    }
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute("position",new BufferAttribute(new Float32Array(positions),3));
  geometry.setAttribute("uv",new BufferAttribute(new Float32Array(uv),2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

function Strand({ track, state, celebration }: { track: Track; state: RefObject<GameState>; celebration: RefObject<number> }) {
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(() => ribbonGeometry(track),[track]);
  const joins = useMemo(() => joinField(track), [track]);
  const material = useMemo(() => new ShaderMaterial({
    vertexShader: strandVertex, fragmentShader: strandFragment, side: DoubleSide, transparent: !track.letter, depthWrite: track.letter,
    uniforms: {
      uTime: { value: 0 }, uSpeed: { value: 0 }, uPlayer: { value: new Vector2() },
      uAwake: { value: track.unlock === 0 ? 1 : 0 }, uPulseAge: { value: 100 },
      uPulseOrigin: { value: new Vector2() }, uComplete: { value: 0 }, uLetter: { value: Number(track.letter) },
      uJoinEnabled: { value: joins.enabled }, uJoinSegments: { value: joins.segments }, uJoinCenters: { value: joins.centers },
      uRibbonHalfWidth: { value: track.width * .5 },
    },
  }),[joins, track]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); },[geometry,material]);
  useFrame((_,delta) => {
    const game = state.current, uniforms = material.uniforms;
    uniforms.uTime.value = game.time+celebration.current;
    uniforms.uSpeed.value = game.speed;
    uniforms.uPlayer.value.set(game.x,game.z);
    uniforms.uPulseOrigin.value.set(game.pulseX,game.pulseZ);
    uniforms.uPulseAge.value = game.time+celebration.current-game.pulseAt;
    uniforms.uAwake.value += (Number(track.unlock <= game.connections)-uniforms.uAwake.value)*(1-Math.exp(-delta*3));
    uniforms.uComplete.value = Math.min(1,celebration.current/3);
    if (mesh.current) mesh.current.visible = track.letter || celebration.current < 3;
  });
  return <mesh ref={mesh} geometry={geometry} material={material} />;
}

function Connections({ state, celebration }: { state: RefObject<GameState>; celebration: RefObject<number> }) {
  const gates = useRef<(Group | null)[]>([]);
  useFrame(() => {
    gates.current.forEach((group,index) => {
      if (!group) return;
      group.visible = index === state.current.connections && celebration.current === 0;
      group.rotation.y = state.current.time*.4;
      group.scale.setScalar(1+Math.sin(state.current.time*2.2)*.05);
    });
  });
  return <>{GATES.map((gate,index) => <group key={gate.id} ref={node => { gates.current[index] = node; }} position={[gate.from.x,.06,gate.from.z]}>
    <mesh rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.53,.016,5,40]} /><meshBasicMaterial color="#88edb5" /></mesh>
    <mesh position={[0,.58,0]}><octahedronGeometry args={[.09,0]} /><meshBasicMaterial color="#bfffd2" /></mesh>
    <mesh position={[0,.31,0]}><cylinderGeometry args={[.006,.006,.48,5]} /><meshBasicMaterial color="#7dfbb0" transparent opacity={.65} /></mesh>
    {[-1,1].map(side => <mesh key={side} position={[side*.63,.04,0]} rotation={[0,0,side*.4]}><sphereGeometry args={[.045,7,5]} /><meshBasicMaterial color="#b8faca" /></mesh>)}
  </group>)}</>;
}

function Footprints({ state, celebration }: { state: RefObject<GameState>; celebration: RefObject<number> }) {
  const cursor = useRef(0), last = useRef(-1);
  const { gl } = useThree();
  const geometry = useMemo(() => {
    const result = new BufferGeometry();
    result.setAttribute("position",new BufferAttribute(new Float32Array(96*3),3));
    result.setAttribute("born",new BufferAttribute(new Float32Array(96).fill(-100),1));
    return result;
  },[]);
  const material = useMemo(() => new ShaderMaterial({ vertexShader: trailVertex, fragmentShader: trailFragment, transparent: true, depthWrite: false, blending: AdditiveBlending, uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } } }),[]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); },[geometry,material]);
  useFrame(() => {
    const game = state.current;
    material.uniforms.uTime.value = game.time+celebration.current;
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    if (game.speed < .1 || game.distance-last.current < .16) return;
    last.current = game.distance;
    const index = cursor.current++%96;
    const side = index%2 ? .14 : -.14;
    geometry.attributes.position.setXYZ(index,game.x+Math.cos(game.yaw)*side,.025,game.z-Math.sin(game.yaw)*side);
    geometry.attributes.born.setX(index,game.time);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.born.needsUpdate = true;
  });
  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

function Pulse({ state, celebration }: { state: RefObject<GameState>; celebration: RefObject<number> }) {
  const ring = useRef<Mesh>(null);
  const material = useMemo(() => new MeshBasicMaterial({ color: "#9bffc9", transparent: true, opacity: 0, depthWrite: false }),[]);
  useEffect(() => () => material.dispose(),[material]);
  useFrame(() => {
    if (!ring.current) return;
    const age = state.current.time+celebration.current-state.current.pulseAt;
    ring.current.visible = age >= 0 && age < 1.65;
    ring.current.position.set(state.current.pulseX,.04,state.current.pulseZ);
    ring.current.scale.setScalar(.25+age*5);
    material.opacity = Math.max(0,1-age/1.65)*.55;
  });
  return <mesh ref={ring} rotation={[-Math.PI/2,0,0]} material={material}><ringGeometry args={[.99,1,80]} /></mesh>;
}

function Dust() {
  const geometry = useMemo(() => {
    let seed = 0xd10c9a67;
    const random = () => { seed = (seed*1664525+1013904223)>>>0; return seed/4294967296; };
    const positions = new Float32Array(180*3);
    for (let i = 0; i < 180; i++) { positions[i*3] = random()*43-20; positions[i*3+1] = random()*7-4; positions[i*3+2] = random()*29-15; }
    const result = new BufferGeometry(); result.setAttribute("position",new BufferAttribute(positions,3)); return result;
  },[]);
  useEffect(() => () => geometry.dispose(),[geometry]);
  return <points geometry={geometry}><pointsMaterial size={.019} color="#79c6a8" transparent opacity={.4} depthWrite={false} /></points>;
}

function Simulation({ state, input, running, onReady, onSnapshot, onUnavailable, low, onLower }: Props & { low: boolean; onLower: () => void }) {
  const { camera, size, gl, setFrameloop } = useThree();
  const ready = useRef(false), lastSnapshot = useRef("");
  const bearing = useRef<HTMLElement | null>(null);
  const celebration = useRef(0), look = useRef(new Vector3(state.current.x,.2,state.current.z-1.6));
  const destination = useMemo(() => new Vector3(),[]), target = useMemo(() => new Vector3(),[]);
  const budget = useRef({ last: 0, warm: 0, elapsed: 0, frames: 0, exhausted: false });
  useEffect(() => { budget.current = { last: 0, warm: 0, elapsed: 0, frames: 0, exhausted: false }; },[running,low]);
  useFrame((_, rawDelta) => {
    if (!ready.current) { ready.current = true; onReady(); }
    if (!running || document.hidden) return;
    const delta = Math.min(.05,rawDelta);
    stepGame(state.current,input.current,delta);
    const game = state.current;
    const snapshot = `${game.phase}:${game.connections}:${game.nearGate}:${game.sparks}:${game.rewardAt}`;
    if (snapshot !== lastSnapshot.current) { lastSnapshot.current = snapshot; onSnapshot(getGameSnapshot(game)); }
    // Read-only telemetry supports real-input browser tests; never controls play.
    const canvas = gl.domElement;
    canvas.dataset.playerX = game.x.toFixed(3); canvas.dataset.playerZ = game.z.toFixed(3);
    canvas.dataset.gameTime = game.time.toFixed(3); canvas.dataset.phase = game.phase;
    canvas.dataset.nearGate = game.nearGate === null ? "" : String(game.nearGate);
    canvas.dataset.sparks = String(game.sparks);
    canvas.dataset.reward = game.rewardAt >= 0 ? "earned" : "locked";
    if (!bearing.current?.isConnected) bearing.current = canvas.closest(".conductor-stage")?.querySelector<HTMLElement>(".conductor-bearing") ?? null;
    const gate = GATES[game.connections];
    if (bearing.current && gate) bearing.current.style.transform = `rotate(${Math.atan2(gate.from.x-game.x,game.z-gate.from.z)}rad)`;

    if (game.phase === "complete") celebration.current += delta;
    const reveal = Math.min(1,celebration.current/4.5);
    const blend = reveal*reveal*(3-2*reveal);
    const overhead = Math.max(21,31/(2*Math.tan(42*Math.PI/360)*(size.width/size.height)));
    destination.set(game.x*(1-blend)+1.7*blend,7.2+(overhead-7.2)*blend,(game.z+8.5)*(1-blend)+1.3*blend);
    target.set(game.x*(1-blend)+1.7*blend,.25*(1-blend),(game.z-1.6)*(1-blend)-.5*blend);
    camera.position.lerp(destination,1-Math.exp(-delta*4.5));
    look.current.lerp(target,1-Math.exp(-delta*4.5));
    camera.lookAt(look.current); camera.updateMatrixWorld();
    if (celebration.current > 7) { setFrameloop("demand"); return; }

    // Visible wall-clock windows, not FPS promises or a quota of slow frames.
    // Start low-cost; degrade DPR/geometry, then offer the honest still edition.
    const sample = budget.current, now = performance.now();
    if (sample.exhausted) return;
    if (!sample.last) { sample.last = now; return; }
    const milliseconds = now-sample.last; sample.last = now;
    if (sample.warm < 2200) { sample.warm += milliseconds; return; }
    sample.elapsed += milliseconds; sample.frames++;
    if (sample.elapsed >= 2200) {
      const mean = sample.elapsed/sample.frames;
      if (mean > 46) {
        sample.exhausted = true;
        if (low) { setFrameloop("never"); onUnavailable("budget"); }
        else onLower();
      }
      sample.elapsed = 0; sample.frames = 0;
    }
  },-2);
  return <>
    <color attach="background" args={["#050908"]} />
    {TRACKS.map(track => <Strand key={track.id} track={track} state={state} celebration={celebration} />)}
    <Connections state={state} celebration={celebration} />
    <LooseSparks state={state} celebration={celebration} />
    <Footprints state={state} celebration={celebration} />
    <Pulse state={state} celebration={celebration} />
    <Dust />
    <ConductorCharacter state={state} celebration={celebration} low={low || size.width < 700} />
  </>;
}

export default function ConductorWorld(props: Props) {
  const { onUnavailable: reportUnavailable } = props;
  const [low, setLow] = useState(false);
  const [supported, setSupported] = useState(false);
  const [visible, setVisible] = useState(true);
  const release = useRef<(() => void) | null>(null);
  const failed = useRef(false);
  const active = useRef(true);
  const onUnavailable = useCallback((cause: string) => { if (active.current && !failed.current) { failed.current = true; reportUnavailable(cause); } },[reportUnavailable]);
  const onLower = useCallback(() => setLow(true),[]);
  useEffect(() => {
    active.current = true;
    const frame = requestAnimationFrame(() => {
      // Canvas fallback children mount even on capable browsers. Probe once
      // before creating the render root; never give fallback markup an effect.
      let available = false;
      try {
        const context = document.createElement("canvas").getContext("webgl2");
        available = !!context;
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch { /* The static study remains visible. */ }
      if (available) setSupported(true);
      else onUnavailable("unavailable");
    });
    let inView = true;
    const visibility = () => setVisible(!document.hidden && inView);
    const observer = new IntersectionObserver(entries => { inView = !!entries[0]?.isIntersecting; visibility(); });
    const stage = document.querySelector(".conductor-stage");
    if (stage) observer.observe(stage);
    document.addEventListener("visibilitychange",visibility);
    return () => { active.current = false; cancelAnimationFrame(frame); release.current?.(); observer.disconnect(); document.removeEventListener("visibilitychange",visibility); };
  },[onUnavailable]);
  if (!supported) return null;
  return <GraphicsBoundary onFailure={() => onUnavailable("unavailable")}>
    <Canvas className="conductor-canvas" frameloop={!visible ? "never" : props.running ? "always" : "demand"} dpr={low ? .7 : 1} camera={{ position: [-9,7.2,13.5], fov: 42, near: .05, far: 150 }} gl={{ antialias: false, alpha: false, powerPreference: "high-performance", depth: true, stencil: false }}
      onCreated={({ gl }) => {
        const lost = (event: Event) => { event.preventDefault(); onUnavailable("context-lost"); };
        const canvas = gl.domElement;
        canvas.setAttribute("aria-hidden","true");
        canvas.addEventListener("webglcontextlost",lost);
        release.current = () => canvas.removeEventListener("webglcontextlost",lost);
      }}>
      <Simulation {...props} onUnavailable={onUnavailable} low={low} onLower={onLower} />
    </Canvas>
  </GraphicsBoundary>;
}
