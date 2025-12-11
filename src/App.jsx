import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";

import ControlsPanel from "./components/ControlsPanel";
import IslandMesh from "./components/IslandMesh";
import WaterPlane from "./components/WaterPlane";

import { runClimateModel } from "./climate/climateModel";

export default function App() {

  // --- tất cả sliders bạn muốn chạy model ---
  const [coal, setCoal] = useState(20);
  const [oil, setOil] = useState(20);
  const [naturalGas, setNaturalGas] = useState(20);
  const [bioenergy, setBioenergy] = useState(10);
  const [renewables, setRenewables] = useState(15);
  const [nuclear, setNuclear] = useState(10);
  const [zeroCarbonNew, setZeroCarbonNew] = useState(10);
  const [carbonPrice, setCarbonPrice] = useState(0);

  const [energyEfficiencyTransport, setEnergyEfficiencyTransport] = useState(10);
  const [electrification, setElectrification] = useState(10);

  const [energyEfficiencyBuildings, setEnergyEfficiencyBuildings] = useState(10);
  const [electrificationBuildings, setElectrificationBuildings] = useState(10);

  const [population, setPopulation] = useState(20);
  const [economicGrowth, setEconomicGrowth] = useState(20);

  const [natureBased, setNatureBased] = useState(10);
  const [technological, setTechnological] = useState(10);

  const [agriculturalEmissions, setAgriculturalEmissions] = useState(20);
  const [wasteLeakage, setWasteLeakage] = useState(20);
  const [deforestation, setDeforestation] = useState(30);

  // === RUN CLIMATE MODEL ===
  const climate = runClimateModel({
    coal, oil, naturalGas, bioenergy, renewables, nuclear, zeroCarbonNew,
    carbonPrice,
    energyEfficiencyTransport, electrification,
    energyEfficiencyBuildings, electrificationBuildings,
    population, economicGrowth,
    natureBased, technological,
    agriculturalEmissions, wasteLeakage, deforestation
  });

  // Sea level returned in meters → map to 3D units
  const seaLevelUnits = climate.seaLevel * 0.35;    // scale for 3D

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      <ControlsPanel
        coal={coal} setCoal={setCoal}
        oil={oil} setOil={setOil}
        naturalGas={naturalGas} setNaturalGas={setNaturalGas}
        bioenergy={bioenergy} setBioenergy={setBioenergy}
        renewables={renewables} setRenewables={setRenewables}
        nuclear={nuclear} setNuclear={setNuclear}
        zeroCarbonNew={zeroCarbonNew} setZeroCarbonNew={setZeroCarbonNew}
        carbonPrice={carbonPrice} setCarbonPrice={setCarbonPrice}

        energyEfficiencyTransport={energyEfficiencyTransport}
        setEnergyEfficiencyTransport={setEnergyEfficiencyTransport}
        electrification={electrification}
        setElectrification={setElectrification}

        energyEfficiencyBuildings={energyEfficiencyBuildings}
        setEnergyEfficiencyBuildings={setEnergyEfficiencyBuildings}
        electrificationBuildings={electrificationBuildings}
        setElectrificationBuildings={setElectrificationBuildings}

        population={population} setPopulation={setPopulation}
        economicGrowth={economicGrowth} setEconomicGrowth={setEconomicGrowth}

        natureBased={natureBased} setNatureBased={setNatureBased}
        technological={technological} setTechnological={setTechnological}

        agriculturalEmissions={agriculturalEmissions}
        setAgriculturalEmissions={setAgriculturalEmissions}
        wasteLeakage={wasteLeakage}
        setWasteLeakage={setWasteLeakage}
        deforestation={deforestation}
        setDeforestation={setDeforestation}
      />

      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [6, 6, 8], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight intensity={1.2} position={[5, 10, 5]} />

          <IslandMesh
  coal={coal}
  renewables={renewables}
  deforestation={deforestation}
  seaLevel={seaLevelUnits}
/>

<WaterPlane seaLevel={seaLevelUnits} color="#0b63a6" />

          <WaterPlane seaLevel={seaLevelUnits} color="#0b63a6" />
        </Canvas>
      </div>
    </div>
  );
}
