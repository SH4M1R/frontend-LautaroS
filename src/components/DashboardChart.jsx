import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function DashboardChart({ ventasSemanal }) {
  const labels = ventasSemanal.map((v) => v.dia);
  const dataValues = ventasSemanal.map((v) => v.total);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Ventas (S/)",
        data: dataValues,
        backgroundColor: "rgba(220,53,69,0.7)",
        borderColor: "rgba(220,53,69,1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header text-danger fw-bold">📈 Ventas Semanales</div>
      <div className="card-body">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
