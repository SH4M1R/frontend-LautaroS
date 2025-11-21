import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowedRoles }) {
  const { usuario } = useAuth();

  if (!usuario) {
    // No está logueado → redirige a login
    return <Navigate to="/login" replace />;
  }

  // Obtener el rol real del usuario
  const userRole = typeof usuario.rol === "string" 
    ? usuario.rol 
    : usuario.rol?.rol; // si es objeto, tomar el campo "rol"

  if (!userRole || !allowedRoles.includes(userRole)) {
    // No tiene permiso → redirige al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}