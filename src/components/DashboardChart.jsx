// src/components/DashboardChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const DashboardChart = () => {
  const data = {
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    datasets: [
      {
        label: "Ventas",
        data: [120, 200, 150, 300, 250],
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">📈 Ventas Semanales</div>
      <div className="card-body">
        <Bar data={data} />
      </div>
    </div>
  );
};

export default DashboardChart;
