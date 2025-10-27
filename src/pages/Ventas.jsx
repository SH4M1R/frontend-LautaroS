import React, { useEffect, useState } from "react";
import MetodoPago from "../components/MetodoPago";

export default function Ventas() {
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [cliente, setCliente] = useState("");
  const [fechaActual, setFechaActual] = useState(new Date());

  useEffect(() => {
    fetchProductos();
    const intervalo = setInterval(() => setFechaActual(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/productos");
      const data = await res.json();
      setProductos(data.filter((p) => p.estado));
    } catch (err) {
      console.error(err);
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const agregarAlCarrito = (producto) => {
    if (!producto.estado) return;
    const existe = carrito.find((item) => item.idProducto === producto.idProducto);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.idProducto === producto.idProducto ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  };

  const modificarCantidad = (idProducto, incremento) => {
    setCarrito(
      carrito.map((item) =>
        item.idProducto === idProducto ? { ...item, cantidad: Math.max(item.cantidad + incremento, 1) } : item
      )
    );
  };

  const eliminarProductoCarrito = (idProducto) => setCarrito(carrito.filter((item) => item.idProducto !== idProducto));

  const total = carrito.reduce((acc, item) => acc + item.precioVenta * item.cantidad, 0);

  const fechaFormateada = fechaActual.toLocaleString();

  return (
    <div className="container-fluid mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          <i className="bi bi-basket fs-3 text-primary"></i>
          <h2 className="mb-0">Ventas</h2>
        </div>
        <div className="text-end">
          <small className="text-muted">{fechaFormateada}</small>
        </div>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Nombre del cliente..."
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>

      <div className="row h-100">
        {/* Productos */}
        <div
          className="col-md-8 mb-3"
          style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}
        >
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

          <div className="row g-3">
            {productosFiltrados.length === 0 && <p className="text-muted">No hay productos disponibles.</p>}
            {productosFiltrados.map((p) => (
              <div key={p.idProducto} className="col-sm-6 col-md-4 col-lg-3">
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{ cursor: p.estado ? "pointer" : "not-allowed", transition: "transform 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src={p.imagen ? `http://localhost:9000/upload/${p.imagen}` : "https://via.placeholder.com/150"}
                    alt={p.producto}
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-center mb-1">{p.producto}</h6>
                    <p className="text-center text-muted small mb-2">
                      {p.descripcion || "Sin descripción"}
                    </p>
                    <p className="text-center text-primary fw-bold mb-2">S/ {p.precioVenta}</p>
                    <button
                      className={`btn btn-${p.estado ? "primary" : "secondary"} btn-sm mt-auto`}
                      disabled={!p.estado}
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

        {/* Carrito */}
        <div className="col-md-4" style={{ height: "500px", overflowY: "auto" }}>
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column h-100">
              <h5 className="mb-3"><i className="bi bi-cart me-2"></i>Carrito</h5>

              <div className="flex-fill overflow-auto mb-3">
                {carrito.length === 0 ? (
                  <p className="text-muted">No hay productos en el carrito.</p>
                ) : (
                  <ul className="list-group">
                    {carrito.map((item) => (
                      <li
                        key={item.idProducto}
                        className="list-group-item d-flex justify-content-between align-items-center flex-column flex-md-row"
                      >
                        <div>
                          <strong>{item.producto}</strong>
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => modificarCantidad(item.idProducto, -1)}
                            >
                              -
                            </button>
                            <span>{item.cantidad}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => modificarCantidad(item.idProducto, 1)}
                            >
                              +
                            </button>
                            <button
                              className="btn btn-sm btn-danger ms-2"
                              onClick={() => eliminarProductoCarrito(item.idProducto)}
                            >
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
                <button
                  className="btn btn-success w-100 mt-2"
                  onClick={() => setModalPagoOpen(true)}
                >
                  <i className="bi bi-credit-card me-1"></i> Finalizar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalPagoOpen && (
        <MetodoPago
          total={total}
          cliente={cliente}
          onClose={() => {
            setModalPagoOpen(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
