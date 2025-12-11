import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import DashboardPieChart from "../components/DashboardPieChart";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import LoaderConGIF from "../components/LoaderConGIF";

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
  const [loading, setLoading] = useState(true); // spinner circular mientras carga
  const [mostrarGIF, setMostrarGIF] = useState(false); // gif después de cargar

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
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

        setLoading(false);
        setMostrarGIF(true);

        setTimeout(() => setMostrarGIF(false), 1200); // mostrar gif 1.2s antes de contenido
      } catch (error) {
        console.error("Error cargando dashboard", error);
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="d-flex" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Sidebar />
      <div className="container-fluid p-4">
        <h2 className="mb-4 text-danger text-center">
          Dashboard del Restaurante Lautaro´s
        </h2>

        {/* Spinner circular mientras carga */}
        {loading && (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {/* GIF de confirmación breve */}
        {mostrarGIF && !loading && (
          <div className="d-flex justify-content-center my-5">
            <LoaderConGIF loading={true} />
          </div>
        )}

        {/* Contenido */}
        {!loading && !mostrarGIF && (
          <div>
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
        )}
      </div>
    </div>
  );
}
