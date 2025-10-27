import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ModalProducto({ isOpen, onClose, onSave, categorias, productoEditado }) {
  const [producto, setProducto] = useState({
    producto: "",
    descripcion: "",
    precioVenta: "",
    estado: true,
    categoria: null,
    imagen: null,
  });

  useEffect(() => {
    if (productoEditado) {
      setProducto({
        idProducto: productoEditado.idProducto,
        producto: productoEditado.producto || "",
        descripcion: productoEditado.descripcion || "",
        precioVenta: productoEditado.precioVenta || "",
        estado: productoEditado.estado ?? true,
        categoria: productoEditado.categoria || null,
        imagen: null,
      });
    } else {
      setProducto({
        producto: "",
        descripcion: "",
        precioVenta: "",
        estado: true,
        categoria: null,
        imagen: null,
      });
    }
  }, [productoEditado, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriaChange = (e) => {
    const idCategoria = parseInt(e.target.value);
    const categoriaSeleccionada = categorias.find((cat) => cat.idCategoria === idCategoria);
    setProducto((prev) => ({ ...prev, categoria: categoriaSeleccionada }));
  };

  const handleImagenChange = (e) => {
    setProducto((prev) => ({ ...prev, imagen: e.target.files[0] }));
  };

  const handleSubmit = () => {
    if (!producto.producto || !producto.descripcion || !producto.precioVenta || !producto.categoria) {
      alert("Completa todos los campos obligatorios.");
      return;
    }
    onSave(producto);
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{productoEditado ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control type="text" name="producto" value={producto.producto} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={2} name="descripcion" value={producto.descripcion} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio de Venta (S/)</Form.Label>
            <Form.Control type="number" name="precioVenta" value={producto.precioVenta} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select value={producto.categoria?.idCategoria || ""} onChange={handleCategoriaChange}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nombreCategoria}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen del Producto</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImagenChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
}