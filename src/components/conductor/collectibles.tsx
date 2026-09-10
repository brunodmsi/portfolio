"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { InstancedMesh, MeshBasicMaterial, Object3D, SphereGeometry, TorusGeometry } from "three";
import { SPARKS, type GameState } from "./engine";

/** Seven loose loops of light, batched into two draw calls; no textures or passes. */
export function LooseSparks({ state, celebration }: { state: RefObject<GameState>; celebration: RefObject<number> }) {
  const loops = useRef<InstancedMesh>(null);
  const cores = useRef<InstancedMesh>(null);
  const transform = useMemo(() => new Object3D(), []);
  const geometry = useMemo(() => ({
    loop: new TorusGeometry(.13, .017, 4, 20),
    core: new SphereGeometry(.052, 8, 5),
  }), []);
  const material = useMemo(() => ({
    loop: new MeshBasicMaterial({ color: "#76e4b7", toneMapped: false }),
    core: new MeshBasicMaterial({ color: "#d0e4d7", toneMapped: false }),
  }), []);
  useEffect(() => () => {
    geometry.loop.dispose(); geometry.core.dispose();
    material.loop.dispose(); material.core.dispose();
  }, [geometry, material]);

  useFrame(() => {
    if (!loops.current || !cores.current) return;
    const game = state.current;
    const time = game.time + celebration.current;
    SPARKS.forEach((spark, index) => {
      const born = game.collectedAt[index];
      const age = born < 0 ? -1 : time - born;
      const visible = spark.unlock <= game.connections && (age < 0 || age < .55);
      const progress = age < 0 ? 0 : Math.min(1, age / .55);
      const ease = 1 - Math.pow(1 - progress, 3);
      // A pickup joins the walker in one small arc. It follows simulation time,
      // so pausing freezes both the reward and its visual acknowledgment.
      transform.position.set(
        spark.x + (game.x - spark.x) * ease,
        .5 + Math.sin(time * 1.8 + index) * .07 + ease * .75 + Math.sin(progress * Math.PI) * .45,
        spark.z + (game.z - spark.z) * ease,
      );
      const scale = visible ? (1 - ease) * (age < 0 ? 1 : 1.2) : 0;
      transform.rotation.set(.35, time * .7 + index * 1.4, -.35);
      transform.scale.set(scale, scale * 1.5, scale);
      transform.updateMatrix();
      loops.current!.setMatrixAt(index, transform.matrix);
      transform.rotation.set(0, 0, 0);
      transform.scale.setScalar(scale);
      transform.updateMatrix();
      cores.current!.setMatrixAt(index, transform.matrix);
    });
    loops.current.instanceMatrix.needsUpdate = true;
    cores.current.instanceMatrix.needsUpdate = true;
  });

  return <group name="loose-sparks">
    <instancedMesh ref={loops} args={[geometry.loop, material.loop, SPARKS.length]} frustumCulled={false} />
    <instancedMesh ref={cores} args={[geometry.core, material.core, SPARKS.length]} frustumCulled={false} />
  </group>;
}
