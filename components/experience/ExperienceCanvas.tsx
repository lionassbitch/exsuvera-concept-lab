"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { scrollWorld } from "../../lib/scroll-world";
import { ArtistScene } from "./ArtistScene";
import { CameraRig } from "./CameraRig";
import { SceneAtmosphere } from "./SceneAtmosphere";
import { SymbolScene } from "./SymbolScene";
import { WorldScene } from "./WorldScene";

export function ExperienceCanvas({ onFailure }: { onFailure: () => void }) {
  const low = scrollWorld.tier === "low";

  return (
    <div className="rd-canvas" aria-hidden="true">
      <Canvas
        dpr={low ? [1, 1.15] : [1, 1.5]}
        camera={{ position: [0, 0.55, 8.1], fov: 34, near: 0.1, far: 70 }}
        gl={{
          antialias: !low,
          alpha: false,
          powerPreference: low ? "low-power" : "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#08090b", 1);
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            onFailure();
          });
        }}
      >
        <AdaptiveDpr />
        <SceneAtmosphere />
        <CameraRig />
        <ArtistScene />
        <SymbolScene />
        <WorldScene />
      </Canvas>
    </div>
  );
}
