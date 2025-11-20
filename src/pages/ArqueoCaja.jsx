import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ArqueoCaja() {
  const [montoInicial, setMontoInicial] = useState("");
  const [ventasHoy, setVentasHoy] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [arqueoFinal, setArqueoFinal] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // ---- Cargar ventas del día ----
  const cargarVentasDeHoy = async () => {
    try {
      const res = await axios.get("http://localhost:9050/api/ventas/hoy");

      console.log("VENTAS HOY:", res.data);

      let lista = [];

      if (Array.isArray(res.data)) {
        lista = res.data;
      } else if (Array.isArray(res.data.ventas)) {
        lista = res.data.ventas;
      }

      setVentasHoy(lista);

      const total = lista.reduce((acc, venta) => acc + (venta.total || 0), 0);
      setTotalVentas(total);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  };

  useEffect(() => {
    cargarVentasDeHoy();
  }, []);

  // ---- Registrar monto inicial ----
  const registrarMontoInicial = () => {
    if (!montoInicial || isNaN(montoInicial)) {
      alert("Ingresa un monto válido.");
      return;
    }

    localStorage.setItem("montoInicialCaja", montoInicial);
    alert("Monto inicial registrado correctamente.");
  };

  // ---- Cerrar caja ----
  const cerrarCaja = () => {
    const montoInicialGuardado = parseFloat(localStorage.getItem("montoInicialCaja") || 0);

    const arqueo = montoInicialGuardado + totalVentas;
    setArqueoFinal(arqueo);

    setShowModal(true);
  };

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow-sm">
      <h2 className="text-center mb-4">Arqueo de Caja</h2>

      {/* Monto inicial */}
      <div className="mb-3">
        <label className="form-label fw-bold">Monto Inicial del Día</label>
        <input
          type="number"
          className="form-control"
          value={montoInicial}
          onChange={(e) => setMontoInicial(e.target.value)}
          placeholder="Ingrese monto inicial..."
        />
        <button className="btn btn-primary mt-2" onClick={registrarMontoInicial}>
          Registrar Monto Inicial
        </button>
      </div>

      {/* Ventas del día */}
      <div className="mt-4">
        <h4 className="mb-3">Ventas del Día</h4>

        <Table striped bordered hover>
          <thead>
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
                  <td>{v.cliente?.nombre}</td>
                  <td>S/ {v.total}</td>
                  <td>{v.fechaVenta}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay ventas registradas hoy.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <h5 className="text-end mt-3">
          Total vendido hoy: <strong>S/ {totalVentas}</strong>
        </h5>
      </div>

      {/* Botón cerrar caja */}
      <div className="text-center mt-4">
        <button className="btn btn-danger" onClick={cerrarCaja}>
          Cerrar Caja
        </button>
      </div>

      {/* Modal resultado */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resultado del Arqueo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h5>Monto Inicial: S/ {montoInicial}</h5>
          <h5>Total Ventas: S/ {totalVentas}</h5>
          <hr />
          <h4>Total en Caja: S/ {arqueoFinal}</h4>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
