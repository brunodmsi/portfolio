"use client";

/* eslint-disable react-hooks/immutability -- Three.js uniforms and scene objects are an imperative render graph updated in useFrame, not React state. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction, Effect } from "postprocessing";
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Color, Group, Mesh, PerspectiveCamera, ShaderMaterial, Uniform, Vector2, Vector3, DoubleSide, ACESFilmicToneMapping, BufferAttribute, BufferGeometry } from "three";
import { createFilaments, createNode, createOrbit, createPortal, createSpine } from "./geometry";
import { filamentFragment, filamentVertex, finishFragment } from "./shaders";
import type { WorldInput } from "./types";

type WorldProps = {
  input: RefObject<WorldInput>;
  eventSource: RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onUnavailable: (reason?: "unavailable" | "context-lost") => void;
  onBudgetFallback: () => void;
  onQuality: (quality: string) => void;
  onProject: (project: number) => void;
};

class WorldBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function material(color = "#498c65", glow = .08, iridescence = .65, low = false) {
  return new ShaderMaterial({
    defines: low ? { LOW_QUALITY: 1 } : {},
    vertexShader: filamentVertex,
    fragmentShader: filamentFragment,
    side: DoubleSide,
    uniforms: {
      uTime: { value: 0 }, uDepth: { value: 0 }, uMotion: { value: 1 }, uTension: { value: 0 },
      uPointer: { value: new Vector2() }, uPulse: { value: -100 }, uColor: { value: new Color(color) },
      uGlow: { value: glow }, uIridescence: { value: iridescence },
    },
  });
}

function updateMaterial(mat: ShaderMaterial, input: WorldInput, time: number, tension: number) {
  mat.uniforms.uTime.value = time;
  mat.uniforms.uDepth.value = input.progress;
  mat.uniforms.uPulse.value = input.pulse;
  mat.uniforms.uPointer.value.set(input.pointer[0], input.pointer[1]);
  mat.uniforms.uTension.value = tension;
}

const ray = new Vector3();
const direction = new Vector3();
function screenToWorld(x: number, y: number, camera: PerspectiveCamera, width: number, height: number, result: Vector3) {
  ray.set(x / width * 2 - 1, -(y / height) * 2 + 1, .5).unproject(camera);
  direction.copy(ray).sub(camera.position).normalize();
  const distance = -camera.position.z / direction.z;
  return result.copy(camera.position).addScaledVector(direction, distance);
}

function CameraJourney({ input, nodePositions }: { input: RefObject<WorldInput>; nodePositions: RefObject<Vector3[]> }) {
  const { camera, size } = useThree();
  const look = useRef(new Vector3(0, 0, 0));
  const destination = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  const progress = useRef(input.current.progress);
  useFrame((_, delta) => {
    const state = input.current;
    progress.current += (state.progress - progress.current) * (1 - Math.exp(-delta * 5));
    const p = progress.current;
    const mobile = size.width < 650;
    if (state.project !== null) {
      const point = nodePositions.current[state.project];
      const horizontal = mobile ? 0 : 2.4;
      target.copy(point).add(new Vector3(horizontal, mobile ? -1.9 : 0, 0));
      destination.copy(point).add(new Vector3(horizontal, mobile ? -1.9 : .2, mobile ? 8.5 : 8.4));
    } else {
      destination.set(mobile ? 1.25 : Math.sin(p * .6) * .4, -p * 12, mobile ? 18.7 : 18.4 - p * .22);
      target.set(mobile ? 1.25 : 0, -p * 12, 0);
    }
    const easing = 1 - Math.exp(-delta * (state.project === null ? 4 : 3.3));
    camera.position.lerp(destination, easing);
    look.current.lerp(target, easing);
    camera.lookAt(look.current);
    camera.updateMatrixWorld();
  }, -2);
  return null;
}

function Organism({ input, low }: { input: RefObject<WorldInput>; low: boolean }) {
  const hero = useRef<Group>(null);
  const portal = useRef<Mesh>(null);
  const geometries = useMemo(() => ({ filaments: createFilaments(low), spine: createSpine(low), portal: createPortal(low) }), [low]);
  const shared = useMemo(() => material("#648d77", .045, .65, low), [low]);
  const contact = useMemo(() => material("#70ad89", .19, .9, low), [low]);
  const tension = useRef(0);
  useEffect(() => () => { Object.values(geometries).forEach((geometry) => geometry.dispose()); }, [geometries]);
  useEffect(() => () => { shared.dispose(); contact.dispose(); }, [shared, contact]);
  useFrame((_, delta) => {
    const time = performance.now() / 1000;
    tension.current += (Math.max(.22, input.current.velocity) - tension.current) * Math.min(1, delta * 4);
    updateMaterial(shared, input.current, time, tension.current);
    updateMaterial(contact, input.current, time, tension.current);
    if (hero.current) {
      hero.current.rotation.y = Math.sin(time * .07) * .065 + input.current.progress * .06;
      hero.current.rotation.z = Math.sin(time * .06) * .014;
    }
    if (portal.current) portal.current.rotation.z = Math.sin(time * .07) * .08;
  });
  return <>
    <group ref={hero} position={[.2, .1, 0]}><mesh geometry={geometries.filaments} material={shared} /></group>
    <mesh geometry={geometries.spine} material={shared} />
    <mesh geometry={geometries.filaments} material={shared} position={[-4.3,-13,-2.3]} rotation={[.4,1.1,-.75]} scale={[.6,.58,.65]} />
    <mesh ref={portal} geometry={geometries.portal} material={contact} position={[4.2,-49.3,0]} rotation={[.1,.35,.1]} />
  </>;
}

const nodeColors = ["#abc4b9", "#35c666", "#5c95c9", "#c4ded3"];

function ProjectNode({ index, input, low, positions, onProject }: { index: number; input: RefObject<WorldInput>; low: boolean; positions: RefObject<Vector3[]>; onProject: (index: number) => void }) {
  const group = useRef<Group>(null);
  const object = useRef<Group>(null);
  const { camera, size } = useThree();
  const geometry = useMemo(() => createNode(index, low), [index, low]);
  const shader = useMemo(() => material(nodeColors[index], index === 1 ? .28 : .12, index === 2 ? 1 : .65, low), [index, low]);
  const scale = useRef(1);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => shader.dispose(), [shader]);
  useFrame(() => {
    const node = group.current;
    if (!node || !object.current) return;
    const time = performance.now() / 1000;
    const anchor = input.current.projectAnchors[index];
    if (input.current.project === null && anchor) {
      screenToWorld(anchor.left + anchor.width / 2, anchor.top + anchor.height * .46, camera as PerspectiveCamera, size.width, size.height, positions.current[index]);
      scale.current = Math.min(1.55, anchor.height / size.height * (2 * camera.position.z * Math.tan((camera as PerspectiveCamera).fov * Math.PI / 360)) / 4.4);
    }
    node.position.copy(positions.current[index]);
    node.scale.setScalar(scale.current);
    node.visible = input.current.project !== null ? input.current.project === index : !!anchor && anchor.bottom > -100 && anchor.top < size.height + 100;
    object.current.rotation.y = time * [ .09, .19, .075, .04 ][index];
    object.current.rotation.z = index === 1 ? -.32 : index === 3 ? -.4 + Math.sin(time * .2) * .06 : Math.sin(time * .1 + index) * .08;
    object.current.rotation.x = index === 0 ? .35 : index === 3 ? .3 : .15;
    updateMaterial(shader, input.current, time, .25);
    shader.uniforms.uGlow.value = input.current.project === index ? .3 : index === 1 ? .22 : .1;
  });
  return <group ref={group} onClick={(event) => {
    if ((event.nativeEvent.target as Element)?.closest?.("dialog")) return;
    event.stopPropagation();
    onProject(index);
  }}>
    <group ref={object}>
      <mesh geometry={geometry} material={shader} />
      {index === 2 && <mesh rotation={[.4,.5,.25]}>
        <octahedronGeometry args={[.86,0]} />
        {low ? <meshStandardMaterial color="#41696f" metalness={.8} roughness={.2} /> : <meshPhysicalMaterial color="#91c9b2" transmission={.76} thickness={1.2} ior={1.45} roughness={.1} metalness={.05} iridescence={.8} iridescenceIOR={1.36} envMapIntensity={1.6} />}
      </mesh>}
    </group>
  </group>;
}

function LanguageOrbits({ input, low }: { input: RefObject<WorldInput>; low: boolean }) {
  const { camera, size } = useThree();
  const group = useRef<Group>(null);
  const particles = useRef<(Mesh | null)[]>([]);
  const point = useMemo(() => new Vector3(), []);
  const geometry = useMemo(() => createOrbit(), []);
  const shader = useMemo(() => material("#3d8260", .02, .3, low), [low]);
  useEffect(() => () => { geometry.dispose(); shader.dispose(); }, [geometry, shader]);
  useFrame(() => {
    const anchors = input.current.languageAnchors;
    if (!anchors.length || !group.current) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    anchors.forEach((anchor, index) => {
      minX = Math.min(minX, anchor.left); minY = Math.min(minY, anchor.top);
      maxX = Math.max(maxX, anchor.right); maxY = Math.max(maxY, anchor.bottom);
      const mesh = particles.current[index];
      if (mesh) {
        screenToWorld(anchor.left + 9, anchor.top + anchor.height / 2, camera as PerspectiveCamera, size.width, size.height, mesh.position);
        mesh.scale.setScalar(input.current.language === index ? 1.7 : 1);
        mesh.visible = input.current.project === null && anchor.top < size.height && anchor.bottom > 0;
      }
    });
    screenToWorld((minX + maxX) / 2, (minY + maxY) / 2, camera as PerspectiveCamera, size.width, size.height, point);
    group.current.position.copy(point);
    const ratio = 2 * camera.position.z * Math.tan((camera as PerspectiveCamera).fov * Math.PI / 360) / size.height;
    group.current.scale.set((maxX - minX) * ratio * .53, (maxY - minY) * ratio * .52, 1);
    group.current.visible = minY < size.height && maxY > 0 && input.current.project === null;
    updateMaterial(shader, input.current, performance.now() / 1000, .15);
  });
  return <>
    <group ref={group}><mesh geometry={geometry} material={shader} rotation={[.35,.15,-.4]} /><mesh geometry={geometry} material={shader} rotation={[.15,.7,.7]} scale={[.78,1.08,1]} /><mesh geometry={geometry} material={shader} rotation={[.5,.2,-.25]} scale={[.55,.65,1]} /></group>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} ref={(node) => { particles.current[i] = node; }}><sphereGeometry args={[.042,8,6]} /><meshBasicMaterial color="#68d994" toneMapped={false} /></mesh>)}
  </>;
}

function SuspendedParticles({ low }: { low: boolean }) {
  const geometry = useMemo(() => {
    const count = low ? 130 : 360;
    const positions = new Float32Array(count * 3);
    let seed = 285;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < count; i++) { positions[i*3] = (random()-.5)*24; positions[i*3+1] = 7-random()*64; positions[i*3+2] = -3-random()*9; }
    const result = new BufferGeometry();
    result.setAttribute("position", new BufferAttribute(positions,3));
    return result;
  }, [low]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <points geometry={geometry}><pointsMaterial color="#7fcfa4" size={.021} transparent opacity={.32} depthWrite={false} sizeAttenuation /></points>;
}

class OpticalFinish extends Effect {
  constructor() { super("OpticalFinish", finishFragment, { blendFunction: BlendFunction.NORMAL, uniforms: new Map([["uTime",new Uniform(0)],["uGrain",new Uniform(.007)]]) }); }
}

function Lens() {
  const finish = useMemo(() => new OpticalFinish(), []);
  useFrame(() => { finish.uniforms.get("uTime")!.value = performance.now() / 1000; });
  useEffect(() => () => finish.dispose(), [finish]);
  return <EffectComposer multisampling={0} enableNormalPass={false}>
    <Bloom intensity={.38} luminanceThreshold={.87} luminanceSmoothing={.6} mipmapBlur resolutionScale={.5} />
    <primitive object={finish} />
  </EffectComposer>;
}

function newBudgetWindow() {
  return { last: 0, elapsed: 0, samples: 0, severe: 0, headroom: 0, warmup: true, stopped: false };
}

/**
 * Budget raw visible-tab time, not a quota of slow frames. A 600 ms stall
 * contributes 600 ms immediately. Hidden intervals are discarded, and only
 * the first draw after a tier/visibility change is treated as compilation warmup.
 * One already-running GL call cannot be preempted; exhaustion stops future work.
 */
function FrameBudget({ low, visible, onDecline, onPromote, onExhausted }: {
  low: boolean;
  visible: boolean;
  onDecline: () => void;
  onPromote: () => void;
  onExhausted: () => void;
}) {
  const { size, setFrameloop } = useThree();
  const budget = useRef(newBudgetWindow());
  const promotionUsed = useRef(false);

  useEffect(() => { budget.current = newBudgetWindow(); }, [low, visible]);

  useFrame(() => {
    const sample = budget.current;
    if (sample.stopped) return;
    if (!visible || document.hidden) {
      budget.current = newBudgetWindow();
      return;
    }
    const now = performance.now();
    if (!sample.last) { sample.last = now; return; }
    const duration = now - sample.last;
    sample.last = now;
    if (sample.warmup) { sample.warmup = false; return; }
    if (duration <= 0) return;

    sample.elapsed += duration;
    sample.samples++;
    sample.severe = duration > 120 ? sample.severe + duration : Math.max(0, sample.severe - duration * 2);
    sample.headroom = duration <= 18.5 ? sample.headroom + duration : 0;

    // A severe interval can exhaust the budget on its own. The ordinary check
    // closes after elapsed time, with no minimum sample/frame-count gate.
    let exceeded = sample.severe >= 350;
    if (sample.elapsed >= 1000) {
      exceeded ||= sample.elapsed / sample.samples > (low ? 40 : 25);
      sample.elapsed = 0;
      sample.samples = 0;
    }
    if (exceeded) {
      sample.stopped = true;
      promotionUsed.current = true;
      if (low) {
        setFrameloop("never");
        onExhausted();
      } else onDecline();
      return;
    }

    // One desktop promotion is earned by uninterrupted measured frame headroom.
    // It is not a delayed splash, interaction gate, UA check, or audit exception.
    const desktop = size.width >= 700 && window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    if (low && !promotionUsed.current && desktop && sample.headroom >= 2200) {
      promotionUsed.current = true;
      sample.stopped = true;
      onPromote();
    }
  }, -3);
  return null;
}

function Scene({ input, low, onProject, onReady }: { input: RefObject<WorldInput>; low: boolean; onProject: (index: number) => void; onReady: () => void }) {
  const positions = useRef(Array.from({ length: 4 }, (_, i) => new Vector3(i % 2 ? 3 : -3,-25-Math.floor(i/2)*5,0)));
  const { gl } = useThree();
  const frames = useRef(0);
  useFrame(() => { if (++frames.current === 3) { gl.domElement.setAttribute("data-ready", "true"); onReady(); } });
  return <>
    <CameraJourney input={input} nodePositions={positions} />
    <ambientLight intensity={.55} color="#74a98b" />
    <directionalLight position={[3,7,9]} intensity={2} color="#d9f8e8" />
    <Organism input={input} low={low} />
    {Array.from({ length: 4 }, (_, index) => <ProjectNode key={index} index={index} input={input} low={low} positions={positions} onProject={onProject} />)}
    <LanguageOrbits input={input} low={low} />
    <SuspendedParticles low={low} />
    {!low && <><Environment resolution={64} frames={1}><Lightformer intensity={4} color="#c2f1d6" position={[0,5,-2]} scale={[12,2,1]} /><Lightformer intensity={2} color="#326c77" position={[-5,1,0]} rotation={[0,Math.PI/2,0]} scale={[3,10,1]} /></Environment><Lens /></>}
  </>;
}

export default function World(props: WorldProps) {
  const { onQuality, onUnavailable } = props;
  // Start every device with the inexpensive version of the same composition.
  const [low, setLow] = useState(true);
  const [visible, setVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [mounted, setMounted] = useState(false);
  const activeAttempt = useRef(true);
  const detachContextListener = useRef<() => void>(() => {});
  const lowerQuality = useCallback(() => setLow(true), []);
  const raiseQuality = useCallback(() => setLow(false), []);
  useEffect(() => {
    activeAttempt.current = true;
    return () => {
      // R3F may intentionally lose the context during disposal. That teardown
      // must not replace a user's pause or a recorded performance-budget exit.
      activeAttempt.current = false;
      detachContextListener.current();
    };
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      // Canvas fallback children also mount on capable browsers. Probe once
      // instead of attaching an effect to those children, and release the probe.
      const probe = document.createElement("canvas");
      let supported = false;
      try {
        const context = probe.getContext("webgl2");
        supported = !!context;
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch { /* The complete HTML/SVG composition is already present. */ }
      if (supported) setMounted(true);
      else onUnavailable("unavailable");
    });
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", visibility); };
  }, [onUnavailable]);
  useEffect(() => { onQuality(low ? "low" : "balanced"); }, [low, onQuality]);
  if (!mounted) return null;
  return <WorldBoundary onUnavailable={props.onUnavailable}><Canvas
    eventSource={props.eventSource as RefObject<HTMLDivElement>}
    eventPrefix="client"
    dpr={low ? 1 : 1.4}
    frameloop={visible ? "always" : "never"}
    camera={{ position: [0,0,18.4], fov: 42, near: .1, far: 100 }}
    gl={{ antialias: false, alpha: false, powerPreference: "high-performance", toneMapping: ACESFilmicToneMapping }}
    fallback={<span>The still composition remains available.</span>}
    onCreated={({ gl }) => {
      gl.setClearColor("#050505", 1);
      gl.domElement.setAttribute("aria-hidden", "true");
      const lost = (event: Event) => {
        event.preventDefault();
        if (activeAttempt.current) props.onUnavailable("context-lost");
      };
      gl.domElement.addEventListener("webglcontextlost", lost, { once: true });
      detachContextListener.current = () => gl.domElement.removeEventListener("webglcontextlost", lost);
    }}
  ><Suspense fallback={null}><FrameBudget low={low} visible={visible} onDecline={lowerQuality} onPromote={raiseQuality} onExhausted={props.onBudgetFallback} /><Scene input={props.input} low={low} onProject={props.onProject} onReady={props.onReady} /></Suspense></Canvas></WorldBoundary>;
}
