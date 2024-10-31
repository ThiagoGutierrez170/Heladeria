import express from 'express';
import { crearUsuario, editarUsuario, eliminarUsuario, listaUsuario } from '../controllers/usuario.controller.js';

const router = express.Router();

// Ruta para crear un usuario (solo administrador)
router.post('/crear', crearUsuario);

// Ruta para editar un usuario (acceso según necesidad, puede ser solo administrador o el propio usuario)
router.put('/editar/:id', editarUsuario);

// Ruta para eliminar un usuario (solo administrador)
router.delete('/eliminar/:id', eliminarUsuario);

// Ruta para listar usuarios (acceso según rol)
router.get('/lista', listaUsuario);

export default router;