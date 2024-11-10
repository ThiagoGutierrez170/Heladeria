import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/utils/Navbar';
import React from 'react';
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
import RecargaHelado from './components/Helados/RecargaHelado';
import ListaHelados from './components/Helados/ListaHelados';
import CrearHelado from './components/Helados/CrearHelado';
import EditarHelado from './components/Helados/EditarHelado';
import HeladoDetalles from './components/Helados/HeladoDetalle';
import Titulo from './components/utils/Titulo';
import Login from './components/Auth/Login';
import CrearUsuario from './components/Usuarios/CrearUsuario';
import Registro from './components/Usuarios/CrearUsuario';
import ListaUsuario from './components/Usuarios/ListaUsuario';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DetalleUsuario from './components/Usuarios/DetalleUsuario';
import EditarUsuario from './components/Usuarios/EditarUsuario';


const App = () => (

  <Router>
    <Titulo />
    <Navbar />
    <Routes>
      //Login
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<CrearUsuario />} />

        // Rutas de Helados
      <Route path="/helados" element={<ListaHelados />} />
      <Route path="/agregar-helado" element={<CrearHelado />} />
      <Route path="/editar-helado/:id" element={<EditarHelado />} />
      <Route path="/helado-detalle/:id" element={<HeladoDetalles />} />
      <Route path="/recargar-helado/:id" element={<RecargaHelado />} />

      {/* Rutas de Notas Activas */}
      <Route path="/notas-activas" element={<ListaNotasActivas />} />
      <Route path="/nota-activa/:id" element={<NotaActiva />} />
      <Route path="/editar-nota/:id" element={<EditarNota />} />
      <Route path="/recargar-catalogo/:id" element={<RecargarCatalogo />} />


      {/* Rutas para Finalizar Nota y Factura */}
      <Route path="/finalizar-nota/:id" element={<FinalizarNota />} />
      <Route path="/factura/:id" element={<Factura />} />

      {/* Rutas de Notas Finalizadas */}
      <Route path="/registro-finalizados" element={<RegistroFinalizados />} />
      <Route path="/nota-detalle/:id" element={<DetalleNota />} />

      {/* Ruta para Crear Nota */}
      <Route path="/agregar-nota" element={<CrearNota />} />

        // Rutas de Usuarios
      <Route path="/usuarios" element={<ListaUsuario />} />
      <Route path="/crear-usuario" element={<CrearUsuario />} />
      <Route path='/editar/usuario/:id' element={<EditarUsuario />} />
      <Route path="/detalle-usuario/:id" element={<DetalleUsuario />} />

        // Rutas de Vendedores
      <Route path="/vendedores" element={<VendedoresList />} />
      <Route path="/agregar-vendedor" element={<VendedoresForm />} />
      <Route path="/editar-vendedor/:id" element={<EditarVendedor />} />

    </Routes>
  </Router>

);

export default App;
