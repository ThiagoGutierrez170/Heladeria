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
                
                console.log(response.data);
                setNota(response.data);

            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al cargar la nota.', 'error');
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
        <Container>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/notas-activas')}
                sx={{
                    mb: 2,
                    mt: 3,
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
            <Typography variant="h4" gutterBottom color='black'>
                Detalle de Nota Activa
            </Typography>

            {/* Información de la nota en formato horizontal */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Playa</strong></TableCell>
                            <TableCell><strong>Clima</strong></TableCell>
                            <TableCell><strong>Vendedor</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{nota.playa}</TableCell>
                            <TableCell>{nota.clima}</TableCell>
                            <TableCell>{nota.vendedor_id ? `${nota.vendedor_id.nombre} ${nota.vendedor_id.apellido}` : 'No asignado'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Tabla de catálogo de helados */}
            <Typography variant="h6" sx={{ mt: 3 }} color='black'>
                Catálogo de Helados
            </Typography>
            {Array.isArray(nota.catalogo) && nota.catalogo.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
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

            {/* Botones de acciones */}
            <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleEditar} sx={{ mr: 2 }}>
                    Editar
                </Button>
                <Button variant="contained" color="secondary" onClick={handleRecargarCatalogo} sx={{ mr: 2 }}>
                    Recargar Catálogo
                </Button>
                <Button variant="contained" color="error" onClick={handleEliminar}>
                    Eliminar
                </Button>
                <Button variant="contained" color="success" onClick={handleFinalizarNota} sx={{ ml: 2 }}>
                    Finalizar Nota
                </Button>
            </Box>
        </Container>
    );

};

export default NotaActiva;
