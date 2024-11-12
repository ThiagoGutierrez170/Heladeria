import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Grid } from '@mui/material';
import Swal from 'sweetalert2';

const NotaActiva = () => {
    const { id } = useParams();
    const [nota, setNota] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotaDetalle = async () => {
            try {
                const response = await axios.get(`/api/nota/activas/${id}`);
                //console.log("Datos de la nota:", response.data); // Verifica la estructura de los datos
                setNota(response.data);
            } catch (error) {
                console.error('Error al obtener el detalle de la nota:', error);
            }
        };

        fetchNotaDetalle();
    }, [id]);

    const handleEditar = () => {
        navigate(`/editar-nota/${id}`);
    };

    const handleRecargarCatalogo = () => {
        navigate(`/recargar-catalogo/${id}`);
    };

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
                await axios.delete(`/api/nota/${id}`);
                Swal.fire('Eliminado!', 'La nota ha sido eliminada.', 'success');
                navigate('/notas-activas');
            } catch (error) {
                Swal.fire('Error!', 'Hubo un problema al eliminar la nota.', 'error');
            }
        }
    };

    const handleFinalizarNota = () => {
        navigate(`/finalizar-nota/${id}`);
    };

    if (!nota) return <Typography>Cargando...</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/notas-activas')}
                sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#1976d2',
                    '&:hover': {
                        backgroundColor: '#155a8a',
                    },
                }}
            >
                Volver
            </Button>

            <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#fff' }}>
                <Typography variant="h4" align="center" color="black" gutterBottom>
                    Detalle de Nota Activa
                </Typography>

                <Box sx={{ my: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1"><strong>Playa:</strong> {nota.playa}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1"><strong>Clima:</strong> {nota.clima}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">
                                <strong>Vendedor: </strong> {nota.vendedor_id ? `${nota.vendedor_id.nombre} ${nota.vendedor_id.apellido}` : 'No asignado'}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Typography variant="h6" align="center" sx={{ mt: 3 }} color="black">
                    Catálogo de Helados
                </Typography>
                {Array.isArray(nota.catalogo) && nota.catalogo.length > 0 ? (
                    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 1, borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"><strong>Imagen</strong></TableCell>
                                    <TableCell align="center"><strong>Nombre del Helado</strong></TableCell>
                                    <TableCell align="center"><strong>Cantidad Total</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {nota.catalogo.map((item) => (
                                    <TableRow key={item.helado_id._id}>
                                        <TableCell align="center">
                                            <img
                                                src={item.helado_id.imagen} 
                                                alt={item.helado_id.nombre}
                                                width={60}
                                                height={60}
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">{item.helado_id.nombre}</TableCell>
                                        <TableCell align="center">{item.cantidadTotal}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body2" sx={{ color: 'black' }}>
                        No hay artículos en el catálogo.
                    </Typography>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleEditar}>
                        Editar
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleRecargarCatalogo}>
                        Recargar Catálogo
                    </Button>
                    <Button variant="contained" color="error" onClick={handleEliminar}>
                        Eliminar
                    </Button>
                    <Button variant="contained" color="success" onClick={handleFinalizarNota}>
                        Finalizar Nota
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default NotaActiva;
