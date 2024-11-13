import React, { useState } from 'react';
import { Button, Container, TextField, Typography, FormControlLabel, Checkbox, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';

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

    const handleCancel = () => {
        navigate('/helados');
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                p: { xs: 2, sm: 4 },
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
                textAlign: 'center',
                mt: { xs: 3, sm: 5 },
            }}
        >
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, color: '#333', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                Agregar Helado
            </Typography>
            <form onSubmit={manejarEnvio}>
                {['nombre', 'imagen', 'costo', 'precioBase', 'precioVenta', 'cantidadCaja', 'stock'].map((field) => (
                    <TextField
                        key={field}
                        label={labels[field]}
                        variant="outlined"
                        fullWidth
                        name={field}
                        value={datosFormulario[field]}
                        onChange={manejarCambio}
                        error={!!errors[field]}
                        helperText={errors[field]}
                        margin="normal"
                        type={['costo', 'precioBase', 'precioVenta', 'cantidadCaja', 'stock'].includes(field) ? 'number' : 'text'}
                        sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    />
                ))}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={datosFormulario.estado}
                            onChange={manejarCambio}
                            name="estado"
                            sx={{
                                '&.Mui-checked': { color: '#1976d2' },
                                '&.Mui-checked:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
                                '& .MuiSvgIcon-root': { fontSize: 28 },
                            }}
                        />
                    }
                    label="Estado"
                    sx={{ color: '#333', fontSize: { xs: '0.9rem', sm: '1rem' }, display: 'block', textAlign: 'left', my: 2 }}
                />
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon />}
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                        }}
                    >
                        Agregar
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        startIcon={<CancelIcon />}
                        sx={{
                            borderColor: '#f44336',
                            color: '#f44336',
                            '&:hover': {
                                borderColor: '#d32f2f',
                                color: '#d32f2f',
                            },
                        }}
                    >
                        Cancelar
                    </Button>
                </Stack>
            </form>
        </Container>
    );
};

export default CrearHelado;
