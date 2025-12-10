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
  const [cajaHoy, setCajaHoy] = useState(null);
  const [cargando, setCargando] = useState(true);

  // =================== CARGAR CAJA ABIERTA ===================
  const cargarCajaHoy = async () => {
    try {
      const resCaja = await axios.get(`${API}/api/caja/hoy`);
      const caja = resCaja.data || null;

      if (caja && !caja.fechaCierre) {
        setCajaHoy(caja);
        setMontoInicial(caja.montoInicial);
        await cargarVentasHoy(caja.idCaja);
      } else {
        setCajaHoy(null);
        setMontoInicial("");
        setVentasHoy([]);
        setTotalVentas(0);
      }

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

  // =================== CARGAR VENTAS DE LA CAJA ===================
  const cargarVentasHoy = async (cajaId) => {
    try {
      const resVentas = await axios.get(`${API}/api/ventas/listar`);
      const todasVentas = resVentas.data || [];

      const hoy = new Date();
      const ventasDeCaja = todasVentas.filter((v) => {
        const fechaVenta = new Date(v.fechaVenta);
        return (
          v.caja?.idCaja === cajaId &&
          fechaVenta.getFullYear() === hoy.getFullYear() &&
          fechaVenta.getMonth() === hoy.getMonth() &&
          fechaVenta.getDate() === hoy.getDate()
        );
      });

      setVentasHoy(ventasDeCaja);
      setTotalVentas(ventasDeCaja.reduce((acc, v) => acc + (v.total || 0), 0));
    } catch (error) {
      console.error("Error al cargar ventas:", error);
      setVentasHoy([]);
      setTotalVentas(0);
    }
  };

  // =================== ABRIR CAJA ===================
  const registrarMontoInicial = async () => {
    if (!montoInicial || isNaN(montoInicial)) {
      return Swal.fire("Error", "Ingresa un monto válido", "error");
    }

    try {
      const res = await axios.post(`${API}/api/caja/abrir`, {
        montoInicial: parseFloat(montoInicial),
      });

      const cajaAbierta = res.data;
      setCajaHoy(cajaAbierta);
      setMontoInicial(cajaAbierta.montoInicial);
      await cargarVentasHoy(cajaAbierta.idCaja);

      Swal.fire("Éxito", "Caja abierta correctamente", "success");
    } catch (error) {
      console.error("Error al abrir caja:", error.response?.data || error);
      Swal.fire("Error", "No se pudo abrir la caja. Puede que ya esté abierta.", "error");
    }
  };

  // =================== CERRAR CAJA ===================
  const cerrarCaja = async () => {
    if (!cajaHoy?.idCaja) {
      return Swal.fire("Error", "No hay caja abierta. Por favor abre la caja primero.", "error");
    }

    try {
      const res = await axios.post(`${API}/api/caja/cerrar`, { idCaja: cajaHoy.idCaja });

      Swal.fire(
        "Caja Cerrada",
        `Monto Inicial: S/ ${montoInicial}\nTotal Ventas: S/ ${totalVentas.toFixed(
          2
        )}\nTotal en Caja: S/ ${res.data.totalEnCaja.toFixed(2)}`,
        "success"
      );

      setCajaHoy(null);
      setMontoInicial("");
      setVentasHoy([]);
      setTotalVentas(0);
    } catch (error) {
      console.error("Error al cerrar caja:", error.response?.data || error);
      Swal.fire("Error", "No se pudo cerrar la caja.", "error");
    }
  };

  // =================== REFRESCO AUTOMÁTICO DE VENTAS ===================
  useEffect(() => {
    cargarCajaHoy();
    const intervalo = setInterval(() => {
      if (cajaHoy?.idCaja) {
        cargarVentasHoy(cajaHoy.idCaja);
      }
    }, 5000); // cada 5 segundos

    return () => clearInterval(intervalo);
  }, [cajaHoy?.idCaja]);

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
          disabled={cajaHoy && !cajaHoy.fechaCierre} // bloqueado si hay caja abierta
        />
        <button
          className="btn btn-danger w-100"
          onClick={registrarMontoInicial}
          style={{ fontWeight: "600" }}
          disabled={cajaHoy && !cajaHoy.fechaCierre} // bloqueado si hay caja abierta
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
          disabled={!cajaHoy || cajaHoy.fechaCierre} // habilitado solo si hay caja abierta
        >
          <FaDollarSign size={20} /> Cerrar Caja
        </button>
      </div>
    </div>
  );
}
