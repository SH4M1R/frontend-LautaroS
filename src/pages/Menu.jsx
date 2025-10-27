import React, { useEffect, useState } from "react";
import CardProducto from "../components/CardProducto";
import ModalProducto from "../components/ModalProducto";
import ModalCategoria from "../components/ModalCategoria";

export default function Menu() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isProductoModalOpen, setProductoModalOpen] = useState(false);
  const [isCategoriaModalOpen, setCategoriaModalOpen] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await fetch(`http://localhost:9000/api/productos/${id}`, { method: "DELETE" });
      fetchProductos();
    }
  };

  const handleSaveProducto = async (producto) => {
    try {
      const formData = new FormData();
      formData.append("producto", producto.producto);
      formData.append("descripcion", producto.descripcion);
      formData.append("precioVenta", producto.precioVenta);
      formData.append("estado", producto.estado);
      formData.append("idCategoria", producto.categoria?.idCategoria || "");
      if (producto.imagen) formData.append("imagen", producto.imagen);

      let res;
      if (producto.idProducto) {
        res = await fetch(`http://localhost:9000/api/productos/actualizar-imagen/${producto.idProducto}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("http://localhost:9000/api/productos/con-imagen", {
          method: "POST",
          body: formData,
        });
      }

      await res.json();
      fetchProductos();
      setProductoModalOpen(false);
      setProductoEdit(null);
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al guardar el producto.");
    }
  };

  const handleEdit = (producto) => {
    setProductoEdit(producto);
    setProductoModalOpen(true);
  };

  const handleToggleEstado = async (prod) => {
    try {
      await fetch(`http://localhost:9000/api/productos/${prod.idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...prod, estado: !prod.estado }),
      });
      fetchProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const productosFiltrados = productos.filter(
    (prod) =>
      prod.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      (prod.descripcion && prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 gap-3">
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <i className="bi bi-egg-fried fs-2 text-warning"></i>
          <h2 className="mb-0">Menú Lautaro´s</h2>
        </div>

        <div className="flex-grow-1 mx-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-success d-flex align-items-center gap-1" onClick={() => setCategoriaModalOpen(true)}>
            <i className="bi bi-plus-lg"></i> Categoria
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-1" onClick={() => setProductoModalOpen(true)}>
            <i className="bi bi-plus-lg"></i> Producto
          </button>
        </div>
      </div>

      {categorias.map((cat) => {
        const productosCategoria = productosFiltrados.filter(
          (prod) => prod.categoria?.idCategoria === cat.idCategoria
        );

        return (
          <div key={cat.idCategoria} className="mb-5">
            <h4 className="mb-3">{cat.nombreCategoria}</h4>
            {productosCategoria.length > 0 ? (
              <div className="row">
                {productosCategoria.map((prod) => (
                  <div key={prod.idProducto} className="col-md-4 mb-3">
                    <CardProducto
                      producto={prod}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleEstado={handleToggleEstado}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No hay productos en esta categoría</p>
            )}
          </div>
        );
      })}

      <ModalProducto
        isOpen={isProductoModalOpen}
        onClose={() => {
          setProductoModalOpen(false);
          setProductoEdit(null);
        }}
        onSave={handleSaveProducto}
        productoEditado={productoEdit}
        categorias={categorias}
      />

      <ModalCategoria
        isOpen={isCategoriaModalOpen}
        onClose={() => setCategoriaModalOpen(false)}
        onSave={(cat) => setCategorias((prev) => [...prev, cat])}
      />
    </div>
  );
}