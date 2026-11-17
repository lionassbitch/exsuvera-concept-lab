"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sourceImages } from "../../lib/artist-config";
import { windowFade } from "../../lib/motion";
import { scrollWorld } from "../../lib/scroll-world";
import { ImageDepthLayer } from "./ImageDepthLayer";

export function WorldScene() {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const fade = windowFade(scrollWorld.smooth, 0.52, 0.7, 1.2, 1.35);
    if (!group.current) return;
    group.current.visible = fade > 0.02;
  });

  return (
    <group ref={group} position={[0, 0, -12]}>
      {[-2.3, 2.4].map((x) => (
        <mesh key={x} position={[x, 0.9, -0.15]}>
          <boxGeometry args={[0.01, 0.85, 0.01]} />
          <meshBasicMaterial color="#179aa8" toneMapped={false} />
        </mesh>
      ))}
      <ImageDepthLayer
        url={sourceImages.world.src}
        position={[0.9, 0.5, 0.08]}
        height={1.5}
        range={[0.56, 0.74, 1.2, 1.35]}
        parallax={0.12}
        mount
        narrow={[0.08, 0.48]}
        narrowFit={0.52}
      />
    </group>
  );
}
