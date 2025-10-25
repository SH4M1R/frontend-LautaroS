import React from "react";

export default function CardProducto({ producto, onEdit, onDelete, onToggleEstado }) {
  const imagenURL = producto.foto
    ? `http://localhost:9000/uploads/${producto.foto}`
    : "https://via.placeholder.com/150";

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={imagenURL}
        className="card-img-top"
        alt={producto.producto}
        style={{ maxHeight: "150px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{producto.producto}</h5>
        <p className="card-text">{producto.descripcion || "Sin descripción"}</p>
        <p className="card-text fw-bold">S/ {producto.precioVenta ?? "0.00"}</p>
        <p>Categoría: {producto.categoria?.nombreCategoria || "—"}</p>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <button
            className={`btn btn-sm ${producto.estado ? "btn-success" : "btn-secondary"}`}
            onClick={() => onToggleEstado(producto)}
          >
            {producto.estado ? "Disponible" : "No disponible"}
          </button>

          <div>
            <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(producto)}>Editar</button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(producto.idProducto)}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
