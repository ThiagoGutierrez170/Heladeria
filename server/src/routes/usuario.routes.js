import express from 'express';
import { crearUsuario, editarUsuario, eliminarUsuario, listaUsuario, traerUsuario } from '../controllers/usuario.controller.js';

const usuarioRouter = express.Router();

// Ruta para crear un usuario (solo administrador)
usuarioRouter.post('/', crearUsuario);

// Ruta para editar un usuario (acceso según necesidad, puede ser solo administrador o el propio usuario)
usuarioRouter.put('/:id', editarUsuario);

// Ruta para eliminar un usuario (solo administrador)
usuarioRouter.delete('/:id', eliminarUsuario);

// Ruta para listar usuarios (acceso según rol)
usuarioRouter.get('/lista', listaUsuario);

usuarioRouter.get('/:id', traerUsuario);

export default usuarioRouter;