import React, { useState } from "react";
import "./SceneSelector.css";

export default function SceneSelector({ activeScene, setActiveScene }) {
  const scenes = [
    { id: "main", label: "🏝️ Hòn Đảo Chính", desc: "Băng tan & Mực nước" },
    { id: "flooding", label: "🌊 Bão Lũ", desc: "Hiệu ứng lũ lụt" },
    { id:  "drought", label: "🔥 Hạn Hán", desc: "Khô hạn & nóng" },
    { id:  "disease", label: "🦠 Bệnh Dịch", desc: "Sự phát xuất bệnh" },
    { id: "biodiversity", label: "🌿 Sinh Học", desc: "Mất đa dạng" },
  ];

  return (
    <div className="scene-selector">
      <h3>Chọn Mô Hình</h3>
      <div className="scene-buttons">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            className={`scene-btn ${activeScene === scene.id ?  "active" : ""}`}
            onClick={() => setActiveScene(scene.id)}
            title={scene.desc}
          >
            <span className="scene-label">{scene.label}</span>
            <span className="scene-desc">{scene.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}