import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecargaHelado = () => {
    const [helados, setHelados] = useState([]);
    const [cajas, setCajas] = useState({});

    // Obtener la lista de helados al montar el componente
    useEffect(() => {
        const obtenerHelados = async () => {
            try {
                const response = await axios.get("http://localhost:9999/api/helados");
                setHelados(response.data);
            } catch (error) {
                console.error("Error al obtener helados:", error);
            }
        };

        obtenerHelados();
    }, []);

    // Maneja los cambios en el input de cajas para cada helado
    const handleCajasChange = (e, heladoId) => {
        const { value } = e.target;
        setCajas({
            ...cajas,
            [heladoId]: value,
        });
    };

    // Actualiza el stock del helado
    const handleRecargarStock = async (helado) => {
        const cantidadCajas = parseInt(cajas[helado._id], 10) || 0;
        const nuevoStock = helado.stock + (cantidadCajas * helado.cantidadCaja);

        try {
            await axios.put(`http://localhost:9999/api/helados/actualizar/${helado._id}`, { stock: nuevoStock });
            alert(`Stock de ${helado.nombre} actualizado a ${nuevoStock}`);

            // Actualizar el estado de helados con el nuevo stock
            setHelados((prevHelados) =>
                prevHelados.map((h) => (h._id === helado._id ? { ...h, stock: nuevoStock } : h))
            );

            // Limpiar el input de cajas para este helado
            setCajas({ ...cajas, [helado._id]: "" });
        } catch (error) {
            console.error("Error al actualizar el stock:", error);
        }
    };

    return (
        <div>
            <h1>Recarga de Stock de Helados</h1>
            <ul>
                {helados.map((helado) => (
                    <li key={helado._id} className="helado-recarga-item">
                        <p><strong>Nombre:</strong> {helado.nombre}</p>
                        <p><strong>Stock Actual:</strong> {helado.stock}</p>
                        <p><strong>Unidades por Caja:</strong> {helado.cantidadCaja}</p>
                        <div>
                            <label htmlFor={`cajas-${helado._id}`}>Cantidad de Cajas:</label>
                            <input
                                type="number"
                                id={`cajas-${helado._id}`}
                                name={`cajas-${helado._id}`}
                                value={cajas[helado._id] || ""}
                                onChange={(e) => handleCajasChange(e, helado._id)}
                                min="0"
                                className="cajas-input"
                            />
                            <button onClick={() => handleRecargarStock(helado)}>Recargar Stock</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecargaHelado;
