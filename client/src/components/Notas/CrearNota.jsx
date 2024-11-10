import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Typography, Button, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CrearNota = () => {
    const [vendedor, setVendedor] = useState('');
    const [playa, setPlaya] = useState('');
    const [clima, setClima] = useState('');
    const [catalogo, setCatalogo] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener helados activos y vendedores para los menús desplegables
        const fetchData = async () => {
            try {
                const heladoResponse = await axios.get('/api/helado?estado=activo'); // Filtrar helados por estado activo
                const vendedorResponse = await axios.get('/api/vendedor');
                const heladosActivos = heladoResponse.data.map((helado) => ({
                    helado_id: helado._id,
                    nombre: helado.nombre,
                    imagen_url: helado.imagen_url,
                    cantidad_inicial: 0,
                }));
                setCatalogo(heladosActivos);
                setVendedores(vendedorResponse.data);
            } catch (error) {
                console.error("Error al cargar helados o vendedores:", error);
            }
        };
        fetchData();
    }, []);

    const handleChangeCantidad = (index, cantidad) => {
        const cantidadNumerica = parseInt(cantidad, 10);

        if (cantidadNumerica < 0) {
            // Si se ingresa un valor negativo, mostrar un alerta
            Swal.fire('Error', 'La cantidad no puede ser negativa.', 'error');
            return;  // No actualizamos el estado si el número es negativo
        }

        const newCatalogo = [...catalogo];
        newCatalogo[index].cantidad_inicial = isNaN(cantidadNumerica) ? 0 : cantidadNumerica;
        setCatalogo(newCatalogo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!vendedor) newErrors.vendedor = 'Seleccione un vendedor';
        if (!playa) newErrors.playa = 'Seleccione una playa';
        if (!clima) newErrors.clima = 'Seleccione el clima';
        if (catalogo.every(item => item.cantidad_inicial === 0)) {
            newErrors.catalogo = 'Agregue cantidades para al menos un helado';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await axios.post('/api/nota', {
                    vendedor_id: vendedor,
                    playa,
                    clima,
                    catalogo,
                    estado: 'activo',
                });

                Swal.fire({
                    title: 'Nota creada!',
                    text: 'La nota de venta fue creada exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                navigate('/notas-activas');
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.response ? error.response.data.message : 'Hubo un problema al crear la nota.',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h4" gutterBottom align="center">
                Crear Nota de Venta
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Vendedor</InputLabel>
                    <Select
                        value={vendedor}
                        onChange={(e) => setVendedor(e.target.value)}
                        error={!!errors.vendedor}
                    >
                        {vendedores.map((vend) => (
                            <MenuItem key={vend._id} value={vend._id}>{vend.nombre} {vend.apellido}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Playa</InputLabel>
                    <Select
                        value={playa}
                        onChange={(e) => setPlaya(e.target.value)}
                        error={!!errors.playa}
                    >
                        <MenuItem value="San José">San José</MenuItem>
                        <MenuItem value="Mboi ka´e">Mboi ka´e</MenuItem>
                        <MenuItem value="San Isidro">San Isidro</MenuItem>
                        <MenuItem value="Evento">Evento</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Clima</InputLabel>
                    <Select
                        value={clima}
                        onChange={(e) => setClima(e.target.value)}
                        error={!!errors.clima}
                    >
                        <MenuItem value="soleado">Soleado</MenuItem>
                        <MenuItem value="despejado">Despejado</MenuItem>
                        <MenuItem value="nublado">Nublado</MenuItem>
                        <MenuItem value="lluvia">Lluvia</MenuItem>
                        <MenuItem value="tormenta">Tormenta</MenuItem>
                    </Select>
                </FormControl>

                <Typography variant="h6" sx={{ mt: 3 }}>
                    Catálogo de Helados
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Imagen</TableCell>
                                <TableCell>Nombre del Helado</TableCell>
                                <TableCell>Cantidad Inicial</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {catalogo.map((item, index) => (
                                <TableRow key={item.helado_id}>
                                    <TableCell>
                                        <img src={item.imagen_url} alt={item.nombre} style={{ width: 50, height: 50 }} />
                                    </TableCell>
                                    <TableCell>{item.nombre}</TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            type="number"
                                            value={item.cantidad_inicial}
                                            onChange={(e) => handleChangeCantidad(index, e.target.value)}
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {errors.catalogo && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        {errors.catalogo}
                    </Typography>
                )}

                <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary">
                            Crear Nota
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/notas-activas')}>
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default CrearNota;
