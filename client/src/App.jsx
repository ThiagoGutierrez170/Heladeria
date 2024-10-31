import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendedoresList from './assets/components/vendedores/VendedoresList';
import VendedoresForm from './assets/components/vendedores/vendedoresForm';
import Navbar from './assets/components/Navbar';
import EditarVendedor from './assets/components/vendedores/VendedorEditar';

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/vendedores" element={<VendedoresList />} />
          <Route path="/agregar-vendedor" element={<VendedoresForm />} />
          <Route path="/editar-vendedor/:id" element={<EditarVendedor />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
