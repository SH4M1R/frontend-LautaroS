import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Reportes from "./pages/Reportes";
import ArqueoCaja from "./pages/ArqueoCaja";
import Ventas from "./pages/Ventas";
import Empleados from "./pages/Empleados";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      {/* Sidebar solo si no estamos en la página de login */}
      {!isLoginPage && <Sidebar />}

      <main style={{ marginLeft: isLoginPage ? "0" : "250px", padding: "10px" }}>
        <Routes>
          {/* Ruta de login */}
          <Route path="/login" element={<Login />} />

          {/* Todas las rutas protegidas por sesión */}
          <Route element={<PrivateRoute />}>
            {/* Dashboard accesible a todos */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Rutas accesibles para VENDEDOR y ADMINISTRADOR */}
            <Route element={<RoleRoute allowedRoles={["VENDEDOR", "ADMINISTRADOR"]} />}>
              <Route path="/menu" element={<Menu />} />
              <Route path="/ventas" element={<Ventas />} />
            </Route>

            {/* Rutas accesibles solo para ADMINISTRADOR */}
            <Route element={<RoleRoute allowedRoles={["ADMINISTRADOR"]} />}>
              <Route path="/empleados" element={<Empleados />} />
              <Route path="/ArqueoCaja" element={<ArqueoCaja />} />
              <Route path="/reportes" element={<Reportes />} />
            </Route>
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
