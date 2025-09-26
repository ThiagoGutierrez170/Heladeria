import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Stack, Checkbox, FormControlLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
//import axios from 'axios';
import api from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditarHelado = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [helado, setHelado] = useState({
        nombre: '',
        imagen: '',
        costo: '',
        precioBase: '',
        precioVenta: '',
        cantidadCaja: '',
        stock: '',
        estado: true,
    });

    useEffect(() => {
        const obtenerHelado = async () => {
            try {
                const response = await api.get(`/helado/${id}`);
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
            await api.put(`/helado/${id}`, helado);
            Swal.fire('Éxito', 'El helado ha sido actualizado.', 'success');
            navigate('/helados');
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
                backgroundColor: '#f5f5f5', // Fondo suave
            }}
        >
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, color: 'black' }}>
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
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff', // Fondo blanco
                            borderRadius: '5px', // Bordes redondeados
                        },
                    }}
                    required
                    InputProps={{
                        style: { color: 'black' },
                    }}
                />
                <TextField
                    fullWidth
                    label="Imagen URL"
                    name="imagen"
                    value={helado.imagen}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff', // Fondo blanco
                            borderRadius: '5px', // Bordes redondeados
                        },
                    }}
                    required
                    InputProps={{
                        style: { color: 'black' },
                    }}
                />
                <TextField
                    fullWidth
                    label="Costo"
                    name="costo"
                    value={helado.costo}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff',
                            borderRadius: '5px',
                        },
                    }}
                    required
                    InputProps={{
                        style: { color: 'black' },
                    }}
                />
                <TextField
                    fullWidth
                    label="Precio Base"
                    name="precioBase"
                    value={helado.precioBase}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff',
                            borderRadius: '5px',
                        },
                    }}
                    required
                    InputProps={{
                        style: { color: 'black' },
                    }}
                />
                <TextField
                    fullWidth
                    label="Precio Venta"
                    name="precioVenta"
                    value={helado.precioVenta}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff',
                            borderRadius: '5px',
                        },
                    }}
                    required
                    InputProps={{
                        style: { color: 'black' },
                    }}
                />
                <TextField
                    fullWidth
                    label="Cantidad por Caja"
                    name="cantidadCaja"
                    value={helado.cantidadCaja}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff',
                            borderRadius: '5px',
                        },
                    }}
                    required
                    InputProps={{
                        style: { color: 'black' },
                    }}
                />
                <TextField
                    fullWidth
                    label="Stock"
                    name="stock"
                    value={helado.stock}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                        mb: 3,
                        '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff',
                            borderRadius: '5px',
                        },
                    }}
                    required
                    InputProps={{
                        style: { color: 'black' },
                    }}
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
                    label={<span style={{ color: 'black', fontSize: '16px' }}>Estado</span>}
                    sx={{
                        marginBottom: 3,
                    }}
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
                        Actualizar
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

export default EditarHelado;
