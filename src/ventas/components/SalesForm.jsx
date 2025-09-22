import React, { useEffect, useState } from "react";
import { STATES } from "../store/schema";
import { today } from "../utils/dates";

const platos = ["Lomo Saltado","Ceviche","Ají de Gallina","Pollo a la Brasa","Arroz Chaufa"];

export default function SalesForm({ initial, onSubmit, onCancel }) {
  const [f, setF] = useState(initial || {
    id: `V-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
    fechaISO: new Date().toISOString(),
    cliente: "", plato: platos[0], cantidad: 1, precioUnit: 0, estado: "Pendiente",
  });
  useEffect(()=>{ if(initial) setF(initial); },[initial]);
  const ch = (k,v)=>setF(s=>({...s,[k]:v}));

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="filters" style={{ gridTemplateColumns: "1fr 1fr 1fr .6fr .6fr .6fr" }}>
        <input placeholder="Cliente" value={f.cliente} onChange={e=>ch("cliente",e.target.value)} />
        <select value={f.plato} onChange={e=>ch("plato",e.target.value)}>{platos.map(p=><option key={p}>{p}</option>)}</select>
        <input type="date" value={today()} disabled />
        <input type="number" min="1" value={f.cantidad} onChange={e=>ch("cantidad",e.target.value)} />
        <input type="number" step="0.1" value={f.precioUnit} onChange={e=>ch("precioUnit",e.target.value)} />
        <select value={f.estado} onChange={e=>ch("estado",e.target.value)}>{STATES.map(s=><option key={s}>{s}</option>)}</select>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button className="btn primary" onClick={()=>onSubmit(f)}>Guardar</button>
        {onCancel && <button className="btn" onClick={onCancel}>Cancelar</button>}
      </div>
    </div>
  );
}
