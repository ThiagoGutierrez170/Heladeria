import express from 'express';
import vendedorController from '../controllers/vendedores.controller.js';

const vendedorRouter = express.Router();

vendedorRouter.get('/', vendedorController.obtenerVendedor);

vendedorRouter.get('/:id', vendedorController.obtenerVendedorPorId);

vendedorRouter.post('/', vendedorController.crearVendedor);

vendedorRouter.put('/:id', vendedorController.actualizarVendedor);

vendedorRouter.delete('/:id', vendedorController.eliminarVendedor);

export default vendedorRouter;