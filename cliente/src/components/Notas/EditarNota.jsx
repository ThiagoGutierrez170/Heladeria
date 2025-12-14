import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
    Container, Typography, TextField, Button, MenuItem, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress
} from '@mui/material';
import Swal from 'sweetalert2';

const EditarNota = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [nota, setNota] = useState({
        playa: '',
        clima: '',
        vendedor: '',
    });

    const [catalogoExtendido, setCatalogoExtendido] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    
    const opcionesPlaya = ['San José', 'Mboi ka´e', 'San Isidro', 'Evento'];
    const opcionesClima = ['soleado', 'despejado', 'nublado', 'lluvia', 'tormenta'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notaRes, heladosRes, vendRes] = await Promise.all([
                    api.get(`/nota/activas/${id}`),
                    api.get('/helado?estado=true'),
                    api.get('/vendedor')
                ]);

                const notaData = notaRes.data;
                const todosLosHelados = heladosRes.data;
                const listaVendedores = vendRes.data;

                // 1. Datos Generales
                const vendedorId = notaData.vendedor_id ? notaData.vendedor_id._id : '';
                const vendedorValido = listaVendedores.some(v => v._id === vendedorId) ? vendedorId : '';

                setNota({
                    playa: notaData.playa || '',
                    clima: notaData.clima || '',
                    vendedor: vendedorValido,
                });

                setVendedores(listaVendedores);

                // 2. Fusión de Catálogos
                const catalogoFusionado = todosLosHelados.map(helado => {
                    const itemEnNota = notaData.catalogo.find(item => {
                        const idEnNota = item.helado_id._id || item.helado_id;
                        return String(idEnNota) === String(helado._id);
                    });
                    
                    // Si existe y es mayor a 0, usamos el numero. Si es 0 o no existe, usamos cadena vacía ''
                    let cantidad = '';
                    if (itemEnNota && itemEnNota.cantidad_inicial > 0) {
                        cantidad = itemEnNota.cantidad_inicial;
                    }

                    return {
                        helado_id: helado._id,
                        nombre: helado.nombre,
                        imagen: helado.imagen,
                        cantidad_inicial: cantidad 
                    };
                });

                setCatalogoExtendido(catalogoFusionado);

            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNota({ ...nota, [name]: value });
    };

    const handleCantidadChange = (heladoId, nuevaCantidad) => {
        const valorNumerico = parseInt(nuevaCantidad, 10);

        // Si es vacío, dejamos vacío. Si es número válido positivo, usamos el número.
        let valorFinal = '';
        if (nuevaCantidad !== '') {
            if (valorNumerico < 0) return; // No permitir negativos
            valorFinal = valorNumerico;
        }

        setCatalogoExtendido(prev => prev.map(item => {
            if (item.helado_id === heladoId) {
                return { ...item, cantidad_inicial: valorFinal };
            }
            return item;
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nota.playa || !nota.clima || !nota.vendedor) {
            Swal.fire('Atención', 'Por favor completa todos los datos generales.', 'warning');
            return;
        }

        const payload = {
            vendedor_id: nota.vendedor,
            playa: nota.playa,
            clima: nota.clima,
            // Convertimos las cadenas vacías a 0 antes de enviar al backend
            catalogoNuevosDatos: catalogoExtendido.map(item => ({
                helado_id: item.helado_id,
                cantidad_inicial: item.cantidad_inicial === '' ? 0 : item.cantidad_inicial
            }))
        };

        try {
            await api.put(`/nota/activas/${id}`, payload);
            await Swal.fire('Actualizado', 'La nota se ha actualizado correctamente.', 'success');
            navigate('/notas-activas');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || 'Error al actualizar';
            Swal.fire('Error', msg, 'error');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" align="center" gutterBottom color="text.primary">
                Editar Nota Activa
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Datos Generales</Typography>
                    <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                        <TextField
                            select
                            label="Vendedor"
                            name="vendedor"
                            value={nota.vendedor}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            {vendedores.map((v) => (
                                <MenuItem key={v._id} value={v._id}>{v.nombre} {v.apellido}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Playa"
                            name="playa"
                            value={nota.playa}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            {opcionesPlaya.map((op) => <MenuItem key={op} value={op}>{op}</MenuItem>)}
                        </TextField>

                        <TextField
                            select
                            label="Clima"
                            name="clima"
                            value={nota.clima}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            {opcionesClima.map((op) => <MenuItem key={op} value={op}>{op}</MenuItem>)}
                        </TextField>
                    </Box>
                </Paper>

                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Catálogo de Helados
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"><strong>Imagen</strong></TableCell>
                                    <TableCell><strong>Producto</strong></TableCell>
                                    <TableCell align="center" sx={{ width: 180 }}><strong>Cant. Inicial</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {catalogoExtendido.map((item) => (
                                    <TableRow key={item.helado_id} hover>
                                        <TableCell align="center">
                                            <img 
                                                src={item.imagen} 
                                                alt={item.nombre} 
                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} 
                                            />
                                        </TableCell>
                                        <TableCell>{item.nombre}</TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                type="number"
                                                size="small"
                                                variant="outlined"
                                                value={item.cantidad_inicial}
                                                onChange={(e) => handleCantidadChange(item.helado_id, e.target.value)}
                                                placeholder="0"
                                                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button variant="outlined" color="secondary" size="large" onClick={() => navigate(-1)}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary" size="large">
                        Guardar Cambios
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default EditarNota;