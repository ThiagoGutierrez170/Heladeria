import React, { useState } from 'react';
<<<<<<< HEAD
import { Button, Container, TextField, Typography, FormControlLabel, Checkbox, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
=======
import axios from 'axios';
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2

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
<<<<<<< HEAD
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const labels = {
        nombre: 'Nombre del Helado',
        imagen: 'URL de Imagen',
        costo: 'Costo',
        precioBase: 'Precio Base',
        precioVenta: 'Precio de Venta',
        cantidadCaja: 'Cantidad en Caja',
        stock: 'Stock Disponible',
    };
=======
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        setDatosFormulario({
            ...datosFormulario,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
<<<<<<< HEAD
        const newErrors = {};

        Object.keys(datosFormulario).forEach((field) => {
            if (!datosFormulario[field] && field !== 'estado') {
                newErrors[field] = `Por favor proporciona ${labels[field].toLowerCase()}`;
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await axios.post('http://localhost:5000/api/helados', datosFormulario);
                Swal.fire('Helado agregado!', 'Has agregado correctamente el helado.', 'success');
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
                Swal.fire('Error!', 'Hubo un problema al registrar el helado.', 'error');
            }
=======
        try {
            const respuesta = await axios.post('/api/helado/', datosFormulario);
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
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2
        }
    };

    return (
<<<<<<< HEAD
        <Container maxWidth="sm" sx={{ p: 4, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)', borderRadius: 2, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, color: '#333' }}>
                Agregar Helado
            </Typography>
            <form onSubmit={manejarEnvio}>
                {['nombre', 'imagen', 'costo', 'precioBase', 'precioVenta', 'cantidadCaja', 'stock'].map((field) => (
                    <TextField
                        key={field}
                        label={labels[field]}  // Usando el label personalizado
                        variant="outlined"
                        fullWidth
                        name={field}
                        value={datosFormulario[field]}
                        onChange={manejarCambio}
                        error={!!errors[field]}
                        helperText={errors[field]}
                        margin="normal"
                        type={['costo', 'precioBase', 'precioVenta', 'cantidadCaja', 'stock'].includes(field) ? 'number' : 'text'}
                    />
                ))}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={datosFormulario.estado}
                            onChange={manejarCambio}
                            name="estado"
                            sx={{
                                '&.Mui-checked': {
                                    color: '#1976d2', // Color cuando está chequeado
                                },
                                '&.Mui-checked:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)', // Efecto hover
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: 28, // Tamaño del icono del checkbox
                                },
                            }}
                        />
                    }
                    label="Estado"
                    sx={{
                        marginRight: 300,
                        fontSize: '16px', // Tamaño de la fuente de la etiqueta
                        color: '#333', // Color de la etiqueta
                    }}
                />
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            sx={{ padding: '12px 24px', fontSize: '16px', '&:hover': { backgroundColor: '#0056b3' } }}
                        >
                            Agregar
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate('/helados')}
                            startIcon={<CancelIcon />}
                            sx={{ padding: '12px 24px', fontSize: '16px' }}
                        >
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
=======
        <div className='center-container-div'>
            <h1>Nuevo Helado</h1>
            <form className='center-container-div' onSubmit={manejarEnvio}>
                <div>
                    <label htmlFor="nombre">Nombre:</label><br />
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className='dato-entrada'
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
                        className='dato-entrada'
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
                        className='dato-entrada'
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
                        className='dato-entrada'
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
                        className='dato-entrada'
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
                        className='dato-entrada'
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
                        className='dato-entrada'
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
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2
    );
};

export default CrearHelado;
