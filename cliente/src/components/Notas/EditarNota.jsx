import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
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
    const [vendedores, setVendedores] = useState([]); // Estado para almacenar la lista de vendedores

    const opcionesPlaya = ['San José', 'Mboi ka´e', 'San Isidro', 'Evento'];
    const opcionesClima = ['soleado', 'despejado', 'nublado', 'lluvia', 'tormenta'];
    const opcionesEstado = ['activo', 'finalizado'];

    useEffect(() => {
        // Obtener la nota por su ID
        const fetchNota = async () => {
            try {
                const response = await axios.get(`/api/nota/activas/${id}`);
                const notaData = response.data;

                // Asegurarse de que el vendedor esté correctamente asignado
                setNota({
                    ...notaData,
                    vendedor: notaData.vendedor_id ? notaData.vendedor_id._id : '', // Asegúrate de acceder al ID del vendedor
                });
            } catch (error) {
                console.error('Error al cargar la nota:', error);
            }
        };

        // Obtener la lista de vendedores
        const fetchVendedores = async () => {
            try {
                const response = await axios.get('/api/vendedor'); // Cambia esta URL a la correcta en tu backend
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

        if (!nota.playa) newErrors.playa = 'Por favor selecciona la playa';
        if (!nota.clima) newErrors.clima = 'Por favor selecciona el clima';
        if (!nota.vendedor) newErrors.vendedor = 'Por favor selecciona el vendedor';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await axios.put(`/api/nota/activas/${id}`, nota);
                Swal.fire('Guardado', 'La nota ha sido actualizada con éxito', 'success');
                navigate('/notas-activas');
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al actualizar la nota', 'error');
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom color='black' sx={{ mb: 2 }}>
                Editar Nota
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    select
                    label="Playa"
                    name="playa"
                    value={nota.playa}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.playa}
                    helperText={errors.playa}
                >
                    {opcionesPlaya.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                
                <TextField
                    select
                    label="Clima"
                    name="clima"
                    value={nota.clima}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.clima}
                    helperText={errors.clima}
                >
                    {opcionesClima.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Campo para seleccionar el vendedor */}
                <TextField
                    select
                    label="Vendedor"
                    name="vendedor"
                    value={nota.vendedor}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.vendedor}
                    helperText={errors.vendedor}
                >
                    {vendedores.map((vendedor) => (
                        <MenuItem key={vendedor._id} value={vendedor._id}>
                            {vendedor.nombre} {vendedor.apellido} {/* Muestra el nombre y apellido del vendedor */}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Guardar Cambios
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(-1)}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Cancelar
                </Button>
            </form>
        </Container>
    );
};

export default EditarNota;
