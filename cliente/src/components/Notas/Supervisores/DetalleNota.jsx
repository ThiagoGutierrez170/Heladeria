import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import axios from 'axios';
import api from '../../../utils/api';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

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
                const response = await api.get(`/nota/finalizadas/${id}/detalle`);
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

    const formatearGs = (valor) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'decimal',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(valor);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" color="text.primary" gutterBottom>
                Detalle de la Nota
            </Typography>
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
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Vendedor: </strong>
                                {notaInfo.vendedor?.nombre ? 
                                    `${notaInfo.vendedor.nombre} ${notaInfo.vendedor.apellido}` 
                                    : "Información de vendedor no disponible"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1"><strong>Playa:</strong> {notaInfo.playa}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1"><strong>Clima:</strong> {notaInfo.clima}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1"><strong>Fecha:</strong> {new Date(notaInfo.fecha).toLocaleDateString()}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            <Typography variant="h6" align="center" color="text.primary" gutterBottom>
                Detalle de Ganancias de la Nota
            </Typography>
            <Divider sx={{ my: 3 }} />

            {/* Tabla de detalles de helados y ganancias */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nombre del helado</strong></TableCell>
                            <TableCell align="center"><strong>Cantidad Vendida</strong></TableCell>
                            <TableCell align="center"><strong>Ganancia Mínima (Gs)</strong></TableCell>
                            <TableCell align="center"><strong>Ganancia Base (Gs)</strong></TableCell>
                            <TableCell align="center"><strong>Ganancia Total (Gs)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {detallesGanancias.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.nombre}</TableCell>
                                <TableCell align="center">{item.cantidadVendida}</TableCell>
                                <TableCell align="center">{formatearGs(item.gananciaMinima)} Gs</TableCell>
                                <TableCell align="center">{formatearGs(item.gananciaBase)} Gs</TableCell>
                                <TableCell align="center">{formatearGs(item.gananciaTotal)} Gs</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Tabla con las ganancias totales */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" align="center" color="text.primary" gutterBottom>
                Ganancias Totales de la Nota
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Ganancia Mínima Total</strong></TableCell>
                            <TableCell align="center"><strong>Ganancia Base Total</strong></TableCell>
                            <TableCell align="center"><strong>Ganancia Total</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">{formatearGs(gananciaMinima)} Gs</TableCell>
                            <TableCell align="center">{formatearGs(gananciaBase)} Gs</TableCell>
                            <TableCell align="center">{formatearGs(gananciaTotal)} Gs</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default DetalleNotaS;
