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
                cantidad_inicial: cantidadInicial,
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
// Editar una nota activa (Con gestión inteligente de stock)
const EditarNotaActiva = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendedor_id, playa, clima, catalogoNuevosDatos } = req.body;

        const nota = await Nota.findById(id);
        if (!nota || nota.estado !== 'activo') {
            return res.status(404).json({ error: 'Nota activa no encontrada' });
        }

        // 1. Actualizar datos básicos
        nota.vendedor_id = vendedor_id || nota.vendedor_id;
        nota.playa = playa || nota.playa;
        nota.clima = clima || nota.clima;

        // 2. Gestión del Catálogo y Stock
        if (catalogoNuevosDatos && Array.isArray(catalogoNuevosDatos)) {
            
            const nuevoCatalogoProcesado = [];

            for (let itemNuevo of catalogoNuevosDatos) {
                const heladoId = itemNuevo.helado_id;
                const nuevaCantidadInicial = parseInt(itemNuevo.cantidad_inicial, 10) || 0;
                // Aseguramos que recargas sea un array de números
                const nuevasRecargas = Array.isArray(itemNuevo.recargas) 
                    ? itemNuevo.recargas.map(r => parseInt(r, 10) || 0) 
                    : [];

                // Buscamos datos anteriores
                const itemExistente = nota.catalogo.find(i => i.helado_id.toString() === heladoId);
                
                const cantidadInicialAnterior = itemExistente ? itemExistente.cantidad_inicial : 0;
                // Sumamos las recargas viejas
                const sumaRecargasAnterior = itemExistente 
                    ? itemExistente.recargas.reduce((acc, curr) => acc + curr, 0) 
                    : 0;

                // Sumamos las recargas nuevas
                const sumaRecargasNueva = nuevasRecargas.reduce((acc, curr) => acc + curr, 0);

                // Calculamos el TOTAL (Inicial + Recargas) anterior vs nuevo
                const totalAnterior = cantidadInicialAnterior + sumaRecargasAnterior;
                const totalNuevo = nuevaCantidadInicial + sumaRecargasNueva;

                const diferencia = totalNuevo - totalAnterior;

                // Ajuste de Stock
                if (diferencia !== 0) {
                    const helado = await Helado.findById(heladoId);
                    if (helado) {
                        // Si diferencia es positiva (aumentó la nota), restamos stock
                        // Si diferencia es negativa (disminuyó la nota), sumamos stock
                        helado.stock -= diferencia; 
                        await helado.save();
                    }
                }

                // Solo agregamos al nuevo catálogo si hay movimiento (inicial > 0 o hay recargas)
                if (nuevaCantidadInicial > 0 || nuevasRecargas.length > 0) {
                    nuevoCatalogoProcesado.push({
                        helado_id: heladoId,
                        cantidad_inicial: nuevaCantidadInicial,
                        recargas: nuevasRecargas, // <--- Aquí guardamos las nuevas recargas editadas
                        cantidad_vendida: 0 
                    });
                }
            }

            // 3. Manejar helados ELIMINADOS (Devolución total de stock)
            const idsNuevos = catalogoNuevosDatos.map(i => i.helado_id);
            const itemsEliminados = nota.catalogo.filter(i => !idsNuevos.includes(i.helado_id.toString()));

            for (let itemEliminado of itemsEliminados) {
                const totalADevolver = itemEliminado.cantidad_inicial + itemEliminado.recargas.reduce((a, b) => a + b, 0);
                if (totalADevolver > 0) {
                    const helado = await Helado.findById(itemEliminado.helado_id);
                    if (helado) {
                        helado.stock += totalADevolver;
                        await helado.save();
                    }
                }
            }

            nota.catalogo = nuevoCatalogoProcesado;
        }

        await nota.save();
        res.status(200).json({ mensaje: 'Nota activa actualizada exitosamente', nota });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar la nota activa', detalle: error.message });
    }
};

// Lista de notas finalizadas (información y cálculos de ganancias base total)
// Lista de notas finalizadas (usando cantidad vendida para calcular la ganancia base total)
const ListaNotasFinalizada = async (req, res) => {
    try {
        // 1. Obtener parámetros de la query
        const { page = 1, limit = 20, playa, startDate, endDate } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // 2. Construir el objeto de búsqueda (Query Dinámica)
        let query = { estado: 'finalizado' };

        // Filtro por Playa
        if (playa && playa.trim() !== "") {
            query.playa = playa;
        }

        // Filtro por Rango de Fechas
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate); // Desde las 00:00:00 de esa fecha
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Hasta el último milisegundo de ese día
                query.createdAt.$lte = end;
            }
        }

        // 3. Ejecutar la consulta con el objeto 'query' dinámico
        const notasFinalizadas = await Nota.find(query)
            .populate('vendedor_id', 'nombre apellido')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // 4. Obtener el total basado en la MISMA query (importante para la paginación)
        const totalNotas = await Nota.countDocuments(query);

        const notasConGanancias = notasFinalizadas.map(nota => {
            return {
                _id: nota._id,
                vendedor_id: nota.vendedor_id,
                playa: nota.playa,
                clima: nota.clima,
                createdAt: nota.createdAt,
                gananciaBaseTotal: nota.totalBase, 
            };
        });

        res.status(200).json({
            notas: notasConGanancias,
            totalRecords: totalNotas,
            totalPages: Math.ceil(totalNotas / parseInt(limit)),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener notas finalizadas', detalle: error.message });
    }
};

const ListaNotasSupervisor = async (req, res) => {
    try {
        const { page = 1, limit = 20, playa, startDate, endDate } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Filtro base: solo notas finalizadas
        let query = { estado: 'finalizado' };

        // Filtro por Playa
        if (playa && playa !== "") {
            query.playa = playa;
        }

        // Filtro por Rango de Fechas
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Incluir todo el día final
                query.createdAt.$lte = end;
            }
        }

        const notasFinalizadas = await Nota.find(query)
            .populate('vendedor_id', 'nombre apellido')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalNotas = await Nota.countDocuments(query);

        const notasParaSupervisor = notasFinalizadas.map(nota => ({
            _id: nota._id,
            vendedor_id: nota.vendedor_id, // Para que el frontend acceda a nombre/apellido
            playa: nota.playa,
            createdAt: nota.createdAt,
            recaudacionTotal: nota.totalVenta 
        }));

        res.status(200).json({
            notas: notasParaSupervisor,
            totalRecords: totalNotas,
            totalPages: Math.ceil(totalNotas / parseInt(limit)),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado' });
    }
};

const TraerFactura = async (req, res) => {
    try {
        const { id } = req.params;

        // Encuentra la nota por ID y popula el vendedor y el catálogo
        const nota = await Nota.findById(id)
            .populate('vendedor_id', 'nombre apellido') 
            .populate('catalogo.helado_id', 'nombre precioBase imagen'); 

        if (!nota || nota.estado !== 'finalizado') {
            return res.status(404).json({ error: 'Nota finalizada no encontrada' });
        }

        let calculoTotalEnVivo = 0; // Variable para recalcular el total

        // Crea el detalle de la factura calculando la ganancia base
        const detallesFactura = nota.catalogo.map(item => {
            // Protección por si se borró el helado
            if (!item.helado_id) return null;

            const cantidadTotal = item.cantidad_inicial + item.recargas.reduce((acc, r) => acc + r, 0);
            const cantidadVendida = item.cantidad_vendida;
            
            // Usamos el precio guardado en el item si existe, si no el del helado actual
            const precioUnitario = item.precio || item.helado_id.precioBase;
            const gananciaItem = cantidadVendida * precioUnitario;

            calculoTotalEnVivo += gananciaItem; // Sumamos al total global

            return {
                imagen: item.helado_id.imagen, 
                nombre: item.helado_id.nombre,
                cantidadTotal,
                cantidadVendida,
                gananciaBase: gananciaItem
            };
        }).filter(item => item !== null);

        // Usamos el cálculo en vivo si el guardado en BD es 0 o inconsistente
        // Esto soluciona el error visual del "0"
        const gananciaTotalBase = (nota.totalBase > 0) ? nota.totalBase : calculoTotalEnVivo;

        res.status(200).json({
            detallesFactura,
            gananciaTotalBase, // Ahora enviamos el valor asegurado
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
            .populate('catalogo.helado_id')
            .populate('vendedor_id', 'nombre apellido');

        if (!nota || nota.estado !== 'finalizado') {
            return res.status(404).json({ error: 'Nota finalizada no encontrada' });
        }

        const detallesGanancias = nota.catalogo.map(item => {
            // Protección por si se borró el helado
            if (!item.helado_id) return null;

            const subtotalReal = item.subtotal > 0 
                ? item.subtotal 
                : (item.cantidad_vendida * (item.precio || item.helado_id.precioBase));

            return {
                // CORRECCIÓN AQUÍ: Solo enviamos el ID como texto, no el objeto entero
                helado_id: item.helado_id._id, 
                
                nombre: item.helado_id.nombre,
                imagen: item.helado_id.imagen,
                cantidadVendida: item.cantidad_vendida,
                
                precioUnitario: item.precio || item.helado_id.precioBase,
                subtotal: subtotalReal,

                gananciaMinima: item.cantidad_vendida * item.helado_id.costo,
                gananciaBase: item.cantidad_vendida * item.helado_id.precioBase,
                gananciaTotal: item.cantidad_vendida * item.helado_id.precioVenta
            };
        }).filter(item => item !== null); // Filtramos nulos

        res.status(200).json({
            detallesGanancias,
            gananciaMinima: nota.totalCosto,
            gananciaBase: nota.totalBase,    
            gananciaTotal: nota.totalVenta,
            vendedor_id: nota.vendedor_id ? { nombre: nota.vendedor_id.nombre, apellido: nota.vendedor_id.apellido } : null,
            playa: nota.playa,
            clima: nota.clima,
            fecha: nota.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el detalle de la nota', detalle: error.message });
    }
};

const getDetalleNotaSupervisor = async (req, res) => {
    try {
        const { id } = req.params;
        const nota = await Nota.findById(id)
            .populate('vendedor_id', 'nombre apellido')
            .populate('catalogo.helado_id', 'nombre imagen');

        if (!nota) return res.status(404).json({ error: "Nota no encontrada" });

        // Mapeamos solo los datos permitidos para supervisores
        const detallesVenta = nota.catalogo.map(item => ({
            nombre: item.helado_id.nombre,
            imagen: item.helado_id.imagen,
            cantidadVendida: item.cantidad_vendida,
            // El supervisor solo ve el subtotal de venta (cantidad * precio_venta)
            subtotalVenta: item.subtotal 
        }));

        res.json({
            vendedor: nota.vendedor_id,
            playa: nota.playa,
            clima: nota.clima,
            fecha: nota.createdAt,
            detallesVenta,
            totalGeneralVenta: nota.totalVenta // Solo el total final de ventas
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener detalle para supervisor" });
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

        let acumTotalCosto = 0;
        let acumTotalBase = 0;
        let acumTotalVenta = 0;

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

                const vendida = item.cantidad_vendida;

                item.precio = helado.precioBase; 
                item.subtotal = vendida * helado.precioBase;
                
                acumTotalCosto += vendida * helado.costo;
                acumTotalBase += vendida * helado.precioBase;
                acumTotalVenta += vendida * helado.precioVenta;
            } else {
                console.log(`Helado con ID ${heladoId} no encontrado`);
            }
        }

        // Actualiza los totales en la nota
        nota.totalCosto = acumTotalCosto;
        nota.totalBase = acumTotalBase;
        nota.totalVenta = acumTotalVenta;

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

        if (!heladoId || cantidadVendida === undefined) {
            return res.status(400).json({ error: 'heladoId y cantidadVendida son requeridos' });
        }
        
        // Validación básica
        if (isNaN(cantidadVendida) || cantidadVendida < 0) {
            return res.status(400).json({ error: 'La cantidad vendida debe ser un número positivo' });
        }

        const nota = await Nota.findById(id);
        if (!nota || nota.estado !== 'finalizado') {
            return res.status(404).json({ error: 'Nota no encontrada o no finalizada' });
        }

        // Buscamos el ítem específico
        const itemAModificar = nota.catalogo.find(h => h.helado_id.toString() === heladoId);
        if (!itemAModificar) {
            return res.status(404).json({ error: 'Helado no encontrado en la nota' });
        }

        if (cantidadVendida > itemAModificar.cantidad_inicial) {
            return res.status(400).json({ error: 'La cantidad vendida no puede ser mayor que la cantidad inicial' });
        }

        // 1. Actualizamos la cantidad
        itemAModificar.cantidad_vendida = cantidadVendida;

        let precioReferencia = itemAModificar.precio;
        
        if (!precioReferencia || precioReferencia === 0) {
             const hInfo = await Helado.findById(heladoId);
             precioReferencia = hInfo ? hInfo.precioBase : 0;
             itemAModificar.precio = precioReferencia; 
        }

        itemAModificar.subtotal = cantidadVendida * precioReferencia;

        let nuevoTotalCosto = 0;
        let nuevoTotalBase = 0;
        let nuevoTotalVenta = 0;

        for (let item of nota.catalogo) {
            if (item.precio && item.precio > 0) {
                // Si tenemos datos históricos (Ideal)
                const hInfo = await Helado.findById(item.helado_id); 
                
                const costoActual = hInfo ? hInfo.costo : 0;
                const pVentaActual = hInfo ? hInfo.precioVenta : 0;

                nuevoTotalCosto += item.cantidad_vendida * costoActual;
                nuevoTotalBase += item.subtotal; // Usamos el subtotal ya calculado y guardado
                nuevoTotalVenta += item.cantidad_vendida * pVentaActual;
            } else {
                const hInfo = await Helado.findById(item.helado_id);
                if(hInfo) {
                    nuevoTotalCosto += item.cantidad_vendida * hInfo.costo;
                    nuevoTotalBase += item.cantidad_vendida * hInfo.precioBase;
                    nuevoTotalVenta += item.cantidad_vendida * hInfo.precioVenta;
                }
            }
        }

        nota.totalCosto = nuevoTotalCosto;
        nota.totalBase = nuevoTotalBase;
        nota.totalVenta = nuevoTotalVenta;

        await nota.save();

        res.status(200).json({ mensaje: 'Nota actualizada y recalvulada exitosamente', nota });
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ error: 'Error al editar la nota', detalle: error.message });
    }
};
/*
const MigrarNotasViejas = async (req, res) => {
    try {
        const notas = await Nota.find({ estado: 'finalizado' }).populate('catalogo.helado_id');
        
        let actualizadas = 0;

        for (let nota of notas) {
            // OPCIONAL: Si quieres forzar la actualización aunque ya tenga totales, 
            // comenta la línea del 'continue'. Si solo quieres arreglar las que están en 0, déjala.
            // if (nota.totalBase > 0) continue; 

            console.log(`Procesando nota ID: ${nota._id}`);

            let costoGlobal = 0;
            let baseGlobal = 0;
            let ventaGlobal = 0;

            // 2. Iteramos sobre cada helado dentro de la nota (el catálogo)
            // Usamos un bucle for clásico o for..of para poder modificar el objeto 'item'
            for (let item of nota.catalogo) {
                
                // Verificamos que el helado exista y que el populate haya funcionado
                if (item.helado_id) {
                    const cantidad = item.cantidad_vendida;
                    
                    // Obtenemos los precios de referencia del producto (Helado)
                    const pCosto = item.helado_id.costo || 0;
                    const pBase = item.helado_id.precioBase || 0;     // Usamos Precio Base como referencia
                    const pVenta = item.helado_id.precioVenta || 0;

                    // --- ACTUALIZAMOS EL ITEM INDIVIDUAL (LO QUE PEDISTE) ---
                    // Guardamos el precio unitario en el detalle
                    item.precio = pBase; 
                    // Guardamos el subtotal individual
                    item.subtotal = cantidad * pBase; 

                    // --- SUMAMOS A LOS TOTALES GENERALES ---
                    costoGlobal += cantidad * pCosto;
                    baseGlobal += cantidad * pBase;   // Sumamos al total de la nota
                    ventaGlobal += cantidad * pVenta;
                }
            }

            // 3. Asignamos los nuevos acumulados a la Nota principal
            nota.totalCosto = costoGlobal;
            nota.totalBase = baseGlobal;
            nota.totalVenta = ventaGlobal;

            // Guardamos la nota completa (esto guarda los cambios en catalogo y en los totales)
            await nota.save();
            actualizadas++;
        }

        res.json({ 
            mensaje: 'Migración detallada completada con éxito', 
            notas_procesadas: notas.length, 
            notas_actualizadas: actualizadas 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en migración' });
    }
};*/

/*
const MigrarTurnoYClima = async (req, res) => {
    try {
        // 1. Actualizar todas las notas: poner turno 'Dia' y borrar clima
        const resultado = await Nota.updateMany(
            {}, // Filtro vacío para afectar a TODAS las notas
            { 
                $set: { turno: 'Dia' },     // Agrega el campo turno
                $unset: { clima: "" }       // Elimina el campo clima
            }
        );

        res.json({ 
            mensaje: 'Migración de turno y clima completada', 
            notas_modificadas: resultado.modifiedCount 
        });

    } catch (error) {
        console.error("Error en la migración:", error);
        res.status(500).json({ error: 'Error interno durante la migración' });
    }
};*/

export default {
    Crear,
    ListaNotasActivas,
    TraerNotaActiva,
    RecargarCatalogo,
    EditarNotaActiva,
    ListaNotasFinalizada,
    ListaNotasSupervisor,
    TraerFactura,
    DetalleNota,
    getDetalleNotaSupervisor,
    FinalizarNota,
    EditarFinalizado,
    Eliminar,
    //MigrarNotasViejas
    //MigrarTurnoYClima
};
