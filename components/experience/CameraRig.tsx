"use client";

import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NARROW_CAMERA, WIDE_CAMERA, samplePath } from "../../lib/motion";
import { scrollWorld } from "../../lib/scroll-world";

export function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const fov = useRef(34);

  useFrame(() => {
    const perspective = cameraRef.current;
    if (!perspective) return;
    const path = samplePath(scrollWorld.smooth, scrollWorld.narrow ? NARROW_CAMERA : WIDE_CAMERA);
    const parallax = scrollWorld.tier === "high" && !scrollWorld.narrow;
    const shiftX = parallax ? scrollWorld.pointer.x * 0.16 : 0;
    const shiftY = parallax ? scrollWorld.pointer.y * 0.06 : 0;
    perspective.position.set(path.pos[0] + shiftX, path.pos[1] + shiftY, path.pos[2]);
    perspective.lookAt(path.target[0] + shiftX * 0.35, path.target[1] + shiftY * 0.4, path.target[2]);
    const nextFov = scrollWorld.narrow ? 42 : 34;
    if (Math.abs(fov.current - nextFov) > 0.01) {
      fov.current = nextFov;
      perspective.fov = nextFov;
      perspective.updateProjectionMatrix();
    }
  });

  return (
    <PerspectiveCamera ref={cameraRef} makeDefault fov={34} near={0.1} far={70} position={[0, 0.55, 8.1]} />
  );
}
