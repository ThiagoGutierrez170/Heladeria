import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Container, Typography, Grid, Paper, Divider, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Button
} from '@mui/material';

const DetalleNota = () => {
    const { id } = useParams();
    const [detallesGanancias, setDetallesGanancias] = useState([]);
    const [gananciaMinima, setGananciaMinima] = useState(0);
    const [gananciaBase, setGananciaBase] = useState(0);
    const [gananciaTotal, setGananciaTotal] = useState(0);
    const [notaInfo, setNotaInfo] = useState(null);
    const [fechaNota, setFechaNota] = useState('');
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
                setNotaInfo({ vendedor: vendedor_id, playa, clima });
                setFechaNota(fecha);
            } catch (error) {
                console.error('Error al cargar el detalle de la nota:', error);
            }
        };
        fetchNota();
    }, [id]);

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
                navigate('/registro-finalizados');
            } catch (error) {
                Swal.fire('Error!', 'Hubo un problema al eliminar la nota.', 'error');
            }
        }
    };

    // Función para formatear los números en guaraníes con puntos
    const formatearGs = (valor) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'decimal',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(valor);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" color='black' gutterBottom>
                Detalle de la Nota
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/registro-finalizados')}
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
            {notaInfo && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Table>
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
                                <TableCell>
                                    {notaInfo.vendedor?.nombre
                                        ? `${notaInfo.vendedor.nombre} ${notaInfo.vendedor.apellido}`
                                        : "Información de vendedor no disponible"}
                                </TableCell>
                                <TableCell>{notaInfo.playa}</TableCell>
                                <TableCell>{notaInfo.clima}</TableCell>
                                <TableCell>{new Date(fechaNota).toLocaleDateString()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            )}


            <Typography variant="h6" align="center" color='black' gutterBottom>
                Detalle de Ganancias de la Nota
            </Typography>
            <Divider sx={{ my: 3 }} />

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Imagen</strong></TableCell>
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
                                <TableCell>
                                    <img
                                        src={item.imagen} // Imagen por defecto si falta la URL
                                        alt={item.nombre}
                                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                                    />
                                </TableCell>
                                <TableCell>{item.nombre || "Nombre no disponible"}</TableCell>
                                <TableCell align="center">{item.cantidadVendida}</TableCell>
                                <TableCell align="center">{formatearGs(item.gananciaMinima)} Gs</TableCell>
                                <TableCell align="center">{formatearGs(item.gananciaBase)} Gs</TableCell>
                                <TableCell align="center">{formatearGs(item.gananciaTotal)} Gs</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" align="center" color='black' gutterBottom>
                Ganancias Totales de la Nota
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Ganancia Mínima Total</strong></TableCell>
                            <TableCell><strong>Ganancia Base Total</strong></TableCell>
                            <TableCell><strong>Ganancia Total</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{formatearGs(gananciaMinima)} Gs</TableCell>
                            <TableCell>{formatearGs(gananciaBase)} Gs</TableCell>
                            <TableCell>{formatearGs(gananciaTotal)} Gs</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Button variant="contained" color="error" onClick={handleEliminar} fullWidth>
                Eliminar Nota
            </Button>
            <br /><br /><br />
        </Container>
    );
};

export default DetalleNota;