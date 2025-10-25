import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";
import qrYape from '../assets/qr-yape.jpg';

export default function MetodoPago({ total, onClose }) {
  const [metodo, setMetodo] = useState("");
  const [efectivo, setEfectivo] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [boleta, setBoleta] = useState("");

  const vuelto = efectivo ? Number(efectivo) - total : 0;

  const procesarPago = () => {
    if (!metodo) { alert("Selecciona un método de pago."); return; }
    if (metodo === "efectivo" && (!efectivo || Number(efectivo) < total)) {
      alert("Monto recibido insuficiente."); return;
    }
    if (metodo === "tarjeta" && (tarjeta.length !== 4 || !boleta)) {
      alert("Completa los datos de tarjeta y boleta."); return;
    }

    alert("Pago procesado correctamente");
    onClose();
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <Modal show={true} onHide={onClose} centered size="md">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Método de Pago</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Card className="mb-3 shadow-sm border-0">
          <Card.Body>
            <h5 className="text-center">Total a pagar</h5>
            <p className="text-center fs-4 fw-bold text-primary">S/ {total.toFixed(2)}</p>
          </Card.Body>
        </Card>

        {!metodo && (
          <div className="d-grid gap-2">
            <Button variant="outline-primary" onClick={() => setMetodo("efectivo")}>
              Efectivo
            </Button>
            <Button variant="outline-secondary" onClick={() => setMetodo("yape")}>
              Yape
            </Button>
            <Button variant="outline-info" onClick={() => setMetodo("tarjeta")}>
              Tarjeta/Izipay
            </Button>
          </div>
        )}

        {metodo === "efectivo" && (
          <Card className="p-3 shadow-sm border-0 mt-3">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Monto recibido</Form.Label>
                <Form.Control
                  type="number"
                  value={efectivo}
                  onChange={(e) => setEfectivo(e.target.value)}
                  placeholder="Ingrese el monto"
                />
              </Form.Group>
              <p className="fw-bold">
                Vuelto:{" "}
                <span className={vuelto < 0 ? "text-danger" : "text-success"}>
                  {vuelto >= 0 ? `S/ ${vuelto.toFixed(2)}` : "Monto insuficiente"}
                </span>
              </p>
            </Form>
          </Card>
        )}

        {metodo === "yape" && (
          <Card className="p-3 shadow-sm border-0 mt-3 text-center">
            <p className="mb-2 fw-semibold">Escanea este QR para pagar con Yape</p>
            <img src={qrYape} alt="QR Yape" className="img-fluid border rounded d-block mx-auto" style={{ height: "200px", width:"200px"}}/> </Card>
        )}

        {metodo === "tarjeta" && (
          <Card className="p-3 shadow-sm border-0 mt-3">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Últimos 4 dígitos de la tarjeta</Form.Label>
                <Form.Control
                  type="text"
                  maxLength={4}
                  value={tarjeta}
                  onChange={(e) => setTarjeta(e.target.value)}
                  placeholder="1234"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Número de boleta</Form.Label>
                <Form.Control
                  type="text"
                  value={boleta}
                  onChange={(e) => setBoleta(e.target.value)}
                  placeholder="Ingrese nro de boleta"
                />
              </Form.Group>
            </Form>
          </Card>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={procesarPago}>
          Confirmar Pago
        </Button>
      </Modal.Footer>
    </Modal>
  );
}