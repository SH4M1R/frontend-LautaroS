import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  GiftIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

function Collapsible({ open, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.maxHeight = open ? `${el.scrollHeight}px` : "0px";
  }, [open]);

  return (
    <div ref={ref} className="overflow-hidden"
      style={{
        maxHeight: open ? "500px" : "0px",
        transition: "max-height 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}

export default function Sidebar() {
  const { usuario } = useAuth();
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openAnalisis, setOpenAnalisis] = useState(false);

  return (
    <aside
      className="position-fixed top-0 start-0 vh-100 bg-dark text-light d-flex flex-column justify-content-between shadow-lg"
      style={{ width: "250px", zIndex: 1000 }} >
      {/* Logo */}
      <div className="p-3 text-center border-bottom border-secondary">
        <div className="d-flex justify-content-center align-items-center mb-2">
          <img
            src="/LogoLautaro.png"
            alt="Logo"
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
          <h5 className="fw-bold mb-0 text-danger">Restaurante Lautaro´S</h5>
        </div>
      </div>

      {/* Usuario */}
      {usuario && (
        <div className="text-center py-3 bg-secondary bg-opacity-25">
          <UserIcon
            style={{ width: "28px", color: "red", marginRight: "6px" }}
          />
          <span className="fw-semibold text-white">{usuario.nombre}</span>
        </div>
      )}

      {/* Navegación */}
      <nav className="flex-grow-1 overflow-auto px-3 py-3">
        <p className="text-uppercase text-secondary small fw-bold mb-3"> General </p>

        <Link to="/dashboard"
          className="d-flex align-items-center text-decoration-none text-light mb-3" >
          <ChartBarIcon style={{ width: "24px", marginRight: "10px", color: "red" }} /> Dashboard </Link>

        <Link to="/arqueo-caja"
          className="d-flex align-items-center text-decoration-none text-light mb-3" >
          <CurrencyDollarIcon style={{ width: "24px", marginRight: "10px", color: "red" }} /> Arqueo de Caja </Link>

        <Link to="/ventas"
          className="d-flex align-items-center text-decoration-none text-light mb-3" >
          <ShoppingCartIcon
            style={{ width: "24px", marginRight: "10px", color: "red" }} /> Ventas </Link>

        <Link to="/reservas"
          className="d-flex align-items-center text-decoration-none text-light mb-3" >
          <CalendarDaysIcon style={{ width: "24px", marginRight: "10px", color: "red" }} /> Reservas </Link>

        {/* Administración */}
        <div className="mt-4">
          <button
            onClick={() => setOpenAdmin(!openAdmin)}
            className="btn btn-sm w-100 text-start text-light d-flex justify-content-between align-items-center px-0"
            style={{ background: "none", border: "none" }} >
            <div className="d-flex align-items-center">
              <UserGroupIcon style={{ width: "24px", marginRight: "10px", color: "red" }} />
              Administración </div>
            <span>{openAdmin ? "▲" : "▼"}</span>
          </button>

          <Collapsible open={openAdmin}>
            <div className="ps-4 mt-2">
              <Link to="/usuarios"
                className="d-block text-light text-decoration-none mb-2" >
                <UserIcon style={{ width: "22px", marginRight: "8px", color: "red" }} /> Gestión de Usuarios </Link>
              <Link to="/menu"
                className="d-block text-light text-decoration-none mb-2" >
                <ClipboardDocumentListIcon style={{ width: "22px", marginRight: "8px", color: "red" }} /> Gestión de Menú </Link>
              <Link to="/promociones"
                className="d-block text-light text-decoration-none mb-2" >
                <GiftIcon style={{ width: "22px", marginRight: "8px", color: "red" }} /> Promociones </Link>
            </div>
          </Collapsible>
        </div>

        {/* Análisis y Configuración */}
        <div className="mt-3">
          <button
            onClick={() => setOpenAnalisis(!openAnalisis)}
            className="btn btn-sm w-100 text-start text-light d-flex justify-content-between align-items-center px-0"
            style={{ background: "none", border: "none" }} >
            <div className="d-flex align-items-center">
              <ChartBarIcon style={{ width: "24px", marginRight: "10px", color: "red" }} /> Análisis & Configuración </div>
            <span>{openAnalisis ? "▲" : "▼"}</span>
          </button>

          <Collapsible open={openAnalisis}>
            <div className="ps-4 mt-2">
              <Link to="/reportes"
                className="d-block text-light text-decoration-none mb-2" >
                <ChartBarIcon style={{ width: "22px", marginRight: "8px", color: "red" }} /> Reportes </Link>
              <Link to="/configuracion"
                className="d-block text-light text-decoration-none mb-2" >
                <Cog6ToothIcon style={{ width: "22px", marginRight: "8px", color: "red" }} /> Configuración del Restaurante </Link>
            </div>
          </Collapsible>
        </div>
      </nav>

      {/* Cerrar sesión */}
      <div className="p-3">
        <Link to="/login" className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold" >
          <PowerIcon style={{ width: "18px" }} /> Cerrar Sesión </Link>
      </div>
    </aside>
  );
}