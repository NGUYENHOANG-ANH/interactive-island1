import React, { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise2D } from "simplex-noise";

export default function IslandMesh({ coal, renewables, deforestation, seaLevel = 0 }) {
  const meshRef = useRef();
  const [geometry, setGeometry] = useState(null);

  const noise2D = useMemo(() => createNoise2D(), []);

  const SIZE = 6;
  const SEGMENTS = 120;

  // === Generate static base island ===
  useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const d = Math.min(1, Math.sqrt(x * x + y * y) / (SIZE * 0.5));

      const volcano = (1 - d) ** 2.2 * 1.8;
      const noise = noise2D(x * 0.7, y * 0.7) * 0.4;

      pos.setZ(i, volcano + noise * 0.6);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    
    setGeometry(geo);
  }, [noise2D]);

  // === Climate deformation ===
  useFrame(() => {
    if (! geometry) return;

    const pos = geometry.attributes.position;
    const t = performance.now() * 0.0002;

    // Climate heat
    const heat = coal * 0.015 - renewables * 0.008 + deforestation * 0.01;

    // Scale sea-level effect
    const seaEffect = seaLevel * 0.15;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const d = Math.min(1, Math.sqrt(x * x + y * y) / (SIZE * 0.5));

      const base = (1 - d) ** 2.2 * 1.8;
      const melt = noise2D(x * 0.7 + t, y * 0.7 + t) * 0.2;

      let finalZ = base + melt - heat * 0.2 - seaEffect;
      finalZ = Math.max(finalZ, -0.1);

      pos.setZ(i, finalZ);
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.2, 0]}
      geometry={geometry}
    >
      <meshStandardMaterial
        color="#6ca85a"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}