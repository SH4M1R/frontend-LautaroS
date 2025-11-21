import React, { createContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;
export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Intentamos cargar desde backend
    fetch(`${API}/api/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => {
        // Fallback a localStorage si falla
        const stored = localStorage.getItem("productos");
        if (stored) setProductos(JSON.parse(stored));
      });
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      localStorage.setItem("productos", JSON.stringify(productos));
    }
  }, [productos]);

  const agregarProducto = (producto) => {
    setProductos([...productos, { ...producto, idProducto: Date.now() }]);
  };

  const eliminarProducto = (idProducto) => {
    setProductos(productos.filter((p) => p.idProducto !== idProducto));
  };

  const toggleAgotado = (idProducto) => {
    setProductos(
      productos.map((p) =>
        p.idProducto === idProducto ? { ...p, estado: !p.estado } : p
      )
    );
  };

  return (
    <MenuContext.Provider value={{ productos, agregarProducto, eliminarProducto, toggleAgotado }}>
      {children}
    </MenuContext.Provider>
  );
};
