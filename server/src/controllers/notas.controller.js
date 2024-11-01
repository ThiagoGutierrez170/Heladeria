import Nota from "../models/nota.models.js";
import Helado from "../models/helado.models.js";
import mongoose from 'mongoose';

// Crear una nueva nota
const Crear = async (req, res) => {
    try {
        const { vendedor_id, catalogo, playa, clima } = req.body;
        const creador = req.user.id;

        const catalogoConStock = [];
        for (let item of catalogo) {
            const { helado_id, cantidad_inicial } = item;
            const helado = await Helado.findById(helado_id);
            if (!helado) return res.status(404).json({ error: `Helado con id ${helado_id} no encontrado` });

            // Ajustar stock para que no sea menor que 0
            const nuevoStock = Math.max(helado.stock - cantidad_inicial, 0);
            helado.stock = nuevoStock;
            await helado.save();

            catalogoConStock.push({ helado_id, cantidad_inicial });
        }

        const nuevaNota = await Nota.create({
            vendedor_id,
            catalogo: catalogoConStock,
            playa,
            clima,
            creador
        });

        res.status(201).json(nuevaNota);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la nota', detalle: error.message });
    }
};

// Lista de notas activas (solo información)
const ListaNortasActivas = async (req, res) => {
    try {
        const notasActivas = await Nota.find({ estado: 'activo' }).populate('vendedor_id', 'nombre apellido');
        res.status(200).json(notasActivas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener notas activas', detalle: error.message });
    }
};

// Obtener una nota activa específica
const TraerNotaActiva = async (req, res) => {
    try {
        const { id } = req.params;
        const nota = await Nota.findById(id).populate('vendedor_id', 'nombre apellido');
        if (!nota || nota.estado !== 'activo') {
            return res.status(404).json({ error: 'Nota activa no encontrada' });
        }
        res.status(200).json(nota);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la nota activa', detalle: error.message });
    }
};

// Recargar el catálogo de una nota existente
const RecargarCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        const { recargas } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID de nota inválido' });
        }

        const nota = await Nota.findById(id);
        if (!nota || nota.estado !== 'activo') {
            return res.status(404).json({ error: 'Nota activa no encontrada' });
        }

        for (let recarga of recargas) {
            const { helado_id, cantidad } = recarga;
            const helado = await Helado.findById(helado_id);
            if (!helado) return res.status(404).json({ error: `Helado con id ${helado_id} no encontrado` });

            // Ajustar stock para que no sea menor que 0
            const nuevoStock = Math.max(helado.stock - cantidad, 0);
            helado.stock = nuevoStock;
            await helado.save();

            const itemCatalogo = nota.catalogo.find(item => item.helado_id.equals(helado_id));
            if (itemCatalogo) {
                itemCatalogo.recargas.push(cantidad);
            } else {
                nota.catalogo.push({ helado_id, cantidad_inicial: cantidad, recargas: [cantidad] });
            }
        }

        await nota.save();
        res.status(200).json({ mensaje: 'Catálogo recargado exitosamente', nota });
    } catch (error) {
        res.status(500).json({ error: 'Error al recargar catálogo', detalle: error.message });
    }
};

// Editar una nota activa
const EditarNotaActiva = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendedor_id, playa, clima } = req.body;

        const nota = await Nota.findById(id);
        if (!nota || nota.estado !== 'activo') {
            return res.status(404).json({ error: 'Nota activa no encontrada' });
        }

        nota.vendedor_id = vendedor_id || nota.vendedor_id;
        nota.playa = playa || nota.playa;
        nota.clima = clima || nota.clima;
        await nota.save();

        res.status(200).json({ mensaje: 'Nota activa actualizada exitosamente', nota });
    } catch (error) {
        res.status(500).json({ error: 'Error al editar la nota activa', detalle: error.message });
    }
};

// Lista de notas finalizadas (información y cálculos de ganancias)
const ListaNortasFinalizada = async (req, res) => {
    try {
        const notasFinalizadas = await Nota.find({ estado: 'finalizado' }).populate('vendedor_id', 'nombre apellido');
        const notasConGanancias = notasFinalizadas.map(nota => {
            const detallesGanancias = nota.catalogo.map(item => {
                const cantidadTotal = item.cantidad_inicial + item.recargas.reduce((acc, r) => acc + r, 0);
                const cantidadVendida = cantidadTotal - (item.cantidad_devuelta || 0);
                return {
                    helado_id: item.helado_id,
                    gananciaMinima: cantidadVendida * item.helado_id.costo,
                    gananciaBase: cantidadVendida * item.helado_id.precioBase,
                    gananciaTotal: cantidadVendida * item.helado_id.precioVenta
                };
            });
            return { ...nota.toObject(), detallesGanancias };
        });
        res.status(200).json(notasConGanancias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener notas finalizadas', detalle: error.message });
    }
};

// Obtener la factura de una nota finalizada
const TraerFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const nota = await Nota.findById(id).populate('catalogo.helado_id');
        if (!nota || nota.estado !== 'finalizado') {
            return res.status(404).json({ error: 'Nota finalizada no encontrada' });
        }

        const detallesFactura = nota.catalogo.map(item => {
            const cantidadTotal = item.cantidad_inicial + item.recargas.reduce((acc, r) => acc + r, 0);
            const cantidadVendida = cantidadTotal - (item.cantidad_devuelta || 0);
            return {
                nombre: item.helado_id.nombre,
                cantidadTotal,
                cantidadVendida,
                gananciaBase: cantidadVendida * item.helado_id.precioBase
            };
        });

        const gananciaTotalBase = detallesFactura.reduce((acc, detalle) => acc + detalle.gananciaBase, 0);
        res.status(200).json({ detallesFactura, gananciaTotalBase });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar la factura', detalle: error.message });
    }
};

// Obtener el detalle de una nota finalizada (con cálculo de todas las ganancias)
const DetalleNota = async (req, res) => {
    try {
        const { id } = req.params;
        const nota = await Nota.findById(id).populate('catalogo.helado_id');
        if (!nota || nota.estado !== 'finalizado') {
            return res.status(404).json({ error: 'Nota finalizada no encontrada' });
        }

        const detallesGanancias = nota.catalogo.map(item => {
            const cantidadTotal = item.cantidad_inicial + item.recargas.reduce((acc, r) => acc + r, 0);
            const cantidadVendida = cantidadTotal - (item.cantidad_devuelta || 0);

            return {
                nombre: item.helado_id.nombre,
                cantidadTotal,
                cantidadVendida,
                gananciaMinima: cantidadVendida * item.helado_id.costo,
                gananciaBase: cantidadVendida * item.helado_id.precioBase,
                gananciaTotal: cantidadVendida * item.helado_id.precioVenta
            };
        });

        const gananciaMinima = detallesGanancias.reduce((acc, item) => acc + item.gananciaMinima, 0);
        const gananciaBase = detallesGanancias.reduce((acc, item) => acc + item.gananciaBase, 0);
        const gananciaTotal = detallesGanancias.reduce((acc, item) => acc + item.gananciaTotal, 0);

        res.status(200).json({ detallesGanancias, gananciaMinima, gananciaBase, gananciaTotal });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el detalle de la nota', detalle: error.message });
    }
};

// Eliminar una nota (solo visible para el administrador)
const Eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const notaEliminada = await Nota.findByIdAndDelete(id);
        if (!notaEliminada) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        res.status(200).json({ mensaje: 'Nota eliminada con éxito', notaEliminada });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la nota', detalle: error.message });
    }
};

export default {
    Crear,
    ListaNortasActivas,
    TraerNotaActiva,
    RecargarCatalogo,
    EditarNotaActiva,
    ListaNortasFinalizada,
    TraerFactura,
    DetalleNota,
    Eliminar
};
