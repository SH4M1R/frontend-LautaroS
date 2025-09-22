// src/pages/Menu.jsx
import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

export default function Menu() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const storedMenu = JSON.parse(localStorage.getItem("menu")) || [];
    setProductos(storedMenu);
  }, []);

  const addToCart = (producto) => {
    if (producto.agotado) return; // no permitir agregar si está agotado

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${producto.nombre} agregado al carrito`);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Menú del Restaurante</h2>
      <div className="row">
        {productos.length === 0 ? (
          <p>No hay platos disponibles</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} className="col-md-3 mb-4">
              <Card>
                {producto.imagen && (
                  <Card.Img
                    variant="top"
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {producto.categoria}
                  </Card.Subtitle>
                  <Card.Text>{producto.descripcion}</Card.Text>
                  <h5>S/ {producto.precio}</h5>

                  {producto.agotado ? (
                    <Button variant="danger" disabled>
                      Agotado
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => addToCart(producto)}
                    >
                      Agregar al Carrito
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
