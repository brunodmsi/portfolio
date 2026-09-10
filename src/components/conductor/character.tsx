"use client";

/* eslint-disable react-hooks/immutability -- R3F groups/material uniforms are an imperative render graph. */

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { CapsuleGeometry, Group, LatheGeometry, SphereGeometry, TorusGeometry, Vector2, type ShaderMaterial } from "three";
import { createMetalMaterial } from "./metal";
import type { GameState } from "./engine";

type Props = { state: RefObject<GameState>; celebration: RefObject<number>; low: boolean };

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const angleDelta = (from: number, to: number) => Math.atan2(Math.sin(to - from), Math.cos(to - from));

function pearProfile(top: number, bottom: number, widest: number) {
  return [
    new Vector2(0.055, bottom), new Vector2(widest * 0.66, bottom + 0.025),
    new Vector2(widest, bottom + (top - bottom) * 0.3), new Vector2(widest * 0.94, bottom + (top - bottom) * 0.55),
    new Vector2(widest * 0.69, top - 0.075), new Vector2(widest * 0.28, top - 0.012), new Vector2(0.055, top),
  ];
}

function Leg({ side, limb, foot, joint, material, hipRef, kneeRef, ankleRef }: { side: -1 | 1; limb: CapsuleGeometry; foot: SphereGeometry; joint: SphereGeometry; material: ShaderMaterial; hipRef: RefObject<Group | null>; kneeRef: RefObject<Group | null>; ankleRef: RefObject<Group | null> }) {
  return <group ref={hipRef} position={[side * 0.145, 0.685, 0]}>
    <mesh geometry={limb} material={material} position={[0, -0.16, 0]} scale={[0.78, 1, 0.78]} />
    <group ref={kneeRef} position={[0, -0.335, 0]}>
      <mesh geometry={joint} material={material} scale={[0.78, 0.78, 0.78]} />
      <mesh geometry={limb} material={material} position={[0, -0.145, 0]} scale={[0.69, 0.91, 0.69]} />
      <group ref={ankleRef} position={[0, -0.305, 0]}>
        <mesh geometry={joint} material={material} scale={[0.58, 0.58, 0.58]} />
        <mesh geometry={foot} material={material} position={[0, 0.032, 0.105]} scale={[0.13, 0.074, 0.205]} />
      </group>
    </group>
  </group>;
}

function Arm({ side, limb, joint, material, shoulderRef, elbowRef }: { side: -1 | 1; limb: CapsuleGeometry; joint: SphereGeometry; material: ShaderMaterial; shoulderRef: RefObject<Group | null>; elbowRef: RefObject<Group | null> }) {
  return <group ref={shoulderRef} position={[side * 0.335, 1.075, -0.005]}>
    <mesh geometry={limb} material={material} position={[0, -0.15, 0]} scale={[0.64, 0.93, 0.64]} />
    <group ref={elbowRef} position={[0, -0.31, 0]}>
      <mesh geometry={joint} material={material} scale={[0.62, 0.62, 0.62]} />
      <mesh geometry={limb} material={material} position={[0, -0.125, 0]} scale={[0.52, 0.75, 0.52]} />
      <mesh geometry={joint} material={material} position={[0, -0.275, 0.005]} scale={[0.72, 0.92, 0.72]} />
    </group>
  </group>;
}

/** A compact mercury walker; its local forward axis is +Z. */
export function ConductorCharacter({ state, celebration, low }: Props) {
  const root = useRef<Group>(null);
  const sculpt = useRef<Group>(null);
  const hips = useRef<Group>(null);
  const upper = useRef<Group>(null);
  const halo = useRef<Group>(null);
  const award = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftKnee = useRef<Group>(null);
  const rightKnee = useRef<Group>(null);
  const leftAnkle = useRef<Group>(null);
  const rightAnkle = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftElbow = useRef<Group>(null);
  const rightElbow = useRef<Group>(null);

  const geometry = useMemo(() => ({
    helmet: new LatheGeometry(pearProfile(0.39, -0.37, 0.34), low ? 14 : 28),
    torso: new LatheGeometry(pearProfile(0.33, -0.34, 0.305), low ? 12 : 24),
    visor: new SphereGeometry(1, low ? 12 : 24, low ? 8 : 16),
    limb: new CapsuleGeometry(0.105, 0.12, low ? 3 : 6, low ? 8 : 14),
    joint: new SphereGeometry(0.105, low ? 10 : 18, low ? 7 : 12),
    foot: new SphereGeometry(1, low ? 10 : 18, low ? 7 : 12),
    halo: new TorusGeometry(0.295, 0.009, low ? 4 : 7, low ? 16 : 34),
    bead: new SphereGeometry(0.035, low ? 8 : 14, low ? 6 : 10),
  }), [low]);
  const silver = useMemo(() => createMetalMaterial({ color: "#abc4b9", accent: "#76e4b7", roughness: 0.16, low }), [low]);
  const graphite = useMemo(() => createMetalMaterial({ color: "#071512", accent: "#5ed6c5", roughness: 0.3, glow: 0.035, low }), [low]);
  const signal = useMemo(() => createMetalMaterial({ color: "#17483f", accent: "#70f2c0", roughness: 0.09, glow: 0.24, low }), [low]);

  useEffect(() => () => {
    Object.values(geometry).forEach((item) => item.dispose());
    silver.dispose(); graphite.dispose(); signal.dispose();
  }, [geometry, silver, graphite, signal]);

  useFrame((_, delta) => {
    const current = state.current;
    const character = root.current;
    if (!character) return;
    const forming = smooth(0, 1.5, current.time);
    const limbGrowth = smooth(0.38, 1.08, current.time);
    const pulseAge = current.time - current.pulseAt;
    const pulse = pulseAge >= 0 && pulseAge < 1.0 ? Math.sin(pulseAge * Math.PI) * Math.exp(-pulseAge * 1.3) : 0;
    const speed = Math.min(1, current.speed * 1.8);
    const stride = Math.sin(current.distance * 9.2) * speed * limbGrowth;
    const targetYaw = current.yaw;
    const turn = angleDelta(character.rotation.y, targetYaw);
    const ease = 1 - Math.exp(-delta * 11);

    character.position.set(current.x, (1 - forming) * (1 - forming) * 1.28, current.z);
    character.rotation.y += turn * ease;
    silver.uniforms.uTime.value = current.time;
    graphite.uniforms.uTime.value = current.time;
    signal.uniforms.uTime.value = current.time;
    silver.uniforms.uPulse.value = pulse;
    graphite.uniforms.uPulse.value = pulse;
    signal.uniforms.uPulse.value = pulse;

    if (sculpt.current) {
      const landingSquash = Math.exp(-Math.pow((forming - 0.68) * 5.1, 2)) * 0.18;
      // The descending two-lobe sculpt compresses into one droplet before its
      // limbs extend; its pivot remains at the floor for the finished stance.
      const dropletHeight = 0.52 + forming * 0.48;
      sculpt.current.scale.set(
        1 + (1 - dropletHeight) * 0.42 + landingSquash * 0.65,
        dropletHeight * (1 - landingSquash),
        1 + (1 - dropletHeight) * 0.42 + landingSquash * 0.65,
      );
      sculpt.current.position.y = speed * Math.abs(Math.sin(current.distance * 9.2)) * 0.022 + pulse * 0.028;
    }
    if (hips.current) {
      hips.current.rotation.z = -turn * 0.16 + stride * 0.055;
      hips.current.rotation.x = -speed * 0.05;
    }
    if (upper.current) {
      upper.current.rotation.z = -turn * 0.23 - stride * 0.038;
      upper.current.rotation.x = speed * 0.075 + pulse * 0.05;
    }
    if (halo.current) {
      halo.current.rotation.y = current.phase === "complete" ? 0 : current.time * 0.18;
      halo.current.scale.setScalar(1 + pulse * 0.16);
    }
    if (award.current) {
      const age = current.rewardAt < 0 ? -1 : current.time + celebration.current - current.rewardAt;
      const arrival = age < 0 ? 0 : 1 - Math.pow(1 - Math.min(1, age / .7), 3);
      award.current.visible = age >= 0;
      award.current.scale.setScalar(arrival);
      award.current.position.y = 2.08 - arrival * .18;
      // The honor is deliberately ill-fitting: a tipped, off-center filament,
      // with a loose bead hanging from one end. Never a new light/render pass.
      award.current.rotation.set(Math.PI / 2 + .22, -.12, .28 + Math.sin(current.time * 1.6) * .045);
    }

    [leftLeg.current, rightLeg.current].forEach((leg, index) => {
      const direction = index === 0 ? 1 : -1;
      if (leg) { leg.rotation.x = stride * direction * 0.64; leg.scale.y = limbGrowth; }
      const knee = index === 0 ? leftKnee.current : rightKnee.current;
      const ankle = index === 0 ? leftAnkle.current : rightAnkle.current;
      if (knee) knee.rotation.x = Math.max(0, -stride * direction) * 0.78;
      if (ankle) ankle.rotation.x = -stride * direction * 0.24;
    });
    [leftArm.current, rightArm.current].forEach((arm, index) => {
      const direction = index === 0 ? 1 : -1;
      if (arm) { arm.rotation.x = -stride * direction * 0.71 + pulse * 0.12; arm.scale.y = limbGrowth; }
      const elbow = index === 0 ? leftElbow.current : rightElbow.current;
      if (elbow) elbow.rotation.x = Math.max(0, stride * direction) * 0.52 + 0.08;
    });
  }, 0);

  return <group ref={root} name="conductor-character">
    <group ref={sculpt}>
      <group ref={hips}>
        <Leg side={-1} limb={geometry.limb} foot={geometry.foot} joint={geometry.joint} material={silver} hipRef={leftLeg} kneeRef={leftKnee} ankleRef={leftAnkle} />
        <Leg side={1} limb={geometry.limb} foot={geometry.foot} joint={geometry.joint} material={silver} hipRef={rightLeg} kneeRef={rightKnee} ankleRef={rightAnkle} />
      </group>
      <group ref={upper}>
        <mesh geometry={geometry.torso} position={[0, 0.89, 0]} material={silver} />
        <Arm side={-1} limb={geometry.limb} joint={geometry.joint} material={silver} shoulderRef={leftArm} elbowRef={leftElbow} />
        <Arm side={1} limb={geometry.limb} joint={geometry.joint} material={silver} shoulderRef={rightArm} elbowRef={rightElbow} />
        <mesh geometry={geometry.helmet} position={[0, 1.3, 0.015]} material={silver} />
        <mesh geometry={geometry.visor} position={[0, 1.29, 0.303]} scale={[0.255, 0.12, 0.035]} material={graphite} />
        <group ref={halo} position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={geometry.halo} material={signal} />
        </group>
        <group ref={award} name="employee-of-the-void-halo" position={[.07, 1.9, 0]} visible={false}>
          <mesh geometry={geometry.halo} scale={[1.38, 1.1, 2]}><meshBasicMaterial color="#a9f7c4" toneMapped={false} /></mesh>
          <mesh geometry={geometry.bead} position={[.405, -.035, .035]} scale={[.65, .65, .65]}><meshBasicMaterial color="#d0e4d7" toneMapped={false} /></mesh>
        </group>
        <group position={[0, 1.01, -0.255]}>
          {[-0.12, 0, 0.12].map((x, index) => <mesh key={x} geometry={geometry.bead} position={[x, -index * 0.105, 0]} material={signal} />)}
        </group>
      </group>
    </group>
  </group>;
}
