import React, { createContext, useState, useEffect } from "react";

// Crear contexto
export const MenuContext = createContext();

// Proveedor de datos
export const MenuProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("productos");
    if (stored) {
      setProductos(JSON.parse(stored));
    } else {
      // Si no hay nada, carga los iniciales
      const iniciales = [
        { id: 1, nombre: "Lomo Saltado", descripcion: "Clásico plato peruano de carne salteada con cebolla, tomate y papas fritas.", precio: 28.0, categoria: "Plato de Fondo", img: "https://images.pexels.com/photos/28503582/pexels-photo-28503582.jpeg", agotado: false },
        { id: 2, nombre: "Ceviche Clásico", descripcion: "Pesca del día marinada en limón, con cebolla morada, camote y choclo.", precio: 25.0, categoria: "Entrada", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbR3IATt46jQws-6HXvDqSMFoGX9zmUagJGQ&s", agotado: false },
        { id: 3, nombre: "Ají de Gallina", descripcion: "Pollo deshilachado en cremosa salsa de ají amarillo con pan y leche.", precio: 22.0, categoria: "Plato de Fondo", img: "https://buenazo.cronosmedia.glr.pe/original/2023/06/26/6499bf204fb28f54f91a9289.png", agotado: false },
        { id: 4, nombre: "Causa Limeña", descripcion: "Capas de papa amarilla con relleno de pollo y palta.", precio: 18.0, categoria: "Entrada", img: "https://d2j9trpqxd6hrn.cloudfront.net/uploads/recipe/main_image/889/causa_limen%CC%83a.webp", agotado: false },
        { id: 5, nombre: "Anticuchos", descripcion: "Brochetas de corazón de res marinadas y asadas a la parrilla.", precio: 20.0, categoria: "Entrada", img: "https://comidasperuanas.net/wp-content/uploads/2015/06/Anticuchos-de-Coraz%C3%B3n-Peruanos.jpg", agotado: false },
        { id: 6, nombre: "Arroz con Mariscos", descripcion: "Arroz salteado con mariscos frescos, al estilo peruano.", precio: 26.0, categoria: "Plato de Fondo", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbzeOl5TUjUNam6xG0ovGbklmiEWNX3q00eQ&s", agotado: false },
        { id: 7, nombre: "Suspiro Limeño", descripcion: "Postre peruano con manjar blanco y merengue al oporto.", precio: 12.0, categoria: "Postre", img: "https://www.recetasnestle.com.pe/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/f9174d14214c9315a3234a3581617e3f.jpg?itok=B5me4xUd", agotado: false },
        { id: 8, nombre: "Mazamorra Morada", descripcion: "Postre tradicional hecho a base de maíz morado, frutas y especias.", precio: 10.0, categoria: "Postre", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2jp1tXvsJ5-engpODTozvyAjvyKQpxmmR2A&s", agotado: false },
        { id: 9, nombre: "Chicha Morada", descripcion: "Bebida refrescante hecha con maíz morado, piña y canela.", precio: 8.0, categoria: "Bebida", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6P1bpkgGU-ULZIQg3CwMIPuq9U4fyHAoaBQ&s", agotado: false },
      ];
      setProductos(iniciales);
      localStorage.setItem("productos", JSON.stringify(iniciales));
    }
  }, []);

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    if (productos.length > 0) {
      localStorage.setItem("productos", JSON.stringify(productos));
    }
  }, [productos]);

  // Métodos
  const agregarProducto = (producto) => {
    setProductos([...productos, { ...producto, id: Date.now(), agotado: false }]);
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const toggleAgotado = (id) => {
    setProductos(
      productos.map((p) =>
        p.id === id ? { ...p, agotado: !p.agotado } : p
      )
    );
  };

  return (
    <MenuContext.Provider value={{ productos, agregarProducto, eliminarProducto, toggleAgotado }}>
      {children}
    </MenuContext.Provider>
  );
};
