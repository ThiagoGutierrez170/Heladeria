import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendedoresList from './components/Vendedores/VendedoresList';
import VendedoresForm from './components/Vendedores/VendedoresForm';
import Navbar from './components/utils/Navbar';
import EditarVendedor from './components/Vendedores/VendedorEditar';
//import GenerarVendedoresPrueba from './components/Vendedores/locales/GeneradorVendedores';


const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/vendedores" element={<VendedoresList />} />
          <Route path="/agregar-vendedor" element={<VendedoresForm />} />
          <Route path="/editar-vendedor/:id" element={<EditarVendedor />} />
          {/*<Route path="/generar-vendedores" element={<GenerarVendedoresPrueba />} />*/}
        </Routes>
      </Router>
    </>
  );
};

export default App;
