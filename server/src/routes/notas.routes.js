import express from 'express';
import notaController from '../controllers/nota.controller.js';

const NotaRouter = express.Router();

// Rutas para las notas activas
NotaRouter.get('/activas', notaController.ListaNortasActivas);
NotaRouter.get('/activas/:id', notaController.TraerNotaActiva);
NotaRouter.post('/', notaController.Crear);
NotaRouter.put('/activas/:id', notaController.EditarNotaActiva);

// Rutas para recargar el catálogo de una nota
NotaRouter.put('/recargar/:id', notaController.RecargarCatalogo);

// Rutas para las notas finalizadas
NotaRouter.get('/finalizadas', notaController.ListaNortasFinalizada);
NotaRouter.get('/finalizadas/:id/factura', notaController.TraerFactura);
NotaRouter.get('/finalizadas/:id/detalle', notaController.DetalleNota);

// Ruta para eliminar una nota (solo accesible por administradores)
NotaRouter.delete('/:id', notaController.Eliminar);

export default NotaRouter;
