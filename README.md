## Proyecto MERN - Sistema de Gestión de Inventario y Ventas  

Este proyecto es una solución digital diseñada para gestionar la venta de helados y resolver el problema del administrador de heladeros de las tres playas de Encarnación, quien anteriormente utilizaba notas físicas para registrar las transacciones.  

## Características  

- **Centralización del Inventario:** Control digital en tiempo real del inventario de helados.  
- **Automatización del Registro de Ventas:** Elimina el uso de notas físicas y reduce errores humanos.  
- **Gestión de Notas:**  
  - Crear notas con un catálogo de productos.  
  - Recargar el catálogo de una nota activa.  
  - Finalizar notas, mostrando el monto a cobrar por vendedor/heladero.  
  - Registro detallado de notas finalizadas, incluyendo acceso a su historial y facturas.  
- **Generación Automática de Reportes y Facturas:** Simplifica el cálculo de ganancias y costos.  
- **Sistema de Roles:**  
  - **Administrador:** Acceso total, incluida la gestión de usuarios y eliminación de datos.  
  - **Usuario:** Acceso general, sin permisos de eliminación permanente ni gestión de usuarios.  
  - **Supervisor:** Acceso limitado para visualizar notas finalizadas y sus detalles.  
- **Seguridad:**  
  - Autenticación mediante JSON Web Tokens (JWT).  
  - Contraseñas encriptadas con bcryptjs.  

## Tecnologías y Bibliotecas Utilizadas  

### **Backend**  
- **Node.js:** Entorno de ejecución del servidor.  
- **Express.js:** Framework para crear la API RESTful.  
- **MongoDB:** Base de datos NoSQL para gestionar datos de usuarios, inventarios y transacciones.  

### **Frontend**  
- **React:** Biblioteca para construir una interfaz interactiva y dinámica.  
- **Material UI:** Componentes estilizados y consistentes para el diseño.  
- **React Hook Form:** Biblioteca para la gestión de formularios.  

### **Herramientas Adicionales**  
- **AgGrid:** Visualización y manipulación de datos en tablas interactivas.  
- **SweetAlert2:** Alertas y notificaciones estilizadas.  
- **JWT:** Autenticación y autorización seguras.  
- **bcryptjs:** Encriptación de contraseñas.  
- **GitHub:** Gestión de versiones y colaboración.  
- **Trello:** Organización y planificación del desarrollo.  
- **Zoom:** Coordinación del equipo mediante reuniones.  

## Instalación  

### Requisitos Previos  
- Tener instalados:  
  - [Node.js](https://nodejs.org/)  
  - [MongoDB](https://www.mongodb.com/try/download/community) (o usar una base de datos en la nube).  

## Configurar Variables de Entorno  

Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:  

```env
PORT=5000  
MONGO_URI=tu_uri_de_mongo  
JWT_SECRET=tu_secreto_jwt  

# Variables para el administrador predeterminado
ADMIN_EMAIL=[correo_del_administrador]  
ADMIN_PASSWORD=[contraseña_del_administrador]  
ADMIN_USERNAME=[nombre_del_administrador] 
