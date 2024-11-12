import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Componentes de autenticación y utilidades
import Navbar from './components/utils/Navbar';
import Titulo from './components/utils/Titulo';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RouteError from './components/utils/RouteError';

// Componentes de Vendedores
import VendedoresList from './components/Vendedores/VendedoresList';
import VendedoresForm from './components/Vendedores/VendedoresForm';
import EditarVendedor from './components/Vendedores/VendedorEditar';

// Componentes de Notas
import CrearNota from './components/Notas/CrearNota';
import ListaNotasActivas from './components/Notas/ListaNotasActivas';
import NotaActiva from './components/Notas/NotaActiva';
import EditarNota from './components/Notas/EditarNota';
import RecargarCatalogo from './components/Notas/RecargarCatalogo';
import FinalizarNota from './components/Notas/FinalizarNota';
import Factura from './components/Notas/Factura';
import RegistroFinalizados from './components/Notas/RegistroFinalizados';
import DetalleNota from './components/Notas/DetalleNota';
import RegistroFinalizadosS from './components/Notas/Supervisores/RegistroNotas';
import DetalleNotaS from './components/Notas/Supervisores/DetalleNota';

// Componentes de Helados
import RecargaHelado from './components/Helados/RecargaHelado';
import ListaHelados from './components/Helados/ListaHelados';
import CrearHelado from './components/Helados/CrearHelado';
import EditarHelado from './components/Helados/EditarHelado';
import HeladoDetalles from './components/Helados/HeladoDetalle';

// Componentes de Usuarios
import CrearUsuario from './components/Usuarios/CrearUsuario';
import ListaUsuario from './components/Usuarios/ListaUsuario';
import DetalleUsuario from './components/Usuarios/DetalleUsuario';
import EditarUsuario from './components/Usuarios/EditarUsuario';

const App = () => {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const ubicacion = useLocation();
  const navegar = useNavigate();

  const verificarAutenticacion = () => {
    const token = localStorage.getItem('token');
    setEstaAutenticado(!!token);
    if (!token) {
      navegar('/login');
    }
  };

  useEffect(() => {
    verificarAutenticacion();
  }, []);

  useEffect(() => {
    if (ubicacion.pathname === '/logout' && estaAutenticado) {
      manejarCerrarSesion();
      navegar('/login');
    }
  }, [ubicacion.pathname, navegar]);

  const manejarCerrarSesion = () => {
    localStorage.removeItem('token');
    setEstaAutenticado(false);
  };

  return (
    <Router>
      <Titulo />
      {estaAutenticado && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute element={<VendedoresList />} />} />

        {/* Rutas de Vendedores */}
        <Route path="/vendedores" element={<ProtectedRoute element={<VendedoresList />} />} />
        <Route path="/agregar-vendedor" element={<ProtectedRoute element={<VendedoresForm />} />} />
        <Route path="/editar-vendedor/:id" element={<ProtectedRoute element={<EditarVendedor />} />} />

        {/* Rutas de Notas */}
        <Route path="/notas-activas" element={<ProtectedRoute element={<ListaNotasActivas />} />} />
        <Route path="/nota-activa/:id" element={<ProtectedRoute element={<NotaActiva />} />} />
        <Route path="/editar-nota/:id" element={<ProtectedRoute element={<EditarNota />} />} />
        <Route path="/recargar-catalogo/:id" element={<ProtectedRoute element={<RecargarCatalogo />} />} />
        <Route path="/finalizar-nota/:id" element={<ProtectedRoute element={<FinalizarNota />} />} />
        <Route path="/factura/:id" element={<ProtectedRoute element={<Factura />} />} />
        <Route path="/registro-finalizados" element={<ProtectedRoute element={<RegistroFinalizados />} />} />
        <Route path="/nota-detalle/:id" element={<ProtectedRoute element={<DetalleNota />} />} />
        <Route path="/agregar-nota" element={<ProtectedRoute element={<CrearNota />} />} />

        {/* Rutas de Helados */}
        <Route path="/helados" element={<ProtectedRoute element={<ListaHelados />} />} />
        <Route path="/agregar-helado" element={<ProtectedRoute element={<CrearHelado />} />} />
        <Route path="/editar-helado/:id" element={<ProtectedRoute element={<EditarHelado />} />} />
        <Route path="/helado-detalle/:id" element={<ProtectedRoute element={<HeladoDetalles />} />} />
        <Route path="/recargar-helado/:id" element={<ProtectedRoute element={<RecargaHelado />} />} />

        {/* Rutas de Usuarios */}
        <Route path="/usuarios" element={<ProtectedRoute element={<ListaUsuario />} />} />
        <Route path="/crear-usuario" element={<ProtectedRoute element={<CrearUsuario />} />} />
        <Route path="/editar/usuario/:id" element={<ProtectedRoute element={<EditarUsuario />} />} />
        <Route path="/detalle-usuario/:id" element={<ProtectedRoute element={<DetalleUsuario />} />} />

        {/* Rutas para supervisores */}
        <Route path="/S-registro-finalizados" element={<ProtectedRoute element={<RegistroFinalizadosS />} />} />
        <Route path="/S-detalle-nota/:id" element={<ProtectedRoute element={<DetalleNotaS />} />} />

        {/* Ruta para errores */}
        <Route path="*" element={<RouteError />} />
      </Routes>
    </Router>
  );
};

export default App;
