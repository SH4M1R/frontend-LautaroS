import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:9000/api/empleados/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, contrasena }), // coincide con LoginDTO
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Usuario o contraseña incorrectos.");
        return;
      }

      const data = await response.json();

      login({
        idEmpleado: data.idEmpleado,
        username: data.username,
        user: data.user,
        rol: data.rol?.rol,
      });

      navigate("/dashboard");

    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: "linear-gradient(825deg, white, red)" }}>
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "100%", maxWidth: "400px", backgroundColor: "#ffffff" }}>
        <div className="text-center mb-4">
          <i className="bi bi-lock-fill text-danger" style={{ fontSize: "2.5rem" }}></i>
          <h3 className="mt-2 fw-bold text-dark">Bienvenido</h3>
          <p className="text-muted mb-0">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-person-fill text-secondary"></i>
              </span>
              <input type="text" className="form-control border-start-0" placeholder="Ingresa tu usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-key-fill text-secondary"></i>
              </span>
              <input type={showPassword ? "text" : "password"} className="form-control border-start-0" placeholder="Ingresa tu contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
              </button>
            </div>
          </div>
          <p className="text-muted mb-0">DATOS DE LA BD PARA INICIAR SESION:</p>
          <p className="text-muted mb-0">usuario: admin // contraseña: admin123</p>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-danger fw-semibold">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Iniciar sesión
            </button>
          </div>

          {error && <div className="alert alert-danger mt-3 text-center py-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}