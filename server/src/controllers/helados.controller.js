import Helado from '../models/helado.models.js';
import Nota from '../models/nota.models.js';
import mongoose from 'mongoose';

const heladoController = {
    crearHelado: async (req, res) => {
        try {
            const { nombre, imagen, costo, precioBase, precioVenta, cantidadCaja, stock } = req.body;
            if (!nombre || !imagen || !costo || !precioBase || !precioVenta || !cantidadCaja || !stock) {
                return res.status(400).json({ error: 'Faltan datos' });
            }
            const nuevoHelado = await Helado.create(req.body);
            return res.status(201).json(nuevoHelado);
        } catch (error) {
            return res.status(400).json({ error: 'Error al crear el helado', detalle: error.message });
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
            res.status(500).json({ error: 'Error al obtener el helado', detalle: error.message });
        }
    },

    actualizarHelado: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const { nombre, imagen, costo, precioBase, precioVenta, cantidadCaja, stock } = req.body;
            if (!nombre || !imagen || !costo || !precioBase || !precioVenta || !cantidadCaja || !stock) {
                return res.status(400).json({ error: 'Faltan datos' });
            }
            const heladoActualizado = await Helado.findByIdAndUpdate(id, req.body, { new: true });
            if (!heladoActualizado) {
                return res.status(404).json({ error: 'Helado no encontrado' });
            }
            return res.status(200).json(heladoActualizado);
        } catch (error) {
            return res.status(400).json({ error: 'Error al actualizar el helado', detalle: error.message });
        }
    },

    eliminarHelado: async (req, res) => {
        try {
            const { id } = req.params;
    
            // Verifica si el ID es válido
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
    
            // Verifica si el helado está relacionado con alguna nota
            const notasAsociadas = await Nota.findOne({ 'catalogo.helado_id': id });
    
            if (notasAsociadas) {
                return res.status(400).json({
                    error: 'No se puede eliminar el helado',
                    detalle: 'Este helado está asociado a una o más notas y no se puede eliminar'
                });
            }
    
            // Si no tiene dependencias, procede con la eliminación
            const heladoEliminado = await Helado.findByIdAndDelete(id);
    
            if (!heladoEliminado) {
                return res.status(404).json({ error: 'Helado no encontrado' });
            }
    
            return res.status(200).json({ mensaje: 'Helado eliminado con éxito', heladoEliminado });
        } catch (error) {
            console.error("Error al eliminar el helado:", error.message);
            return res.status(500).json({ error: 'Error al eliminar el helado', detalle: error.message });
        }
    },
    
    
    recargarHelados: async (req, res) => {
        try {
            const { id } = req.params;  // Obtener el ID desde la URL
            const { cantidadCajas } = req.body; // Recibir la cantidad de cajas desde el body

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: `ID inválido para el helado con id ${id}` });
            }

            const helado = await Helado.findById(id);
            if (!helado) {
                return res.status(404).json({ error: `Helado con id ${id} no encontrado.` });
            }

            // Aumentar el stock
            helado.stock += cantidadCajas * helado.cantidadCaja;

            // Guardar los cambios
            await helado.save();

            return res.status(200).json({ mensaje: 'Recarga completada exitosamente.' });
        } catch (error) {
            return res.status(500).json({ error: 'Error al recargar helados', detalle: error.message });
        }
    }


};

export default heladoController;
