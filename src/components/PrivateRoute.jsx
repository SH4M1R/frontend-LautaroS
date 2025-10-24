import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { usuario } = useAuth();

  // Si no hay usuario, redirige a login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderiza las rutas hijas
  return <Outlet />;
}
