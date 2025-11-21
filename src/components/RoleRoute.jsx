import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowedRoles }) {
  const { usuario } = useAuth();
  const token = localStorage.getItem("token");

  if (!usuario || !token) {
    return <Navigate to="/login" replace />;
  }

  const userRole =
    typeof usuario.rol === "string"
      ? usuario.rol
      : usuario.rol?.rol;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
