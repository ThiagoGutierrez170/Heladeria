import mongoose, { Schema, model } from 'mongoose';

const vendedorSchema = new mongoose.Schema({

    nombre: { type: String, required: true },

    apellido: { type: String, required: true },

    edad: { type: Number, required: true },

    ci: { 
        type: String, 
        required: true, 
        unique: [true, "Este CI debe ser único"],
    },

    contacto: { type: String, required: false },

    estado: {type:Boolean, required: true, default: true},
},
    {
        timestamps: true
    });


const Vendedor = model('Vendedor', vendedorSchema);

export default Vendedor;