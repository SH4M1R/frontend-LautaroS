// src/components/OrdersTable.jsx
import React from "react";

const OrdersTable = ({ pedidos, setPedidos }) => {
  const eliminarPedido = (id) => {
    setPedidos(pedidos.filter((pedido) => pedido.id !== id));
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">🧾 Últimos pedidos</div>
      <div className="card-body">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Plato</th>
              <th>Monto</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.cliente}</td>
                <td>{p.plato}</td>
                <td>S/ {p.monto}</td>
                <td>{p.estado}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarPedido(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay pedidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
