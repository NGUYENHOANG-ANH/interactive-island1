import React from "react";
import "./ControlsPanel.css";

export default function ControlsPanel(props) {
  const {
    coal, setCoal,
    oil, setOil,
    naturalGas, setNaturalGas,
    bioenergy, setBioenergy,
    renewables, setRenewables,
    nuclear, setNuclear,
    zeroCarbonNew, setZeroCarbonNew,
    carbonPrice, setCarbonPrice,
    energyEfficiencyTransport, setEnergyEfficiencyTransport,
    electrification, setElectrification,
    energyEfficiencyBuildings, setEnergyEfficiencyBuildings,
    electrificationBuildings, setElectrificationBuildings,
    population, setPopulation,
    economicGrowth, setEconomicGrowth,
    natureBased, setNatureBased,
    technological, setTechnological,
    agriculturalEmissions, setAgriculturalEmissions,
    wasteLeakage, setWasteLeakage,
    deforestation, setDeforestation,
  } = props;

  const Range = ({ label, value, onChange, min = 0, max = 100 }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
      <div className="slider-container">
        <div className="slider-header">
          <label className="slider-label">{label}</label>
          <span className="slider-value">{value}</span>
        </div>
        <div className="slider-wrapper">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="slider-input"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
            }}
          />
        </div>
        <div className="slider-track">
          <div className="slider-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="controls-panel">
      <h2 className="panel-title">Climate Interactive Panel</h2>

      <section className="panel-section">
        <h3 className="section-header">⚡ Energy Supply</h3>
        <div className="grid grid-cols-2 gap-4">
          <Range label="Coal" value={coal} onChange={setCoal} />
          <Range label="Renewables" value={renewables} onChange={setRenewables} />
          <Range label="Oil" value={oil} onChange={setOil} />
          <Range label="Nuclear" value={nuclear} onChange={setNuclear} />
          <Range label="Natural Gas" value={naturalGas} onChange={setNaturalGas} />
          <Range label="Zero-Carbon" value={zeroCarbonNew} onChange={setZeroCarbonNew} />
          <Range label="Bioenergy" value={bioenergy} onChange={setBioenergy} />
          <Range label="Carbon Price" value={carbonPrice} onChange={setCarbonPrice} min={0} max={200} />
        </div>
      </section>

      <section className="panel-section">
        <h3 className="section-header">🚗 Transport</h3>
        <Range label="Energy Efficiency" value={energyEfficiencyTransport} onChange={setEnergyEfficiencyTransport} />
        <Range label="Electrification" value={electrification} onChange={setElectrification} />
      </section>

      <section className="panel-section">
        <h3 className="section-header">🏢 Buildings & Industry</h3>
        <Range label="Energy Efficiency" value={energyEfficiencyBuildings} onChange={setEnergyEfficiencyBuildings} />
        <Range label="Electrification" value={electrificationBuildings} onChange={setElectrificationBuildings} />
      </section>

      <section className="panel-section">
        <h3 className="section-header">📈 Growth</h3>
        <Range label="Population" value={population} onChange={setPopulation} />
        <Range label="Economic Growth" value={economicGrowth} onChange={setEconomicGrowth} />
      </section>

      <section className="panel-section">
        <h3 className="section-header">🌱 CO₂ Removal</h3>
        <Range label="Nature-Based" value={natureBased} onChange={setNatureBased} />
        <Range label="Technological" value={technological} onChange={setTechnological} />
      </section>

      <section className="panel-section">
        <h3 className="section-header">♻️ Greenhouse Gases</h3>
        <Range label="Agricultural Emissions" value={agriculturalEmissions} onChange={setAgriculturalEmissions} />
        <Range label="Waste & Leakage" value={wasteLeakage} onChange={setWasteLeakage} />
        <Range label="Deforestation" value={deforestation} onChange={setDeforestation} />
      </section>

      <div className="panel-footer">
        Thay đổi các slider để tương tác với đảo bên phải →
      </div>
    </div>
  );
}