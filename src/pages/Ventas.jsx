import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash } from "react-icons/fa";
import MetodoPago from "../components/MetodoPago";
import Swal from "sweetalert2";

export default function Ventas() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [documentoCliente, setDocumentoCliente] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [montoPagado, setMontoPagado] = useState(0);
  const [vuelto, setVuelto] = useState(0);
  const [ultimos4, setUltimos4] = useState("");
  const [codigoIzipay, setCodigoIzipay] = useState(0);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/categorias");
        setCategorias(res.data);
      } catch (error) {
        console.error("Error obteniendo categorías", error);
      }
    };

    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/productos");
        setProductos(res.data);
      } catch (error) {
        console.error("Error obteniendo productos", error);
      }
    };

    fetchCategorias();
    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    const exist = carrito.find((p) => p.idProducto === producto.idProducto);
    if (exist) {
      setCarrito(
        carrito.map((p) =>
          p.idProducto === producto.idProducto
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (id, cantidad) => {
    setCarrito(
      carrito
        .map((item) =>
          item.idProducto === id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const quitarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.idProducto !== id));
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precioVenta * item.cantidad,
    0
  );

  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      Swal.fire("Error", "El carrito está vacío", "error");
      return;
    }

    const detalles = carrito.map((item) => ({
      producto: { idProducto: item.idProducto },
      subtotal: item.precioVenta * item.cantidad,
      stock: item.cantidad,
      metodoPago,
      montoPagado: metodoPago === "EFECTIVO" ? montoPagado : 0,
      vuelto: metodoPago === "EFECTIVO" ? vuelto : 0,
      codigoIzipay: metodoPago === "IZIPAY" ? codigoIzipay : "",
      numeroTarjeta: metodoPago === "IZIPAY" ? ultimos4 : "",
    }));

    const request = {
      total,
      cliente: {
        nombre: nombreCliente || "CLIENTE VARIOS",
        documento: documentoCliente || 0,
      },
      detalles,
    };

    try {
      await axios.post("http://localhost:9000/api/ventas/registrar", request);
      Swal.fire("Éxito", "Venta registrada correctamente", "success");
      setCarrito([]);
      setNombreCliente("");
      setDocumentoCliente("");
      setMontoPagado(0);
      setVuelto(0);
      setUltimos4("");
      setCodigoIzipay("");
    } catch (error) {
      console.error("Error registrando venta", error);
      Swal.fire("Error", "No se pudo registrar la venta", "error");
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.producto.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoriaSeleccionada === "" || p.categoria?.nombreCategoria === categoriaSeleccionada)
  );

  return (
    <div className="container-fluid" style={{ backgroundColor: "white" }}>
      <div className="row p-3">
        <div className="col-md-8 border-end" style={{ height: "100vh", overflowY: "auto" }}>
          <h4 className="fw-bold text-danger mb-3">Gestión de Ventas</h4>

          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del cliente"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Documento"
                value={documentoCliente}
                onChange={(e) => setDocumentoCliente(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((c) => (
                  <option key={c.idCategoria} value={c.idCategoria}>
                    {c.nombreCategoria}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="row">
            {productosFiltrados.map((prod) => (
              <div key={prod.idProducto} className="col-md-4 mb-3">
                <div className="card h-100 shadow-sm">
                  <img
                    src={`http://localhost:9000${prod.imagen}`}
                    className="card-img-top"
                    alt={prod.producto}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="fw-bold">{prod.producto}</h6>
                    <p className="text-muted">{prod.descripcion}</p>
                    <p className="fw-bold text-danger">S/ {prod.precioVenta.toFixed(2)}</p>
                    <button
                      className="btn btn-danger w-100"
                      onClick={() => agregarAlCarrito(prod)}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {productosFiltrados.length === 0 && (
              <p className="text-center mt-4 text-muted">No hay productos que coincidan.</p>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <h4 className="fw-bold text-danger mb-3">Carrito</h4>

          <div
            style={{ height: "300px", overflowY: "auto", border: "1px solid #dee2e6", padding: "10px" }}
          >
            {carrito.map((item) => (
              <div key={item.idProducto} className="d-flex align-items-center border-bottom py-2">
                <span className="fw-bold flex-grow-1">{item.producto}</span>
                <div className="d-flex align-items-center me-3">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => cambiarCantidad(item.idProducto, -1)}
                  >
                    -
                  </button>
                  <span className="mx-2 fw-bold">{item.cantidad}</span>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => cambiarCantidad(item.idProducto, 1)}
                  >
                    +
                  </button>
                </div>
                <span className="fw-bold me-3">
                  S/ {(item.precioVenta * item.cantidad).toFixed(2)}
                </span>
                <button
                  className="btn btn-sm text-danger"
                  onClick={() => quitarDelCarrito(item.idProducto)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {carrito.length === 0 && <p className="text-center mt-4 text-muted">Carrito vacío</p>}
          </div>

          <MetodoPago
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            montoPagado={montoPagado}
            setMontoPagado={setMontoPagado}
            vuelto={vuelto}
            setVuelto={setVuelto}
            total={total}
            ultimos4={ultimos4}
            setUltimos4={setUltimos4}
            codigoIzipay={codigoIzipay}
            setCodigoIzipay={setCodigoIzipay}
          />

          <div className="d-flex justify-content-between mt-3 p-2 fw-bold fs-5">
            <span>Total:</span>
            <span className="text-danger">S/ {total.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-danger w-100 mt-3 p-3 fw-bold"
            onClick={finalizarVenta}
          >
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
}
