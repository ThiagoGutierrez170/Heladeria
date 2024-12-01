import Nota from "../models/nota.models.js";
import Helado from "../models/helado.models.js";
import mongoose from 'mongoose';

// Crear una nueva nota
const Crear = async (req, res) => {
    try {
        const { vendedor_id, catalogo, playa, clima } = req.body;
        //const creador = req.user.id;

        const catalogoConStock = [];
        for (let item of catalogo) {
            const { helado_id, cantidad_inicial } = item;
            if (cantidad_inicial > 0) {
                const helado = await Helado.findById(helado_id);
                if (!helado) return res.status(404).json({ error: `Helado con id ${helado_id} no encontrado` });

                // Ajustar stock para que no sea menor que 0
                const nuevoStock = Math.max(helado.stock - cantidad_inicial, 0);
                helado.stock = nuevoStock;
                await helado.save();

                catalogoConStock.push({ helado_id, cantidad_inicial });
            };
        }

        const nuevaNota = await Nota.create({
            vendedor_id,
            catalogo: catalogoConStock,
            playa,
            clima,
            /*creador*/
        });

        res.status(201).json(nuevaNota);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la nota', detalle: error.message });
    }
};

// Lista de notas activas (solo información)
const ListaNotasActivas = async (req, res) => {
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

        // Obtén la nota activa junto con los detalles del catálogo
        const notaActiva = await Nota.findById(id)
            .populate('vendedor_id', 'nombre apellido')
            .populate('catalogo.helado_id', 'nombre imagen'); // Asegura que los helados están poblados

        if (!notaActiva) {
            return res.status(404).json({ error: 'Nota activa no encontrada' });
        }

        // Mapeamos el catálogo y calculamos la cantidadTotal
        const catalogoConCantidadTotal = notaActiva.catalogo.map((item) => {
            const cantidadInicial = item.cantidad_inicial || 0; // Asegúrate de que cantidad_inicial no sea nulo
            const recargas = Array.isArray(item.recargas) && item.recargas.length > 0
                ? item.recargas.reduce((acc, r) => acc + (r || 0), 0) // Suma las recargas
                : 0; // Si no hay recargas, la suma es 0

            const cantidadTotal = cantidadInicial + recargas;

            return {
                helado_id: item.helado_id,
                recargas: item.recargas || [], // Si no tiene recargas, aseguramos que sea un array vacío
                cantidadTotal: cantidadTotal,
            };
        });

        res.status(200).json({
            ...notaActiva.toObject(),
            catalogo: catalogoConCantidadTotal,
        });
    } catch (error) {
        console.error('Error al obtener la nota activa:', error);
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

        if (!Array.isArray(nota.catalogo)) nota.catalogo = [];

        // Convertir recargas en un array filtrando entradas inválidas
        const recargasArray = Object.entries(recargas)
            .map(([helado_id, cantidad]) => ({
                helado_id,
                cantidad: parseInt(cantidad, 10) || 0
            }))
            .filter(item => mongoose.Types.ObjectId.isValid(item.helado_id) && item.cantidad > 0);

        for (let recarga of recargasArray) {
            const { helado_id, cantidad } = recarga;

            // Verificar si el helado existe
            const helado = await Helado.findById(helado_id);
            if (!helado) {
                return res.status(404).json({ error: `Helado con ID ${helado_id} no encontrado` });
            }

            // Reducir el stock del helado
            helado.stock -= cantidad;
            await helado.save();

            // Buscar el helado en el catálogo de la nota
            const itemCatalogo = nota.catalogo.find(item => String(item.helado_id) === String(helado_id));

            if (itemCatalogo) {
                // Si existe en el catálogo
                if (itemCatalogo.cantidad_inicial === 0) {
                    // Si no tiene cantidad inicial, asignar la cantidad aquí
                    itemCatalogo.cantidad_inicial = cantidad;
                } else {
                    // Si ya tiene cantidad inicial, agregar a recargas
                    itemCatalogo.recargas = itemCatalogo.recargas || [];
                    itemCatalogo.recargas.push(cantidad);
                }
            } else {
                // Si no existe en el catálogo, agregarlo con cantidad inicial
                nota.catalogo.push({
                    helado_id,
                    cantidad_inicial: cantidad,
                    recargas: []
                });
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
const ListaNotasFinalizada = async (req, res) => {
    try {
        const notasFinalizadas = await Nota.find({ estado: 'finalizado' }).populate('vendedor_id', 'nombre apellido').populate('catalogo.helado_id', 'costo precioBase precioVenta');

        const notasConGanancias = notasFinalizadas.map(nota => {
            const detallesGanancias = nota.catalogo.map(item => {
                const cantidadTotal = item.cantidad_inicial + item.recargas.reduce((acc, r) => acc + r, 0);
                const cantidadVendida = cantidadTotal - (item.cantidad_devuelta || 0);
                return {
                    helado_id: item.helado_id._id,
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

const TraerFactura = async (req, res) => {
    try {
        const { id } = req.params;

        // Encuentra la nota por ID y popula el vendedor y el catálogo
        const nota = await Nota.findById(id)
            .populate('vendedor_id', 'nombre apellido') // Popula el vendedor
            .populate('catalogo.helado_id', 'nombre precioBase imagen'); // Popula el nombre, precio base e imagen del helado

        if (!nota || nota.estado !== 'finalizado') {
            return res.status(404).json({ error: 'Nota finalizada no encontrada' });
        }

        // Crea el detalle de la factura calculando la ganancia base
        const detallesFactura = nota.catalogo.map(item => {
            const cantidadTotal = item.cantidad_inicial + item.recargas.reduce((acc, r) => acc + r, 0);
            const cantidadVendida = item.cantidad_vendida;
            return {
                imagen: item.helado_id.imagen, // Imagen del helado
                nombre: item.helado_id.nombre,
                cantidadTotal,
                cantidadVendida,
                gananciaBase: cantidadVendida * item.helado_id.precioBase
            };
        });

        // Calcula la ganancia total base sumando las ganancias de cada helado
        const gananciaTotalBase = detallesFactura.reduce((acc, detalle) => acc + detalle.gananciaBase, 0);

        // Incluye en la respuesta la información completa de la nota, incluyendo createdAt
        res.status(200).json({
            detallesFactura,
            gananciaTotalBase,
            vendedor: nota.vendedor_id ? { nombre: nota.vendedor_id.nombre, apellido: nota.vendedor_id.apellido } : null,
            playa: nota.playa,
            clima: nota.clima,
            createdAt: nota.createdAt 
        });
    } catch (error) {
        console.error('Error al generar la factura:', error);
        res.status(500).json({ error: 'Error al generar la factura', detalle: error.message });
    }
};



// Controlador corregido: DetalleNota
const DetalleNota = async (req, res) => {
    try {
        const { id } = req.params;
        const nota = await Nota.findById(id)
            .populate('catalogo.helado_id')  // Popula la información del helado en el catálogo
            .populate('vendedor_id', 'nombre apellido');  // Popula solo nombre y apellido del vendedor

        // Verificar que la nota exista y que su estado sea 'finalizado'
        if (!nota || nota.estado !== 'finalizado') {
            return res.status(404).json({ error: 'Nota finalizada no encontrada' });
        }

        // Asegurarse de que la cantidad vendida esté directamente en la base de datos
        const detallesGanancias = nota.catalogo.map(item => {
            return {
                helado_id: item.helado_id,
                nombre: item.helado_id.nombre,
                imagen: item.helado_id.imagen,
                cantidadVendida: item.cantidad_vendida,  // Usamos la cantidad vendida directamente de la base de datos
                gananciaMinima: item.cantidad_vendida * item.helado_id.costo,
                gananciaBase: item.cantidad_vendida * item.helado_id.precioBase,
                gananciaTotal: item.cantidad_vendida * item.helado_id.precioVenta
            };
        });

        // Calcular las ganancias totales
        const gananciaMinima = detallesGanancias.reduce((acc, item) => acc + item.gananciaMinima, 0);
        const gananciaBase = detallesGanancias.reduce((acc, item) => acc + item.gananciaBase, 0);
        const gananciaTotal = detallesGanancias.reduce((acc, item) => acc + item.gananciaTotal, 0);

        // Enviar la respuesta con la estructura esperada
        res.status(200).json({
            detallesGanancias,
            gananciaMinima,
            gananciaBase,
            gananciaTotal,
            vendedor_id: nota.vendedor_id ? { nombre: nota.vendedor_id.nombre, apellido: nota.vendedor_id.apellido } : null,
            playa: nota.playa,
            clima: nota.clima,
            fecha: nota.createdAt
        });
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

// Finalizar una nota activa
const FinalizarNota = async (req, res) => {
    try {
        const { devoluciones } = req.body; // Cantidad devuelta para cada helado
        const { id } = req.params;

        console.log('ID de la nota:', id);

        // Encuentra la nota por ID
        const nota = await Nota.findById(id);
        if (!nota) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        // Procesa cada item en el catálogo de la nota
        for (let item of nota.catalogo) {
            const heladoId = item.helado_id.toString();
            const cantidadDevuelta = devoluciones[heladoId] || 0; // Devolución del frontend para este helado

            // Calcula cantidad total disponible (inicial + recargas)
            const cantidadTotal = item.cantidad_inicial + (item.recargas || []).reduce((acc, r) => acc + r, 0);

            // Asegúrate de que la cantidad devuelta no exceda la cantidad total
            if (cantidadDevuelta > cantidadTotal) {
                return res.status(400).json({ error: `La cantidad devuelta para el helado ${heladoId} no puede ser mayor que la cantidad total (${cantidadTotal})` });
            }

            // Calcula y asigna cantidad vendida
            item.cantidad_vendida = cantidadTotal - cantidadDevuelta;

            // Actualiza el stock en el modelo Helado
            const helado = await Helado.findById(heladoId);
            if (helado) {
                // Asegúrate de que el helado tenga stock inicial y se actualice correctamente
                helado.stock += cantidadDevuelta; // Añade la cantidad devuelta al stock
                await helado.save();
            } else {
                console.log(`Helado con ID ${heladoId} no encontrado`);
            }
        }

        // Cambia el estado de la nota a 'finalizado'
        nota.estado = 'finalizado';
        await nota.save();

        res.status(200).json({ message: 'Nota finalizada correctamente' });
    } catch (error) {
        console.error('Error al finalizar la nota:', error);
        res.status(500).json({ error: 'Error interno en el servidor', detalle: error.message });
    }
};

// Editar una nota finalizada
const EditarFinalizado = async (req, res) => {
    try {
        const { id } = req.params;
        const { heladoId, cantidadVendida } = req.body;

        console.log('Datos recibidos:', { heladoId, cantidadVendida });

        if (!heladoId || cantidadVendida === undefined) {
            return res.status(400).json({ error: 'heladoId y cantidadVendida son requeridos' });
        }

        // Verificar que la cantidadVendida sea un número válido
        if (isNaN(cantidadVendida) || cantidadVendida < 0) {
            return res.status(400).json({ error: 'La cantidad vendida debe ser un número positivo' });
        }

        const nota = await Nota.findById(id);
        if (!nota) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        if (nota.estado !== 'finalizado') {
            return res.status(400).json({ error: 'La nota no está finalizada' });
        }

        const helado = nota.catalogo.find(h => h.helado_id.toString() === heladoId);
        if (!helado) {
            return res.status(404).json({ error: 'Helado no encontrado en la nota' });
        }

        // Verificar si la cantidad vendida no excede la cantidad original
        if (cantidadVendida > helado.cantidad_inicial) {
            return res.status(400).json({ error: 'La cantidad vendida no puede ser mayor que la cantidad inicial' });
        }

        helado.cantidad_vendida = cantidadVendida;

        await nota.save();

        res.status(200).json({ mensaje: 'Cantidad vendida actualizada exitosamente', nota });
    } catch (error) {
        console.error('Error al actualizar la cantidad vendida:', error); // Esto ayudará a depurar el error
        res.status(500).json({ error: 'Error al editar la cantidad vendida del helado', detalle: error.message });
    }
};









 
export default {
    Crear,
    ListaNotasActivas,
    TraerNotaActiva,
    RecargarCatalogo,
    EditarNotaActiva,
    ListaNotasFinalizada,
    TraerFactura,
    DetalleNota,
    FinalizarNota,
    EditarFinalizado,
    Eliminar
};
