import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Importación de componentes
import VendedoresList from './components/Vendedores/VendedoresList';
import VendedoresForm from './components/Vendedores/VendedoresForm';
import EditarVendedor from './components/Vendedores/VendedorEditar';
import CrearNota from './components/Notas/CrearNota';
import ListaNotasActivas from './components/Notas/ListaNotasActivas';
import NotaActiva from './components/Notas/NotaActiva';
import EditarNota from './components/Notas/EditarNota';
import RecargarCatalogo from './components/Notas/RecargarCatalogo';
import FinalizarNota from './components/Notas/FinalizarNota';
import Factura from './components/Notas/Factura';
import RegistroFinalizados from './components/Notas/RegistroFinalizados';
import DetalleNota from './components/Notas/DetalleNota';
import Navbar from './components/utils/Navbar';
import Titulo from './components/utils/Titulo';
import Login from './components/Auth/Login';
import RutaPrivada from './components/utils/RutaPrivada';
import RouteError from './components/utils/RouteError';
import ListaUsuario from './components/Usuarios/ListaUsuario';
import EditarUsuario from './components/Usuarios/EditarUsuario';
import CrearUsuario from './components/Usuarios/CrearUsuario';
import RegistroFinalizadosS from './components/Notas/Supervisores/RegistroNotas';
import DetalleNotaS from './components/Notas/Supervisores/DetalleNota';
import CrearHelado from './components/Helados/CrearHelado';
import ListaHelados from './components/Helados/ListaHelados';
import EditarHelado from './components/Helados/EditarHelado';
import ListaVendedores from './components/Vendedores/VendedoresList';
import Home from './components/Home/Home.jsx';
import EditarFinalizado from './components/Notas/EditarFinalizado.jsx';

const App = () => {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const usuarioRol = localStorage.getItem('rol');

  const verificarAutenticacion = () => {
    const token = localStorage.getItem('token');
    setEstaAutenticado(!!token);
    if (!token) {
      navegar('/login'); 
    }
  };

 
  useEffect(() => {
    verificarAutenticacion();
  }, [ubicacion.pathname]);

 
  useEffect(() => {
    if (ubicacion.pathname === '/logout' && estaAutenticado) {
      manejarCerrarSesion();
      navegar('/login'); // REDIRIGE AL LOGIN
    }
  }, [ubicacion.pathname, navegar, usuarioRol]);

  // MANEJO DEL CIERRE DE SESIÓN
  const manejarCerrarSesion = () => {
    localStorage.removeItem('token'); // ELIMINA EL TOKEN AL CERRAR SESIÓN
    setEstaAutenticado(false);
  };

  // Función para mostrar alerta si el supervisor intenta acceder a rutas no permitidas
  const urlAlert = (usuarioRol, ubicacion, navegar) => {
    const rutasPermitidasSupervisor = [
      '/',
      '/S-registro-finalizados',
      '/S-detalle-nota', // Aquí puedes ajustar si las rutas tienen parámetros
    ];

    // Verifica si el usuario es supervisor y si está en una ruta no permitida
    if (usuarioRol === 'supervisor' && !rutasPermitidasSupervisor.some(ruta => ubicacion.pathname.includes(ruta))) {
      Swal.fire({
        title: '¡Atención!',
        text: 'Estás intentando acceder a una ruta que no está permitida para tu rol. ¡Por favor, revisa tu ruta!',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      navegar('/'); 
    }
  };

  // Llamada a la función urlAlert cada vez que cambie la ruta
  useEffect(() => {
    if (usuarioRol === 'supervisor') {
      urlAlert(usuarioRol, ubicacion, navegar);
    }
  }, [ubicacion.pathname, usuarioRol, navegar]);

  return (
    <>
      <Titulo />

      {/* Renderiza el Navbar solo si el usuario está autenticado */}
      {estaAutenticado && <Navbar />}

      <Routes>
        {/* Ruta pública para Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
          <>
            <Route path="/" element={<RutaPrivada element={<Home />} />} />
            <Route path="/vendedores" element={<RutaPrivada element={<ListaVendedores />} />} />
            <Route path="/agregar-vendedor" element={<RutaPrivada element={<VendedoresForm />} />} />
            <Route path="/editar-vendedor/:id" element={<RutaPrivada element={<EditarVendedor />} />} />
            <Route path="/notas-activas" element={<RutaPrivada element={<ListaNotasActivas />} />} />
            <Route path="/nota-activa/:id" element={<RutaPrivada element={<NotaActiva />} />} />
            <Route path="/editar-nota/:id" element={<RutaPrivada element={<EditarNota />} />} />
            <Route path="/recargar-catalogo/:id" element={<RutaPrivada element={<RecargarCatalogo />} />} />
            <Route path="/finalizar-nota/:id" element={<RutaPrivada element={<FinalizarNota />} />} />
            <Route path="/factura/:id" element={<RutaPrivada element={<Factura />} />} />
            <Route path="/registro-finalizados" element={<RutaPrivada element={<RegistroFinalizados />} />} />
            <Route path="/nota-detalle/:id" element={<RutaPrivada element={<DetalleNota />} />} />
            <Route path="/agregar-nota" element={<RutaPrivada element={<CrearNota />} />} />
            <Route path="/editar-finalizado/:id" element={<RutaPrivada element={<EditarFinalizado />} />} />

            <Route path="/agregar-helado" element={<RutaPrivada element={<CrearHelado />} />} />
            <Route path="/helados" element={<RutaPrivada element={<ListaHelados />} />} />
            <Route path="/editar-helado/:id" element={<RutaPrivada element={<EditarHelado />} />} />

            <Route path="/usuarios" element={<RutaPrivada element={<ListaUsuario />} />} />
            <Route path="/usuario-editar/:id" element={<RutaPrivada element={<EditarUsuario />} />} />
            <Route path="/crear-usuario" element={<RutaPrivada element={<CrearUsuario />} />} />
          </>
        )}

        {/* Rutas para los supervisores */}
        {(usuarioRol === 'supervisor') && (
          <>
            <Route path="/" element={<RutaPrivada element={<Home />} />} />
            <Route path="/S-registro-finalizados" element={<RutaPrivada element={<RegistroFinalizadosS />} />} />
            <Route path="/S-detalle-nota/:id" element={<RutaPrivada element={<DetalleNotaS />} />} />
          </>
        )}

        <Route path="*" element={<RouteError />} />
      </Routes>
    </>
  );
};

export default App;
