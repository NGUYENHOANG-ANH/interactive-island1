import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloodingScene({ floodingRisk, seaLevel }) {
  const waterRef = useRef();
  const rainGroupRef = useRef();

  useFrame((state) => {
    // Water wave animation
    if (waterRef.current) {
      waterRef.current.position.y = 
        Math.sin(state.clock.elapsedTime * 2) * 0.3 + seaLevel;
      waterRef.current.rotation.z += 0.0005;
    }

    // Rain falling animation
    if (rainGroupRef.current) {
      rainGroupRef.current.children.forEach((rainDrop, i) => {
        // Fall down
        rainDrop.position.y -= (0.08 + (floodingRisk * 0.002));
        
        // Sway side to side (wind effect)
        rainDrop.position.x += Math.sin(state.clock.elapsedTime + i) * 0.02;
        
        // Reset position when falls below ground
        if (rainDrop. position.y < -5) {
          rainDrop. position.y = 15;
          rainDrop.position.x = (Math.random() - 0.5) * 30;
          rainDrop.position.z = (Math.random() - 0.5) * 30;
        }

        // Fade out as falls
        const fadeProgress = Math.max(0, (15 - rainDrop.position. y) / 20);
        rainDrop.material.opacity = 0.8 * (1 - fadeProgress);
      });
    }
  });

  const floodColor =
    floodingRisk < 30 
      ? "#87CEEB" 
      :  floodingRisk < 60 
        ? "#4169E1" 
        : "#00008B";

  const rainCount = Math.max(50, Math.floor(floodingRisk * 15));

  return (
    <group>
      {/* Background */}
      <mesh position={[0, -1, -20]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial
          color={floodingRisk > 50 ? "#4a4a4a" : "#87CEEB"}
        />
      </mesh>

      {/* Buildings */}
      {[...Array(5)].map((_, i) => (
        <group key={i} position={[i * 5 - 10, 0, -5]}>
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, 4, 3]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>

          {[0, 1, 2, 3].  map((w) => (
            <mesh 
              key={w} 
              position={[-1, 1 + w, 1.6]} 
              castShadow
            >
              <boxGeometry args={[0.6, 0.6, 0.1]} />
              <meshStandardMaterial
                color={floodingRisk > 40 ? "#0000FF" : "#FFD700"}
                emissive={floodingRisk > 40 ? "#0000FF" : "#FFD700"}
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}

          {floodingRisk > 20 && (
            <mesh position={[0, seaLevel * 1.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[4, seaLevel * 3, 4]} />
              <meshStandardMaterial
                color={floodColor}
                opacity={0.4}
                transparent
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Water plane */}
      <mesh 
        position={[0, seaLevel - 0.5, 0]} 
        ref={waterRef} 
        castShadow 
        receiveShadow
      >
        <planeGeometry args={[50, 50, 20, 20]} />
        <meshStandardMaterial
          color={floodColor}
          opacity={Math.min(floodingRisk / 100, 0.7)}
          transparent
          wireframe={floodingRisk > 70}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Animated Rain/Snow */}
      {floodingRisk > 20 && (
        <group ref={rainGroupRef}>
          {[...Array(rainCount)].map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 30,
                Math.random() * 15 + 5,
                (Math.random() - 0.5) * 30,
              ]}
            >
              <sphereGeometry args={[0.08 + Math.random() * 0.05, 8, 8]} />
              <meshStandardMaterial
                color="#FFFFFF"
                opacity={0.7}
                transparent
                emissive="#FFFFFF"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Storm clouds effect - opacity changes */}
      {floodingRisk > 50 && (
        <mesh position={[0, 12, -15]}>
          <sphereGeometry args={[20, 32, 32]} />
          <meshStandardMaterial
            color="#333333"
            opacity={Math.min(floodingRisk / 100 * 0.4, 0.4)}
            transparent
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Warning lights - blink with intensity */}
      {floodingRisk > 50 && (
        <group>
          {[...Array(4)].map((_, i) => {
            const blinkIntensity = 1 + Math.sin(performance.now() * 0.005 + i) * 0.5;
            return (
              <pointLight
                key={i}
                position={[i * 10 - 15, 8, -5]}
                color="#FF0000"
                intensity={(floodingRisk / 50) * blinkIntensity}
                distance={20}
              />
            );
          })}
        </group>
      )}

      {/* Emergency warning box - pulsing */}
      {floodingRisk > 70 && (
        <mesh 
          position={[0, 8, 5]} 
          castShadow
          scale={1 + Math.sin(performance.now() * 0.003) * 0.1}
        >
          <boxGeometry args={[8, 2, 0.2]} />
          <meshStandardMaterial
            color="#FF0000"
            emissive="#FF0000"
            emissiveIntensity={0.8 + Math.sin(performance.now() * 0.004) * 0.2}
          />
        </mesh>
      )}
    </group>
  );
}