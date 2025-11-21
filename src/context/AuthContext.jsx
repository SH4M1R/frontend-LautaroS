import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsuario(res.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, token) => {
    setUsuario(userData);
    localStorage.setItem("usuario", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
