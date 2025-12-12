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
  const fossilFuelShare = (coal + oil + naturalGas) / 300;
  const cleanShare = (renewables + nuclear + zeroCarbonNew) / 300;

  let energyCO2 = fossilFuelShare * 35;
  energyCO2 *= 1 - cleanShare * 0.65;

  // ---- 2) TRANSPORT EMISSIONS ------------------------------
  const transportReduction =
      energyEfficiencyTransport * 0.004 +
      electrification * 0.006;

  let transportCO2 = 8;
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
  const temperature = 0.75 + totalCO2 * 0.04;
  const seaLevelRise = Math.max(0, temperature * 0.32);

  // ========== MỘI MÔ HÌNH MỚI ==========

  // ---- 9) BĂNG TAN (ICE MELTING) ----------------------------
  const iceMelting = Math.min(100, temperature * 15 + deforestation * 0.3);
  // Nhiệt độ ↑ + Phá rừng ↑ = Băng tan nhiều hơn

  // ---- 10) BÃO LŨ (FLOODING RISK) ---------------------------
  const floodingRisk = Math.min(100, 
    seaLevelRise * 20 +  // Mực nước dâng
    population * 0.15 +   // Dân số đông → thiệt hại lớn
    deforestation * 0.2   // Rừng mất → dễ lũ
  );

  // ---- 11) HẠN HÁN (DROUGHT LEVEL) --------------------------
  const droughtLevel = Math.min(100,
    temperature * 20 +    // Nhiệt độ ↑ = Hạn hán ↑
    agriculturalEmissions * 0.1 +
    (100 - renewables) * 0.05  // Năng lượng tái tạo ít = khí hậu xấu
  );

  // ---- 12) SỰ PHÁT XUẤT BỆNH (DISEASE SPREAD) ----------------
  const diseaseSpread = Math.min(100,
    temperature * 8 +     // Nhiệt độ cao → virus phát triển
    population * 0.2 +    // Dân số đông → dễ lây lan
    wasteLeakage * 0.15   // Rác thải → vệ sinh kém
  );

  // ---- 13) MẤT ĐA DẠNG SINH HỌC (BIODIVERSITY LOSS) -----------
  const biodiversityLoss = Math.min(100,
    deforestation * 1.5 +  // Phá rừng = mất habitat
    temperature * 5 +      // Biến đổi khí hậu = mất loài
    agriculturalEmissions * 0.1 +
    (100 - natureBased) * 0.1  // Không bảo tồn tự nhiên
  );

  // ---- 14) STRESS INDEX (Chỉ số căng thẳng môi trường) --------
  const stressIndex = Math.min(100,
    (floodingRisk + droughtLevel + diseaseSpread + biodiversityLoss) / 4
  );

  return {
    // Original outputs
    co2: totalCO2,
    temperature,
    seaLevel: seaLevelRise,
    forcing: temperature * 1.5,

    // New outputs
    iceMelting,
    floodingRisk,
    droughtLevel,
    diseaseSpread,
    biodiversityLoss,
    stressIndex
  };
}