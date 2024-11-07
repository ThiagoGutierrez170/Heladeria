import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendedoresList from './components/vendedores/VendedoresList';
import VendedoresForm from './components/vendedores/vendedoresForm';
import Navbar from './components/Navbar';
import EditarVendedor from './components/vendedores/VendedorEditar';
import GenerarVendedoresPrueba from './components/locales/GeneradorVendedores';
import Titulo from './Titulo';
import CrearHelado from './components/Helados/CrearHelado';
import ListaHelados from './components/Helados/ListaHelados'
import EditarHelado from './components/Helados/EditarHelado';
import NotasForm from './components/Notas/CrearNota';
import DetalleNota from './components/Notas/DetalleNota';
import Login from './components/Auth/Login';
import ListaUsuario from './components/Usuarios/ListaUsuario';  // Importa el componente ListaUsuario
import CrearUsuario from './components/Usuarios/CrearUsuario';

const App = () => {
  return (
    <>
      <Router>
        <Titulo />
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<CrearUsuario />} />
          <Route path="/vendedores" element={<VendedoresList />} />
          <Route path="/agregar-vendedor" element={<VendedoresForm />} />
          <Route path="/editar-vendedor/:id" element={<EditarVendedor />} />
          <Route path="/generar-vendedores" element={<GenerarVendedoresPrueba />} />
          <Route path="/helados" element={<ListaHelados />} />
          <Route path="/agregar-helado" element={<CrearHelado />} />
          <Route path="/editar-helado/:id" element={<EditarHelado />} />
          <Route path="/agregar-nota" element={<NotasForm />} />
          <Route path="/notas" element={<DetalleNota />} />
          <Route path="/usuarios" element={<ListaUsuario />} />  {/* Ruta para la lista de usuarios */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
