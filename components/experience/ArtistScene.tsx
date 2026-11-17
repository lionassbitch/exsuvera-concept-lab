"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sourceImages } from "../../lib/artist-config";
import { windowFade } from "../../lib/motion";
import { scrollWorld } from "../../lib/scroll-world";
import { ImageDepthLayer } from "./ImageDepthLayer";

export function ArtistScene() {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const fade = windowFade(scrollWorld.smooth, -0.08, 0.02, 0.26, 0.44);
    if (!group.current) return;
    group.current.visible = fade > 0.02;
    group.current.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.material || Array.isArray(mesh.material)) return;
      if (!mesh.material.userData.fade) return;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = (mesh.material.userData.baseOpacity as number) * fade;
    });
  });

  return (
    <group ref={group}>
      <mesh position={[-2.35, 2.15, -0.4]}>
        <planeGeometry args={[0.01, 0.9]} />
        <meshBasicMaterial color="#f4f0e6" transparent opacity={0.7} toneMapped={false} userData={{ fade: true, baseOpacity: 0.7 }} />
      </mesh>
      <mesh position={[2.55, 2.05, -0.55]}>
        <planeGeometry args={[0.012, 0.85]} />
        <meshBasicMaterial color="#c7a263" transparent opacity={0.6} toneMapped={false} userData={{ fade: true, baseOpacity: 0.6 }} />
      </mesh>
      <ImageDepthLayer
        url={sourceImages.hoodie.src}
        position={[-0.42, 1.82, -0.4]}
        height={1.28}
        range={[-0.05, 0.04, 0.24, 0.42]}
        parallax={0.16}
        mount
        narrow={[-0.49, 0.02]}
      />
      <ImageDepthLayer
        url={sourceImages.portrait.src}
        position={[1.15, 1.32, 0.12]}
        height={2.05}
        range={[-0.08, 0.02, 0.28, 0.46]}
        parallax={0.1}
        mount
      />
    </group>
  );
}
