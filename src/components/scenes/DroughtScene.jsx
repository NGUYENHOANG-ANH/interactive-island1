import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

export default function DroughtScene({ droughtLevel }) {
  const sunRef = useRef();
  const smoothDrought = useRef(droughtLevel);

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current. rotation.z += 0.008;
    }
    smoothDrought.current += (droughtLevel - smoothDrought.current) * 0.07;
  });

  const getColors = (drought) => {
    if (drought < 40) {
      return {
        ground: "#7CB342",
        sky: "#87CEEB",
        status:  "#2E7D32",
        statusEmissive: "#4CAF50",
      };
    } else if (drought < 70) {
      return {
        ground: "#B8860B",
        sky: "#DEB887",
        status: "#F57C00",
        statusEmissive: "#FFB74D",
      };
    } else {
      return {
        ground: "#6B4423",
        sky: "#8B6F47",
        status: "#C62828",
        statusEmissive: "#EF5350",
      };
    }
  };

  const colors = getColors(smoothDrought.current);

  return (
    <group>
      {/* SKY */}
      <mesh position={[0, 8, -12]}>
        <planeGeometry args={[50, 12]} />
        <meshStandardMaterial color={colors.sky} />
      </mesh>

      {/* SUN */}
      <mesh
        position={[10, 8, -11]}
        ref={sunRef}
        castShadow
        scale={1 + smoothDrought.current * 0.01}
      >
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshStandardMaterial
          color={smoothDrought.current > 70 ? "#FF4500" : "#FF6B35"}
          emissive="#FFD700"
          emissiveIntensity={Math.max(0.3, (smoothDrought.current / 100) * 0.8)}
        />
      </mesh>

      {/* SUN LIGHT */}
      <pointLight
        position={[10, 8, -11]}
        color="#FF8C42"
        intensity={2 + smoothDrought.current * 0.03}
        distance={40}
      />

      {/* GROUND */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial color={colors.ground} />
      </mesh>

      {/* LABELS */}
      <Text
        position={[0, 6, 0]}
        fontSize={1.5}
        color={colors.status}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        ☀️ DROUGHT LEVEL
      </Text>

      <Text
        position={[0,5, 0]}
        fontSize={2.2}
        color={colors.status}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        {`${Math.round(smoothDrought.current)}%`}
      </Text>

      <Text
        position={[-8, 5.5, 0]}
        fontSize={1.1}
        color={smoothDrought.current < 50 ? "#2E7D32" : "#8B4513"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#FFFFFF"
      >
        {smoothDrought.current < 50 ? "🌳 Alive" : "💀 Dead"}
      </Text>

      <Text
        position={[8, 3.2, 0]}
        fontSize={1.1}
        color={smoothDrought.current < 40 ? "#1976D2" : "#D2B48C"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#FFFFFF"
      >
        {smoothDrought.current < 40 ? "💧 Water" : "🏜️ Dry"}
      </Text>

      <Text
        position={[0, 3.8, 0]}
        fontSize={0.8}
        color="#555555"
        anchorX="center"
        anchorY="middle"
      >
        {smoothDrought.current < 40
          ? "Healthy conditions"
          : smoothDrought.current < 70
          ?  "Moderate drought"
          :  "Critical crisis"}
      </Text>

      {/* TREE - ALIVE */}
      {smoothDrought.current < 50 && (
        <group position={[-8, 0, 0]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 3.6, 8]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh
            position={[0, 4, 0]}
            castShadow
            receiveShadow
            scale={1 + Math.sin(performance.now() * 0.002) * 0.05}
          >
            <sphereGeometry args={[2.5, 28, 28]} />
            <meshStandardMaterial
              color="#2E7D32"
              metalness={0.1}
              roughness={0.7}
              emissive="#4CAF50"
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      )}

      {/* TREE - DEAD */}
      {smoothDrought.current >= 50 && (
        <group position={[-8, 0, 0]} scale={1 - (smoothDrought.current - 50) * 0.005}>
          <mesh
            position={[0, 1.8, 0]}
            castShadow
            rotation={[Math.sin(performance.now() * 0.003) * 0.1, 0, 0]}
          >
            <cylinderGeometry args={[0.4, 0.5, 3.6, 8]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
          {[0, 90, 180, 270].map((angle) => (
            <mesh
              key={angle}
              position={[
                Math. cos((angle * Math.PI) / 180) * 1.5,
                2.8,
                Math.sin((angle * Math.PI) / 180) * 1.5,
              ]}
              rotation={[0.3 + Math.sin(performance.now() * 0.004 + angle) * 0.2, 0, 0]}
              castShadow
            >
              <boxGeometry args={[0.2, 1.8, 0.2]} />
              <meshStandardMaterial color="#4E342E" />
            </mesh>
          ))}
        </group>
      )}

      {/* WATER - ALIVE */}
      {smoothDrought.current < 40 && (
        <mesh position={[8, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2, 0.4, 32]} />
          <meshStandardMaterial
            color="#1976D2"
            metalness={0.8}
            roughness={0.1}
            emissive="#42A5F5"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* WATER - DRY */}
      {smoothDrought.current >= 40 && (
        <group position={[8, 0, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[2, 2, 0.25, 32]} />
            <meshStandardMaterial color="#D2B48C" roughness={0.95} />
          </mesh>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const crackProgress = Math.min(1, (smoothDrought.current - 40) / 40);
            return (
              <mesh
                key={angle}
                position={[
                  Math.cos((angle * Math.PI) / 180) * (1 + crackProgress * 0.3),
                  0.15,
                  Math.sin((angle * Math.PI) / 180) * (1 + crackProgress * 0.3),
                ]}
                rotation={[0, (angle * Math.PI) / 180, 0]}
                scale={[1 + crackProgress * 0.5, 1, 1]}
                castShadow
              >
                <boxGeometry args={[1.8, 0.08, 0.15]} />
                <meshStandardMaterial color="#9B8B7E" roughness={0.95} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* STATUS INDICATOR */}
      <mesh position={[8, 3.2, -0.5]}>
        <boxGeometry args={[3.5, 0.9, 0.2]} />
        <meshStandardMaterial
          color={colors. status}
          emissive={colors.statusEmissive}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* WARNING OVERLAY */}
      {smoothDrought.current > 80 && (
        <mesh position={[0, 0.01, -15]}>
          <planeGeometry args={[55, 35]} />
          <meshStandardMaterial
            color="#FF6B6B"
            opacity={Math.min(0.2, (smoothDrought.current - 80) * 0.02)}
            transparent
            emissive="#FF0000"
            emissiveIntensity={Math.min(0.3, (smoothDrought.current - 80) * 0.01)}
          />
        </mesh>
      )}
    </group>
  );
}