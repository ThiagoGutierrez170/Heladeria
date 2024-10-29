import mongoose, { Schema, model } from 'mongoose';

const vendedorSchema = new mongoose.Schema({

    nombre: { type: String, required: true },

    apellido: { type: String, required: true },

    edad: { type: Number, required: true },

    ci: { type: String, required: true },

    contacto: { type: String, required: false }
},
    {
        timestamps: true
    });


const Vendedor = model('Vendedor', vendedorSchema);

export default Vendedor;