import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import userData from "../data/usuario";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === userData.usuario && password === userData.contraseña) {
      setError("");
      setUsuario(userData);
      navigate("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div
  className="d-flex align-items-center justify-content-center vh-100"
  style={{
    background: "linear-gradient(825deg, white, red)",
  }}
>
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Encabezado */}
        <div className="text-center mb-4">
          <i
            className="bi bi-lock-fill text-danger"
            style={{ fontSize: "2.5rem" }}
          ></i>
          <h3 className="mt-2 fw-bold text-dark">Bienvenido</h3>
          <p className="text-muted mb-0">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Usuario */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-person-fill text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-key-fill text-secondary"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control border-start-0"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          {/* Botón */}
          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-danger fw-semibold">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Iniciar sesión
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger mt-3 text-center py-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}