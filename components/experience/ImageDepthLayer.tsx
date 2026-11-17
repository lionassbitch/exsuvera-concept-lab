"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollWorld } from "../../lib/scroll-world";
import { windowFade } from "../../lib/motion";

type BackdropKey = {
  color: [number, number, number];
  strength: number;
};

type Props = {
  url: string;
  position: [number, number, number];
  height: number;
  range: [number, number, number, number];
  parallax?: number;
  /** Sample the corners and lift a flat studio or black field off the artwork. */
  isolateBackdrop?: boolean;
  feather?: number;
  displace?: number;
  dim?: number;
  mount?: boolean;
  /** Horizontal scale and vertical shift used on narrow viewports. */
  narrow?: [number, number];
  /** Scale used on narrow viewports. */
  narrowFit?: number;
};

const vertexShader = /* glsl */ `
varying vec2 vUv;
uniform sampler2D map;
uniform float displace;
void main() {
  vUv = uv;
  vec3 displaced = position;
  float heightSample = dot(texture2D(map, uv).rgb, vec3(0.2126, 0.7152, 0.0722));
  displaced.z += heightSample * displace;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
uniform sampler2D map;
uniform float opacity;
uniform vec3 keyColor;
uniform float keyStrength;
uniform float feather;
uniform float dim;
varying vec2 vUv;

vec3 toLinear(vec3 color) {
  return pow(max(color, vec3(0.0)), vec3(2.2));
}

void main() {
  vec4 tex = texture2D(map, vUv);
  float keyDist = distance(tex.rgb, keyColor);
  float keyed = smoothstep(0.32, 0.08, keyDist);
  float alpha = tex.a * opacity * mix(1.0, 1.0 - keyed, keyStrength);
  float featherMix = step(0.001, feather);
  float edgeX = smoothstep(0.0, max(feather, 0.0001), vUv.x) * smoothstep(0.0, max(feather, 0.0001), 1.0 - vUv.x);
  float edgeY = smoothstep(0.0, max(feather, 0.0001), vUv.y) * smoothstep(0.0, max(feather, 0.0001), 1.0 - vUv.y);
  alpha *= mix(1.0, edgeX * edgeY, featherMix);
  if (alpha < 0.015) discard;
  gl_FragColor = vec4(toLinear(tex.rgb) * dim, alpha);
}
`;

function readBackdrop(context: CanvasRenderingContext2D, width: number, height: number): BackdropKey {
  const points: Array<[number, number]> = [
    [1, 1],
    [width - 2, 1],
    [1, height - 2],
    [width - 2, height - 2],
  ];
  const colors = points.map(([x, y]) => {
    const pixel = context.getImageData(Math.max(0, x), Math.max(0, y), 1, 1).data;
    return [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255] as [number, number, number];
  });
  const average: [number, number, number] = [0, 0, 0];
  for (const color of colors) {
    average[0] += color[0] / colors.length;
    average[1] += color[1] / colors.length;
    average[2] += color[2] / colors.length;
  }
  const variance =
    colors.reduce((sum, color) => {
      return (
        sum +
        (color[0] - average[0]) ** 2 +
        (color[1] - average[1]) ** 2 +
        (color[2] - average[2]) ** 2
      );
    }, 0) / colors.length;
  const strength = variance < 0.008 ? 1 : variance < 0.02 ? 0.55 : 0;
  return { color: average, strength };
}

export function ImageDepthLayer({
  url,
  position,
  height,
  range,
  parallax = 0.12,
  isolateBackdrop = false,
  feather = 0,
  displace = 0,
  dim = 1,
  mount = false,
  narrow: narrowShift = [0.18, 0.5],
  narrowFit = 0.72,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const mountRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const aspectRef = useRef(1);
  const keyRef = useRef<BackdropKey>({ color: [0, 0, 0], strength: 0 });
  const ready = useRef(false);

  const uniforms = useMemo(
    () => ({
      map: { value: null as THREE.Texture | null },
      opacity: { value: 0 },
      keyColor: { value: new THREE.Color(0, 0, 0) },
      keyStrength: { value: 0 },
      feather: { value: feather },
      dim: { value: dim },
      displace: { value: displace },
    }),
    [dim, displace, feather]
  );

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (cancelled) return;
      const maxEdge = scrollWorld.tier === "low" ? 1280 : 2048;
      const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const key = isolateBackdrop
        ? readBackdrop(context, canvas.width, canvas.height)
        : { color: [0, 0, 0] as [number, number, number], strength: 0 };
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.NoColorSpace;
      texture.anisotropy = scrollWorld.tier === "low" ? 2 : 4;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
      textureRef.current?.dispose();
      textureRef.current = texture;
      aspectRef.current = canvas.width / canvas.height;
      keyRef.current = key;
      ready.current = true;
      if (material.current) {
        material.current.uniforms.map.value = texture;
        material.current.uniforms.keyColor.value.setRGB(key.color[0], key.color[1], key.color[2]);
        material.current.uniforms.keyStrength.value = key.strength;
        material.current.uniformsNeedUpdate = true;
      }
      if (mesh.current) {
        const width = height * aspectRef.current;
        mesh.current.scale.set(width, height, 1);
      }
    };
    image.onerror = () => {
      ready.current = false;
    };
    image.src = url;
    return () => {
      cancelled = true;
      textureRef.current?.dispose();
      textureRef.current = null;
    };
  }, [height, isolateBackdrop, url]);

  useFrame(() => {
    const fade = windowFade(scrollWorld.smooth, range[0], range[1], range[2], range[3]);
    const narrow = scrollWorld.narrow;
    const allowParallax = scrollWorld.tier === "high" && !narrow;
    const fit = narrow ? narrowFit : 1;
    if (group.current) {
      group.current.visible = ready.current && fade > 0.02;
      group.current.position.set(
        position[0] * (narrow ? narrowShift[0] : 1) + scrollWorld.pointer.x * parallax * (allowParallax ? 1 : 0),
        position[1] + (narrow ? narrowShift[1] : 0) + scrollWorld.pointer.y * parallax * 0.45 * (allowParallax ? 1 : 0),
        position[2]
      );
    }
    if (material.current) {
      material.current.uniforms.opacity.value = fade;
      material.current.uniforms.map.value = textureRef.current;
      material.current.uniforms.keyStrength.value = keyRef.current.strength;
    }
    const paintMount = (plate: THREE.Mesh | null, alpha: number) => {
      if (!plate) return;
      const plateMaterial = plate.material as THREE.MeshBasicMaterial;
      plateMaterial.opacity = alpha;
    };
    if (mesh.current && ready.current) {
      const plateHeight = height * fit;
      const width = plateHeight * aspectRef.current;
      mesh.current.scale.set(width, plateHeight, 1);
      mountRef.current?.scale.set(width * 1.045, plateHeight * 1.045, 1);
      edgeRef.current?.scale.set(width * 1.07, plateHeight * 1.07, 1);
      paintMount(mountRef.current, fade);
      paintMount(edgeRef.current, fade);
    }
  });

  const showMount = mount;

  return (
    <group ref={group} position={position}>
      {showMount ? (
        <>
          <mesh ref={edgeRef} position={[0, 0, -0.08]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="#c7a263" transparent opacity={0} toneMapped={false} />
          </mesh>
          <mesh ref={mountRef} position={[0, 0, -0.05]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="#14120e" transparent opacity={0} toneMapped={false} />
          </mesh>
        </>
      ) : null}
      <mesh ref={mesh} frustumCulled={false}>
        <planeGeometry args={[1, 1, displace > 0 ? 48 : 1, displace > 0 ? 48 : 1]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={displace <= 0 && feather <= 0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
