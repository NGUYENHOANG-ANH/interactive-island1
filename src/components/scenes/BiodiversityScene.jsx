import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

export default function BiodiversityScene({ biodiversityLoss }) {
  const smoothLoss = useRef(biodiversityLoss);

  const getColors = (loss) => {
    if (loss < 40) {
      return {
        ground: "#8BC34A",
        sky: "#87CEEB",
        status: "#2E7D32",
        statusEmissive: "#4CAF50",
      };
    } else if (loss < 70) {
      return {
        ground: "#CD853F",
        sky: "#D3D3D3",
        status: "#F57C00",
        statusEmissive: "#FFB74D",
      };
    } else {
      return {
        ground: "#704214",
        sky: "#A9A9A9",
        status: "#C62828",
        statusEmissive: "#EF5350",
      };
    }
  };

  const Tree = ({ position, alive, scale = 1, deathProgress = 0 }) => (
    <group position={position} scale={scale} castShadow>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 2.4, 8]} />
        <meshStandardMaterial
          color={alive ? "#6D4C41" : "#4E342E"}
          roughness={0.8}
        />
      </mesh>

      {alive ?  (
        <mesh
          position={[0, 2.8, 0]}
          castShadow
          receiveShadow
          scale={1 - deathProgress * 0.3}
        >
          <sphereGeometry args={[1.8, 20, 20]} />
          <meshStandardMaterial
            color="#2E7D32"
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
      ) : (
        <>
          {[0, 90, 180, 270]. map((angle) => (
            <mesh
              key={angle}
              position={[
                Math.cos((angle * Math.PI) / 180) * 0.9 * (1 + deathProgress * 0.2),
                2.2 - deathProgress * 0.3,
                Math.sin((angle * Math.PI) / 180) * 0.9 * (1 + deathProgress * 0.2),
              ]}
              rotation={[deathProgress * 0.3, 0, 0]}
              castShadow
            >
              <boxGeometry args={[0.15, 1.2, 0.15]} />
              <meshStandardMaterial color="#3E2723" />
            </mesh>
          ))}
        </>
      )}
    </group>
  );

  const Animal = ({ position, alive, scale = 1, deathProgress = 0 }) => (
    <group position={position} scale={scale} castShadow receiveShadow>
      <mesh
        position={alive ? [0, 0, 0] : [0, deathProgress * 2, 0]}
        scale={alive ? 1 : 1 - deathProgress * 0.5}
      >
        <sphereGeometry args={[0.5, 18, 18]} />
        <meshStandardMaterial
          color={alive ? "#E63946" : "#9E9E9E"}
          emissive={alive ? "#E63946" : undefined}
          emissiveIntensity={alive ? 0.3 : 0}
          metalness={alive ? 0.3 : 0}
          opacity={alive ? 1 : Math.max(0, 1 - deathProgress)}
          transparent={! alive}
        />
      </mesh>
    </group>
  );

  const aliveCount = Math.max(0, 10 - Math.floor(biodiversityLoss / 10));
  const deadCount = 10 - aliveCount;
  const aliveAnimals = Math.max(0, 5 - Math.floor(biodiversityLoss / 20));
  const extinctAnimals = Math.floor(biodiversityLoss / 20);

  useFrame(() => {
    smoothLoss.current += (biodiversityLoss - smoothLoss.current) * 0.05;
  });

  const colors = getColors(smoothLoss. current);

  return (
    <group>
      <mesh position={[0, 8, -15]}>
        <planeGeometry args={[60, 20]} />
        <meshStandardMaterial
          color={colors. sky}
          emissive={colors.sky}
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color={colors.ground} />
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
        🌿 BIODIVERSITY LOSS
      </Text>

      <Text
        position={[0, 9.5, 0]}
        fontSize={3}
        color={colors.status}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.006}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        {`${Math.round(smoothLoss.current)}%`}
      </Text>

      <Text
        position={[-18, 7, -1]}
        fontSize={1.2}
        color="#2E7D32"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        🌱 HEALTHY
      </Text>

      <Text
        position={[-18, 6, -1]}
        fontSize={0.7}
        color="#558B2F"
        anchorX="center"
        anchorY="middle"
      >
        {`Trees: ${aliveCount}/10`}
      </Text>

      {[...Array(5)].map((_, i) => {
        const isAlive = i < aliveCount;
        const deathProgress = isAlive ? 0 : (i - aliveCount) / Math.max(1, deadCount);
        return (
          <Tree
            key={`tree-alive-${i}`}
            position={[-20 + i * 2.5, 0, 2]}
            alive={isAlive}
            scale={1.1}
            deathProgress={deathProgress}
          />
        );
      })}

      <Text
        position={[0, 7, -1]}
        fontSize={1.2}
        color="#E63946"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        ❤️ LIVING ANIMALS
      </Text>

      <Text
        position={[0, 6, -1]}
        fontSize={0.7}
        color="#C62828"
        anchorX="center"
        anchorY="middle"
      >
        {`${aliveAnimals}/5 Alive`}
      </Text>

      {[...Array(5)].map((_, i) => {
        const isAlive = i < aliveAnimals;
        const deathProgress = isAlive ? 0 : (i - aliveAnimals) / Math.max(1, extinctAnimals);
        return (
          <Animal
            key={`animal-${i}`}
            position={[-8 + i * 4, 0.6, 3]}
            alive={isAlive}
            scale={1.2}
            deathProgress={deathProgress}
          />
        );
      })}

      <Text
        position={[18, 7, -1]}
        fontSize={1.2}
        color="#8B4513"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#FFFFFF"
        fontWeight="bold"
      >
        💀 EXTINCT
      </Text>

      <Text
        position={[18, 6, -1]}
        fontSize={0.7}
        color="#6D4C41"
        anchorX="center"
        anchorY="middle"
      >
        {`${deadCount}/10`}
      </Text>

      {[...Array(5)].map((_, i) => {
        const isAlive = i + 5 < aliveCount;
        const deathProgress = isAlive ? 0 : (i + 5 - aliveCount) / Math.max(1, deadCount);
        return (
          <Tree
            key={`tree-dead-${i}`}
            position={[13 + i * 2.5, 0, 2]}
            alive={isAlive}
            scale={1.1}
            deathProgress={deathProgress}
          />
        );
      })}

      <mesh position={[0, 4.5, -0.5]}>
        <boxGeometry args={[4, 1, 0.2]} />
        <meshStandardMaterial
          color={colors. status}
          emissive={colors.statusEmissive}
          emissiveIntensity={0.6}
        />
      </mesh>

      <Text
        position={[0, 4.5, 0.2]}
        fontSize={0.9}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {smoothLoss.current < 40
          ? "✅ Healthy Ecosystem"
          : smoothLoss. current < 70
          ? "⚠️ Moderate Loss"
          : "🚨 Critical Loss"}
      </Text>

      {smoothLoss.current > 75 && (
        <mesh position={[0, 0.05, -18]}>
          <planeGeometry args={[65, 40]} />
          <meshStandardMaterial
            color="#FF6B6B"
            opacity={0.1}
            transparent
            emissive="#FF0000"
            emissiveIntensity={0.15}
          />
        </mesh>
      )}
    </group>
  );
}