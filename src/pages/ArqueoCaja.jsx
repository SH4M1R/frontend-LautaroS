import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaDollarSign, FaCashRegister } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

export default function ArqueoCaja() {
  const [montoInicial, setMontoInicial] = useState("");
  const [ventasHoy, setVentasHoy] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [arqueoFinal, setArqueoFinal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cajaHoy, setCajaHoy] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarCajaHoy = async () => {
    try {
      setCargando(true);

      // Obtener caja del día
      let caja = null;
      try {
        const resCaja = await axios.get(`${API}/api/caja/hoy`);
        caja = resCaja.data || null;
        setCajaHoy(caja);
        setMontoInicial(caja?.montoInicial || "");
      } catch {
        console.warn("No hay caja abierta hoy");
        setCajaHoy(null);
        setMontoInicial("");
      }

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
      setTotalVentas(
        ventasDeHoy.reduce((acc, v) => acc + (v.total || 0), 0)
      );

      setCargando(false);
    } catch (error) {
      console.error("Error al cargar caja:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCajaHoy();
  }, []);

  // Registrar monto inicial
  const registrarMontoInicial = async () => {
    if (!montoInicial || isNaN(montoInicial)) {
      alert("Ingresa un monto válido.");
      return;
    }

    try {
      await axios.post(`${API}/api/caja/abrir`, { montoInicial: parseFloat(montoInicial) });
      alert("Caja abierta correctamente.");
      cargarCajaHoy();
    } catch (error) {
      console.error("Error al registrar monto inicial:", error.response?.data || error);
      alert("No se pudo abrir la caja. Puede que ya esté abierta.");
    }
  };

  // Cerrar caja
  const cerrarCaja = async () => {
    if (!cajaHoy?.idCaja) {
      alert("No hay caja abierta para cerrar.");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/caja/cerrar`, { idCaja: cajaHoy.idCaja });
      setArqueoFinal(res.data.totalEnCaja || 0);
      setShowModal(true);
      cargarCajaHoy();
    } catch (error) {
      console.error("Error al cerrar caja:", error.response?.data || error);
      alert("No se pudo cerrar la caja.");
    }
  };

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

      {/* Modal de arqueo final */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Resultado del Arqueo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h5>Monto Inicial: S/ {montoInicial}</h5>
            <h5>Total Ventas: S/ {totalVentas.toFixed(2)}</h5>
            <hr />
            <h3 className="fw-bold text-danger">Total en Caja: S/ {arqueoFinal?.toFixed(2)}</h3>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
