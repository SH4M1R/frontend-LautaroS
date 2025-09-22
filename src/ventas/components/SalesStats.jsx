import React from "react";
import { S } from "../utils/money";

export default function SalesStats({ total, pedidos, tickets, clientes }) {
  return (
    <div className="grid4">
      <div className="card"><div className="kpiTitle">Ventas Hoy</div><div className="kpiValue">{S(total)}</div></div>
      <div className="card"><div className="kpiTitle">Pedidos Activos</div><div className="kpiValue">{pedidos}</div></div>
      <div className="card"><div className="kpiTitle">Tickets</div><div className="kpiValue">{tickets}</div></div>
      <div className="card"><div className="kpiTitle">Clientes</div><div className="kpiValue">{clientes}</div></div>
    </div>
  );
}
