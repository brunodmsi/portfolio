import assert from "node:assert/strict";
import {
  GATES,
  SPARKS,
  START,
  TRACKS,
  createGameState,
  getGameSnapshot,
  nearestTrackPoint,
  stepGame,
} from "../src/components/conductor/engine.ts";

const idle = { x: 0, z: 0, pulse: 0 };

// The closed b bowl, non-letter connector, and non-retracing m stems stay
// distinct for the overhead final-reveal treatment and ribbon geometry.
{
  const b = TRACKS.find((track) => track.id === "b");
  const connector = TRACKS.find((track) => track.id === "m-connector");
  const leftStem = TRACKS.find((track) => track.id === "m-left-stem");
  const middleStem = TRACKS.find((track) => track.id === "m-middle-stem");
  const m = TRACKS.find((track) => track.id === "m");
  assert.deepEqual(b.points.at(-1), { x: -9, z: 0 });
  assert.equal(b.letter, true);
  assert.deepEqual(connector.points, [{ x: 4, z: -6 }, { x: 4, z: 0 }]);
  assert.equal(connector.letter, false);
  assert.deepEqual(leftStem.points, [{ x: 4, z: 0 }, { x: 4, z: 5 }]);
  assert.deepEqual(middleStem.points, [{ x: 7, z: 0 }, { x: 7, z: 5 }]);
  assert.equal(leftStem.letter, true);
  assert.equal(middleStem.letter, true);
  assert.deepEqual(m.points[0], { x: 4, z: 0 });
  assert.deepEqual(m.points.at(-1), { x: 10, z: 5 });
  assert.equal(m.letter, true);
}

// Every spark is exactly on a currently live authored track at its unlock
// count, not floating beside a strand.
for (const spark of SPARKS) {
  const nearest = nearestTrackPoint(spark.x, spark.z, spark.unlock);
  assert.ok(nearest && nearest.distance < 0.000001, `spark ${spark.id} is not on a live track`);
}

function begin() {
  const state = createGameState();
  stepGame(state, idle, 1.51);
  assert.equal(state.phase, "walking", "forming phase should complete through stepGame");
  return state;
}

function moveTo(state, target, pulse = 0) {
  for (let index = 0; index < 900; index += 1) {
    const dx = target.x - state.x;
    const dz = target.z - state.z;
    if (Math.hypot(dx, dz) < 0.16) return;
    stepGame(state, { x: dx, z: dz, pulse }, 1 / 60);
  }
  assert.fail(`could not reach ${target.x}, ${target.z}; stopped at ${state.x}, ${state.z}`);
}

function settle(state, pulse = 0) {
  for (let index = 0; index < 24; index += 1) {
    stepGame(state, { ...idle, pulse }, 1 / 60);
  }
}

function pulseAtGate(state, serial) {
  const gate = GATES[state.connections];
  moveTo(state, gate.from, serial - 1);
  stepGame(state, { ...idle, pulse: serial }, 0.03);
  assert.equal(state.connections, serial, `gate ${serial} should unlock in order`);
}

// Axes are normalized: a diagonal hold never has a faster velocity than a
// cardinal hold, even while its position is constrained by the b stem.
{
  const cardinal = begin();
  const diagonal = begin();
  for (let index = 0; index < 90; index += 1) {
    stepGame(cardinal, { x: 0, z: -1, pulse: 0 }, 1 / 60);
    stepGame(diagonal, { x: 1, z: -1, pulse: 0 }, 1 / 60);
  }
  assert.ok(Math.abs(cardinal.speed - diagonal.speed) < 0.001);
  assert.ok(diagonal.speed <= 2.601);
}

// Forming, paused zero-delta frames, and locked islands never collect sparks.
{
  const state = createGameState();
  state.x = SPARKS[0].x;
  state.z = SPARKS[0].z;
  stepGame(state, { x: 1, z: 0, pulse: 0 }, 0.2);
  assert.equal(state.sparks, 0, "forming must not collect a spawn-adjacent spark");
  const before = { ...state };
  stepGame(state, { x: 1, z: 1, pulse: 1 }, 0);
  assert.deepEqual(state, before);
  assert.deepEqual(getGameSnapshot(state), { phase: "forming", connections: 0, nearGate: null, sparks: 0, rewardAt: -1 });

  const locked = begin();
  locked.x = SPARKS[2].x;
  locked.z = SPARKS[2].z;
  stepGame(locked, { x: 1, z: 0, pulse: 0 }, 1 / 60);
  assert.equal(locked.sparks, 0, "a spark on a locked island must remain unavailable");
}

// Entering a live spark radius while walking collects it once. Stopping or
// retracing cannot farm another copy of the same id.
{
  const state = begin();
  state.x = SPARKS[0].x;
  state.z = SPARKS[0].z;
  stepGame(state, idle, 1 / 60);
  assert.equal(state.sparks, 0, "idling on a spark cannot collect it");
  stepGame(state, { x: 0, z: -1, pulse: 0 }, 1 / 60);
  assert.equal(state.sparks, 1);
  const firstCollection = state.collectedAt[0];
  stepGame(state, idle, 1);
  assert.equal(state.sparks, 1);
  assert.equal(state.collectedAt[0], firstCollection);
  assert.equal(state.rewardAt, -1);
}

// Pulses always emit when eligible, but only the current nearby gate connects;
// holding/replaying the same serial cannot turn one press into multiple gates.
{
  const state = begin();
  stepGame(state, { ...idle, pulse: 1 }, 0.03);
  assert.equal(state.connections, 0);
  const emittedAt = state.pulseAt;
  assert.ok(emittedAt > 1.5);
  stepGame(state, { ...idle, pulse: 1 }, 1);
  assert.equal(state.pulseAt, emittedAt);

  moveTo(state, GATES[0].from);
  stepGame(state, { ...idle, pulse: 2 }, 0.03);
  assert.equal(state.connections, 1);
  stepGame(state, { ...idle, pulse: 2 }, 1);
  assert.equal(state.connections, 1);
}

// Before gate one, movement can reach the b bowl edge but cannot cross its
// locked two-unit gap. A very large frame gets the same protection.
{
  const state = begin();
  stepGame(state, { x: 1, z: 0, pulse: 0 }, 1000);
  assert.ok(state.x < -3.3, `locked gap was crossed: x=${state.x}`);
  assert.equal(state.connections, 0);
}

// Replay the full authored route from a fresh state. These are route waypoints,
// not state teleports: every location is reached through simulation/collision.
for (let replay = 0; replay < 2; replay += 1) {
  const state = begin();
  moveTo(state, { x: -4, z: 2.5 });
  pulseAtGate(state, 1);
  moveTo(state, { x: -2.8, z: 2.5 });
  moveTo(state, { x: 1, z: 5 });
  settle(state);
  moveTo(state, { x: 1, z: -6 });
  pulseAtGate(state, 2);
  moveTo(state, { x: 4, z: -6 });
  moveTo(state, { x: 4, z: 0 });
  moveTo(state, { x: 4, z: 5 });
  settle(state);
  moveTo(state, { x: 7, z: 0 });
  moveTo(state, { x: 7, z: 5 });
  settle(state);
  moveTo(state, { x: 10, z: 0 });
  moveTo(state, { x: 10, z: 5 });
  assert.equal(state.sparks, SPARKS.length, "the critical route should collect all sparks before gate three");
  assert.ok(state.collectedAt.every((time) => time >= 0));
  const rewardAt = state.rewardAt;
  assert.ok(rewardAt >= 0, "the cosmetic reward should unlock once all sparks are collected");
  pulseAtGate(state, 3);
  assert.equal(state.phase, "complete");
  assert.equal(state.connections, 3);
  assert.equal(state.completedAt, state.time);
  assert.equal(state.rewardAt, rewardAt, "the reward timestamp is one-shot");
  assert.notDeepEqual({ x: state.x, z: state.z }, START);
}

// Replay is entirely fresh: no collection or reward state survives a run.
{
  const state = createGameState();
  assert.equal(state.sparkMask, 0);
  assert.equal(state.sparks, 0);
  assert.deepEqual(state.collectedAt, Array(SPARKS.length).fill(-1));
  assert.equal(state.rewardAt, -1);
}

console.log("conductor engine tests passed");
