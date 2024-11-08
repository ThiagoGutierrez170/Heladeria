import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


const App = () => {
  return (
    <>
      <Router>
        <Titulo />
        <Navbar />
        <Routes>
          {/* Rutas de Vendedores */}
          <Route path="/vendedores" element={<VendedoresList />} />
          <Route path="/agregar-vendedor" element={<VendedoresForm />} />
          <Route path="/editar-vendedor/:id" element={<EditarVendedor />} />
          
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

          <Route path="/agregar-helado" element={<CrearHelado/>}/>
          <Route path="/helados" element={<ListaHelados/>}/>
          <Route path="/editar-helado/:id" element={<EditarHelado/>}/>

        </Routes>
      </Router>
    </>
  );
};

export default App;
