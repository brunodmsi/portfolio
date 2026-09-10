/**
 * The small, renderer-agnostic simulation for O Condutor.  World coordinates
 * are an overhead plan: x runs left-to-right and z runs top-to-bottom.
 *
 * Keep this module dependency-free.  It is also exercised directly by Node
 * with TypeScript type stripping.
 */

export type Point2 = { x: number; z: number };

export type Track = {
  id: string;
  points: Point2[];
  width: number;
  unlock: number;
  letter: boolean;
};

export type Gate = {
  id: number;
  from: Point2;
  to: Point2;
  radius: number;
};

export type Spark = {
  id: number;
  x: number;
  z: number;
  /** Required connection count, matching the track that holds the spark. */
  unlock: number;
};

export type GameInput = {
  /** Horizontal movement axis, normally A/D or left/right. */
  x: number;
  /** Vertical movement axis, normally W/S or up/down. */
  z: number;
  /** An increasing event serial, rather than a held button state. */
  pulse: number;
};

export type GamePhase = "forming" | "walking" | "complete";

export type GameState = {
  x: number;
  z: number;
  vx: number;
  vz: number;
  yaw: number;
  speed: number;
  time: number;
  phase: GamePhase;
  connections: number;
  nearGate: number | null;
  /** Simulation time of the last accepted visual pulse. */
  pulseAt: number;
  pulseX: number;
  pulseZ: number;
  /** Last pulse serial consumed; prevents a held key from re-triggering. */
  lastPulse: number;
  distance: number;
  /** Collected-spark bits, indexed by spark id. */
  sparkMask: number;
  sparks: number;
  /** Per-spark collection simulation times; -1 means uncollected. */
  collectedAt: number[];
  /** Simulation time the cosmetic all-sparks reward became available. */
  rewardAt: number;
  /** Simulation time at which the third connection was restored. */
  completedAt: number;
};

export type GameSnapshot = Pick<GameState, "phase" | "connections" | "nearGate" | "sparks" | "rewardAt">;

export type NearestTrackPoint = Point2 & {
  distance: number;
  track: Track;
};

const WIDTH = 1.3;
const BRIDGE_WIDTH = 1.22;
const FORMING_SECONDS = 1.5;
const PULSE_COOLDOWN = 0.65;
const BASE_SPEED = 2.6;
const ACCELERATION = 14;
const DECELERATION = 18;
const MAX_STEP = 1 / 45;
const MAX_DELTA = 5;

const point = (x: number, z: number): Point2 => ({ x, z });

function quadratic(from: Point2, control: Point2, to: Point2, steps = 8): Point2[] {
  const result: Point2[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    const inverse = 1 - t;
    result.push(
      point(
        inverse * inverse * from.x + 2 * inverse * t * control.x + t * t * to.x,
        inverse * inverse * from.z + 2 * inverse * t * control.z + t * t * to.z,
      ),
    );
  }
  return result;
}

function join(...parts: Point2[][]): Point2[] {
  return parts.flatMap((part, index) => (index === 0 ? part : part.slice(1)));
}

const bBowl = join(
  quadratic(point(-9, 0), point(-6, 0), point(-4, 2.5)),
  quadratic(point(-4, 2.5), point(-6, 5), point(-9, 5)),
);

const dBowl = join(
  quadratic(point(1, 0), point(-2, 0), point(-3, 2.5)),
  quadratic(point(-3, 2.5), point(-2, 5), point(1, 5)),
);

const firstHump = quadratic(point(4, 0), point(5.5, -1), point(7, 0));
const secondHump = quadratic(point(7, 0), point(8.5, -1), point(10, 0));
const dot = Array.from({ length: 13 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2;
  return point(13 + Math.cos(angle) * 0.36, 5 + Math.sin(angle) * 0.36);
});

/** All traversable authored strokes. `unlock` is the required connection count. */
export const TRACKS: Track[] = [
  {
    id: "b",
    points: join([point(-9, -6), point(-9, 0)], bBowl, [point(-9, 5), point(-9, 0)]),
    width: WIDTH,
    unlock: 0,
    letter: true,
  },
  {
    id: "bridge-1",
    points: [point(-4, 2.5), point(-2, 2.5)],
    width: BRIDGE_WIDTH,
    unlock: 1,
    letter: false,
  },
  {
    id: "d",
    points: join([point(1, -6), point(1, 0)], dBowl, [point(1, 5), point(1, 0)]),
    width: WIDTH,
    unlock: 1,
    letter: true,
  },
  {
    id: "bridge-2",
    points: [point(1, -6), point(4, -6)],
    width: BRIDGE_WIDTH,
    unlock: 2,
    letter: false,
  },
  {
    id: "m-connector",
    points: [point(4, -6), point(4, 0)],
    width: WIDTH,
    unlock: 2,
    letter: false,
  },
  {
    id: "m-left-stem",
    points: [point(4, 0), point(4, 5)],
    width: WIDTH,
    unlock: 2,
    letter: true,
  },
  {
    id: "m-middle-stem",
    points: [point(7, 0), point(7, 5)],
    width: WIDTH,
    unlock: 2,
    letter: true,
  },
  {
    id: "m",
    points: join([point(4, 0)], firstHump, secondHump, [point(10, 0), point(10, 5)]),
    width: WIDTH,
    unlock: 2,
    letter: true,
  },
  {
    id: "bridge-3",
    points: [point(10, 5), point(13, 5)],
    width: BRIDGE_WIDTH,
    unlock: 3,
    letter: false,
  },
  { id: "dot", points: dot, width: WIDTH, unlock: 3, letter: true },
];

export const GATES: Gate[] = [
  { id: 1, from: point(-4, 2.5), to: point(-2, 2.5), radius: 0.94 },
  { id: 2, from: point(1, -6), to: point(4, -6), radius: 0.94 },
  { id: 3, from: point(10, 5), to: point(13, 5), radius: 0.94 },
];

/**
 * Seven small route rewards. The curved-stroke coordinates are projected onto
 * the authored, sampled collision polylines rather than floating beside them.
 */
export const SPARKS: Spark[] = [
  { id: 0, x: -7.4314923326268545, z: 4.805666375763621, unlock: 0 },
  { id: 1, x: -5.781798002219756, z: 4.10488346281909, unlock: 0 },
  { id: 2, x: -1.7119999999999997, z: 4.216, unlock: 1 },
  { id: 3, x: 1, z: -3, unlock: 1 },
  { id: 4, x: 2.5, z: -6, unlock: 2 },
  { id: 5, x: 4, z: -2.6, unlock: 2 },
  { id: 6, x: 7, z: 0, unlock: 2 },
];

export const START = point(-9, 5);

export function createGameState(): GameState {
  return {
    x: START.x,
    z: START.z,
    vx: 0,
    vz: 0,
    yaw: 0,
    speed: 0,
    time: 0,
    phase: "forming",
    connections: 0,
    nearGate: null,
    pulseAt: -PULSE_COOLDOWN,
    pulseX: START.x,
    pulseZ: START.z,
    lastPulse: 0,
    distance: 0,
    sparkMask: 0,
    sparks: 0,
    collectedAt: Array(SPARKS.length).fill(-1),
    rewardAt: -1,
    completedAt: -1,
  };
}

function nearestOnSegment(x: number, z: number, from: Point2, to: Point2): Point2 {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const lengthSquared = dx * dx + dz * dz;
  if (lengthSquared === 0) return point(from.x, from.z);
  const t = Math.max(0, Math.min(1, ((x - from.x) * dx + (z - from.z) * dz) / lengthSquared));
  return point(from.x + dx * t, from.z + dz * t);
}

function distanceTo(x: number, z: number, target: Point2): number {
  return Math.hypot(x - target.x, z - target.z);
}

/** Finds the closest point on a currently live stroke. */
export function nearestTrackPoint(x: number, z: number, connections: number): NearestTrackPoint | null {
  let nearest: NearestTrackPoint | null = null;
  for (const track of TRACKS) {
    if (track.unlock > connections) continue;
    for (let index = 1; index < track.points.length; index += 1) {
      const candidate = nearestOnSegment(x, z, track.points[index - 1], track.points[index]);
      const distance = distanceTo(x, z, candidate);
      if (!nearest || distance < nearest.distance) {
        nearest = { ...candidate, distance, track };
      }
    }
  }
  return nearest;
}

function constrainToLiveTracks(state: GameState, nextX: number, nextZ: number): Point2 {
  const nearest = nearestTrackPoint(nextX, nextZ, state.connections);
  if (!nearest) return point(state.x, state.z);
  const radius = nearest.track.width / 2;
  if (nearest.distance <= radius) return point(nextX, nextZ);

  const dx = nextX - nearest.x;
  const dz = nextZ - nearest.z;
  const scale = radius / nearest.distance;
  return point(nearest.x + dx * scale, nearest.z + dz * scale);
}

function approach(current: number, target: number, maximumChange: number): number {
  if (current < target) return Math.min(current + maximumChange, target);
  return Math.max(current - maximumChange, target);
}

function refreshNearGate(state: GameState): void {
  const nextGate = GATES[state.connections];
  state.nearGate = nextGate && distanceTo(state.x, state.z, nextGate.from) <= nextGate.radius ? nextGate.id : null;
}

function processPulse(state: GameState, input: GameInput): void {
  if (input.pulse <= state.lastPulse) return;
  state.lastPulse = input.pulse;
  if (state.time - state.pulseAt < PULSE_COOLDOWN) return;

  // A pulse is a visual event regardless of whether it reaches a gate.
  state.pulseAt = state.time;
  state.pulseX = state.x;
  state.pulseZ = state.z;

  const nextGate = GATES[state.connections];
  if (!nextGate || distanceTo(state.x, state.z, nextGate.from) > nextGate.radius) return;

  state.connections += 1;
  refreshNearGate(state);
  if (state.connections === GATES.length) {
    state.phase = "complete";
    state.completedAt = state.time;
    state.vx = 0;
    state.vz = 0;
    state.speed = 0;
  }
}

function collectSparks(state: GameState): void {
  for (const spark of SPARKS) {
    const bit = 1 << spark.id;
    if (spark.unlock > state.connections || (state.sparkMask & bit) !== 0) continue;
    if (Math.hypot(state.x - spark.x, state.z - spark.z) > 0.9) continue;

    state.sparkMask |= bit;
    state.sparks += 1;
    state.collectedAt[spark.id] = state.time;
  }
  if (state.sparks === SPARKS.length && state.rewardAt < 0) state.rewardAt = state.time;
}

function walk(state: GameState, input: GameInput, delta: number): void {
  const magnitude = Math.hypot(input.x, input.z);
  const factor = magnitude > 1 ? 1 / magnitude : 1;
  const targetVx = input.x * factor * BASE_SPEED;
  const targetVz = input.z * factor * BASE_SPEED;
  const rate = magnitude > 0 ? ACCELERATION : DECELERATION;
  state.vx = approach(state.vx, targetVx, rate * delta);
  state.vz = approach(state.vz, targetVz, rate * delta);
  state.speed = Math.hypot(state.vx, state.vz);

  const constrained = constrainToLiveTracks(state, state.x + state.vx * delta, state.z + state.vz * delta);
  const moved = distanceTo(state.x, state.z, constrained);
  state.distance += moved;
  state.x = constrained.x;
  state.z = constrained.z;
  if (state.speed > 0.001) state.yaw = Math.atan2(state.vx, state.vz);
  refreshNearGate(state);
  // A spark is collected only by a real walking displacement, never by spawn,
  // a paused/zero-delta frame, or merely remaining in its radius.
  if (moved > 0.00001) collectSparks(state);
}

function isComplete(state: GameState): boolean {
  return state.phase === "complete";
}

/**
 * Advances the mutable game state.  Long browser frames are split into small
 * collision steps and capped, so a resume/stall cannot skip a locked bridge.
 */
export function stepGame(state: GameState, input: GameInput, delta: number): void {
  if (isComplete(state) || !Number.isFinite(delta) || delta <= 0) return;
  const remainingDelta = Math.min(delta, MAX_DELTA);
  let remaining = remainingDelta;
  while (remaining > 0 && !isComplete(state)) {
    const step = Math.min(MAX_STEP, remaining);
    remaining -= step;
    state.time += step;

    if (state.phase === "forming") {
      if (state.time >= FORMING_SECONDS) state.phase = "walking";
      refreshNearGate(state);
      continue;
    }

    processPulse(state, input);
    if (state.phase === "walking") walk(state, input, step);
  }
}

export function getGameSnapshot(state: GameState): GameSnapshot {
  return { phase: state.phase, connections: state.connections, nearGate: state.nearGate, sparks: state.sparks, rewardAt: state.rewardAt };
}
