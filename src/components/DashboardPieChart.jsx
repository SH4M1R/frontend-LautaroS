import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPieChart({ platos }) {
  const data = {
    labels: platos.map(p => p.nombre),
    datasets: [
      {
        label: "Cantidad vendida",
        data: platos.map(p => p.cantidad),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FF9800", "#9C27B0"
        ],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  };

  return <Pie data={data} />;
}
