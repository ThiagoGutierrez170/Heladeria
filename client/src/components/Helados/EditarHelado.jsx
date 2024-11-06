<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Stack, Checkbox, FormControlLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditarHelado = () => {
    const [helado, setHelado] = useState({
=======
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarHelado = () => {
    const { id } = useParams(); // Obtener el ID del helado de la URL
    const navigate = useNavigate(); // Para redirigir después de la actualización

    const [datosFormulario, setDatosFormulario] = useState({
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2
        nombre: '',
        imagen: '',
        costo: '',
        precioBase: '',
        precioVenta: '',
        cantidadCaja: '',
        stock: '',
        estado: true,
    });
<<<<<<< HEAD
    const { id } = useParams(); // Para obtener el ID del helado a editar
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerHelado = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/helado/${id}`);
                setHelado(response.data);
            } catch (error) {
                console.error('Error al obtener el helado:', error);
            }
        };
        obtenerHelado();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHelado({ ...helado, [name]: value });
    };

    const handleEstadoChange = (e) => {
        setHelado({ ...helado, estado: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/helado/${id}`, helado);
            Swal.fire('Éxito', 'El helado ha sido actualizado.', 'success');
            navigate('/helados'); // Redirigir a la lista de helados después de la actualización
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al actualizar el helado.', 'error');
        }
    };

    const handleCancel = () => {
        navigate('/helados');
    };

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                maxWidth: 'sm',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
                backgroundColor: '#ffffff',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom color="primary" sx={{ mb: 3 }}>
                Editar Helado
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={helado.nombre}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="Imagen URL"
                    name="imagen"
                    value={helado.imagen}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="Costo"
                    name="costo"
                    value={helado.costo}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="Precio Base"
                    name="precioBase"
                    value={helado.precioBase}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="Precio Venta"
                    name="precioVenta"
                    value={helado.precioVenta}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="Cantidad por Caja"
                    name="cantidadCaja"
                    value={helado.cantidadCaja}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="Stock"
                    name="stock"
                    value={helado.stock}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={helado.estado}
                            onChange={handleEstadoChange}
                            sx={{
                                '&.Mui-checked': {
                                    color: '#1976d2',
                                },
                                '&.Mui-checked:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: 28,
                                },
                            }}
                        />
                    }
                    label="Estado"
                    sx={{
                        marginBottom: 3,
                        fontSize: '16px',
                        color: '#333',
                    }}
                />
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon />}
                    >
                        Actualizar
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        startIcon={<CancelIcon />}
                    >
                        Cancelar
                    </Button>
                </Stack>
            </form>
        </Container>
=======

    // Cargar el helado al iniciar el componente
    useEffect(() => {
        const getHelado = async () => {
            try {
                const response = await axios.get(`/api/helados/${id}`);
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
            const response = await axios.put(`/api/helados/${id}`, datosFormulario);
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
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2
    );
};

export default EditarHelado;
