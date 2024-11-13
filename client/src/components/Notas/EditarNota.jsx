import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, MenuItem, Grid, FormControl, InputLabel, Select, Box } from '@mui/material';
import Swal from 'sweetalert2';

const EditarNota = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nota, setNota] = useState({
        playa: '',
        clima: '',
        estado: '',
        catalogo: [],
        vendedor: '',
    });
    const [errors, setErrors] = useState({});
    const [vendedores, setVendedores] = useState([]);

    const opcionesPlaya = ['San José', 'Mboi ka´e', 'San Isidro', 'Evento'];
    const opcionesClima = ['soleado', 'despejado', 'nublado', 'lluvia', 'tormenta'];

    useEffect(() => {
        // Obtener la nota por su ID
        const fetchNota = async () => {
            try {
                const response = await axios.get(`/api/nota/activas/${id}`);
                const notaData = response.data;
                setNota({
                    ...notaData,
                    vendedor: notaData.vendedor_id ? notaData.vendedor_id._id : '',
                });
            } catch (error) {
                console.error('Error al cargar la nota:', error);
            }
        };

        // Obtener la lista de vendedores
        const fetchVendedores = async () => {
            try {
                const response = await axios.get('/api/vendedor');
                setVendedores(response.data);
            } catch (error) {
                console.error('Error al cargar los vendedores:', error);
            }
        };

        fetchNota();
        fetchVendedores();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNota({ ...nota, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validación de campos
        if (!nota.playa) newErrors.playa = 'Por favor selecciona la playa';
        if (!nota.clima) newErrors.clima = 'Por favor selecciona el clima';
        if (!nota.vendedor) newErrors.vendedor = 'Por favor selecciona el vendedor';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                // Actualizar la nota en el backend
                await axios.put(`/api/nota/activas/${id}`, nota);
                Swal.fire('Guardado', 'La nota ha sido actualizada con éxito', 'success');
                navigate('/notas-activas');
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al actualizar la nota', 'error');
            }
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, color: '#333' }}>
                Editar Nota de Venta
            </Typography>
            <form onSubmit={handleSubmit}>
                {/* Campo de selección Playa */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Playa</InputLabel>
                    <Select
                        label="Playa"
                        name="playa"
                        value={nota.playa}
                        onChange={handleInputChange}
                        error={!!errors.playa}
                    >
                        {opcionesPlaya.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.playa && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{errors.playa}</Typography>}
                </FormControl>

                {/* Campo de selección Clima */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Clima</InputLabel>
                    <Select
                        label="Clima"
                        name="clima"
                        value={nota.clima}
                        onChange={handleInputChange}
                        error={!!errors.clima}
                    >
                        {opcionesClima.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.clima && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{errors.clima}</Typography>}
                </FormControl>

                {/* Campo de selección Vendedor */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Vendedor</InputLabel>
                    <Select
                        label="Vendedor"
                        name="vendedor"
                        value={nota.vendedor}
                        onChange={handleInputChange}
                        error={!!errors.vendedor}
                    >
                        {vendedores.map((vendedor) => (
                            <MenuItem key={vendedor._id} value={vendedor._id}>
                                {vendedor.nombre} {vendedor.apellido}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.vendedor && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{errors.vendedor}</Typography>}
                </FormControl>

                {/* Botón para guardar los cambios */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ width: '48%' }}
                    >
                        Guardar Cambios
                    </Button>

                    {/* Botón para cancelar */}
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(-1)}
                        sx={{ width: '48%' }}
                    >
                        Cancelar
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default EditarNota;
