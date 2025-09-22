import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import userData from "../data/usuario";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === userData.usuario && password === userData.contraseña) {
      setError("");
      setUsuario(userData); // 👈 ahora guarda en "usuario"
      navigate("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `url("/src/assets/fondo.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "rgba(255,255,255,0.9)",
        }}
      >
        <h2 className="text-center text-dark mb-2">Bienvenido a Lautaro´S</h2>
        <p className="text-center text-muted mb-4">
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleSubmit}>
          {/* Usuario */}
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
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
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Botón */}
          <div className="d-grid">
            <button type="submit" className="btn btn-outline-dark">
              Ingresar
            </button>
          </div>

          {/* Error */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}