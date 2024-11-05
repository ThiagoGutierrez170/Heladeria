import React, { useState } from 'react';
import axios from 'axios';

const CrearHelado = () => {
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
            const respuesta = await axios.post('http://localhost:9999/api/helados/crear', datosFormulario);
            console.log('Helado agregado:', respuesta.data);

            // LIMPIEZA
            setDatosFormulario({
                nombre: '',
                imagen: '',
                costo: '',
                precioBase: '',
                precioVenta: '',
                cantidadCaja: '',
                stock: '',
                estado: true,
            });
        } catch (error) {
            console.error('Error al agregar el helado:', error);
        }
    };

    return (
        <div className='center-container-div'>
            <h1>Nuevo Helado</h1>
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
                <button type="submit" className='submit-button'>Agregar Helado</button>
            </form>
        </div>
    );
};

export default CrearHelado;
