import express from 'express';
import { login, logout, verificarSesion } from '../controllers/sesiones.controller.js';

const router = express.Router();

// Ruta para iniciar sesión (login)
router.post('/login', login);

// Ruta para cerrar sesión (logout)
router.post('/logout', logout);

// Ruta para verificar la sesión (verificación de token)
router.get('/verificar-sesion', verificarSesion);

export default router;