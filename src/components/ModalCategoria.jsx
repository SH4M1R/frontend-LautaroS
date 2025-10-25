import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ModalCategoria({ isOpen, onClose, onSave }) {
  const [categoria, setCategoria] = useState("");

  const handleSubmit = async () => {
    if (!categoria) return alert("Ingresa un nombre de categoría");

    try {
      const res = await fetch("http://localhost:9000/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreCategoria: categoria }),
      });
      const data = await res.json();
      onSave(data);
      setCategoria("");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la categoría");
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Nueva Categoria</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Nombre de la categoría</Form.Label>
          <Form.Control
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}