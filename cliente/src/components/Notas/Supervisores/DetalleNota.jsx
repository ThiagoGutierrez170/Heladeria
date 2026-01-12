import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import {
    Container, Typography, Grid, Paper, Divider, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Button, Box, CircularProgress
} from '@mui/material';

const DetalleNotaS = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await api.get(`/nota/finalizadas/${id}/detalle-supervisor`);
                setDatos(response.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetalle();
    }, [id]);

    const formatearGs = (valor) => new Intl.NumberFormat('es-PY').format(valor || 0);

    if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    if (!datos) return <Typography align="center">No se encontró la nota.</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 5 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">Resumen de Nota</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography><strong>Vendedor:</strong> {datos.vendedor?.nombre} {datos.vendedor?.apellido}</Typography>
                        <Typography><strong>Playa:</strong> {datos.playa}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography><strong>Fecha:</strong> {new Date(datos.fecha).toLocaleDateString()}</Typography>
                        <Typography><strong>Clima:</strong> {datos.clima}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>Producto</strong></TableCell>
                            <TableCell align="center"><strong>Cantidad Vendida</strong></TableCell>
                            <TableCell align="right"><strong>Subtotal Venta</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datos.detallesVenta.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.nombre}</TableCell>
                                <TableCell align="center">{item.cantidadVendida}</TableCell>
                                <TableCell align="right">{formatearGs(item.subtotalVenta)} Gs</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Paper sx={{ p: 3, textAlign: 'right', bgcolor: '#e3f2fd' }}>
                <Typography variant="h6">Venta Total:</Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {formatearGs(datos.totalGeneralVenta)} Gs
                </Typography>
            </Paper>

            <Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={() => navigate(-1)}>
                Volver al Listado
            </Button>
        </Container>
    );
};

export default DetalleNotaS;