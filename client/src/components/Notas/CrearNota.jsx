import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Typography, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CrearNota = () => {
    const [vendedor, setVendedor] = useState('');
    const [playa, setPlaya] = useState('');
    const [clima, setClima] = useState('');
    const [catalogo, setCatalogo] = useState([]);
    const [helados, setHelados] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener helados y vendedores para los menús desplegables
        const fetchData = async () => {
            try {
                const heladoResponse = await axios.get('/api/helado');
                const vendedorResponse = await axios.get('/api/vendedor');
                setHelados(heladoResponse.data);
                setVendedores(vendedorResponse.data);
            } catch (error) {
                console.error("Error al cargar helados o vendedores:", error);
            }
        };
        fetchData();
    }, []);

    const handleAddHelado = (heladoId) => {
        const newCatalogo = [...catalogo, { helado_id: heladoId, cantidad_inicial: 0, recargas: [] }];
        setCatalogo(newCatalogo);
    };

    const handleChangeCantidad = (index, cantidad) => {
        const newCatalogo = [...catalogo];
        newCatalogo[index].cantidad_inicial = parseInt(cantidad);
        setCatalogo(newCatalogo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!vendedor) newErrors.vendedor = 'Seleccione un vendedor';
        if (!playa) newErrors.playa = 'Seleccione una playa';
        if (!clima) newErrors.clima = 'Seleccione el clima';
        if (catalogo.length === 0) newErrors.catalogo = 'Agregue al menos un helado al catálogo';

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
                navigate('/notas'); // Navegar a la lista de notas después de crearla
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
                    Agregar Helados al Catálogo
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {helados.map((helado) => (
                        <Grid item xs={12} sm={6} key={helado._id}>
                            <Button variant="outlined" onClick={() => handleAddHelado(helado._id)}>
                                {helado.nombre}
                            </Button>
                        </Grid>
                    ))}
                </Grid>

                {catalogo.map((item, index) => (
                    <TextField
                        key={index}
                        label={`Cantidad inicial para ${helados.find(h => h._id === item.helado_id)?.nombre || 'helado'}`}
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={item.cantidad_inicial}
                        onChange={(e) => handleChangeCantidad(index, e.target.value)}
                        margin="normal"
                    />
                ))}

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
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/notas')}>
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default CrearNota;
