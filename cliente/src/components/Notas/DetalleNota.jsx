import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Swal from 'sweetalert2';
import {
    Container, Typography, Paper, Divider, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Box
} from '@mui/material';

const DetalleNota = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados
    const [detallesGanancias, setDetallesGanancias] = useState([]);
    const [totales, setTotales] = useState({ minima: 0, base: 0, venta: 0 });
    const [notaInfo, setNotaInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNota = async () => {
            try {
                const response = await api.get(`/nota/finalizadas/${id}/detalle`);
                
                // Ahora response.data será un OBJETO puro, gracias al arreglo en el backend
                if (response.data) {
                    const { 
                        detallesGanancias, 
                        gananciaMinima, gananciaBase, gananciaTotal, 
                        vendedor_id, playa, clima, fecha 
                    } = response.data;

                    setDetallesGanancias(detallesGanancias || []);
                    setTotales({ 
                        minima: gananciaMinima || 0, 
                        base: gananciaBase || 0, 
                        venta: gananciaTotal || 0 
                    });
                    setNotaInfo({ vendedor: vendedor_id, playa, clima, fecha });
                }
            } catch (error) {
                console.error('Error cargando nota:', error);
                Swal.fire('Error', 'No se pudieron cargar los detalles', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchNota();
    }, [id]);

    const handleEliminar = async () => {
        const result = await Swal.fire({
            title: '¿Eliminar Nota?',
            text: "Se borrará permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/nota/${id}`);
                await Swal.fire('Eliminado', '', 'success');
                navigate('/registro-finalizados');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    const formatearGs = (valor) => new Intl.NumberFormat('es-PY', { style: 'decimal' }).format(valor || 0);

    if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    if (!notaInfo) return <Typography align="center" mt={5}>No se encontró la nota.</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 5, pb: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>Detalle de la Nota</Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button variant="contained" onClick={() => navigate(-1)} fullWidth>Volver</Button>
                <Button variant="contained" color="secondary" onClick={() => navigate(`/editar-finalizado/${id}`)} fullWidth>Editar Nota</Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Vendedor</strong></TableCell>
                                <TableCell><strong>Playa</strong></TableCell>
                                <TableCell><strong>Clima</strong></TableCell>
                                <TableCell><strong>Fecha</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{notaInfo.vendedor ? `${notaInfo.vendedor.nombre} ${notaInfo.vendedor.apellido || ''}` : 'N/A'}</TableCell>
                                <TableCell>{notaInfo.playa}</TableCell>
                                <TableCell>{notaInfo.clima}</TableCell>
                                <TableCell>{notaInfo.fecha ? new Date(notaInfo.fecha).toLocaleDateString() : '-'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Typography variant="h6" align="center" gutterBottom>Productos Vendidos</Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Img</strong></TableCell>
                            <TableCell><strong>Producto</strong></TableCell>
                            <TableCell align="center"><strong>Cant.</strong></TableCell>
                            <TableCell align="right"><strong>G. Mínima</strong></TableCell>
                            <TableCell align="right"><strong>G. Base</strong></TableCell>
                            <TableCell align="right"><strong>G. Total</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {detallesGanancias.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <img src={item.imagen} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                </TableCell>
                                <TableCell>{item.nombre}</TableCell>
                                <TableCell align="center">{item.cantidadVendida}</TableCell>
                                <TableCell align="right">{formatearGs(item.gananciaMinima)}</TableCell>
                                <TableCell align="right">{formatearGs(item.gananciaBase)}</TableCell>
                                <TableCell align="right">{formatearGs(item.gananciaTotal)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="h6" align="center" gutterBottom>Totales</Typography>
                <Box display="flex" justifyContent="space-around">
                    <Typography color="textSecondary">Mínima: <b>{formatearGs(totales.minima)} Gs</b></Typography>
                    <Typography color="primary">Base: <b>{formatearGs(totales.base)} Gs</b></Typography>
                    <Typography color="success.main">Total: <b>{formatearGs(totales.venta)} Gs</b></Typography>
                </Box>
            </Paper>
            
            <Button variant="contained" color="error"   fullWidth sx={{ mt: 3 }} onClick={handleEliminar}>
                Eliminar Nota
            </Button>

        </Container>
    );
};

export default DetalleNota;