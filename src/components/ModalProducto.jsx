import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

export default function ModalProducto({ isOpen, onClose, onSave, categorias = [], productoEditado }) {
  const [producto, setProducto] = useState({
    producto: "",
    descripcion: "",
    precioVenta: "",
    estado: true,
    categoria: null,
    imagen: null,
  });
  const [imagenArchivo, setImagenArchivo] = useState(null);

  useEffect(() => {
    if (productoEditado) {
      setProducto({
        idProducto: productoEditado.idProducto,
        producto: productoEditado.producto || "",
        descripcion: productoEditado.descripcion || "",
        precioVenta: productoEditado.precioVenta || "",
        estado: productoEditado.estado ?? true,
        categoria: productoEditado.categoria || null,
        imagen: productoEditado.imagen || null,
      });
      setImagenArchivo(null);
    } else {
      setProducto({
        producto: "",
        descripcion: "",
        precioVenta: "",
        estado: true,
        categoria: null,
        imagen: null,
      });
      setImagenArchivo(null);
    }
  }, [productoEditado, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoriaChange = (e) => {
    const idCategoria = parseInt(e.target.value);
    const cat = categorias.find(c => c.idCategoria === idCategoria);
    setProducto(prev => ({ ...prev, categoria: cat || null }));
  };

  const handleImagenChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagenArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!producto.producto || !producto.descripcion || !producto.precioVenta || !producto.categoria) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    // Asegurarse de enviar precio como float
    const productoEnviar = { ...producto, precioVenta: parseFloat(producto.precioVenta) };

    await onSave(productoEnviar, imagenArchivo);
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
            <Form.Control type="number" name="precioVenta" value={producto.precioVenta} onChange={handleChange} step="0.01" min="0" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select value={producto.categoria?.idCategoria || ""} onChange={handleCategoriaChange}>
              <option value="">Selecciona una categoría</option>
              {categorias.map(c => (
                <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            {producto.imagen && !imagenArchivo && (
              <div className="mb-2">
                <Image src={`${API}${producto.imagen}`} fluid thumbnail style={{ maxHeight: "150px" }} />
              </div>
            )}
            <Form.Control type="file" onChange={handleImagenChange} accept="image/*" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Disponible"
              checked={producto.estado}
              onChange={e => setProducto(prev => ({ ...prev, estado: e.target.checked }))}
            />
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
