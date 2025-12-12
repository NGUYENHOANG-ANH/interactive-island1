import React, { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise2D } from "simplex-noise";

export default function IslandMesh({ coal, renewables, deforestation, seaLevel = 0 }) {
  const meshRef = useRef();
  const [geometry, setGeometry] = useState(null);

  const noise2D = useMemo(() => {
    try {
      return createNoise2D();
    } catch (error) {
      console.error("❌ Error creating noise2D:", error);
      // Fallback: return a simple function
      return (x, y) => Math.sin(x) * Math.cos(y) * 0.5;
    }
  }, []);

  const SIZE = 6;
  const SEGMENTS = 120;

  // === Generate static base island ===
  useMemo(() => {
    try {
      const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
      const pos = geo.attributes.position;

      // ✅ FIX: Validate all Z values before setting
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        if (isNaN(x) || isNaN(y)) {
          console.warn(`⚠️ Invalid X/Y at index ${i}:`, x, y);
          pos.setZ(i, 0);
          continue;
        }

        const d = Math.min(1, Math.sqrt(x * x + y * y) / (SIZE * 0.5));
        const volcano = (1 - d) ** 2.2 * 1.8;

        let noise = 0;
        try {
          noise = noise2D(x * 0.7, y * 0.7) * 0.4;
        } catch (e) {
          console.warn("⚠️ noise2D failed, using fallback");
          noise = Math.sin(x) * Math.cos(y) * 0.2;
        }

        const z = volcano + noise;

        // ✅ Validate Z before setting
        if (! isNaN(z) && isFinite(z)) {
          pos.setZ(i, z);
        } else {
          console.warn(`⚠️ Invalid Z at index ${i}:`, z);
          pos.setZ(i, volcano);
        }
      }

      pos.needsUpdate = true;

      // ✅ Validate entire position array before computing normals
      const array = pos.array;
      let hasNaN = false;
      for (let i = 0; i < array.length; i++) {
        if (! isFinite(array[i])) {
          hasNaN = true;
          array[i] = 0;
        }
      }

      if (hasNaN) {
        console.warn("⚠️ Fixed NaN values in position array");
        pos.needsUpdate = true;
      }

      try {
        geo.computeVertexNormals();
      } catch (e) {
        console.warn("⚠️ computeVertexNormals failed:", e);
      }

      setGeometry(geo);
      console.log("✅ Island geometry created successfully");
    } catch (error) {
      console.error("❌ Error creating island:", error);
    }
  }, [noise2D]);

  // === Climate deformation ===
  useFrame(() => {
    if (!geometry) return;

    try {
      const pos = geometry.attributes.position;
      const t = performance.now() * 0.0002;

      // Climate heat
      const heat = coal * 0.015 - renewables * 0.008 + deforestation * 0.01;
      const seaEffect = seaLevel * 0.15;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        const d = Math.min(1, Math.sqrt(x * x + y * y) / (SIZE * 0.5));
        const base = (1 - d) ** 2.2 * 1.8;

        let melt = 0;
        try {
          melt = noise2D(x * 0.7 + t, y * 0.7 + t) * 0.2;
        } catch (e) {
          melt = Math.sin(x + t) * Math.cos(y + t) * 0.1;
        }

        let finalZ = base + melt - heat * 0.2 - seaEffect;
        finalZ = Math.max(finalZ, -0.1);

        // ✅ Validate before setting
        if (!isNaN(finalZ) && isFinite(finalZ)) {
          pos.setZ(i, finalZ);
        }
      }

      pos.needsUpdate = true;

      try {
        geometry.computeVertexNormals();
      } catch (e) {
        // Silent fail
      }
    } catch (error) {
      console.error("❌ Error updating island:", error);
    }
  });

  if (!geometry) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.2, 0]}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#6ca85a"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}