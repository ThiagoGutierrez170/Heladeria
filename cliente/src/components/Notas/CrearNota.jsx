import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Typography, Button, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
//import axios from 'axios';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const CrearNota = () => {
    const [vendedor, setVendedor] = useState('');
    const [playa, setPlaya] = useState('');
    const [clima, setClima] = useState('');
    const [catalogo, setCatalogo] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar el bloqueo del botón
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const heladoResponse = await api.get('/helado?estado=activo');
                const vendedorResponse = await api.get('/vendedor');
                const heladosActivos = heladoResponse.data.map((helado) => ({
                    helado_id: helado._id,
                    nombre: helado.nombre,
                    imagen: helado.imagen,
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
            Swal.fire('Error', 'La cantidad no puede ser negativa.', 'error');
            return;
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
            setIsSubmitting(true); // Bloquear el botón
            try {
                await api.post('/nota', {
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
            } finally {
                setIsSubmitting(false); // Desbloquear el botón
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, color: '#333' }}>
                Crear Nota de Venta
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
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
                    </Grid>

                    <Grid item xs={12} md={4}>
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
                    </Grid>

                    <Grid item xs={12} md={4}>
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
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3 }} color='black'>
                    Catálogo de Helados
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Imagen</TableCell>
                                <TableCell>Helado</TableCell>
                                <TableCell>Cantidad Inicial</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {catalogo.map((item, index) => (
                                <TableRow key={item.helado_id}>
                                    <TableCell>
                                        <img src={item.imagen} alt={item.nombre} style={{ width: 50, height: 50 }} />
                                    </TableCell>
                                    <TableCell >
                                        <Typography sx={{ color: 'black', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                            {item.nombre}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            label="Cantidad Inicial"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={item.cantidad_inicial || ''}
                                            onChange={(e) => handleChangeCantidad(index, e.target.value)}
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
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Creando...' : 'Crear Nota'}
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
