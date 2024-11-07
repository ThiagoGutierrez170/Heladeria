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

const Factura = () => {
    const { id } = useParams();
    const [catalogo, setCatalogo] = useState([]);
    const [gananciaTotal, setGananciaTotal] = useState(0);
    const [notaInfo, setNotaInfo] = useState(null);

    useEffect(() => {
        const fetchNota = async () => {
            try {
                const response = await axios.get(`/api/nota/finalizadas/${id}/factura`);
                const { detallesFactura, gananciaTotalBase, vendedor_id, playa, clima } = response.data;
                console.log(response.data);
                const catalogoCalculado = detallesFactura.map((item) => ({
                    nombre: item.nombre,
                    cantidadVendida: item.cantidadVendida,
                    gananciaBaseHelado: item.gananciaBase
                }));

                setCatalogo(catalogoCalculado);
                setGananciaTotal(gananciaTotalBase);
                setNotaInfo({ vendedor: vendedor_id, playa, clima });
            } catch (error) {
                console.error('Error al cargar la nota:', error);
            }
        };

        fetchNota();
    }, [id]);

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Factura de Nota
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
                Ganancias Base de la Nota
            </Typography>
            <Divider sx={{ my: 3 }} />

            {/* Tabla de detalles de helados y ganancias */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nombre del helado</strong></TableCell>
                            <TableCell align="center"><strong>Cantidad Vendida</strong></TableCell>
                            <TableCell align="center"><strong>Total del Helado (Gs)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {catalogo.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.nombre}</TableCell>
                                <TableCell align="center">{item.cantidadVendida}</TableCell>
                                <TableCell align="center">{item.gananciaBaseHelado.toFixed(0)} Gs</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" align="center" sx={{ mt: 2 }}>
                Ganancia base total: {gananciaTotal.toFixed(0)} Gs
            </Typography>
        </Container>
    );
};

export default Factura;