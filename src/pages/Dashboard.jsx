import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    ventasHoy: 0,
    ventasRealizadas: 0,
    platosExistentes: 0,
    clientes: 0,
  });

  const [ventasSemanal, setVentasSemanal] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/dashboard");
        const data = res.data;

        setMetrics({
          ventasHoy: data.ventasHoy,
          ventasRealizadas: data.ventasRealizadas,
          platosExistentes: data.platosExistentes,
          clientes: data.clientes,
        });

        setVentasSemanal(data.ventasSemanal);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="d-flex" style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Sidebar />

      <div className="container-fluid p-4">
        <h2 className="mb-4 text-danger">Dashboard del Restaurante</h2>

        <div className="row mb-4">
          <DashboardCard title="Ventas Hoy" value={`S/ ${metrics.ventasHoy}`} />
          <DashboardCard title="Ventas Realizadas" value={metrics.ventasRealizadas} />
          <DashboardCard title="Platos Existentes" value={metrics.platosExistentes} />
          <DashboardCard title="Clientes" value={metrics.clientes} />
        </div>

        <div className="row mb-4">
          <div className="col-md-8">
            <DashboardChart ventasSemanal={ventasSemanal} />
          </div>
        </div>
      </div>
    </div>
  );
}
