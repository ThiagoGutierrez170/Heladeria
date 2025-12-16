import mongoose from 'mongoose';
import Vendedor from '../models/vendedor.models.js';
import Nota from '../models/nota.models.js';

const vendedorController = {
    crearVendedor: async (req, res) => {
        try {
            const { nombre, apellido, edad, ci, contacto, estado } = req.body;
            if (!nombre || !apellido || !edad || !ci || !contacto || !estado) {
                return res.status(400).json({ error: 'Faltan datos obligatorios' });
            }
            const nuevoVendedor = await Vendedor.create(req.body);
            return res.status(201).json(nuevoVendedor);
        } catch (error) {
            return res.status(400).json({ error: 'Error al crear el vendedor', detalle: error.message });
        }
    },

    obtenerVendedor: async (req, res) => {
        try {
            const vendedores = await Vendedor.find().sort({ estado: -1 });
            res.json(vendedores);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener vendedores', detalle: error.message });
        }
    },

    obtenerVendedorPorId: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const vendedor = await Vendedor.findById(id);
            if (!vendedor) {
                return res.status(404).json({ error: 'Vendedor no encontrado' });
            }
            res.json(vendedor);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el vendedor', detalle: error.message });
        }
    },

    actualizarVendedor: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'ID de vendedor inválido' });
            }

            // CAMBIO: Usamos 'let' para poder modificar 'estado' si viene como string "on"/"off"
            let { nombre, apellido, edad, ci, contacto, estado } = req.body;

            // Corrección para checkbox HTML/React
            if (estado === 'on') estado = true;
            if (estado === 'off') estado = false;

            if (!nombre) return res.status(400).json({ error: 'El campo Nombre es obligatorio' });
            if (!apellido) return res.status(400).json({ error: 'El campo Apellido es obligatorio' });
            if (!ci) return res.status(400).json({ error: 'El campo CI es obligatorio' });
            
            if (edad === undefined || edad === null || edad === '') {
                return res.status(400).json({ error: 'El campo Edad es obligatorio' });
            }

            if (estado === undefined || estado === null) {
                return res.status(400).json({ error: 'El campo Estado es obligatorio' });
            }

            // Objeto limpio para actualizar
            const datosParaActualizar = {
                nombre,
                apellido,
                edad,
                ci,
                contacto,
                estado
            };

            const vendedorActualizado = await Vendedor.findByIdAndUpdate(
                id, 
                datosParaActualizar, 
                { new: true, runValidators: true } 
            );

            if (!vendedorActualizado) {
                return res.status(404).json({ error: 'Vendedor no encontrado en la base de datos' });
            }

            return res.status(200).json(vendedorActualizado);

        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ error: 'El número de CI ya está registrado por otro vendedor.' });
            }
            return res.status(500).json({ error: 'Error interno al actualizar el vendedor', detalle: error.message });
        }
    },

    eliminarVendedor: async (req, res) => {
        try {
            const { id } = req.params;

            // Verifica si el ID es válido
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
    
            // Verifica si el vendedor está relacionado con alguna nota
            const notasAsociadas = await Nota.findOne({ vendedor_id: id });
    
            if (notasAsociadas) {
                return res.status(400).json({
                    error: 'No se puede eliminar el vendedor',
                    detalle: 'Este vendedor está asociado a una o más notas y no se puede eliminar'
                });
            }
    
            // Si no tiene dependencias, procede con la eliminación
            const vendedorEliminado = await Vendedor.findByIdAndDelete(id);
    
            if (!vendedorEliminado) {
                return res.status(404).json({ error: 'Vendedor no encontrado' });
            }
    
            return res.status(200).json({ mensaje: 'Vendedor eliminado con éxito', vendedorEliminado });
        } catch (error) {
            console.error("Error al eliminar el vendedor:", error.message);
            return res.status(500).json({ error: 'Error al eliminar el vendedor', detalle: error.message });
        }
    }
};

export default vendedorController;
