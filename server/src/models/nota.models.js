import mongoose, { Schema, model } from 'mongoose';

const notaSchema = new Schema({
    vendedor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendedor',
        required: true
    },
    catalogo: {
        type: [String],
        required: true
    },
    estado: {
        type: String,
        enum: ['activo', 'finalizado'],
        default: 'activo'
    }
},
    {
        timestamps: true
    });

const Nota = model('Nota', notaSchema);

export default Nota;