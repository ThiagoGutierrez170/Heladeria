import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
    Container, Typography, Grid, Paper, Divider, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Button, Box
} from '@mui/material';
import Swal from 'sweetalert2';
import { toPng } from 'html-to-image';

const Factura = () => {
    const { id } = useParams();
    const [catalogo, setCatalogo] = useState([]);
    const [gananciaTotal, setGananciaTotal] = useState(0);
    const [notaInfo, setNotaInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNota = async () => {
            try {
                const response = await api.get(`/nota/finalizadas/${id}/factura`);
                const { detallesFactura, gananciaTotalBase, vendedor, playa, clima, createdAt } = response.data;

                const catalogoCalculado = detallesFactura.map((item) => ({
                    nombre: item.nombre,
                    imagen: item.imagen,
                    cantidadVendida: item.cantidadVendida,
                    gananciaBaseHelado: item.gananciaBase
                }));

                setCatalogo(catalogoCalculado);
                setGananciaTotal(gananciaTotalBase);
                setNotaInfo({
                    vendedor,
                    playa,
                    clima,
                    fecha: new Date(createdAt).toLocaleDateString()
                });
            } catch (error) {
                console.error('Error al cargar la nota:', error);
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

    // --- FUNCIÓN DE DESCARGA AÑADIDA ---
    const handleDescargarImagen = () => {
        const node = document.getElementById('area-factura');
        if (!node) return;

        Swal.fire({
            title: 'Generando factura...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const width = 370; // Ajustado para que el total y las tablas quepan bien

        toPng(node, { 
            backgroundColor: '#ffffff',
            width: width,
            style: {
                transform: 'scale(1)',
                padding: '5px',
                width: `${width}px`,
                height: 'auto',
                overflow: 'visible',
                margin: '0'
            },
            filter: (domNode) => {
                // Filtramos la columna de imagen para la captura
                if (domNode.tagName === 'TH' && domNode.innerText.trim() === 'Imagen') return false;
                if (domNode.tagName === 'TD' && domNode.getAttribute('data-column') === 'imagen') return false;
                if (domNode.tagName === 'IMG') return false;
                return true;
            }
        })
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `factura-${id}.png`;
            link.href = dataUrl;
            link.click();
            Swal.close();
        })
        .catch((error) => {
            console.error('Error al generar la imagen:', error);
            Swal.fire('Error', 'No se pudo generar la imagen.', 'error');
        });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5, pb: 5 }}>
            <Box display="flex" gap={2} mb={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/registro-finalizados')}
                    sx={{ flex: 1, py: 1.5 }}
                >
                    Volver
                </Button>
                {/* BOTÓN DE DESCARGA */}
                <Button
                    variant="contained"
                    color="warning"
                    onClick={handleDescargarImagen}
                    sx={{ flex: 1, py: 1.5 }}
                >
                    Descargar Imagen
                </Button>
            </Box>

            {/* ÁREA DE CAPTURA - ID: area-factura */}
            <Box id="area-factura" sx={{ backgroundColor: 'white', p: 1 }}>
                <Typography variant="h5" align="center" color="black" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Factura de Nota
                </Typography>

                {notaInfo && (
                    <Paper variant="outlined" sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    <strong>Vendedor:</strong> {notaInfo.vendedor ? `${notaInfo.vendedor.nombre} ${notaInfo.vendedor.apellido}` : '---'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Playa:</strong> {notaInfo.playa}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Clima:</strong> {notaInfo.clima}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2"><strong>Fecha:</strong> {notaInfo.fecha}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, border: '1px solid #ddd' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell align="center" data-column="imagen"><strong>Imagen</strong></TableCell>
                                <TableCell><strong>Helado</strong></TableCell>
                                <TableCell align="center" sx={{ py: 1, px: 0.5 }}><strong>Cant.</strong></TableCell>
                                <TableCell align="right"><strong>Total</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {catalogo.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center" data-column="imagen">
                                        <img
                                            src={item.imagen}
                                            alt=""
                                            style={{ width: 35, height: 35, borderRadius: '4px', objectFit: 'cover' }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '13px' }}>{item.nombre}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '13px', py: 0.5}}>{item.cantidadVendida}</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                                        {formatearGs(item.gananciaBaseHelado)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 2, p: 2, borderTop: '2px solid #333' }}>
                    <Typography variant="h5" align="right" color="black" sx={{ fontWeight: 'bold' }}>
                        TOTAL: {formatearGs(gananciaTotal)} Gs
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Factura;