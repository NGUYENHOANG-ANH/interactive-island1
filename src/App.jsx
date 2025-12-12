import React, { useState } from "react";

import ControlsPanel from "./components/ControlsPanel";
import SceneSelector from "./components/SceneSelector";
import DashboardTabs from "./components/DashboardTabs";
import ErrorBoundary from "./components/ErrorBoundary";

import CanvasWrapper from "./CanvasWrapper"; 
import { runClimateModel } from "./climate/climateModel";

export default function App() {
  const [activeScene, setActiveScene] = useState("main");

  // ===== ENERGY SUPPLY =====
  const [coal, setCoal] = useState(20);
  const [oil, setOil] = useState(20);
  const [naturalGas, setNaturalGas] = useState(20);
  const [bioenergy, setBioenergy] = useState(10);
  const [renewables, setRenewables] = useState(15);
  const [nuclear, setNuclear] = useState(10);
  const [zeroCarbonNew, setZeroCarbonNew] = useState(10);
  const [carbonPrice, setCarbonPrice] = useState(0);

  // ===== TRANSPORT =====
  const [energyEfficiencyTransport, setEnergyEfficiencyTransport] = useState(10);
  const [electrification, setElectrification] = useState(10);

  // ===== BUILDINGS & INDUSTRY =====
  const [energyEfficiencyBuildings, setEnergyEfficiencyBuildings] = useState(10);
  const [electrificationBuildings, setElectrificationBuildings] = useState(10);

  // ===== GROWTH =====
  const [population, setPopulation] = useState(20);
  const [economicGrowth, setEconomicGrowth] = useState(20);

  // ===== CO2 REMOVAL =====
  const [natureBased, setNatureBased] = useState(10);
  const [technological, setTechnological] = useState(10);

  // ===== GREENHOUSE GASES =====
  const [agriculturalEmissions, setAgriculturalEmissions] = useState(20);
  const [wasteLeakage, setWasteLeakage] = useState(20);
  const [deforestation, setDeforestation] = useState(30);

  // ===== CLIMATE MODEL =====
  const climate = runClimateModel({
    coal, oil, naturalGas, bioenergy, renewables, nuclear, zeroCarbonNew,
    carbonPrice,
    energyEfficiencyTransport, electrification,
    energyEfficiencyBuildings, electrificationBuildings,
    population, economicGrowth,
    natureBased, technological,
    agriculturalEmissions, wasteLeakage, deforestation
  });

  const seaLevelUnits = climate.seaLevel * 0.35;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/** ========== LEFT PANEL ========== */}
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
        wasteLeakage={wasteLeakage} setWasteLeakage={setWasteLeakage}
        deforestation={deforestation} setDeforestation={setDeforestation}
      />

      {/** ========== RIGHT PANEL (3D + Dashboard) ========== */}
      <div style={{ flex: 1, position: "relative" }}>

        <SceneSelector activeScene={activeScene} setActiveScene={setActiveScene} />

        <ErrorBoundary>
          {/* ✅ Canvas wrapper - NO Suspense inside!  */}
          <CanvasWrapper
            activeScene={activeScene}
            climate={climate}
            seaLevelUnits={seaLevelUnits}
          />
        </ErrorBoundary>

        <DashboardTabs climate={climate} />
      </div>
    </div>
  );
}