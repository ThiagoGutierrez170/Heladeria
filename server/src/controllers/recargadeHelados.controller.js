import Helado from '../models/Helado.js';

export const recargarHelados = async (req, res) => {
    const { recargas } = req.body; // El array de recargas [{id, cantidadCajas}, ...]

    try {
        for (let recarga of recargas) {
            const { id, cantidadCajas } = recarga;

            const helado = await Helado.findById(id);
            if (!helado) {
                return res.status(404).json({ message: `Helado con id ${id} no encontrado.` });
            }

            // Aumentar el stock usando la cantidadCaja del helado (cuántos helados por caja)
            helado.stock += cantidadCajas * helado.cantidadCaja;

            // Guardar los cambios en la base de datos
            await helado.save();
        }

        res.status(200).json({ message: 'Recarga completada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al recargar helados', error });
    }
};