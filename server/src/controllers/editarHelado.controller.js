export const editarHelado = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, imagen, costo, precioBase, precioVenta, cantidadCaja, stock } = req.body;
    
            // Verificar si todos los datos necesarios están presentes
            if (!nombre || !costo || !precioBase || !precioVenta || !cantidadCaja || !stock) {
                return res.status(400).json({ error: 'Faltan datos' });
            }
    
            // Encontrar y actualizar el helado
            const heladoActualizado = await Helado.findByIdAndUpdate(
                id,
                { nombre, imagen, costo, precioBase, precioVenta, cantidadCaja, stock },
                { new: true } // Devuelve el documento actualizado
            );
    
            if (!heladoActualizado) {
                return res.status(404).json({ error: 'Helado no encontrado' });
            }
    
            return res.status(200).json(heladoActualizado);
        } catch (error) {
            return res.status(400).json({ error: 'Error al editar el helado', detalles: error.message });
        }
    };