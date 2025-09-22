// src/components/MenuManager.jsx
import React, { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";

export default function MenuManager({ menu, setMenu }) {
  const [newDish, setNewDish] = useState({
    nombre: "",
    categoria: "Entrada",
    descripcion: "",
    precio: "",
    imagen: "",
    agotado: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDish({
      ...newDish,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addDish = () => {
    if (!newDish.nombre || !newDish.precio) {
      alert("Por favor, ingresa al menos nombre y precio del plato.");
      return;
    }
    const updatedMenu = [...menu, { ...newDish, id: Date.now() }];
    setMenu(updatedMenu);
    localStorage.setItem("menu", JSON.stringify(updatedMenu)); // <--- aquí
    setNewDish({
      nombre: "",
      categoria: "Entrada",
      descripcion: "",
      precio: "",
      imagen: "",
      agotado: false,
    });
  };

  const deleteDish = (id) => {
    const updatedMenu = menu.filter((dish) => dish.id !== id);
    setMenu(updatedMenu);
    localStorage.setItem("menu", JSON.stringify(updatedMenu)); // <--- aquí
  };

  const toggleAgotado = (id) => {
    const updatedMenu = menu.map((dish) =>
      dish.id === id ? { ...dish, agotado: !dish.agotado } : dish
    );
    setMenu(updatedMenu);
    localStorage.setItem("menu", JSON.stringify(updatedMenu)); // <--- aquí
  };

  return (
    <div>
      <h4>Gestión del Menú</h4>
      <Form className="mb-3">
        <Form.Group className="mb-2">
          <Form.Label>Nombre del Plato</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={newDish.nombre}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Categoría</Form.Label>
          <Form.Select
            name="categoria"
            value={newDish.categoria}
            onChange={handleChange}
          >
            <option>Entrada</option>
            <option>Plato de Fondo</option>
            <option>Postre</option>
            <option>Bebida</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="descripcion"
            value={newDish.descripcion}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Precio (S/)</Form.Label>
          <Form.Control
            type="number"
            name="precio"
            value={newDish.precio}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Imagen (URL)</Form.Label>
          <Form.Control
            type="text"
            name="imagen"
            value={newDish.imagen}
            onChange={handleChange}
          />
        </Form.Group>

        <Button onClick={addDish} variant="success">
          Agregar Plato
        </Button>
      </Form>

      {/* Tabla de platos */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((dish) => (
            <tr key={dish.id}>
              <td>
                {dish.imagen ? (
                  <img src={dish.imagen} alt={dish.nombre} width="60" />
                ) : (
                  "N/A"
                )}
              </td>
              <td>{dish.nombre}</td>
              <td>{dish.categoria}</td>
              <td>{dish.descripcion}</td>
              <td>S/ {dish.precio}</td>
              <td>
                {dish.agotado ? (
                  <span className="text-danger">Agotado</span>
                ) : (
                  <span className="text-success">Disponible</span>
                )}
              </td>
              <td>
                <Button
                  size="sm"
                  variant={dish.agotado ? "warning" : "secondary"}
                  onClick={() => toggleAgotado(dish.id)}
                  className="me-2"
                >
                  {dish.agotado ? "Marcar Disponible" : "Marcar Agotado"}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteDish(dish.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
