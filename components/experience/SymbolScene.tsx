"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sourceImages } from "../../lib/artist-config";
import { windowFade } from "../../lib/motion";
import { scrollWorld } from "../../lib/scroll-world";
import { ImageDepthLayer } from "./ImageDepthLayer";

const posts: Array<[number, number, number]> = [
  [-2.2, 0.85, 0.2],
  [2.35, 0.85, 0.2],
];

export function SymbolScene() {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const fade = windowFade(scrollWorld.smooth, 0.22, 0.4, 0.58, 0.76);
    if (!group.current) return;
    group.current.visible = fade > 0.02;
    group.current.rotation.y = (scrollWorld.smooth - 0.48) * 0.18;
  });

  return (
    <group ref={group} position={[0, 0, -6]}>
      {posts.map((position) => (
        <mesh key={position.join("-")} position={position}>
          <boxGeometry args={[0.012, 0.95, 0.012]} />
          <meshBasicMaterial color="#c7a263" toneMapped={false} />
        </mesh>
      ))}
      <ImageDepthLayer
        url={sourceImages.emblem.src}
        position={[0.95, 0.48, 0.06]}
        height={1.4}
        range={[0.24, 0.42, 0.58, 0.76]}
        parallax={0.1}
        mount
        narrow={[0.08, 0.02]}
        narrowFit={0.44}
      />
    </group>
  );
}
