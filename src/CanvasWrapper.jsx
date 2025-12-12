import React, { useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import IslandMesh from "./components/IslandMesh";
import WaterPlane from "./components/WaterPlane";
import FloodingScene from "./components/scenes/FloodingScene";
import DroughtScene from "./components/scenes/DroughtScene";
import DiseaseScene from "./components/scenes/DiseaseScene";
import BiodiversityScene from "./components/scenes/BiodiversityScene";

function OrbitCameraController({ activeScene }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;

    const cameraConfig = {
      main: { distance: 18, center: [0, 2, 0], autoRotate: false, enablePan: false },
      flooding: { distance: 25, center: [0, 5, 0], autoRotate:  false, enablePan: false },
      drought: { distance: 20, center: [0, 4, 0], autoRotate:  false, enablePan: false },
      disease: { distance: 22, center: [0, 5, 0], autoRotate:  false, enablePan: false },
      biodiversity: { distance:  22, center: [0, 6, 0], autoRotate:  false, enablePan: false },
    };

    const config = cameraConfig[activeScene];
    if (! config) return;

    controlsRef.current.target. set(... config.center);
    controlsRef.current.autoRotate = config.autoRotate;
    controlsRef.current.enablePan = config.enablePan;
    controlsRef.current.minDistance = config.distance * 0.6;
    controlsRef.current.maxDistance = config.distance * 1.8;
    controlsRef.current.update();
  }, [activeScene]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera]}
      enableDamping
      dampingFactor={0.05}
      autoRotate={false}
      enablePan={false}
    />
  );
}

function SceneContent({ activeScene, climate, seaLevelUnits }) {
  return (
    <>
      {activeScene === "main" && (
        <>
          <IslandMesh
            coal={climate.coal}
            renewables={climate.renewables}
            deforestation={climate.deforestation}
            seaLevel={seaLevelUnits}
          />
          <WaterPlane seaLevel={seaLevelUnits} />
        </>
      )}

      {activeScene === "flooding" && (
        <FloodingScene
          floodingRisk={climate.floodingRisk}
          seaLevel={seaLevelUnits}
        />
      )}

      {activeScene === "drought" && (
        <DroughtScene droughtLevel={climate.droughtLevel} />
      )}

      {activeScene === "disease" && (
        <DiseaseScene
          diseaseSpread={climate.diseaseSpread}
          population={climate.population}
        />
      )}

      {activeScene === "biodiversity" && (
        <BiodiversityScene biodiversityLoss={climate.biodiversityLoss} />
      )}
    </>
  );
}

export default function CanvasWrapper({ activeScene, climate, seaLevelUnits }) {
  const cameraPositions = {
    main: { position: [0, 6, 18], fov: 55 },
    flooding: { position: [0, 10, 25], fov: 50 },
    drought: { position: [0, 8, 20], fov: 50 },
    disease: { position: [0, 8, 22], fov: 50 },
    biodiversity: { position: [0, 10, 22], fov: 50 },
  };

  const camera = cameraPositions[activeScene] || cameraPositions.main;

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: camera.position, fov: camera.fov }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: true,
        logarithmicDepthBuffer: true,
      }}
      onCreated={(state) => {
        // Handle context loss events
        state.gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          console.warn('WebGL context lost');
        });
        state.gl.domElement.addEventListener('webglcontextrestored', () => {
          console.log('WebGL context restored');
        });
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={1.3}
        position={[8, 12, 8]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.001}
      />

      <OrbitCameraController activeScene={activeScene} />
      <SceneContent
        activeScene={activeScene}
        climate={climate}
        seaLevelUnits={seaLevelUnits}
      />
    </Canvas>
  );
}