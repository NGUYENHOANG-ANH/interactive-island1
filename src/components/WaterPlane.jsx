import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function WaterPlane({ seaLevel = 0, color = "#0b63a6" }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    // smooth lerp y
    const targetY = -0.45 + seaLevel; // seaLevel already mapped to scene units
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.03);
    ref.current.rotation.z += 0.0008 + seaLevel * 0.001;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI/2, 0, 0]} position={[0, -0.45, 0]}>
      <planeGeometry args={[40, 40, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} transparent opacity={0.9} />
    </mesh>
  );
}
