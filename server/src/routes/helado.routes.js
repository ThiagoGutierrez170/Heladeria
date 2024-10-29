import express from 'express';
import heladoController from '../controllers/helados.controller.js';

const Heladorouter = express.Router();

Heladorouter.get('/', heladoController.obtenerHelado);

Heladorouter.get('/:id', heladoController.obtenerHeladoPorId);

Heladorouter.post('/', heladoController.crearHelado); 

Heladorouter.put('/:id', heladoController.actualizarHelado);

Heladorouter.delete('/:id', heladoController.eliminarHelado);

export default Heladorouter;