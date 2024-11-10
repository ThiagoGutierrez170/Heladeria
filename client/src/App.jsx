import { Routes, Route } from 'react-router-dom';
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
import Titulo from './Titulo'
import CrearHelado from './components/Helados/CrearHelado';
import ListaHelados from './components/Helados/ListaHelados';
import EditarHelado from './components/Helados/EditarHelado';
import RouteError from './components/utils/RouteError';
import Login from './components/Auth/Login';
import RutaPrivada from './components/utils/RutaPrivada';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const App = () => {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const ubicacion = useLocation();
  const navegar = useNavigate();

  // VERIFICA SI EXISTE UN TOKEN
  const verificarAutenticacion = () => {
    const token = localStorage.getItem('token');
    setEstaAutenticado(!!token);
    if (!token) {
      navegar('/login'); // Si no hay token, redirige al login
    }
    console.log(token ? 'Hay token' : 'No hay token');
  };

  // SE VERIFICA AUTENTICACIÓN AL MONTARSE EL COMPONENTE
  useEffect(() => {
    verificarAutenticacion();
  }, []);

  // CIERRA SESIÓN AL IR A /LOGOUT
  useEffect(() => {
    if (ubicacion.pathname === '/logout' && estaAutenticado === true) {
      manejarCerrarSesion();
      navegar('/login'); // REDIRIGE AL LOGIN
    }
  }, [ubicacion.pathname, navegar]);

  // MANEJO DEL CIERRE DE SESIÓN
  const manejarCerrarSesion = () => {
    localStorage.removeItem('token'); // ELIMINA EL TOKEN AL CERRAR SESIÓN
    setEstaAutenticado(false);
  };

  return (
    <>
      <Titulo />
      
      {/* Renderiza el Navbar solo si el usuario está autenticado */}
      {estaAutenticado ? <Navbar /> : null}
      
      <Routes>
        {/* Ruta pública para Login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida para la página principal '/' */}
        <Route path="/" element={<RutaPrivada element={<VendedoresList />} />} />

          <Route path="/agregar-helado" element={<CrearHelado/>}/>
          <Route path="/helados" element={<ListaHelados/>}/>
          <Route path="/editar-helado/:id" element={<EditarHelado/>}/>
          
          

        <Route path="/vendedores" element={<RutaPrivada element={<VendedoresList />} />} />
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
        <Route path="*" element={<RouteError/>}/>
      </Routes>
    </>
  );
};

export default App;