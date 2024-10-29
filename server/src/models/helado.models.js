import mongoose, { Schema, model } from 'mongoose';

const heladoSchema = new Schema({
    nombre: { type: String, required: true },
    imagen: { type: String, required: false },
    costo: { type: Number, required: true },
    precioBase: { type: Number, required: true },
    precioVenta: { type: Number, required: true },
    cantidadCaja: { type: Number, required: true },
    stock: { type: Number, required: true }
}, {
    timestamps: true
});

const Helado = model('Helado', heladoSchema);

export default Helado;
