import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Reportes() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/ventas/listar")
      .then((res) => setVentas(res.data))
      .catch((err) => console.error("Error obteniendo ventas:", err));
  }, []);

  const handleVerDetalle = (idVenta) => {
    axios
      .get(`http://localhost:9000/api/ventas/${idVenta}`)
      .then((res) => {
        setVentaSeleccionada(res.data);
        setShowModal(true);
      })
      .catch((err) => {
        console.error("Error al obtener detalle:", err);
        alert("No se pudo cargar el detalle.");
      });
  };

  return (
    <div className="container mt-4">
      <h2>Reportes de Ventas</h2>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Cliente</th>
            <th>Documento</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.idVenta}>
              <td>{venta.idVenta}</td>
              <td>{venta.cliente?.nombre || "-"}</td>
              <td>{venta.cliente?.documento || "-"}</td>
              <td>S/ {venta.total?.toFixed(2)}</td>
              <td>{new Date(venta.fechaVenta).toLocaleString()}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleVerDetalle(venta.idVenta)}
                >
                  Ver Detalle
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL DETALLE */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ventaSeleccionada ? (
            <div>
              <p><strong>Cliente:</strong> {ventaSeleccionada.cliente?.nombre}</p>
              <p><strong>Total:</strong> S/ {ventaSeleccionada.total?.toFixed(2)}</p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(ventaSeleccionada.fechaVenta).toLocaleString()}
              </p>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Método Pago</th>
                    <th>Monto Pagado</th>
                    <th>Vuelto</th>
                    <th>Código Izipay</th>
                    <th>N° Tarjeta</th>
                  </tr>
                </thead>
                <tbody>
                  {ventaSeleccionada.detalles?.map((detalle) => (
                    <tr key={detalle.idDetalleVenta}>
                      <td>{detalle.producto?.producto}</td>
                      <td>{detalle.producto?.descripcion}</td>
                      <td>{detalle.cantidad || "-"}</td>
                      <td>S/ {detalle.subtotal?.toFixed(2)}</td>
                      <td>{detalle.metodoPago || "-"}</td>
                      <td>{detalle.montoPagado || "-"}</td>
                      <td>{detalle.vuelto || "-"}</td>
                      <td>{detalle.codigoIzipay || "-"}</td>
                      <td>{detalle.numeroTarjeta || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>Cargando detalle...</p>
          )}
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
