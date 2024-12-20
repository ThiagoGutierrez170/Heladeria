import bcrypt from 'bcryptjs';
import Usuario from '../src/models/usuario.models.js';

const initAdmin = async () => {
    try {
        const correo = process.env.ADMIN_EMAIL;
        const contraseña = process.env.ADMIN_PASSWORD;
        const nombreUsuario = process.env.ADMIN_USERNAME;
        const rol = 'administrador';

        // Validar las variables de entorno
        if (!correo || !contraseña || !nombreUsuario) {
            console.error('Faltan datos del administrador en las variables de entorno.');
            return;
        }

        // Verificar si ya existe un usuario con este correo
        const usuarioExistente = await Usuario.findOne({ correo });

        if (usuarioExistente) {
            return;
        }

        // Crear contraseña encriptada
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear el usuario administrador
        const nuevoUsuario = new Usuario({
            nombreUsuario,
            correo,
            contraseña: hashedPassword,
            rol
        });

        await nuevoUsuario.save();
        console.log('Usuario administrador creado exitosamente.');
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error.message);
    }
};

export default initAdmin;
