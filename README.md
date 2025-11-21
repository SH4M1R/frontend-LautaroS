Front - Intranet sistema de ventas Restaurante
# Intranet Sistema de Ventas Restaurante
**Repositorio:** backend‑LautaroS  
**Descripción breve:**  
Sistema backend desarrollado en Java (Spring Boot) para la gestión de ventas, clientes, productos y usuarios (roles Administrador / Vendedor) de un restaurante.

---

## Tabla de contenidos
1. [Características](#características)  
2. [Tecnologías utilizadas](#tecnologías-utilizadas)  
3. [Instalación y configuración](#instalación-y-configuración)  
4. [Estructura del proyecto](#estructura-del-proyecto)  
5. [Funcionalidades principales](#funcionalidades-principales)  
6. [Cómo contribuir](#cómo-contribuir)  
7. [Licencia](#licencia)  
8. [Contacto](#contacto)  

---

## Características
- Autenticación de usuarios con roles: Administrador y Vendedor.  
- CRUD de productos (gestión total de catálogo).  
- Registro de ventas asociadas a usuarios autenticados y clientes (o “Cliente Varios”).  
- Detalle de venta incluye: usuario, cliente, productos seleccionados, subtotal, total, cantidad de productos, fecha, método de pago, monto pagado, vuelto, código Izipay y número de tarjeta.  
- Actualización automática de stock al registrar venta.  
- Dashboard con métricas: número de ventas por mes y suma del total de ventas por mes.  
- Generación de boleta tipo ticket en formato PDF.  
- Validaciones: cliente ya registrado o nuevo, buscador de clientes, validación de DNI (8 dígitos), integración con métodos de pago (efectivo, Yape, Izipay).  
- Interfaz frontend desarrollada con Thymeleaf (y/o Angular/React como mencionado) comunicándose vía API REST.

---

## Tecnologías utilizadas
- **Backend:** Java 21, Spring Boot, Spring Security, Spring Data JPA, MySQL.  
- **Frontend:** Thymeleaf (como motor de plantillas); opcionalmente Angular o React para vistas modernas.  
- **Base de datos:** MySQL (o MariaDB).  
- **Build / Gestión de dependencias:** Maven (pom.xml).  
- **Herramientas adicionales:** Visual Studio Code / IntelliJ IDEA, Postman para testing de APIs, XAMPP para MySQL local.

---

## Instalación y configuración
1. Clona el repositorio:  
   ```bash
   git clone https://github.com/SH4M1R/backend-LautaroS.git
   cd backend-LautaroS
Configura la base de datos MySQL:

Crea una base de datos (por ejemplo ventas_restaurante).

En src/main/resources/application.properties o application.yml, ajusta:

properties
Copiar código
spring.datasource.url=jdbc:mysql://localhost:3306/ventas_restaurante?useSSL=false&serverTimezone=UTC
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update  # o validate, según tu política
Ejecuta la aplicación:

bash
Copiar código
mvn spring-boot:run
o

bash
Copiar código
./mvnw spring-boot:run
Verifica: entra al navegador o Postman en http://localhost:8080 (u otro puerto configurado).

(Opcional) Conecta el frontend: si tienes un módulo Thymeleaf o un frontend separado (Angular/React), asegúrate de que apunte al backend vía URL de la API.

Estructura del proyecto
powershell
Copiar código
backend‑LautaroS/
|– .mvn/
|– src/
|   |– main/
|       |– java/com/tuempresa/ventas/
|           |– controller/
|           |– model/
|           |– repository/
|           |– service/
|           |– security/
|           |– config/
|       |– resources/
|           |– application.properties
|           |– static/ (assets del frontend si aplica)
|           |– templates/ (Thymeleaf vistas)
|– pom.xml
|– mvnw / mvnw.cmd
|– .gitignore
Funcionalidades principales
Gestión de Usuarios: Crear, editar, eliminar usuarios; asignar rol (Administrador o Vendedor).

Gestión de Productos: Alta, baja, modificación de productos; gestión de stock.

Gestión de Clientes: Búsqueda de cliente por DNI; si no existe, registro; evitar duplicados.

Proceso de Venta:

Selección de cliente y productos.

Cálculo automático de subtotal, total, cantidad de productos.

Selección de método de pago (efectivo, Yape, Izipay).

Registro de monto pagado, cálculo de vuelto, registro de código Izipay o número de tarjeta si aplica.

Vinculación de la venta al usuario autenticado que la realiza.

Actualización automática del stock de productos vendidos.

Generación de boleta tipo ticket en PDF.

Dashboard: Resumen gráfico (o tabla) de número de ventas por mes y suma total de ventas por mes.

Seguridad: Rutas protegidas, roles y permisos, bcrypt para contraseñas.

Cómo contribuir
Haz un fork del repositorio.

Crea una branch para tu feature o bugfix:

bash
Copiar código
git checkout -b feature/nombre-de-tu-feature
Haz tus cambios, añade tests si aplica, asegúrate de que todo compile correctamente.

Haz commit de tus cambios:

bash
Copiar código
git commit -m "Añade: descripción de la mejora"
Haz push a tu fork y abre un Pull Request hacia este repositorio principal.

Asegúrate de actualizar la documentación si tu contribución lo requiere.

