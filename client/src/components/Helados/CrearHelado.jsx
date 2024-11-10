import React, { useState } from 'react';
import { Button, Container, TextField, Typography, FormControlLabel, Checkbox, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


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

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        setDatosFormulario({
            ...datosFormulario,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        const newErrors = {};

        Object.keys(datosFormulario).forEach((field) => {
            if (!datosFormulario[field] && field !== 'estado') {
                newErrors[field] = `Por favor proporciona ${labels[field].toLowerCase()}`;
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await axios.post('/api/helado', datosFormulario);
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
                navigate('/helados');
            } catch (error) {
                Swal.fire('Error!', 'Hubo un problema al registrar el helado.', 'error');
            }

        }
    };

    return (
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
    );
};

export default CrearHelado;
