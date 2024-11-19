import express from 'express';
import { login, logout, verificarSesion } from '../controllers/sesiones.controller.js';

const sesionesRouter = express.Router();

// Ruta para iniciar sesión (login)
sesionesRouter.post('/login', login);

// Ruta para cerrar sesión (logout)
sesionesRouter.post('/logout', logout);

// Ruta para verificar la sesión (verificación de token)
sesionesRouter.get('/verificar-sesion', verificarSesion);

export default sesionesRouter;