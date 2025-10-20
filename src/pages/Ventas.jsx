import React, { useState } from "react";
import { productos as menu } from "../data/menu";
import MetodoPago from "../components/MetodoPago";

export default function Ventas() {
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);

  const productosFiltrados = menu.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.idProducto === producto.idProducto);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const modificarCantidad = (idProducto, incremento) => {
    setCarrito(
      carrito
        .map((item) =>
          item.idProducto === idProducto
            ? { ...item, cantidad: Math.max(item.cantidad + incremento, 1) }
            : item
        )
    );
  };

  const eliminarProducto = (idProducto) => {
    setCarrito(carrito.filter((item) => item.idProducto !== idProducto));
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precioVenta * item.cantidad,
    0
  );

  return (
    <div className="container-fluid h-100 mt-3">
      <div className="row h-100">

        {/* Productos */}
        <div className="col-md-8" style={{ height: "100%" }}>
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-basket fs-3 text-primary me-2"></i>
            <h2 className="mb-0">Ventas</h2>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div
            className="row g-3 overflow-auto"
            style={{ maxHeight: "calc(100vh - 150px)" }} // Scroll solo en productos
          >
            {productosFiltrados.length === 0 && (
              <p className="text-muted">No hay productos disponibles.</p>
            )}
            {productosFiltrados.map((p) => (
              <div key={p.idProducto} className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <div className="mb-2 text-center">
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        className="img-fluid"
                        style={{ maxHeight: "120px", objectFit: "contain" }}
                      />
                    </div>
                    <h5 className="card-title text-center">{p.nombre}</h5>
                    <p className="text-center text-primary fw-bold">S/ {p.precioVenta}</p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => agregarAlCarrito(p)}
                    >
                      <i className="bi bi-bag-plus me-1"></i> Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4" style={{ height: "650px" }}>
          <div className="card flex-fill d-flex flex-column shadow-sm h-100">
            <div className="card-body d-flex flex-column h-100">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-cart fs-3 text-primary me-2"></i>
                <h4 className="mb-0">Carrito</h4>
              </div>

              <div className="flex-fill overflow-auto mb-3"
                style={{ maxHeight: "calc(100vh - 200px)" }}>
                {carrito.length === 0 ? (
                  <p className="text-muted">No hay productos en el carrito.</p>
                ) : (
                  <ul className="list-group">
                    {carrito.map((item) => (
                      <li
                        key={item.idProducto}
                        className="list-group-item d-flex justify-content-between align-items-center flex-column flex-md-row">
                        <div>
                          <strong>{item.nombre}</strong>
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <button className="btn btn-sm btn-outline-secondary"
                              onClick={() => modificarCantidad(item.idProducto, -1)}> - </button>
                            <span>{item.cantidad}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => modificarCantidad(item.idProducto, 1)} > + </button>
                            <button
                              className="btn btn-sm btn-danger ms-2"
                              onClick={() => eliminarProducto(item.idProducto)} >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                        <span className="mt-2 mt-md-0">S/ {item.precioVenta * item.cantidad}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-auto border-top pt-3">
                <h5>Total: S/ {total}</h5>
                <button className="btn btn-success w-100 mt-2"
                  onClick={() => setModalPagoOpen(true)} >
                  <i className="bi bi-credit-card me-1"></i> Finalizar Venta </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalPagoOpen && (
        <MetodoPago
          total={total}
          onClose={() => {
            setModalPagoOpen(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}