import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 nuevo

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) setUsuario(JSON.parse(stored));
    setLoading(false); // ✅ después de cargar localStorage
  }, []);

  const login = (empleado) => {
    setUsuario(empleado);
    localStorage.setItem("usuario", JSON.stringify(empleado));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  if (loading) {
    return <div>Cargando...</div>; // o un spinner
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
