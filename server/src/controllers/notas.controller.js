import Nota from "../models/nota.models.js";

// Crear una nueva nota
const create = async (req, res) => {
    try {
        const { vendedor_id, catalogo, playa, clima} = req.body;
        const creador = req.user.id;  // Obtenemos el id del usuario logueado desde el token

        // Creamos la nueva nota con el creador asociado
        const newElement = await Nota.create({ titulo, descripcion, estado, creador });
        res.status(201).json(newElement);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

export default {
    create,
    findAll,
    findById,
    updateById,
    deleteById,
};