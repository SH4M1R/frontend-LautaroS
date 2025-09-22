import React, { useEffect, useMemo, useState } from "react";
import "../ventas/ventas.css";
import SalesStats from "../ventas/components/SalesStats";
import SalesFilters from "../ventas/components/SalesFilters";
import SalesForm from "../ventas/components/SalesForm";
import SalesTable from "../ventas/components/SalesTable";
import { readAll, upsert, removeById } from "../ventas/store/storage";
import { seedVentas } from "../ventas/seed";

export default function Ventas() {
  useEffect(()=>{ seedVentas(); setData(readAll()); },[]);
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);

  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [ordenar, setOrdenar] = useState("recientes");

  const handleSubmit = (venta) => {
    upsert({ ...venta, fechaISO: new Date().toISOString() });
    setData(readAll());
    setEditing(null);
  };
  const handleDelete = (id) => { removeById(id); setData(readAll()); };

  const rows = useMemo(()=>{
    let list = [...data];
    if(q){
      const qc = q.toLowerCase();
      list = list.filter(v => v.id.toLowerCase().includes(qc) || v.cliente.toLowerCase().includes(qc));
    }
    if(estado) list = list.filter(v => v.estado === estado);
    if(desde) list = list.filter(v => v.fechaISO.slice(0,10) >= desde);
    if(hasta) list = list.filter(v => v.fechaISO.slice(0,10) <= hasta);

    if(ordenar==="montoDesc") list.sort((a,b)=>b.total-a.total);
    else if(ordenar==="montoAsc") list.sort((a,b)=>a.total-b.total);
    else list.sort((a,b)=>new Date(b.fechaISO)-new Date(a.fechaISO));

    return list;
  },[data,q,estado,desde,hasta,ordenar]);

  const total = useMemo(()=>rows.reduce((s,v)=>s+v.total,0),[rows]);
  const pedidos = useMemo(()=>rows.filter(v=>v.estado!=="Cancelado").length,[rows]);
  const tickets = rows.length;
  const clientes = useMemo(()=>new Set(rows.map(v=>v.cliente)).size,[rows]);

  return (
    <div className="page">
      <div className="header">
        <h1 className="title">Ventas</h1>
        <button className="btn primary" onClick={()=>setEditing({})}>Nueva venta</button>
      </div>

      <SalesStats total={total} pedidos={pedidos} tickets={tickets} clientes={clientes} />

      {editing && (
        <SalesForm initial={editing.id ? editing : undefined}
                   onSubmit={handleSubmit}
                   onCancel={()=>setEditing(null)} />
      )}

      <SalesFilters q={q} setQ={setQ} estado={estado} setEstado={setEstado}
                    desde={desde} setDesde={setDesde}
                    hasta={hasta} setHasta={setHasta}
                    ordenar={ordenar} setOrdenar={setOrdenar} />

      <SalesTable rows={rows} onEdit={(v)=>setEditing(v)} onDelete={handleDelete} />
    </div>
  );
}
