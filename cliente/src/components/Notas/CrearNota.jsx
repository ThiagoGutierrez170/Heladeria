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
        const fetchData = async () => {
            try {
                const heladoResponse = await axios.get('/api/helado?estado=activo');
                const vendedorResponse = await axios.get('/api/vendedor');
                const heladosActivos = heladoResponse.data.map((helado) => ({
                    helado_id: helado._id,
                    nombre: helado.nombre,
                    imagen: helado.imagen,
                    cantidad_inicial: '',
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
        newCatalogo[index].cantidad_inicial = isNaN(cantidadNumerica) ? '' : cantidadNumerica;  // Usar cadena vacía si no es un número
        setCatalogo(newCatalogo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!vendedor) newErrors.vendedor = 'Seleccione un vendedor';
        if (!playa) newErrors.playa = 'Seleccione una playa';
        if (!clima) newErrors.clima = 'Seleccione el clima';
        if (catalogo.every(item => item.cantidad_inicial === '')) {  // Verificar si alguna cantidad no está vacía
            newErrors.catalogo = 'Debe ingresar la cantidad inicial de los helados';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const nota = {
            vendedor,
            playa,
            clima,
            catalogo,
        };

        try {
            await axios.post('/api/nota', nota);
            Swal.fire('Nota creada', 'La nota ha sido creada exitosamente.', 'success');
            navigate('/notas-activas');
        } catch (error) {
            console.error('Error al crear la nota:', error.response || error);
            Swal.fire('Error', 'Hubo un problema al crear la nota.', 'error');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom color="black" sx={{ mb: 2 }}>
                Crear Nota
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Vendedor</InputLabel>
                            <Select
                                value={vendedor}
                                onChange={(e) => setVendedor(e.target.value)}
                                label="Vendedor"
                            >
                                {vendedores.map((v) => (
                                    <MenuItem key={v._id} value={v._id}>
                                        {v.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Playa"
                            value={playa}
                            onChange={(e) => setPlaya(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Clima</InputLabel>
                            <Select
                                value={clima}
                                onChange={(e) => setClima(e.target.value)}
                                label="Clima"
                            >
                                <MenuItem value="Soleado">Soleado</MenuItem>
                                <MenuItem value="Nublado">Nublado</MenuItem>
                                <MenuItem value="Lluvia">Lluvia</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Imagen</strong></TableCell>
                                <TableCell><strong>Helado</strong></TableCell>
                                <TableCell><strong>Cantidad Inicial</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {catalogo.map((item, index) => (
                                <TableRow key={item.helado_id}>
                                    <TableCell>
                                        <img src={item.imagen} alt={item.nombre} style={{ width: 50, height: 50 }} />
                                    </TableCell>
                                    <TableCell>{item.nombre}</TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            type="number"
                                            value={item.cantidad_inicial || ''}  // Usar cadena vacía por defecto si no hay cantidad
                                            onChange={(e) => handleChangeCantidad(index, e.target.value)}
                                            fullWidth
                                            sx={{ fontSize: '18px' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {errors.catalogo && <Typography color="error">{errors.catalogo}</Typography>}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Crear Nota
                </Button>
            </form>
        </Container>
    );
};

export default CrearNota;
