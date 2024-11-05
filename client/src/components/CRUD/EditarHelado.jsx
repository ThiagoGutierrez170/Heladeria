import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarHelado = () => {
    const { id } = useParams(); // Obtener el ID del helado de la URL
    const navigate = useNavigate(); // Para redirigir después de la actualización

    const [datosFormulario, setDatosFormulario] = useState({
        nombre: '',
        imagen: '',
        costo: '',
        precioBase: '',
        precioVenta: '',
        cantidadCaja: '',
        stock: '',
        estado: true,
    });

    // Cargar el helado al iniciar el componente
    useEffect(() => {
        const getHelado = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/api/helados/${id}`);
                setDatosFormulario(response.data); // Rellenar el formulario con los datos del helado
            } catch (error) {
                console.error('Error al obtener los datos del helado:', error);
            }
        };

        if (id) getHelado();
    }, [id]);

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        setDatosFormulario({
            ...datosFormulario,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:9999/api/helados/${id}`, datosFormulario);
            console.log('Helado actualizado:', response.data);
            navigate(`/helados`); // Redirige a la lista de helados
        } catch (error) {
            console.error('Error al actualizar el helado:', error);
        }
    };

    return (
        <div className='center-container-div'>
            <h1>Editar Helado</h1>
            <form className='center-container-div' onSubmit={manejarEnvio}>
                <div>
                    <label htmlFor="nombre">Nombre:</label><br />
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className='text-finder'
                        value={datosFormulario.nombre}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="imagen">Imagen (URL):</label><br />
                    <input
                        type="text"
                        id="imagen"
                        name="imagen"
                        className='text-finder'
                        value={datosFormulario.imagen}
                        onChange={manejarCambio}
                    />
                </div>
                <div>
                    <label htmlFor="costo">Costo:</label><br />
                    <input
                        type="number"
                        id="costo"
                        name="costo"
                        className='text-finder'
                        value={datosFormulario.costo}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="precioBase">Precio Base:</label><br />
                    <input
                        type="number"
                        id="precioBase"
                        name="precioBase"
                        className='text-finder'
                        value={datosFormulario.precioBase}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="precioVenta">Precio de Venta:</label><br />
                    <input
                        type="number"
                        id="precioVenta"
                        name="precioVenta"
                        className='text-finder'
                        value={datosFormulario.precioVenta}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="cantidadCaja">Cantidad en Caja:</label><br />
                    <input
                        type="number"
                        id="cantidadCaja"
                        name="cantidadCaja"
                        className='text-finder'
                        value={datosFormulario.cantidadCaja}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="stock">Stock:</label><br />
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        className='text-finder'
                        value={datosFormulario.stock}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="estado">Estado:</label><br />
                    <input
                        type="checkbox"
                        id="estado"
                        name="estado"
                        checked={datosFormulario.estado}
                        onChange={manejarCambio}
                    />
                </div>
                <button type="submit" className='submit-button'>Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarHelado;
