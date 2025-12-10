import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, Pagination, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaPrint } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

export default function Reportes() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const ventasPorPagina = 10;

  // Cargar ventas
  useEffect(() => {
    axios.get(`${API}/api/ventas/listar`)
      .then(res => setVentas(res.data))
      .catch(err => console.error("Error obteniendo ventas:", err));
  }, []);

  // Filtrado y orden
  const ventasOrdenadas = [...ventas].sort((a, b) => b.idVenta - a.idVenta);
  const ventasFiltradas = ventasOrdenadas.filter(v => {
    const fecha = new Date(v.fechaVenta);
    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;
    if (desde && fecha < desde) return false;
    if (hasta && fecha > hasta) return false;
    return true;
  });

  // Paginación
  const indexUltimaVenta = paginaActual * ventasPorPagina;
  const indexPrimeraVenta = indexUltimaVenta - ventasPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indexPrimeraVenta, indexUltimaVenta);
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);

  // Detalle venta
  const handleVerDetalle = (idVenta) => {
    axios.get(`${API}/api/ventas/${idVenta}`)
      .then(res => { setVentaSeleccionada(res.data); setShowModal(true); })
      .catch(err => { console.error("Error al obtener detalle:", err); alert("No se pudo cargar el detalle."); });
  };

  // Imprimir voucher
  const handleImprimirVoucher = (idVenta) => {
    window.open(`${API}/api/ventas/${idVenta}/boleta`, "_blank");
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Reportes de Ventas</Card.Title>

          <Form className="mb-4">
            <Row className="align-items-end g-3">
              <Col xs={12} md={3}>
                <Form.Label>Desde:</Form.Label>
                <Form.Control type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
              </Col>
              <Col xs={12} md={3}>
                <Form.Label>Hasta:</Form.Label>
                <Form.Control type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
              </Col>
              <Col xs={12} md={2}>
                <Button variant="danger" className="w-100" onClick={() => setPaginaActual(1)}>
                  Filtrar
                </Button>
              </Col>
            </Row>
          </Form>

          <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm">
              <thead className="table-light">
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
                {ventasPaginadas.map(venta => (
                  <tr key={venta.idVenta}>
                    <td>{venta.idVenta}</td>
                    <td>{venta.cliente?.nombre || "-"}</td>
                    <td>{venta.cliente?.documento || "-"}</td>
                    <td>S/ {venta.total?.toFixed(2) || "0.00"}</td>
                    <td>{new Date(venta.fechaVenta).toLocaleString()}</td>
                    <td className="d-flex gap-2">
                      <Button variant="danger" size="sm" onClick={() => handleVerDetalle(venta.idVenta)}>
                        <FaEye />
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleImprimirVoucher(venta.idVenta)}>
                        <FaPrint />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.First onClick={() => setPaginaActual(1)} disabled={paginaActual === 1} />
                <Pagination.Prev onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))} disabled={paginaActual === 1} />
                {[...Array(totalPaginas)].map((_, i) => (
                  <Pagination.Item key={i + 1} active={i + 1 === paginaActual} onClick={() => setPaginaActual(i + 1)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaActual === totalPaginas} />
                <Pagination.Last onClick={() => setPaginaActual(totalPaginas)} disabled={paginaActual === totalPaginas} />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal detalle venta */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ventaSeleccionada ? (
            <>
              <Row className="mb-2">
                <Col><strong>Cliente:</strong> {ventaSeleccionada.cliente?.nombre || "-"}</Col>
                <Col><strong>Total:</strong> S/ {ventaSeleccionada.total?.toFixed(2) || "0.00"}</Col>
              </Row>
              <Row className="mb-3">
                <Col><strong>Fecha:</strong> {new Date(ventaSeleccionada.fechaVenta).toLocaleString()}</Col>
              </Row>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-light">
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
                    {ventaSeleccionada.detalles?.length > 0 ? (
                      ventaSeleccionada.detalles.map(detalle => (
                        <tr key={detalle.idDetalleVenta}>
                          <td>{detalle.producto?.producto || "-"}</td>
                          <td>{detalle.producto?.descripcion || "-"}</td>
                          <td>{detalle.cantidad || 0}</td>
                          <td>S/ {detalle.subtotal?.toFixed(2) || "0.00"}</td>
                          <td>{detalle.metodoPago || "-"}</td>
                          <td>{detalle.montoPagado?.toFixed(2) || "0.00"}</td>
                          <td>{detalle.vuelto?.toFixed(2) || "0.00"}</td>
                          <td>{detalle.codigoIzipay || "-"}</td>
                          <td>{detalle.numeroTarjeta || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="9" className="text-center">No hay detalles</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </>
          ) : (
            <p>Cargando detalle...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
