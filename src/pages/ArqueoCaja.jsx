import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaDollarSign, FaCashRegister } from "react-icons/fa";
import Swal from "sweetalert2";

const API = import.meta.env.VITE_API_URL;

export default function ArqueoCaja() {
  const [montoInicial, setMontoInicial] = useState("");
  const [ventasHoy, setVentasHoy] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [arqueoFinal, setArqueoFinal] = useState(null);
  const [cajaHoy, setCajaHoy] = useState(null);
  const [cargando, setCargando] = useState(true);

  // =================== CARGAR CAJA Y VENTAS ===================
  const cargarCajaHoy = async () => {
    try {
      setCargando(true);

      // Obtener caja del día
      const resCaja = await axios.get(`${API}/api/caja/hoy`);
      const caja = resCaja.data || null;
      setCajaHoy(caja);
      setMontoInicial(caja?.montoInicial || "");

      // Obtener todas las ventas
      const resVentas = await axios.get(`${API}/api/ventas/listar`);
      const todasVentas = resVentas.data || [];

      // Filtrar ventas del día y de la caja abierta
      const hoy = new Date();
      const ventasDeHoy = todasVentas.filter((v) => {
        const fechaVenta = new Date(v.fechaVenta);
        return (
          fechaVenta.getFullYear() === hoy.getFullYear() &&
          fechaVenta.getMonth() === hoy.getMonth() &&
          fechaVenta.getDate() === hoy.getDate() &&
          v.caja?.idCaja === caja?.idCaja
        );
      });

      setVentasHoy(ventasDeHoy);
      setTotalVentas(ventasDeHoy.reduce((acc, v) => acc + (v.total || 0), 0));

      setCargando(false);
    } catch (error) {
      console.error("Error al cargar caja:", error);
      setCajaHoy(null);
      setMontoInicial("");
      setVentasHoy([]);
      setTotalVentas(0);
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCajaHoy();
  }, []);

  // =================== REGISTRAR MONTO INICIAL ===================
  const registrarMontoInicial = async () => {
    if (!montoInicial || isNaN(montoInicial)) {
      return Swal.fire("Error", "Ingresa un monto válido.", "error");
    }

    try {
      const res = await axios.post(`${API}/api/caja/abrir`, {
        montoInicial: parseFloat(montoInicial),
      });

      const cajaAbierta = res.data;
      setCajaHoy(cajaAbierta);
      setMontoInicial(cajaAbierta.montoInicial);

      Swal.fire("Correcto", "Caja abierta correctamente.", "success");
    } catch (error) {
      console.error("Error al abrir caja:", error.response?.data || error);
      Swal.fire("Error", "No se pudo abrir la caja.", "error");
    }
  };

  // =================== CERRAR CAJA ===================
  const cerrarCaja = async () => {
    if (!cajaHoy?.idCaja) {
      return Swal.fire("Error", "No hay caja abierta. Por favor abre la caja primero.", "error");
    }

    try {
      const res = await axios.post(`${API}/api/caja/cerrar`, { idCaja: cajaHoy.idCaja });
      setArqueoFinal(res.data.totalEnCaja || 0);

      Swal.fire(
        "Correcto",
        `Caja cerrada. Total en caja: S/ ${res.data.totalEnCaja?.toFixed(2)}`,
        "success"
      );

      // Actualizar estado local
      setCajaHoy({ ...cajaHoy, fechaCierre: new Date() });
    } catch (error) {
      console.error("Error al cerrar caja:", error.response?.data || error);
      Swal.fire("Error", "No se pudo cerrar la caja.", "error");
    }
  };

  // =================== RENDER ===================
  return (
    <div className="container mt-5 p-5 bg-light rounded shadow-lg">
      <h2 className="text-center mb-5" style={{ color: "#b71c1c", fontWeight: "700" }}>
        Arqueo de Caja
      </h2>

      {/* Monto inicial */}
      <div className="mb-4 p-4 bg-white rounded shadow-sm border border-danger">
        <label className="form-label fw-bold" style={{ color: "#b71c1c" }}>
          Monto Inicial del Día
        </label>
        <input
          type="number"
          className="form-control mb-3"
          value={montoInicial}
          onChange={(e) => setMontoInicial(e.target.value)}
          placeholder="Ingrese monto inicial..."
          style={{ fontWeight: "500" }}
          disabled={cajaHoy && !cajaHoy.fechaCierre}
        />
        <button
          className="btn btn-danger w-100"
          onClick={registrarMontoInicial}
          style={{ fontWeight: "600" }}
          disabled={cajaHoy && !cajaHoy.fechaCierre}
        >
          <FaCashRegister size={20} /> Abrir Caja
        </button>
      </div>

      {/* Ventas del día */}
      <div className="mt-4 p-4 bg-white rounded shadow-sm border border-danger">
        <h4 className="mb-4 text-danger fw-bold">Ventas del Día</h4>

        {cargando ? (
          <p>Cargando ventas...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-danger">
              <tr>
                <th>ID Venta</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ventasHoy.length > 0 ? (
                ventasHoy.map((v) => (
                  <tr key={v.idVenta}>
                    <td>{v.idVenta}</td>
                    <td>{v.cliente?.nombre || "-"}</td>
                    <td className="text-end">S/ {v.total?.toFixed(2) || "0.00"}</td>
                    <td>{new Date(v.fechaVenta).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No hay ventas registradas hoy.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        <h5 className="text-end mt-3 fw-bold" style={{ color: "#b71c1c" }}>
          Total vendido hoy: S/ {totalVentas.toFixed(2)}
        </h5>
      </div>

      {/* Botón cerrar caja */}
      <div className="text-center mt-5">
        <button
          className="btn btn-danger btn-lg px-5"
          onClick={cerrarCaja}
          style={{ fontWeight: "600" }}
          disabled={!cajaHoy || cajaHoy.fechaCierre}
        >
          <FaDollarSign size={20} /> Cerrar Caja
        </button>
      </div>
    </div>
  );
}
