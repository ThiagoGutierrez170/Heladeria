import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

const DetalleNota = () => {
    const { id } = useParams();
    const [detallesGanancias, setDetallesGanancias] = useState([]);
    const [gananciaMinima, setGananciaMinima] = useState(0);
    const [gananciaBase, setGananciaBase] = useState(0);
    const [gananciaTotal, setGananciaTotal] = useState(0);
    const [notaInfo, setNotaInfo] = useState(null);

    useEffect(() => {
        const fetchNota = async () => {
            try {
                const response = await axios.get(`/api/nota/finalizadas/${id}/detalle`);
                const { detallesGanancias, gananciaMinima, gananciaBase, gananciaTotal } = response.data;
                console.log(response.data);

                setDetallesGanancias(detallesGanancias);
                setGananciaMinima(gananciaMinima);
                setGananciaBase(gananciaBase);
                setGananciaTotal(gananciaTotal);

                // Asumiendo que la información de la nota también viene en la respuesta
                setNotaInfo({ 
                    vendedor: response.data.vendedor, 
                    playa: response.data.playa, 
                    clima: response.data.clima 
                });
            } catch (error) {
                console.error('Error al cargar el detalle de la nota:', error);
            }
        };

        fetchNota();
    }, [id]);

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Detalle de la Nota
            </Typography>

            {/* Información de la nota */}
            {notaInfo && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Vendedor:</strong>
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
                    </Grid>
                </Paper>
            )}

            <Typography variant="h6" align="center" gutterBottom>
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
                                <TableCell align="center">{item.gananciaMinima.toFixed(0)} Gs</TableCell>
                                <TableCell align="center">{item.gananciaBase.toFixed(0)} Gs</TableCell>
                                <TableCell align="center">{item.gananciaTotal.toFixed(0)} Gs</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Tabla con las ganancias totales */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" align="center" gutterBottom>
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
                            <TableCell align="center">{gananciaMinima.toFixed(0)} Gs</TableCell>
                            <TableCell align="center">{gananciaBase.toFixed(0)} Gs</TableCell>
                            <TableCell align="center">{gananciaTotal.toFixed(0)} Gs</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default DetalleNota;
