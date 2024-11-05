import { model, Schema } from 'mongoose';

// Subdocumento para el catálogo (helados vendidos)
const CatalogoSchema = new Schema({
    helado_id: {
        type: Schema.Types.ObjectId,
        ref: 'Helado',  // Referencia al modelo de Helado
        required: true
    },
    cantidad_inicial: {
        type: Number,
        required: true
    },
    recargas: {
        type: [Number],  // Array de números que representan las recargas
        default: []  // Por defecto será un array vacío
    },
    cantidad_vendida: {
        type: Number,
        default: 0  // Inicialmente no se ha vendido nada
    }
});

// Esquema para la colección principal (nota de venta del vendedor)
const NotaSchema = new Schema({
    vendedor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vendedor',  // Referencia al modelo de Vendedor
        required: true
    },
    catalogo: [CatalogoSchema],  // Array de helados en el catálogo
    estado: {
        type: String,
        enum: ['activo', 'finalizado'],  // Valores permitidos
        default: 'activo'  // Por defecto el estado es "activo"
    },
    playa: {
        type: String,
        enum: ['San José', 'Mboi ka´e', 'San Isidro', 'Evento'],  // Valores permitidos para la playa
        required: true
    },
    clima: {
        type: String,
        enum: ['soleado', 'despejado', 'nublado', 'lluvia', 'tormenta'],  // Se puede actualizar luego con datos del clima
    },
    creador: {
        type: Schema.Types.ObjectId, // Referencia al usuario
        required: [false, "No se encontró el creador"],
        ref: 'Usuario' // Referencia al modelo de usuario
    }
},{ timestamps: true });

// Crea el modelo de Nota
const Nota = model("Nota", NotaSchema);

// Exporta el modelo para usarlo en tu aplicación
export default Nota;
