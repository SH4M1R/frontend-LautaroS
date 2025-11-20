import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    ventasHoy: 0,
    pedidosActivos: 0,
    platosVendidos: 0,
    clientes: 0,
  });

  const [pedidos, setPedidos] = useState([]);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const storedMetrics = JSON.parse(localStorage.getItem("metrics"));
    const storedPedidos = JSON.parse(localStorage.getItem("pedidos"));
    const storedMenu = JSON.parse(localStorage.getItem("menu"));

    if (storedMetrics) setMetrics(storedMetrics);
    if (storedPedidos) setPedidos(storedPedidos);
    if (storedMenu && storedMenu.length > 0) {
      setMenu(storedMenu);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("metrics", JSON.stringify(metrics));
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.setItem("menu", JSON.stringify(menu));
  }, [metrics, pedidos, menu]);

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container-fluid p-4">
        <h2 className="mb-4">Dashboard del Restaurante</h2>

        {/* Tarjetas de métricas */}
        <div className="row mb-4">
          <DashboardCard title="Ventas Hoy" value={`S/ ${metrics.ventasHoy}`} />
          <DashboardCard title="Pedidos Activos" value={metrics.pedidosActivos} />
          <DashboardCard title="Platos Vendidos" value={metrics.platosVendidos} />
          <DashboardCard title="Clientes" value={metrics.clientes} />
        </div>

        {/* Gráfico + Notificaciones */}
        <div className="row mb-4">
          <div className="col-md-8">
            <DashboardChart />
          </div>
        </div>
      </div>
    </div>
  );
}