import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const HeladoDetalle = () => {
    const { id_helado } = useParams();
    const navigate = useNavigate();
    const [helado, setHelado] = useState(null); // Estado inicial en `null` para mejor control
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("ID del helado:", id_helado); // Verificar si id_helado es correcto

        const obtenerHelado = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/api/helados/${id_helado}`);
                setHelado(response.data);
                console.log('Datos del helado:', response.data); // Confirmar si los datos son correctos
            } catch (error) {
                console.error('Error en la solicitud:', error);
                setError(error.message || 'Ha ocurrido un error');
            } finally {
                setLoading(false); // Asegurar que loading cambia correctamente
                console.log('Estado de loading:', loading); // Confirmar si loading cambia
            }
        };

        if (id_helado) obtenerHelado(); // Solo llama a la función si `id_helado` está definido
    }, [id_helado]);

    const editarHelado = () => {
        navigate(`/editar/helado/${id_helado}`);
    };

    const eliminarHelado = async () => {
        try {
            await axios.delete(`http://localhost:9999/api/helados/eliminar/${id_helado}`);
            alert("Helado eliminado correctamente");
            navigate("/helados"); // Redirige a la lista de helados tras eliminar
        } catch (error) {
            console.error("Error al eliminar el helado:", error);
            setError(error.message || "Error al eliminar el helado");
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="helado-information-div">
            <h1>{helado?.nombre}</h1>
            <p className="helado-info">Costo: ${helado?.costo}</p>
            <p className="helado-info">Precio Base: ${helado?.precioBase}</p>
            <p className="helado-info">Precio de Venta: ${helado?.precioVenta}</p>
            <p className="helado-info">Cantidad en Caja: {helado?.cantidadCaja}</p>
            <p className="helado-info">Stock: {helado?.stock}</p>
            <p className="helado-info">Estado: {helado?.estado ? "Activo" : "Inactivo"}</p>
            {helado?.imagen && <img src={helado.imagen} alt={`${helado.nombre} imagen`} className="helado-imagen" />}

            <button className='update-button' onClick={editarHelado}>Editar Helado</button>
            <button className='delete-button' onClick={eliminarHelado}>Eliminar Helado</button>
        </div>
    );
};

export default HeladoDetalle;
