import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function WaterPlane({ seaLevel = 0, color = "#0b63a6" }) {
  const meshRef = useRef();
  const targetYRef = useRef(-0.45 + seaLevel);

  // Update target when seaLevel changes
  if (seaLevel !== undefined) {
    targetYRef.current = -0.45 + seaLevel;
  }

  useFrame(() => {
    if (!meshRef.current) return;

    // Smooth lerp y position
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current. position.y,
      targetYRef.current,
      0.03
    );

    // Gentle rotation animation
    meshRef.current.rotation.z += 0.0008 + (seaLevel || 0) * 0.001;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.45, 0]}
      receiveShadow
    >
      <planeGeometry args={[40, 40, 1, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}