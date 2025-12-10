import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash } from "react-icons/fa";
import MetodoPago from "../components/MetodoPago";
import Swal from "sweetalert2";
import LoaderConGIF from "../components/LoaderConGIF";

// Asegúrate de que API apunte a tu backend en Render
const API = "https://backend-lautaros-a1gx.onrender.com";

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
  const [codigoIzipay, setCodigoIzipay] = useState("");

  // =================== CARGA DE CATEGORÍAS Y PRODUCTOS ===================
  useEffect(() => {
    axios.get(`${API}/api/categorias`).then(res => setCategorias(res.data)).catch(err => console.error(err));
    axios.get(`${API}/api/productos`).then(res => setProductos(res.data)).catch(err => console.error(err));
  }, []);

  // =================== CARRITO ===================
  const agregarAlCarrito = (producto) => {
    const exist = carrito.find(p => p.idProducto === producto.idProducto);
    if (exist) {
      setCarrito(carrito.map(p => p.idProducto === producto.idProducto ? { ...p, cantidad: p.cantidad + 1 } : p));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (id, cantidad) => {
    setCarrito(
      carrito.map(item => item.idProducto === id ? { ...item, cantidad: item.cantidad + cantidad } : item)
        .filter(item => item.cantidad > 0)
    );
  };

  const quitarDelCarrito = (id) => setCarrito(carrito.filter(item => item.idProducto !== id));

  const total = carrito.reduce((acc, item) => acc + item.precioVenta * item.cantidad, 0);

  // =================== FINALIZAR VENTA ===================
  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      return Swal.fire("Error", "El carrito está vacío", "error");
    }

    const totalVenta = parseFloat(total.toFixed(2));
    const monto = parseFloat(montoPagado) || totalVenta;
    const vueltoCalculado = monto - totalVenta;

    // Creamos los detalles correctamente (sin stock ni campos repetidos)
    const detalles = carrito.map(item => ({
      producto: { idProducto: item.idProducto },
      cantidad: item.cantidad,
      subtotal: parseFloat((item.precioVenta * item.cantidad).toFixed(2)),
      metodoPago: metodoPago,
      montoPagado: monto,
      vuelto: vueltoCalculado,
      codigoIzipay: metodoPago === "IZIPAY" ? codigoIzipay : null,
      numeroTarjeta: metodoPago === "IZIPAY" ? ultimos4 : null
    }));

    const cliente = {
      nombre: nombreCliente.trim() || "CLIENTE VARIOS",
      dni: documentoCliente.trim() || "00000000"
    };

    const ventaRequest = {
      total: totalVenta,
      montoPagado: monto,
      vuelto: vueltoCalculado,
      metodoPago,
      codigoIzipay: metodoPago === "IZIPAY" ? codigoIzipay : null,
      numeroTarjeta: metodoPago === "IZIPAY" ? ultimos4 : null,
      cliente,
      detalles,
      caja: { idCaja: 1 }
    };

    console.log("payload venta:", JSON.stringify(ventaRequest, null, 2));

    try {
      await axios.post(`${API}/api/ventas/registrar`, ventaRequest);
      Swal.fire("Éxito", "Venta registrada correctamente", "success");

      // Reset de carrito y campos
      setCarrito([]);
      setNombreCliente("");
      setDocumentoCliente("");
      setMontoPagado(0);
      setVuelto(0);
      setUltimos4("");
      setCodigoIzipay("");
      setMetodoPago("EFECTIVO");

    } catch (error) {
      console.error("Error registrando venta", error);
      Swal.fire("Error", "No se pudo registrar la venta", "error");
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.producto.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoriaSeleccionada === "" || p.categoria?.nombreCategoria === categoriaSeleccionada)
  );

  return (
    <div className="container-fluid" style={{ backgroundColor: "white" }}>
      <div className="row p-3">
        {/* COLUMNA PRODUCTOS */}
        <div className="col-md-8 border-end" style={{ height: "100vh", overflowY: "auto" }}>
          <h4 className="fw-bold text-danger mb-3">Gestión de Ventas</h4>

          <div className="row mb-3">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Nombre del cliente" value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Documento" value={documentoCliente} onChange={e => setDocumentoCliente(e.target.value)} />
            </div>
            <div className="col-md-4">
              <select className="form-select" value={categoriaSeleccionada} onChange={e => setCategoriaSeleccionada(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categorias.map(cat => <option key={cat.idCategoria} value={cat.nombreCategoria}>{cat.nombreCategoria}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Buscar productos..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>

          <LoaderConGIF loading={productos.length === 0}>
            <div className="row">
              {productosFiltrados.map(prod => (
                <div key={prod.idProducto} className="col-md-4 mb-3">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`${API}${prod.imagen}`}
                      className="card-img-top"
                      alt={prod.producto}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h6 className="fw-bold">{prod.producto}</h6>
                      <p className="text-muted">{prod.descripcion}</p>
                      <p className="fw-bold text-danger">
                        S/ {prod.precioVenta.toFixed(2)}
                      </p>
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
                <p className="text-center mt-4 text-muted">
                  No hay productos que coincidan.
                </p>
              )}
            </div>
          </LoaderConGIF>
        </div>

        {/* COLUMNA CARRITO */}
        <div className="col-md-4">
          <h4 className="fw-bold text-danger mb-3">Carrito</h4>

          <div style={{ height: "300px", overflowY: "auto", border: "1px solid #dee2e6", padding: "10px" }}>
            {carrito.map(item => (
              <div key={item.idProducto} className="d-flex align-items-center border-bottom py-2">
                <span className="fw-bold flex-grow-1">{item.producto}</span>
                <div className="d-flex align-items-center me-3">
                  <button className="btn btn-outline-danger btn-sm" onClick={() => cambiarCantidad(item.idProducto, -1)}>-</button>
                  <span className="mx-2 fw-bold">{item.cantidad}</span>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => cambiarCantidad(item.idProducto, 1)}>+</button>
                </div>
                <span className="fw-bold me-3">S/ {(item.precioVenta * item.cantidad).toFixed(2)}</span>
                <button className="btn btn-sm text-danger" onClick={() => quitarDelCarrito(item.idProducto)}><FaTrash /></button>
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

          <button className="btn btn-danger w-100 mt-3 p-3 fw-bold" onClick={finalizarVenta}>
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
}
