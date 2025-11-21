# Frontend — Intranet Sistema de Ventas Restaurante

**Descripción breve**  
Interfaz de usuario frontend para el sistema de ventas de restaurante. Permite que los vendedores y administradores interactúen con el backend (Spring Boot) para gestionar productos, ventas, clientes y usuarios.

---

## Tabla de contenidos

1. [Características](#características)  
2. [Tecnologías](#tecnologías)  
3. [Instalación](#instalación)  
4. [Configuración](#configuración)  
5. [Uso](#uso)  
6. [Estructura del proyecto](#estructura-del-proyecto)  
7. [Contribuir](#contribuir)  
8. [Licencia](#licencia)  
9. [Contacto](#contacto)  

---

## Características

- Pantallas para productos: ver, crear, editar, eliminar.  
- Registro de ventas: seleccionar cliente, productos, método de pago.  
- Búsqueda de clientes por DNI y registro de nuevos clientes.  
- Cálculo dinámico de totales, montos pagados y vuelto.  
- Autenticación de usuarios (vendedores/administradores).  
- Dashboard de ventas (gráficos o tablas) si aplica.  
- Interfaz amigable y responsiva para su uso en navegador.  

---

## Tecnologías

- **Frontend:** JavaScript (o TypeScript), React (o el framework que uses), Vite (según `vite.config.js`).  
- **Routing y estado:** React Router / Context API / Redux (ajusta según tu implementación).  
- **HTTP:** Axios (o fetch) para consumir la API REST del backend.  
- **Estilos:** CSS, posiblemente frameworks como Tailwind, Bootstrap u otros (depende de tu proyecto).  
- **Herramientas de construcción:** Vite, npm / yarn.

---

## Instalación

1. Clona el repositorio:  
   ```bash
   git clone https://github.com/SH4M1R/frontend‑LautaroS.git
   cd frontend‑LautaroS
Instala dependencias:

bash
Copiar código
npm install
o si usas yarn:

bash
Copiar código
yarn install
Inicia la aplicación en modo desarrollo:

bash
Copiar código
npm run dev
(o el script que hayas definido en package.json)

Abre tu navegador en http://localhost:3000 (o el puerto que definas) para ver la aplicación.

Configuración
Asegúrate de que el backend (Spring Boot) esté corriendo, por ejemplo en http://localhost:8080.

En tu configuración de llamadas HTTP (Axios, fetch, etc.), define la URL base de la API para apuntar al backend.

Si tu backend tiene CORS habilitado, valida que los orígenes estén permitidos para el dominio del frontend.

Variables de entorno: si usas .env, puedes definir, por ejemplo, VITE_API_URL=http://localhost:8080/api para configurar la base de tus peticiones.

Uso
Inicia sesión como administrador o vendedor.

Navega por el panel de productos para agregar, editar o eliminar.

Ve a la sección de ventas para crear nuevas ventas registrando cliente, seleccionando productos y método de pago.

Consulta el dashboard para ver estadísticas de ventas.

Usa la interfaz para buscar clientes por DNI o registrar nuevos.

Estructura del proyecto
php
Copiar código
frontend‑LautaroS/
├── public/                  # Archivos estáticos  
│   ├── index.html  
│   └── ...  
├── src/  
│   ├── assets/              # Imágenes, estilos, íconos  
│   ├── components/          # Componentes React  
│   ├── pages/               # Vistas / páginas  
│   ├── services/            # Lógica para llamar a la API (Axios, fetch)  
│   ├── contexts/             # Contexto o estado global  
│   ├── router/               # Configuración de rutas (React Router)  
│   └── App.jsx / App.tsx     # Punto de entrada  
├── .gitignore  
├── package.json  
├── vite.config.js            # Configuración de Vite  
└── README.md                  # Este archivo  
Contribuir
Haz un fork del repositorio.

Crea una nueva branch para tu feature o bugfix:

bash
Copiar código
git checkout -b feature/nombre-de-la-feature
Realiza tus cambios. Asegúrate de que la aplicación siga funcionando.

Haz commit de tus cambios:

bash
Copiar código
git commit -m "Añade: descripción de lo que cambiaste"
Haz push a tu fork y abre un Pull Request hacia el repositorio principal.
