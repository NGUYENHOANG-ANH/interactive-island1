import React, { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

export default function DiseaseScene({ diseaseSpread, population }) {
  const particlesRef = useRef(null);
  const [geometryReady, setGeometryReady] = useState(false);
  const smoothSpread = useRef(diseaseSpread);

  useMemo(() => {
    try {
      const geometry = new THREE.BufferGeometry();
      const count = Math.max(100, Math.floor(diseaseSpread * 30));

      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 28;
        positions[i * 3 + 1] = Math.random() * 16;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 24;

        velocities[i * 3] = (Math.random() - 0.5) * 0.15;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
      }

      geometry. setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.userData.velocities = velocities;

      particlesRef.current = geometry;
      setGeometryReady(true);
    } catch (error) {
      console.error("Error creating particle geometry:", error);
      setGeometryReady(false);
    }
  }, [diseaseSpread]);

  useFrame(() => {
    smoothSpread.current += (diseaseSpread - smoothSpread.current) * 0.08;

    if (particlesRef.current && geometryReady) {
      try {
        const positions = particlesRef.current.attributes.position.array;
        const velocities = particlesRef.current.userData.velocities;

        if (! positions || !velocities) return;

        const speed = 0.8 + smoothSpread.current * 0.015;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i] * speed;
          positions[i + 1] += velocities[i + 1] * speed;
          positions[i + 2] += velocities[i + 2] * speed;

          if (Math.abs(positions[i]) > 28) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 16) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 24) velocities[i + 2] *= -1;
        }

        particlesRef.current.attributes.position.needsUpdate = true;
      } catch (error) {
        console.error("Error updating particles:", error);
      }
    }
  });

  const getColor = (spread) => {
    if (spread < 30) return { virus: "#FDD835", status: "#2E7D32", bg: "#E8F5E9" };
    if (spread < 60) return { virus: "#FB8C00", status: "#F57C00", bg: "#FFF3E0" };
    return { virus: "#D32F2F", status: "#C62828", bg: "#FFEBEE" };
  };

  const colors = getColor(smoothSpread.current);
  const infectedCount = Math.floor((diseaseSpread / 100) * 5);
  const healthyCount = 5 - infectedCount;

  return (
    <group>
      <mesh position={[0, 7, -12]}>
        <planeGeometry args={[55, 18]} />
        <meshStandardMaterial
          color={smoothSpread.current > 70 ? "#37474F" : "#ECEFF1"}
          emissive={smoothSpread.current > 70 ? "#263238" : undefined}
          emissiveIntensity={smoothSpread.current > 70 ? 0.2 : 0}
        />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[55, 30]} />
        <meshStandardMaterial color={colors.bg} />
      </mesh>

      <Text
        position={[0, 11, 0]}
        fontSize={1.8}
        color={colors.status}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        🦠 VIRUS SPREAD
      </Text>

      <Text
        position={[0, 10, 0]}
        fontSize={0.95}
        color="#555555"
        anchorX="center"
        anchorY="middle"
      >
        {smoothSpread.current < 30
          ? "✅ Controlled"
          : smoothSpread.current < 60
          ? "⚠️ Spreading"
          : "🚨 Critical"}
      </Text>

      <Text
        position={[0, 8.5, 0]}
        fontSize={3.2}
        color={colors.status}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.006}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        {`${Math.round(smoothSpread.current)}%`}
      </Text>

      <Text
        position={[0, 7.5, 0]}
        fontSize={0.8}
        color="#999999"
        anchorX="center"
        anchorY="middle"
      >
        Infection Rate
      </Text>

      <Text
        position={[-16, 5.5, 0]}
        fontSize={1.1}
        color="#2E7D32"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        👥 HEALTHY
      </Text>

      {[...Array(healthyCount)].map((_, i) => (
        <group key={`healthy-${i}`} position={[-18 + i * 3.5, 1.5, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <sphereGeometry args={[0.6, 20, 20]} />
            <meshStandardMaterial
              color="#4CAF50"
              emissive="#81C784"
              emissiveIntensity={0.4}
              metalness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.8, 0.1, 16, 32]} />
            <meshStandardMaterial
              color="#4CAF50"
              emissive="#81C784"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}

      <Text
        position={[0, 5.5, 0]}
        fontSize={1.1}
        color={colors.virus}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        🦠 VIRUS
      </Text>

      {geometryReady && particlesRef.current && (
        <points geometry={particlesRef.current}>
          <pointsMaterial
            color={colors.virus}
            size={0.6 + smoothSpread.current * 0.01}
            sizeAttenuation
            transparent
            opacity={0.85}
          />
        </points>
      )}

      {smoothSpread.current > 20 && (
        <mesh position={[0, 3, 0]}>
          <torusGeometry
            args={[Math.min(smoothSpread.current / 8, 14), 0.5, 32, 100]}
          />
          <meshStandardMaterial
            color={colors.virus}
            emissive={colors.virus}
            emissiveIntensity={0.8}
            metalness={0.3}
            transparent
            opacity={Math.max(0, 1 - smoothSpread. current / 100)}
          />
        </mesh>
      )}

      <Text
        position={[16, 5.5, 0]}
        fontSize={1.1}
        color={colors.status}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        🤒 INFECTED
      </Text>

      {[...Array(infectedCount)].map((_, i) => {
        const pulseScale = 1 + Math.sin(performance.now() * 0.005 + i) * 0.15;
        return (
          <group key={`infected-${i}`} position={[14 + i * 3.5, 1.5, 0]}>
            <mesh position={[0, 0.5, 0]} castShadow scale={pulseScale}>
              <sphereGeometry args={[0.6, 20, 20]} />
              <meshStandardMaterial
                color={colors.status}
                emissive="#FF5252"
                emissiveIntensity={0.7}
                metalness={0.2}
              />
            </mesh>
            <mesh position={[0, 0, 0]} scale={pulseScale * 1.2}>
              <torusGeometry args={[0.8, 0.12, 16, 32]} />
              <meshStandardMaterial
                color={colors.virus}
                emissive={colors.virus}
                emissiveIntensity={0.9}
              />
            </mesh>
          </group>
        );
      })}

      {[...Array(5 - infectedCount)].map((_, i) => (
        <mesh key={`empty-${i}`} position={[14 + infectedCount * 3.5 + i * 3.5, 1.5, 0]}>
          <sphereGeometry args={[0.6, 20, 20]} />
          <meshStandardMaterial
            color="#CCCCCC"
            opacity={0.3}
            transparent
          />
        </mesh>
      ))}

      {smoothSpread.current > 60 && (
        <group position={[-22, 3, -3]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.5, 3, 0.5]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.3]} castShadow>
            <boxGeometry args={[1, 2, 0.1]} />
            <meshStandardMaterial
              color={colors.status}
              emissive="#FF5252"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[0, 0, 0.3]} castShadow>
            <boxGeometry args={[2, 1, 0.1]} />
            <meshStandardMaterial
              color={colors. status}
              emissive="#FF5252"
              emissiveIntensity={0.6}
            />
          </mesh>
          <Text
            position={[0, -2, 0.4]}
            fontSize={0.6}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.002}
            outlineColor={colors.status}
          >
            🏥 HOSPITAL
          </Text>
        </group>
      )}

      {smoothSpread.current > 75 && (
        <>
          <pointLight
            position={[0, 12, 0]}
            color="#FF0000"
            intensity={2 + (smoothSpread.current - 75) * 0.04}
            distance={40}
          />
          <mesh position={[0, 11.5, 0]}>
            <sphereGeometry args={[0.9, 16, 16]} />
            <meshStandardMaterial
              color="#FF0000"
              emissive="#FF0000"
              emissiveIntensity={1}
            />
          </mesh>
        </>
      )}

      <mesh position={[0, 2.5, -0.5]}>
        <boxGeometry args={[8, 1.2, 0.2]} />
        <meshStandardMaterial
          color={colors.status}
          emissive={colors.status}
          emissiveIntensity={0.5}
        />
      </mesh>

      <Text
        position={[0, 2.5, 0.2]}
        fontSize={0.85}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {`Healthy: ${healthyCount}/5  |  Infected: ${infectedCount}/5`}
      </Text>
    </group>
  );
}