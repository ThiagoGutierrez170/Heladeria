import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nombreUsuario: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { 
        type: String, 
        enum: ['administrador', 'usuario', 'supervisor'],
        required: true 
    }
}, {
    timestamps: true
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;