import React, { useEffect, useState } from "react";
import { fetchAPI } from "../api";
import ModalProducto from "../components/ModalProducto";
import ModalCategoria from "../components/ModalCategoria";

const PAGE_SIZE = 20;

export default function Menu() {
  const API_PRODUCTS = "/api/productos";
  const API_CATEGORIES = "/api/categorias";

  const [productos, setProductos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModalProducto, setShowModalProducto] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await fetchAPI(API_CATEGORIES);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI(API_PRODUCTS);
      const all = res.data || [];

      const filtered = all.filter((p) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          (p.producto || p.Producto || "").toLowerCase().includes(q) ||
          (p.descripcion || "").toLowerCase().includes(q)
        );
      });

      const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      setTotalPages(pages);
      if (page > pages) setPage(1);

      const start = (page - 1) * PAGE_SIZE;
      setProductos(filtered.slice(start, start + PAGE_SIZE));
    } catch (err) {
      console.error("Error fetching productos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProductos(); }, [page, query]);

  const handleSaveProducto = async (productoData, imagenFile) => {
    try {
      const form = new FormData();
      form.append("producto", new Blob([JSON.stringify(productoData)], { type: "application/json" }));
      if (imagenFile) form.append("imagen", imagenFile);

      let res;
      if (productoData.idProducto) {
        res = await fetchAPI(`${API_PRODUCTS}/${productoData.idProducto}`, { method: "PUT", data: form });
      } else {
        res = await fetchAPI(API_PRODUCTS, { method: "POST", data: form });
      }

      const newProducto = res.data;

      setProductos((prev) => {
        const exists = prev.find((p) => p.idProducto === newProducto.idProducto);
        if (exists) {
          return prev.map((p) => p.idProducto === newProducto.idProducto ? newProducto : p);
        } else {
          return [newProducto, ...prev];
        }
      });

      setShowModalProducto(false);
      setEditingProducto(null);
    } catch (err) {
      console.error("Error saving producto", err);
      alert("Error al guardar el producto. Revisa la consola.");
    }
  };

  const handleSaveCategoria = async () => {
    await fetchCategories();
    setShowModalCategoria(false);
  };

  const handleDeleteProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await fetchAPI(`${API_PRODUCTS}/${id}`, { method: "DELETE" });
      await fetchProductos();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar.");
    }
  };

  const handleToggleEstado = async (producto) => {
    try {
      const updated = { ...producto, estado: !producto.estado };
      const form = new FormData();
      form.append("producto", new Blob([JSON.stringify(updated)], { type: "application/json" }));
      await fetchAPI(`${API_PRODUCTS}/${producto.idProducto}`, { method: "PUT", data: form });
      await fetchProductos();
    } catch (err) {
      console.error(err);
      alert("Error al cambiar estado.");
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-danger">Gestión de Productos</h1>
        <div className="d-flex gap-2">
          <button onClick={() => setShowModalCategoria(true)} className="btn btn-danger">Agregar Categoría</button>
          <button onClick={() => { setEditingProducto(null); setShowModalProducto(true); }} className="btn btn-danger">Agregar Producto</button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex mb-3 gap-2 align-items-center">
            <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Buscar productos..." className="form-control w-50" />
            <small className="text-muted">Resultados por página: {PAGE_SIZE}</small>
          </div>

          {loading ? (
            <div className="text-center py-5">Cargando...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-danger">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Precio Venta</th>
                    <th>Categoría</th>
                    <th>Imagen</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, idx) => (
                    <tr key={p.idProducto || idx}>
                      <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td>{p.producto || p.Producto}</td>
                      <td>{p.precioVenta || p.PrecioVenta}</td>
                      <td>{p.categoria?.nombreCategoria || "Sin categoría"}</td>
                      <td>
                        {p.imagen && <img src={`${import.meta.env.VITE_API_URL}${p.imagen}`} alt={p.producto} className="img-thumbnail" style={{ width: "50px", height: "50px", objectFit: "cover" }} />}
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" checked={!!p.estado} onChange={() => handleToggleEstado(p)} />
                          <label className="form-check-label">{p.estado ? "Activo" : "Inactivo"}</label>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger me-1" onClick={() => { setEditingProducto(p); setShowModalProducto(true); }}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProducto(p.idProducto)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModalProducto && <ModalProducto isOpen={showModalProducto} onClose={() => { setShowModalProducto(false); setEditingProducto(null); }} onSave={handleSaveProducto} categorias={categories} productoEditado={editingProducto} />}
      {showModalCategoria && <ModalCategoria isOpen={showModalCategoria} onClose={() => setShowModalCategoria(false)} onSave={handleSaveCategoria} />}
    </div>
  );
}
