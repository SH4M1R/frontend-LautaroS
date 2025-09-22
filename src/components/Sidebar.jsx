import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { usuario } = useAuth();

  return (
    <aside
      className="
        d-flex flex-column p-3 text-white 
        bg-dark vh-100 position-fixed top-0 start-0 overflow-auto
      "
      style={{ width: "240px" }}
    >
      {/* Título */}
      <div className="d-flex align-items-center justify-content-center mb-4">
        <img
          src="/LogoLautaro.png"
          alt="Logo LautaroS"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <h2 className="fs-5 fw-bold mb-0">Restaurante Lautaro´S</h2>
      </div>

      {/* Usuario logueado */}
      {usuario && (
        <div className="text-center mb-4">
          <p className="mb-1 fw-bold">
            <i className="bi bi-person-circle me-2"></i>
            {usuario.nombre}
          </p>
        </div>
      )}

      {/* Navegación */}
      <nav className="nav flex-column gap-2">
        {/* General */}
        <p className="text-uppercase text-secondary small fw-bold mt-2 mb-1">
          General
        </p>
        <Link to="/dashboard" className="nav-link text-white fw-semibold">
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </Link>
        <Link to="/arqueo-caja" className="nav-link text-white fw-semibold">
          <i className="bi bi-cash-coin me-2"></i> Arqueo de Caja
        </Link>
        <Link to="/ventas" className="nav-link text-white fw-semibold">
          <i className="bi bi-cart-fill me-2"></i> Ventas
        </Link>
        <Link to="/reservas" className="nav-link text-white fw-semibold">
          <i className="bi bi-calendar-check me-2"></i> Reservas
        </Link>

        {/* Administración */}
        <p className="text-uppercase text-secondary small fw-bold mt-3 mb-1">
          Administración
        </p>
        <Link to="/usuarios" className="nav-link text-white fw-semibold">
          <i className="bi bi-people-fill me-2"></i> Gestión de Usuarios
        </Link>
        <Link to="/menu" className="nav-link text-white fw-semibold">
          <i className="bi bi-list-ul me-2"></i> Gestión de Menú
        </Link>
        <Link to="/promociones" className="nav-link text-white fw-semibold">
          <i className="bi bi-gift-fill me-2"></i> Promociones
        </Link>

        {/* Análisis / Configuración */}
        <p className="text-uppercase text-secondary small fw-bold mt-3 mb-1">
          Análisis & Configuración
        </p>
        <Link to="/reportes" className="nav-link text-white fw-semibold">
          <i className="bi bi-bar-chart-line-fill me-2"></i> Reportes
        </Link>
        <Link to="/configuracion" className="nav-link text-white fw-semibold">
          <i className="bi bi-gear-fill me-2"></i> Configuración del Restaurante
        </Link>
      </nav>

      {/* Cerrar Sesión */}
      <div className="mt-auto">
        <Link to="/login" className="nav-link text-warning fw-bold">
          <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
}
