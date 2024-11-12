import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Container, Typography, Grid, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

// Función para formatear los números en guaraníes con puntos
const formatearGs = (valor) => {
    return new Intl.NumberFormat('es-PY', {
        style: 'decimal',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }).format(valor);
};

const DetalleNotaS = () => {
    const { id } = useParams();
    const [detallesGanancias, setDetallesGanancias] = useState([]);
    const [gananciaMinima, setGananciaMinima] = useState(0);
    const [gananciaBase, setGananciaBase] = useState(0);
    const [gananciaTotal, setGananciaTotal] = useState(0);
    const [notaInfo, setNotaInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNota = async () => {
            try {
                const response = await axios.get(`/api/nota/finalizadas/${id}/detalle`);
                const { detallesGanancias, gananciaMinima, gananciaBase, gananciaTotal, vendedor_id, playa, clima, fecha } = response.data;
                
                setDetallesGanancias(detallesGanancias);
                setGananciaMinima(gananciaMinima);
                setGananciaBase(gananciaBase);
                setGananciaTotal(gananciaTotal);
                setNotaInfo({ vendedor: vendedor_id, playa, clima, fecha });
            } catch (error) {
                console.error('Error al cargar el detalle de la nota:', error);
            }
        };

        fetchNota();
    }, [id]);

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            {/* Título principal */}
            <Typography variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
                Detalle de la Nota
            </Typography>

            {/* Botón de regreso */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/S-registro-finalizados')}  
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

            {/* Información de la nota */}
            {notaInfo && (
                <Paper sx={{ p: 3, mb: 3, boxShadow: 3, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ color: 'black' }}>
                                <strong>Vendedor: </strong>
                                {notaInfo.vendedor?.nombre ? 
                                    `${notaInfo.vendedor.nombre} ${notaInfo.vendedor.apellido}` 
                                    : "Información de vendedor no disponible"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ color: 'black' }}><strong>Playa:</strong> {notaInfo.playa}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ color: 'black' }}><strong>Clima:</strong> {notaInfo.clima}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ color: 'black' }}><strong>Fecha:</strong> {new Date(notaInfo.fecha).toLocaleDateString()}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Detalle de ganancias */}
            <Typography variant="h6" align="center" gutterBottom sx={{ color: 'black' }}>
                Detalle de Ganancias de la Nota
            </Typography>
            <Divider sx={{ my: 3 }} />

            {/* Tabla de detalles de helados y ganancias */}
            <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black' }}><strong>Nombre del helado</strong></TableCell>
                            <TableCell align="center" sx={{ color: 'black' }}><strong>Cantidad Vendida</strong></TableCell>
                            <TableCell align="center" sx={{ color: 'black' }}><strong>Ganancia Mínima (Gs)</strong></TableCell>
                            <TableCell align="center" sx={{ color: 'black' }}><strong>Ganancia Base (Gs)</strong></TableCell>
                            <TableCell align="center" sx={{ color: 'black' }}><strong>Ganancia Total (Gs)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {detallesGanancias.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ color: 'black' }}>{item.nombre}</TableCell>
                                <TableCell align="center" sx={{ color: 'black' }}>{item.cantidadVendida}</TableCell>
                                <TableCell align="center" sx={{ color: 'black' }}>{formatearGs(item.gananciaMinima)} Gs</TableCell>
                                <TableCell align="center" sx={{ color: 'black' }}>{formatearGs(item.gananciaBase)} Gs</TableCell>
                                <TableCell align="center" sx={{ color: 'black' }}>{formatearGs(item.gananciaTotal)} Gs</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Ganancias totales */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" align="center" gutterBottom sx={{ color: 'black' }}>
                Ganancias Totales de la Nota
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black' }}><strong>Ganancia Mínima Total</strong></TableCell>
                            <TableCell align="center" sx={{ color: 'black' }}><strong>Ganancia Base Total</strong></TableCell>
                            <TableCell align="center" sx={{ color: 'black' }}><strong>Ganancia Total</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center" sx={{ color: 'black' }}>{formatearGs(gananciaMinima)} Gs</TableCell>
                            <TableCell align="center" sx={{ color: 'black' }}>{formatearGs(gananciaBase)} Gs</TableCell>
                            <TableCell align="center" sx={{ color: 'black' }}>{formatearGs(gananciaTotal)} Gs</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default DetalleNotaS;
