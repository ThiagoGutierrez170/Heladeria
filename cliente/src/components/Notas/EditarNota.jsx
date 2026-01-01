import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
    Container, Typography, TextField, Button, MenuItem, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress,
    IconButton, Tooltip
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'; // Importar Iconos
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
                    
                    let cantidad = '';
                    // Usamos un array vacío si no hay recargas
                    let recargas = [];

                    if (itemEnNota) {
                        if (itemEnNota.cantidad_inicial > 0) {
                            cantidad = itemEnNota.cantidad_inicial;
                        }
                        // Aseguramos que recargas sea un array
                        if (Array.isArray(itemEnNota.recargas)) {
                            recargas = itemEnNota.recargas;
                        }
                    }

                    return {
                        helado_id: helado._id,
                        nombre: helado.nombre,
                        imagen: helado.imagen,
                        cantidad_inicial: cantidad,
                        recargas: recargas // Array de números [10, 5, ...]
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

    // Manejo de Cantidad Inicial
    const handleCantidadChange = (heladoId, nuevaCantidad) => {
        const valorNumerico = parseInt(nuevaCantidad, 10);
        let valorFinal = '';
        if (nuevaCantidad !== '') {
            if (valorNumerico < 0) return;
            valorFinal = valorNumerico;
        }

        setCatalogoExtendido(prev => prev.map(item => {
            if (item.helado_id === heladoId) {
                return { ...item, cantidad_inicial: valorFinal };
            }
            return item;
        }));
    };

    // --- FUNCIONES NUEVAS PARA RECARGAS ---

    // Editar valor de una recarga específica
    const handleRecargaValueChange = (heladoId, index, nuevoValor) => {
        const valorNumerico = parseInt(nuevoValor, 10);
        if (nuevoValor !== '' && valorNumerico < 0) return; // No negativos

        setCatalogoExtendido(prev => prev.map(item => {
            if (item.helado_id === heladoId) {
                const nuevasRecargas = [...item.recargas];
                // Si está vacío el input, ponemos 0 momentáneamente o manejamos como vacío
                nuevasRecargas[index] = nuevoValor === '' ? 0 : valorNumerico; 
                return { ...item, recargas: nuevasRecargas };
            }
            return item;
        }));
    };

    // Agregar nueva ranura de recarga (inicia en 0)
    const handleAddRecarga = (heladoId) => {
        setCatalogoExtendido(prev => prev.map(item => {
            if (item.helado_id === heladoId) {
                return { ...item, recargas: [...item.recargas, 0] };
            }
            return item;
        }));
    };

    // Eliminar una recarga
    const handleRemoveRecarga = (heladoId, index) => {
        setCatalogoExtendido(prev => prev.map(item => {
            if (item.helado_id === heladoId) {
                const nuevasRecargas = item.recargas.filter((_, i) => i !== index);
                return { ...item, recargas: nuevasRecargas };
            }
            return item;
        }));
    };

    // --------------------------------------

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
            catalogoNuevosDatos: catalogoExtendido.map(item => ({
                helado_id: item.helado_id,
                cantidad_inicial: item.cantidad_inicial === '' ? 0 : item.cantidad_inicial,
                // Filtramos recargas que sean 0 para no llenar la BD de ceros, opcional
                recargas: item.recargas
            }))
        };

        try {
            await api.put(`/nota/activas/${id}`, payload);
            await Swal.fire('Actualizado', 'La nota y sus recargas se han actualizado correctamente.', 'success');
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                        Catálogo y Recargas
                    </Typography>
                    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                        <Table size="small" sx={{ minWidth: 600 }}> {/* Evita que la tabla se colapse demasiado en móvil */}
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ width: 60 }}><strong>Imagen</strong></TableCell>
                                    <TableCell sx={{ minWidth: 80 }}><strong>Producto</strong></TableCell>
                                    
                                    {/* CAMBIO CLAVE: minWidth en lugar de width fijo */}
                                    <TableCell 
                                        align="center" 
                                        sx={{ 
                                            minWidth: 110, // Garantiza espacio para el input en móviles
                                            width: 150 
                                        }}
                                    >
                                        <strong>Cant. Inicial</strong>
                                    </TableCell>
                                    
                                    <TableCell align="left" sx={{ minWidth: 200 }}><strong>Recargas (Editar)</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {catalogoExtendido.map((item) => (
                                    <TableRow key={item.helado_id} hover>
                                        <TableCell align="center">
                                            <img 
                                                src={item.imagen} 
                                                alt={item.nombre} 
                                                style={{ width: 45, height: 45, objectFit: 'cover', borderRadius: 4 }} 
                                            />
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'middle' }}>
                                            {item.nombre}
                                        </TableCell>
                                        
                                        {/* Celda de Cantidad Inicial optimizada */}
                                        <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                                            <TextField
                                                type="number"
                                                size="small"
                                                variant="outlined"
                                                value={item.cantidad_inicial}
                                                onChange={(e) => handleCantidadChange(item.helado_id, e.target.value)}
                                                placeholder="0"
                                                // Aumentamos el padding interno del input para que sea más fácil tocarlo
                                                inputProps={{ 
                                                    min: 0, 
                                                    style: { 
                                                        textAlign: 'center',
                                                        padding: '6px 4px' 
                                                    } 
                                                }}
                                                sx={{ 
                                                    backgroundColor: '#fff',
                                                    maxWidth: '80px' // Evita que el input sea absurdamente gigante si hay espacio
                                                }}
                                            />
                                        </TableCell>
                                        
                                        <TableCell sx={{ verticalAlign: 'middle' }}>
                                            <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
                                                {item.recargas.map((recarga, index) => (
                                                    <Box 
                                                        key={index} 
                                                        display="flex" 
                                                        alignItems="center" 
                                                        bgcolor="#f5f5f5" 
                                                        border="1px solid #ddd" // Borde para definirlo mejor en móvil
                                                        borderRadius={1} 
                                                        p={0.5}
                                                    >
                                                        <TextField
                                                            type="number"
                                                            variant="standard"
                                                            size="small"
                                                            value={recarga}
                                                            onChange={(e) => handleRecargaValueChange(item.helado_id, index, e.target.value)}
                                                            InputProps={{ disableUnderline: true }}
                                                            inputProps={{ 
                                                                style: { textAlign: 'center', width: '45px', fontWeight: 'bold' } 
                                                            }}
                                                        />
                                                        <IconButton 
                                                            size="small" 
                                                            color="error" 
                                                            onClick={() => handleRemoveRecarga(item.helado_id, index)}
                                                        >
                                                            <RemoveCircleOutline fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                                
                                                <IconButton 
                                                    size="medium" // Un poco más grande para facilitar el toque
                                                    color="primary" 
                                                    onClick={() => handleAddRecarga(item.helado_id)}
                                                >
                                                    <AddCircleOutline />
                                                </IconButton>
                                            </Box>
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