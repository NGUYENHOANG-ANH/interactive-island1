import React, { useState } from "react";
import "./DashboardTabs.css";

export default function DashboardTabs({ climate }) {
  const [activeTab, setActiveTab] = useState("ice");
  const [isOpen, setIsOpen] = useState(true);

  const tabs = [
    { id: "ice", label: "❄️ Băng Tan", icon: "❄️" },
    { id: "flood", label: "🌊 Bão Lũ", icon: "🌊" },
    { id:  "drought", label: "🔥 Hạn Hán", icon: "🔥" },
    { id: "disease", label: "🦠 Bệnh Dịch", icon: "🦠" },
    { id:  "biodiversity", label: "🌿 Sinh học", icon: "🌿" },
  ];

  const getStatusColor = (value) => {
    if (value < 30) return "#10b981"; // Xanh
    if (value < 60) return "#f59e0b"; // Vàng
    return "#ef4444"; // Đỏ
  };

  const getStatusText = (value) => {
    if (value < 30) return "Bình thường";
    if (value < 60) return "Cảnh báo";
    return "Nguy hiểm";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "ice":
        return (
          <div className="dashboard-content">
            <h3>Hiệu ứng Băng Tan</h3>
            <div className="metric-card">
              <div className="metric-header">
                <span>Mức độ băng tan</span>
                <span className="metric-value">{climate.iceMelting.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${climate.iceMelting}%`, background: getStatusColor(climate.iceMelting) }}
                ></div>
              </div>
              <div className="metric-status" style={{ color: getStatusColor(climate.iceMelting) }}>
                {getStatusText(climate.iceMelting)}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Mực nước biển dâng</span>
                <span className="metric-value">{(climate.seaLevel * 100).toFixed(2)}m</span>
              </div>
              <p className="metric-description">
                Nước biển dâng làm hòn đảo bị chìm dần.  Nguyên nhân chính từ khai thác nhiên liệu hóa thạch.
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Tác động</span>
              </div>
              <ul className="impact-list">
                <li>🏝️ Hòn đảo bị chìm nước</li>
                <li>🏘️ Dân cư ven biển phải di cư</li>
                <li>🐧 Động vật cực địa tuyệt chủng</li>
                <li>📉 Kinh tế ven biển suy thoái</li>
              </ul>
            </div>

            <div className="recommendation">
              <h4>💡 Giải pháp:</h4>
              <ul>
                <li>Tăng năng lượng tái tạo (Renewables)</li>
                <li>Giảm than đá (Coal)</li>
                <li>Bảo vệ rừng (giảm Deforestation)</li>
              </ul>
            </div>
          </div>
        );

      case "flood":
        return (
          <div className="dashboard-content">
            <h3>Hiệu ứng Bão Lũ</h3>
            <div className="metric-card">
              <div className="metric-header">
                <span>Nguy hiểm bão lũ</span>
                <span className="metric-value">{climate.floodingRisk.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width:  `${climate.floodingRisk}%`, background: getStatusColor(climate.floodingRisk) }}
                ></div>
              </div>
              <div className="metric-status" style={{ color: getStatusColor(climate.floodingRisk) }}>
                {getStatusText(climate.floodingRisk)}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Nhiệt độ + Dân số + Rừng</span>
              </div>
              <p className="metric-description">
                Bão lũ tăng do:  nước biển dâng, dân số đông, mất rừng (không chắn gió).
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Tác động</span>
              </div>
              <ul className="impact-list">
                <li>💧 Lũ lụt, sạt lở đất</li>
                <li>🏚️ Nhà cửa bị phá hủy</li>
                <li>👥 Thương vong hàng loạt</li>
                <li>💰 Thiệt hại kinh tế lớn</li>
              </ul>
            </div>

            <div className="recommendation">
              <h4>💡 Giải pháp:</h4>
              <ul>
                <li>Trồng lại rừng (Nature-Based)</li>
                <li>Xây dựng hạ tầng chống lũ</li>
                <li>Giảm phát thải CO2</li>
              </ul>
            </div>
          </div>
        );

      case "drought":
        return (
          <div className="dashboard-content">
            <h3>Hiệu ứng Hạn Hán</h3>
            <div className="metric-card">
              <div className="metric-header">
                <span>Mức độ hạn hán</span>
                <span className="metric-value">{climate. droughtLevel.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${climate.droughtLevel}%`, background: getStatusColor(climate.droughtLevel) }}
                ></div>
              </div>
              <div className="metric-status" style={{ color: getStatusColor(climate. droughtLevel) }}>
                {getStatusText(climate.droughtLevel)}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Nhiệt độ cao</span>
                <span className="metric-value">{climate.temperature.toFixed(2)}°C</span>
              </div>
              <p className="metric-description">
                Nhiệt độ tăng → Nước bốc hơi nhiều → Đất khô cằn → Cây chết. 
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Tác động</span>
              </div>
              <ul className="impact-list">
                <li>🌾 Mùa vụ thất bát</li>
                <li>💧 Thiếu nước sinh hoạt</li>
                <li>🐄 Chăn nuôi suy yếu</li>
                <li>🔥 Cháy rừng tăng</li>
              </ul>
            </div>

            <div className="recommendation">
              <h4>💡 Giải pháp:</h4>
              <ul>
                <li>Tăng năng lượng xanh</li>
                <li>Bảo vệ nguồn nước</li>
                <li>Trồng rừng chắn gió</li>
              </ul>
            </div>
          </div>
        );

      case "disease":
        return (
          <div className="dashboard-content">
            <h3>Hiệu ứng Sự Phát Xuất Bệnh Dịch</h3>
            <div className="metric-card">
              <div className="metric-header">
                <span>Nguy hiểm dịch bệnh</span>
                <span className="metric-value">{climate.diseaseSpread.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${climate.diseaseSpread}%`, background: getStatusColor(climate. diseaseSpread) }}
                ></div>
              </div>
              <div className="metric-status" style={{ color: getStatusColor(climate.diseaseSpread) }}>
                {getStatusText(climate.diseaseSpread)}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Nguyên nhân</span>
              </div>
              <p className="metric-description">
                Virus phát triển mạnh khi nhiệt độ cao + dân số đông + vệ sinh kém.
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Tác động</span>
              </div>
              <ul className="impact-list">
                <li>🦠 Virus mới xuất hiện (COVID, Zika... )</li>
                <li>🏥 Hệ thống y tế quá tải</li>
                <li>👥 Morbidity & Mortality tăng</li>
                <li>📉 Kinh tế y tế sụp đổ</li>
              </ul>
            </div>

            <div className="recommendation">
              <h4>💡 Giải pháp:</h4>
              <ul>
                <li>Kiểm soát nhiệt độ toàn cầu</li>
                <li>Cải thiện vệ sinh công cộng</li>
                <li>Phát triển y tế phòng ngừa</li>
              </ul>
            </div>
          </div>
        );

      case "biodiversity":
        return (
          <div className="dashboard-content">
            <h3>Hiệu ứng Mất Đa Dạng Sinh Học</h3>
            <div className="metric-card">
              <div className="metric-header">
                <span>Mức độ mất đa dạng</span>
                <span className="metric-value">{climate.biodiversityLoss.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${climate.biodiversityLoss}%`, background: getStatusColor(climate.biodiversityLoss) }}
                ></div>
              </div>
              <div className="metric-status" style={{ color: getStatusColor(climate.biodiversityLoss) }}>
                {getStatusText(climate.biodiversityLoss)}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Nguyên nhân chính</span>
              </div>
              <p className="metric-description">
                Phá rừng + Biến đổi khí hậu → Mất habitat → Loài tuyệt chủng.
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Tác động</span>
              </div>
              <ul className="impact-list">
                <li>🦁 6 loài động vật tuyệt chủng/ngày</li>
                <li>🌳 Rừng mưa mất 10M hectare/năm</li>
                <li>🐝 Ong thụ phấn giảm → Mất mùa</li>
                <li>⚖️ Mất cân bằng sinh thái</li>
              </ul>
            </div>

            <div className="recommendation">
              <h4>💡 Giải pháp:</h4>
              <ul>
                <li>Bảo vệ các khu rừng (Nature-Based)</li>
                <li>Giảm phát thải (Technological)</li>
                <li>Tạo vùng bảo tồn tự nhiên</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`dashboard-container ${isOpen ? "open" : "closed"}`}>
      {/* Toggle Button */}
      <button 
        className="toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Ẩn Dashboard" : "Hiện Dashboard"}
      >
        {isOpen ? "📊 ▼" : "📊 ▲"}
      </button>

      {/* Dashboard Content */}
      {isOpen && (
        <div className="dashboard-wrapper">
          {/* Tabs */}
          <div className="dashboard-tabs">
            {tabs. map((tab) => (
              <button
                key={tab. id}
                className={`tab-btn ${activeTab === tab.id ?  "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="dashboard-content-wrapper">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}