import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.models.js';

export const crearUsuario = async (req, res) => {
    try {
        const { nombreUsuario, correo, contraseña, rol } = req.body;

        // Verificar que todos los campos están presentes
        if (!nombreUsuario || !correo || !contraseña || !rol) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({
            nombreUsuario,
            correo,
            contraseña: hashedPassword,
            rol
        });
        
        await nuevoUsuario.save();
        return res.status(201).json({ message: 'Usuario creado exitosamente', nuevoUsuario });
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear el usuario', detalles: error.message });
    }
};

export const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreUsuario, correo, rol } = req.body;

        // Verificar campos requeridos
        if (!nombreUsuario || !correo || !rol) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { nombreUsuario, correo, rol },
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json({ message: 'Usuario actualizado exitosamente', usuarioActualizado });
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar el usuario', detalles: error.message });
    }
};

const traerUsuario = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID desde los parámetros de la ruta
        const usuario = await Usuario.findById(id); // Buscar el usuario por ID

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json(usuario); // Enviar el usuario encontrado
    } catch (error) {
        return res.status(400).json({ error: 'Error al traer el usuario' });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el usuario existe
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Eliminar usuario
        await Usuario.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar el usuario', detalles: error.message });
    }
};

export const listaUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, 'nombreUsuario correo rol'); // Excluir contraseña
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener la lista de usuarios', detalles: error.message });
    }
};