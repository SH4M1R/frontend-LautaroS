import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import DashboardPieChart from "../components/DashboardPieChart";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    ventasHoy: 0,
    ventasRealizadas: 0,
    platosExistentes: 0,
    clientes: 0,
  });

  const [ventasSemanal, setVentasSemanal] = useState([]);
  const [platosMasVendidos, setPlatosMasVendidos] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API}/api/dashboard`);
        const data = res.data;

        setMetrics({
          ventasHoy: data.ventasHoy,
          ventasRealizadas: data.ventasRealizadas,
          platosExistentes: data.platosExistentes,
          clientes: data.clientes,
        });

        setVentasSemanal(data.ventasSemanal || []);
        setPlatosMasVendidos(data.platosMasVendidos || []);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="d-flex" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Sidebar />
      <div className="container-fluid p-4">
        <h2 className="mb-4 text-danger text-center">Dashboard del Restaurante Lautaro´s</h2>

        <div className="row mb-4">
          <DashboardCard title="Ventas Hoy" value={`S/ ${metrics.ventasHoy}`} />
          <DashboardCard title="Ventas Realizadas" value={metrics.ventasRealizadas} />
          <DashboardCard title="Platos Existentes" value={metrics.platosExistentes} />
          <DashboardCard title="Clientes" value={metrics.clientes} />
        </div>

        <div className="row mb-4">
          <div className="col-md-8 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-center text-danger mb-3">Ventas Semanales</h5>
                <DashboardChart ventasSemanal={ventasSemanal} />
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-center text-danger mb-3">Platos Más Vendidos</h5>
                {platosMasVendidos.length > 0 ? (
                  <DashboardPieChart platos={platosMasVendidos} />
                ) : (
                  <p className="text-center">No hay datos disponibles</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
