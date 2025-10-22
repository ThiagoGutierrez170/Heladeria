// heladoController.js

import Helado from '../models/helado.models.js';
import Nota from '../models/nota.models.js';
import mongoose from 'mongoose';

const heladoController = {
    crearHelado: async (req, res) => {
        try {
            // Se puede confiar en la validación del modelo/Mongoose para el 400
            const nuevoHelado = await Helado.create(req.body);
            return res.status(201).json(nuevoHelado);
        } catch (error) {
            // Manejo específico de error de validación de Mongoose
            if (error.name === 'ValidationError') {
                const mensajes = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ 
                    error: 'Error de validación al crear el helado', 
                    detalle: mensajes.join(', ') 
                });
            }
            return res.status(500).json({ error: 'Error al crear el helado', detalle: error.message });
        }
    },

    obtenerHelado: async (req, res) => {
        try {
            const helados = await Helado.find();
            res.json(helados);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener helados', detalle: error.message });
        }
    },

    obtenerHeladoPorId: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const helado = await Helado.findById(id);
            if (!helado) {
                return res.status(404).json({ error: 'Helado no encontrado' });
            }
            res.json(helado);
        } catch (error) {
            // Mongoose CastError si el ID tiene el formato incorrecto (ej. demasiado corto)
             if (error.name === 'CastError') {
                 return res.status(400).json({ error: 'ID de helado inválido.' });
             }
            res.status(500).json({ error: 'Error al obtener el helado', detalle: error.message });
        }
    },

    actualizarHelado: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            
            // ELIMINÉ la verificación de campos obligatorios aquí
            // (nombre, imagen, etc.) porque 'findByIdAndUpdate'
            // NO REQUIERE que se envíen TODOS los campos.
            // La validación ahora la hace Mongoose.

            const heladoActualizado = await Helado.findByIdAndUpdate(
                id, 
                req.body, 
                { 
                    new: true,
                    runValidators: true, // <--- ¡CRÍTICO! Aplica las reglas del Schema al actualizar
                    context: 'query' // Necesario para algunas validaciones
                }
            );

            if (!heladoActualizado) {
                return res.status(404).json({ error: 'Helado no encontrado' });
            }
            
            return res.status(200).json(heladoActualizado);
        } catch (error) {
            // Manejo específico de error de validación (la causa principal del 400)
            if (error.name === 'ValidationError') {
                const mensajes = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ 
                    error: 'Error de validación al actualizar el helado', 
                    detalle: mensajes.join(', ') 
                });
            }
             if (error.name === 'CastError') {
                 return res.status(400).json({ error: 'ID de helado inválido.' });
             }
            return res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    },

    eliminarHelado: async (req, res) => {
        try {
            const { id } = req.params;
    
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
    
            // La verificación de notas asociadas está BIEN y retorna 400.
            const notasAsociadas = await Nota.findOne({ 'catalogo.helado_id': id });
    
            if (notasAsociadas) {
                return res.status(400).json({
                    error: 'No se puede eliminar el helado',
                    // Ajusté el detalle para que sea el mensaje que ve el usuario en el frontend
                    message: 'Este helado está asociado a una o más notas y no se puede eliminar.' 
                });
            }
    
            const heladoEliminado = await Helado.findByIdAndDelete(id);
    
            if (!heladoEliminado) {
                return res.status(404).json({ error: 'Helado no encontrado' });
            }
    
            return res.status(200).json({ mensaje: 'Helado eliminado con éxito', heladoEliminado });
        } catch (error) {
            // Aseguramos que la eliminación capture errores de servidor o de formato de ID
            if (error.name === 'CastError') {
                 return res.status(400).json({ error: 'ID de helado inválido.' });
            }
            console.error("Error al eliminar el helado:", error.message);
            return res.status(500).json({ error: 'Error al eliminar el helado', detalle: error.message });
        }
    },
    
    recargarHelados: async (req, res) => {
        try {
            const { id } = req.params; 
            const { cantidadCajas } = req.body; 

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: `ID inválido para el helado con id ${id}` });
            }
            
            // Validación: Asegurar que se envíe la cantidad de cajas y sea un número positivo
            if (!cantidadCajas || typeof cantidadCajas !== 'number' || cantidadCajas <= 0) {
                 return res.status(400).json({ error: 'Debe especificar una cantidad de cajas válida para la recarga.' });
            }

            const helado = await Helado.findById(id);
            if (!helado) {
                return res.status(404).json({ error: `Helado con id ${id} no encontrado.` });
            }
            
            // Usa findByIdAndUpdate para una operación atómica (más seguro)
            const nuevoStock = helado.stock + (cantidadCajas * helado.cantidadCaja);
            
            const heladoRecargado = await Helado.findByIdAndUpdate(
                id,
                { stock: nuevoStock },
                { new: true, runValidators: true } 
            );

            if (!heladoRecargado) {
                 return res.status(404).json({ error: `Helado con id ${id} no encontrado (después de update).` });
            }

            return res.status(200).json({ mensaje: 'Recarga completada exitosamente.', helado: heladoRecargado });
        } catch (error) {
            // Captura errores de validación si el nuevo stock viola una regla (ej. stock máximo)
             if (error.name === 'ValidationError') {
                const mensajes = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ 
                    error: 'Error de validación al recargar el helado', 
                    detalle: mensajes.join(', ') 
                });
            }
            return res.status(500).json({ error: 'Error al recargar helados', detalle: error.message });
        }
    }
};

export default heladoController;