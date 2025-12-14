import React, { useState, useEffect } from 'react';
import { 
    Container, Grid, TextField, Typography, Button, MenuItem, Select, InputLabel, 
    FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const CrearNota = () => {
    const [vendedor, setVendedor] = useState('');
    const [playa, setPlaya] = useState('');
    const [clima, setClima] = useState('');
    const [catalogo, setCatalogo] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [heladoResponse, vendedorResponse] = await Promise.all([
                    api.get('/helado?estado=activo'),
                    api.get('/vendedor')
                ]);

                const heladosActivos = heladoResponse.data.map((helado) => ({
                    helado_id: helado._id,
                    nombre: helado.nombre,
                    imagen: helado.imagen,
                    cantidad_inicial: '', // CAMBIO: Inicializamos vacío para mejor UX
                }));
                
                setCatalogo(heladosActivos);
                setVendedores(vendedorResponse.data);
            } catch (error) {
                console.error("Error al cargar helados o vendedores:", error);
                Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
            }
        };
        fetchData();
    }, []);

    const handleChangeCantidad = (index, cantidad) => {
        const cantidadNumerica = parseInt(cantidad, 10);

        if (cantidad !== '' && cantidadNumerica < 0) {
            return;
        }

        const newCatalogo = [...catalogo];
        // Permitimos que el valor sea '' o el número
        newCatalogo[index].cantidad_inicial = cantidad === '' ? '' : cantidadNumerica;
        setCatalogo(newCatalogo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!vendedor) newErrors.vendedor = 'Seleccione un vendedor';
        if (!playa) newErrors.playa = 'Seleccione una playa';
        if (!clima) newErrors.clima = 'Seleccione el clima';
        
        // Convertimos los vacíos a 0 solo al momento de enviar
        const catalogoParaEnviar = catalogo.map(item => ({
            ...item,
            cantidad_inicial: item.cantidad_inicial === '' ? 0 : item.cantidad_inicial
        }));

        // Validamos que al menos uno tenga cantidad > 0
        if (catalogoParaEnviar.every(item => item.cantidad_inicial === 0)) {
            newErrors.catalogo = 'Agregue cantidades para al menos un helado';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                await api.post('/nota', {
                    vendedor_id: vendedor,
                    playa,
                    clima,
                    catalogo: catalogoParaEnviar,
                    estado: 'activo',
                });

                await Swal.fire({
                    title: 'Nota creada!',
                    text: 'La nota de venta fue creada exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                navigate('/notas-activas');
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.message || 'Hubo un problema al crear la nota.',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ p: 4, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3, mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, color: '#333', fontWeight: 'bold' }}>
                Crear Nota de Venta
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Vendedor */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth error={!!errors.vendedor}>
                            <InputLabel>Vendedor</InputLabel>
                            <Select
                                value={vendedor}
                                label="Vendedor"
                                onChange={(e) => setVendedor(e.target.value)}
                            >
                                {vendedores.map((vend) => (
                                    <MenuItem key={vend._id} value={vend._id} sx={{ fontSize: '1.1rem' }}>
                                        {vend.nombre} 
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.vendedor && <Typography variant="caption" color="error">{errors.vendedor}</Typography>}
                        </FormControl>
                    </Grid>

                    {/* Playa */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth error={!!errors.playa}>
                            <InputLabel>Playa</InputLabel>
                            <Select
                                value={playa}
                                label="Playa"
                                onChange={(e) => setPlaya(e.target.value)}
                            >
                                {['San José', 'Mboi ka´e', 'San Isidro', 'Evento'].map((p) => (
                                    <MenuItem key={p} value={p} sx={{ fontSize: '1.1rem' }}>{p}</MenuItem>
                                ))}
                            </Select>
                            {errors.playa && <Typography variant="caption" color="error">{errors.playa}</Typography>}
                        </FormControl>
                    </Grid>

                    {/* Clima */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth error={!!errors.clima}>
                            <InputLabel>Clima</InputLabel>
                            <Select
                                value={clima}
                                label="Clima"
                                onChange={(e) => setClima(e.target.value)}
                            >
                                {['soleado', 'despejado', 'nublado', 'lluvia', 'tormenta'].map((c) => (
                                    <MenuItem key={c} value={c} sx={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{c}</MenuItem>
                                ))}
                            </Select>
                            {errors.clima && <Typography variant="caption" color="error">{errors.clima}</Typography>}
                        </FormControl>
                    </Grid>
                </Grid>

                <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }} color='text.primary'>
                    Catálogo de Helados
                </Typography>

                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell align="center"><strong>Imagen</strong></TableCell>
                                <TableCell><strong>Producto</strong></TableCell>
                                <TableCell align="center" sx={{ width: 150 }}><strong>Cantidad Inicial</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {catalogo.map((item, index) => (
                                <TableRow key={item.helado_id} hover>
                                    <TableCell align="center">
                                        <img 
                                            src={item.imagen} 
                                            alt={item.nombre} 
                                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            {item.nombre}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            // label="Cant." <-- Quitamos el label flotante para que se vea más limpio si está vacío
                                            placeholder="0" // Placeholder gris de fondo
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={item.cantidad_inicial}
                                            onChange={(e) => handleChangeCantidad(index, e.target.value)}
                                            inputProps={{ min: 0, style: { textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold' } }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {errors.catalogo && (
                    <Typography color="error" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
                        {errors.catalogo}
                    </Typography>
                )}

                <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                    <Grid item xs={12} sm={6}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            size="large"
                            disabled={isSubmitting}
                            sx={{ py: 1.5, fontSize: '1.1rem' }}
                        >
                            {isSubmitting ? 'Guardando...' : 'Crear Nota'}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            fullWidth 
                            size="large"
                            onClick={() => navigate('/notas-activas')}
                            sx={{ py: 1.5, fontSize: '1.1rem' }}
                        >
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default CrearNota;