
export function runClimateModel({
  coal,
  oil,
  naturalGas,
  bioenergy,
  renewables,
  nuclear,
  zeroCarbonNew,
  carbonPrice,

  energyEfficiencyTransport,
  electrification,
  energyEfficiencyBuildings,
  electrificationBuildings,

  population,
  economicGrowth,

  natureBased,
  technological,

  agriculturalEmissions,
  wasteLeakage,
  deforestation
}) {

  // ---- 1) ENERGY EMISSIONS ---------------------------------
  const fossilFuelShare = (coal + oil + naturalGas) / 300; // 0–1
  const cleanShare = (renewables + nuclear + zeroCarbonNew) / 300;

  let energyCO2 = fossilFuelShare * 35;     // ~35 GtCO2 max
  energyCO2 *= 1 - cleanShare * 0.65;       // clean energy cuts emissions

  // ---- 2) TRANSPORT EMISSIONS ------------------------------
  const transportReduction =
      energyEfficiencyTransport * 0.004 +
      electrification * 0.006;

  let transportCO2 = 8;                     // baseline 8Gt
  transportCO2 *= (1 - transportReduction);

  // ---- 3) BUILDINGS / INDUSTRY ------------------------------
  const buildingsReduction =
      energyEfficiencyBuildings * 0.004 +
      electrificationBuildings * 0.005;

  let buildingsCO2 = 12;
  buildingsCO2 *= (1 - buildingsReduction);

  // ---- 4) LAND USE ------------------------------------------
  let landCO2 =
      agriculturalEmissions * 0.12 +
      wasteLeakage * 0.1 +
      deforestation * 0.15;

  // ---- 5) REMOVALS (NEGATIVE) -------------------------------
  const removals =
      natureBased * 0.05 +
      technological * 0.07;

  // ---- 6) ECONOMY & POPULATION ------------------------------
  const growthFactor = 1 + (population * 0.003 + economicGrowth * 0.004);

  // ---- 7) TOTAL EMISSIONS -----------------------------------
  let totalCO2 =
      (energyCO2 + transportCO2 + buildingsCO2 + landCO2) * growthFactor
      - removals;

  totalCO2 = Math.max(totalCO2, 0);

  // ---- 8) TEMPERATURE & SEA LEVEL ---------------------------
  const temperature = 0.75 + totalCO2 * 0.04;      // 0–5°C range
  const seaLevelRise = Math.max(0, temperature * 0.32); // meters

  return {
    co2: totalCO2,
    temperature,
    seaLevel: seaLevelRise,
    forcing: temperature * 1.5
  };
}
