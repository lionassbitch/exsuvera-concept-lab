"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollWorld } from "../../lib/scroll-world";
import { windowFade } from "../../lib/motion";

function unit(index: number) {
  const value = Math.sin(index * 127.1 + 1.7) * 43758.5453;
  return value - Math.floor(value);
}

export function SceneAtmosphere() {
  const dust = useRef<THREE.Points>(null);
  const background = useRef<THREE.Color>(null);
  const fog = useRef<THREE.FogExp2>(null);
  const gold = useMemo(() => new THREE.Color("#14110c"), []);
  const teal = useMemo(() => new THREE.Color("#062126"), []);

  const geometry = useMemo(() => {
    const count = scrollWorld.tier === "low" ? 0 : 90;
    const positions = new Float32Array(Math.max(count, 1) * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (unit(index + 1) - 0.5) * 8;
      positions[index * 3 + 1] = unit(index + 19) * 3.2 - 0.4;
      positions[index * 3 + 2] = -unit(index + 41) * 14;
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return buffer;
  }, []);

  useFrame((_, delta) => {
    const progress = scrollWorld.smooth;
    const symbol = windowFade(progress, 0.22, 0.4, 0.58, 0.76);
    const world = windowFade(progress, 0.54, 0.74, 1.2, 1.4);
    const sky = background.current;
    const haze = fog.current;
    if (sky && haze) {
      sky.set("#08090b").lerp(gold, symbol * 0.85).lerp(teal, world);
      haze.color.copy(sky);
      haze.density = 0.05 + world * 0.018 - symbol * 0.01;
    }
    if (dust.current && scrollWorld.tier === "high") {
      dust.current.rotation.y += delta * 0.012;
      const material = dust.current.material as THREE.PointsMaterial;
      material.opacity = 0.18 + symbol * 0.12 + world * 0.08;
    }
  });

  return (
    <>
      <color ref={background} attach="background" args={["#08090b"]} />
      <fogExp2 ref={fog} attach="fog" args={["#08090b", 0.05]} />
      {scrollWorld.tier === "low" ? null : (
        <points ref={dust} geometry={geometry} frustumCulled={false}>
          <pointsMaterial color="#e7e1d6" size={0.015} transparent opacity={0.2} depthWrite={false} toneMapped={false} />
        </points>
      )}
    </>
  );
}
