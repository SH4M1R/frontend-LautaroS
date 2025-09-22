import React from "react";
import { S } from "../utils/money";

const Badge = ({ estado }) => {
  const cls = estado==="Pagado" ? "badge success" : estado==="Pendiente" ? "badge warning" : "badge danger";
  return <span className={cls}>{estado}</span>;
};

export default function SalesTable({ rows, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table">
          <thead><tr>
            <th>ID</th><th>Fecha</th><th>Cliente</th><th>Plato</th><th>Cant</th><th>Total</th><th>Estado</th><th></th>
          </tr></thead>
          <tbody>
            {rows.map(v=>(
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{new Date(v.fechaISO).toLocaleString()}</td>
                <td>{v.cliente}</td>
                <td>{v.plato}</td>
                <td>{v.cantidad}</td>
                <td>{S(v.total)}</td>
                <td><Badge estado={v.estado} /></td>
                <td style={{ whiteSpace:"nowrap" }}>
                  <button className="btn sm" onClick={()=>onEdit(v)}>Editar</button>
                  <button className="btn sm" style={{ marginLeft:8 }} onClick={()=>onDelete(v.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {rows.length===0 && <tr><td colSpan="8" style={{ textAlign:"center", color:"#6b7280" }}>Sin resultados</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
