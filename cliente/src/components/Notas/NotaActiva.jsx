import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import axios from 'axios';
import api from '../../utils/api';
import {
    Container, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, Grid
} from '@mui/material';
import Swal from 'sweetalert2';

const NotaActiva = () => {
    const { id } = useParams();
    const [nota, setNota] = useState(null);
    const navigate = useNavigate();
    const [usuarioRol, setUsuarioRol] = useState(localStorage.getItem('rol'));

    useEffect(() => {
        const fetchNotaDetalle = async () => {
            try {
                setUsuarioRol(localStorage.getItem('rol'));
                const response = await api.get(`/nota/activas/${id}`);
                setNota(response.data);
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al cargar la nota.', 'error');
            }
        };
        fetchNotaDetalle();
    }, [id]);

    const handleEditar = () => navigate(`/editar-nota/${id}`);
    const handleRecargarCatalogo = () => navigate(`/recargar-catalogo/${id}`);
    const handleEliminar = async () => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará la nota de forma permanente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (confirm.isConfirmed) {
            try {
                await api.delete(`/nota/${id}`);
                Swal.fire('Eliminado!', 'La nota ha sido eliminada.', 'success');
                navigate('/notas-activas');
            } catch (error) {
                Swal.fire('Error!', 'Hubo un problema al eliminar la nota.', 'error');
            }
        }
    };

    const handleFinalizarNota = () => navigate(`/finalizar-nota/${id}`);

    if (!nota) return <Typography>Cargando...</Typography>;

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="center" mb={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/notas-activas')}
                    sx={{
                        mb: 2,
                        px: 6,
                        py: 2,
                        fontSize: '18px',
                    }}
                >
                    Volver
                </Button>
            </Box>
            <Typography variant="h4" gutterBottom align="center" color='black' sx={{ mb: 3, fontSize: '32px' }}>
                Detalle de Nota Activa
            </Typography>

            {/* Información de la nota */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>Playa</TableCell>
                            <TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>Clima</TableCell>
                            <TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>Vendedor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ fontSize: '16px' }}>{nota.playa}</TableCell>
                            <TableCell sx={{ fontSize: '16px' }}>{nota.clima}</TableCell>
                            <TableCell sx={{ fontSize: '16px' }}>
                                {nota.vendedor_id
                                    ? `${nota.vendedor_id.nombre} ${nota.vendedor_id.apellido}`
                                    : 'No asignado'}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Catálogo de helados */}
            <Typography variant="h5" sx={{ mt: 4, fontSize: '24px', textAlign: 'center' }} color="textPrimary">
                Catálogo de Helados
            </Typography>
            {Array.isArray(nota.catalogo) && nota.catalogo.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontSize: '18px', fontWeight: 'bold' }}>Imagen</TableCell>
                                <TableCell align="center" sx={{ fontSize: '18px', fontWeight: 'bold' }}>Nombre del Helado</TableCell>
                                <TableCell align="center" sx={{ fontSize: '18px', fontWeight: 'bold' }}>Cantidad Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {nota.catalogo.map((item) => (
                                <TableRow key={item.helado_id._id}>
                                    <TableCell align="center">
                                        <img
                                            src={item.helado_id.imagen}
                                            alt={item.helado_id.nombre}
                                            width={80}
                                            height={80}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: '16px' }}>{item.helado_id.nombre}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '16px' }}>{item.cantidadTotal}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" sx={{ mt: 2, fontSize: '16px', color: 'textSecondary', textAlign: 'center' }}>
                    No hay artículos en el catálogo.
                </Typography>
            )}

            {/* Botones de acciones */}
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                <Grid item xs={6} sm={4}>
                    <Button fullWidth variant="contained" color="primary" sx={{ fontSize: '18px', py: 2 }} onClick={handleEditar}>
                        Editar
                    </Button>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <Button fullWidth variant="contained" color="secondary" sx={{ fontSize: '18px', py: 2 }} onClick={handleRecargarCatalogo}>
                        Recargar
                    </Button>
                </Grid>
                {usuarioRol === 'administrador' && (
                    <Grid item xs={6} sm={4}>
                        <Button fullWidth variant="contained" color="error" sx={{ fontSize: '18px', py: 2 }} onClick={handleEliminar}>
                            Eliminar
                        </Button>
                    </Grid>
                )}
                <Grid item xs={6} sm={4}>
                    <Button fullWidth variant="contained" color="success" sx={{ fontSize: '18px', py: 2 }} onClick={handleFinalizarNota}>
                        Finalizar
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default NotaActiva;
