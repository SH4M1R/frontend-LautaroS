import React from "react";
import { STATES } from "../store/schema";

export default function SalesFilters({ q, setQ, estado, setEstado, desde, setDesde, hasta, setHasta, ordenar, setOrdenar }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="filters">
        <input placeholder="Buscar por cliente o ID…" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={estado} onChange={e=>setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={desde} onChange={e=>setDesde(e.target.value)} />
        <input type="date" value={hasta} onChange={e=>setHasta(e.target.value)} />
        <select value={ordenar} onChange={e=>setOrdenar(e.target.value)}>
          <option value="recientes">Más recientes</option>
          <option value="montoDesc">Monto ↓</option>
          <option value="montoAsc">Monto ↑</option>
        </select>
      </div>
    </div>
  );
}
