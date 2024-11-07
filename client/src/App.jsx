import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendedoresList from './components/Vendedores/VendedoresList';
import VendedoresForm from './components/Vendedores/vendedoresForm';
import Navbar from './components/Navbar';
import EditarVendedor from './components/Vendedores/VendedorEditar';
import GenerarVendedoresPrueba from './components/locales/GeneradorVendedores';
import HeladoForm from './components/Helados/CrearHelado';
import CrearHelado from './components/Helados/CrearHelado';
import ListaHelados from './components/Helados/ListaHelados';
import EditarHelado from './components/Helados/EditarHelado';
import Titulo from './Titulo';



const App = () => {
  return (
    <>
      <Router>
        <Titulo />
        <Navbar />
        <Routes>
          <Route path="/vendedores" element={<VendedoresList />} />
          <Route path="/agregar-vendedor" element={<VendedoresForm />} />
          <Route path="/editar-vendedor/:id" element={<EditarVendedor />} />
          <Route path="/generar-vendedores" element={<GenerarVendedoresPrueba />} />
          <Route path="/agregar-helado" element={<CrearHelado/>}/>
          <Route path="/helados" element={<ListaHelados/>}/>
          <Route path="/editar-helado/:id" element={<EditarHelado/>}/>

        </Routes>
      </Router>
    </>
  );
};

export default App;
