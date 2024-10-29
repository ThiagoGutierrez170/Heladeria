import express from 'express';
import vendedorController from '../controllers/vendedor.controller.js';

const vendedorRouter = express.Router();

Vendedorrouter.get('/', vendedorController.obtenerVendedor);

Vendedorrouter.get('/:id', vendedorController.obtenerVendedorPorId);

Vendedorrouter.post('/', vendedorController.crearVendedor);

Vendedorrouter.put('/:id', vendedorController.actualizarVendedor);

Vendedorrouter.delete('/:id', vendedorController.eliminarVendedor);

export default vendedorRouter;