import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Ventas from "./pages/Ventas";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      {/* Sidebar solo si NO estoy en login */}
      {!isLoginPage && <Sidebar />}

      <main style={{ marginLeft: isLoginPage ? "0" : "220px", padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/ventas" element={<Ventas />} />
          {/* Si quieres, podrías agregar Home en "/" */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;