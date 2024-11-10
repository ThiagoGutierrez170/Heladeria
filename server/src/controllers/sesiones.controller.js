import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.models.js';

export const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Verifica si el usuario existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verifica la contraseña
        const esContraseñaCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esContraseñaCorrecta) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1m' }
        );

        // Envia el token y la información del usuario
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            usuario: { id: usuario._id, nombreUsuario: usuario.nombreUsuario, rol: usuario.rol }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error en el inicio de sesión', detalles: error.message });
    }
};

export const logout = (req, res) => {
    try {
        // En el cliente, al hacer logout, se debe eliminar el token del almacenamiento local o de cookies.
        return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al cerrar la sesión', detalles: error.message });
    }
};

export const verificarSesion = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No hay token de autenticación' });
    }

    try {
        // Verifica el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id; // Adjunta el ID del usuario al request para su uso

        return res.status(200).json({
            message: 'Sesión válida',
            usuario: { id: decoded.id, rol: decoded.rol }
        });
    } catch (error) {
        return res.status(401).json({ error: 'Token no válido o expirado' });
    }
};