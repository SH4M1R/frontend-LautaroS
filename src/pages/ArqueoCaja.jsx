import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaDollarSign, FaCashRegister } from "react-icons/fa";
import Swal from "sweetalert2";
import LoaderConGIF from "../components/LoaderConGIF";// <-- AÑADIDO: spinner con GIF

const API = import.meta.env.VITE_API_URL;

export default function ArqueoCaja() {
  const [montoInicial, setMontoInicial] = useState("");
  const [ventasHoy, setVentasHoy] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [cajaHoy, setCajaHoy] = useState(null);
  const [cargando, setCargando] = useState(true);

  // =================== CARGAR CAJA ABIERTA Y VENTAS ===================
  const cargarCajaHoy = async () => {
    try {
      setCargando(true);

      const resCaja = await axios.get(`${API}/api/caja/hoy`);
      const caja = resCaja.data || null;

      if (caja && !caja.fechaCierre) {
        // Mantener la caja abierta
        setCajaHoy(caja);
        setMontoInicial(caja.montoInicial); // <-- MOSTRAR montoInicial
        await cargarVentasHoy(caja.idCaja);
      } else {
        setCajaHoy(null);
        setMontoInicial(""); // No hay caja abierta
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

  // =================== CORRECCIÓN: FILTRO DE VENTAS DEL DÍA ===================
  // Antes no consideraba la zona horaria, ahora funciona correctamente
  const cargarVentasHoy = async (cajaId) => {
    try {
      const resVentas = await axios.get(`${API}/api/ventas/listar`);
      const todasVentas = resVentas.data || [];

      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = hoy.getMonth();
      const dd = hoy.getDate();

      const ventasDeHoy = todasVentas.filter((v) => {
        const fechaVenta = new Date(v.fechaVenta);
        return (
          fechaVenta.getFullYear() === yyyy &&
          fechaVenta.getMonth() === mm &&
          fechaVenta.getDate() === dd &&
          v.caja?.idCaja === cajaId
        );
      });

      setVentasHoy(ventasDeHoy);
      setTotalVentas(ventasDeHoy.reduce((acc, v) => acc + (v.total || 0), 0));
    } catch (error) {
      console.error("Error al cargar ventas:", error);
      setVentasHoy([]);
      setTotalVentas(0);
    }
  };

  useEffect(() => {
    cargarCajaHoy();
  }, []);

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
      Swal.fire(
        "Error",
        "No se pudo abrir la caja. Puede que ya esté abierta.",
        "error"
      );
    }
  };

  // =================== CERRAR CAJA ===================
  const cerrarCaja = async () => {
    if (!cajaHoy?.idCaja) {
      return Swal.fire(
        "Error",
        "No hay caja abierta. Por favor abre la caja primero.",
        "error"
      );
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

      // Limpiar estado después de cerrar
      setCajaHoy(null);
      setMontoInicial("");
      setVentasHoy([]);
      setTotalVentas(0);
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
          disabled={cajaHoy && !cajaHoy.fechaCierre} // input bloqueado solo si ya hay caja abierta
        />
        <button
          className="btn btn-danger w-100"
          onClick={registrarMontoInicial}
          style={{ fontWeight: "600" }}
          disabled={cajaHoy && !cajaHoy.fechaCierre} // botón bloqueado si ya hay caja abierta
        >
          <FaCashRegister size={20} /> Abrir Caja
        </button>
      </div>

      {/* Ventas del día */}
      <div className="mt-4 p-4 bg-white rounded shadow-sm border border-danger">
        <h4 className="mb-4 text-danger fw-bold">Ventas del Día</h4>

        {/* =================== AÑADIDO: Spinner mientras carga ventas =================== */}
        <LoaderConGIF loading={cargando}>
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
        </LoaderConGIF>

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
          disabled={!cajaHoy || cajaHoy.fechaCierre} // solo habilitado si hay caja abierta
        >
          <FaDollarSign size={20} /> Cerrar Caja
        </button>
      </div>
    </div>
  );
}
