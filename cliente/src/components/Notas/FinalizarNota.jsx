import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import Swal from 'sweetalert2';

const FinalizarNota = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [catalogo, setCatalogo] = useState([]);
    const [devoluciones, setDevoluciones] = useState({});

    useEffect(() => {
        const fetchCatalogo = async () => {
            try {
                const response = await axios.get(`/api/nota/activas/${id}`);

                if (response.data && Array.isArray(response.data.catalogo)) {
                    setCatalogo(response.data.catalogo);

                    const initialDevoluciones = response.data.catalogo.reduce((acc, item) => {
                        acc[item.helado_id._id] = ''; // Inicia con cadena vacía
                        return acc;
                    }, {});
                    setDevoluciones(initialDevoluciones);
                } else {
                    throw new Error('El catálogo no está disponible o está mal formado');
                }
            } catch (error) {
                console.error('Error al cargar el catálogo:', error);
                Swal.fire('Error', 'Hubo un problema al cargar el catálogo.', 'error');
            }
        };

        fetchCatalogo();
    }, [id]);

    const handleDevolucionChange = (heladoId, value) => {
        const cantidadTotal = catalogo.find((item) => item.helado_id._id === heladoId)?.cantidadTotal;

        let cantidadDevuelta = parseInt(value, 10) || '';

        if (cantidadDevuelta < 0) {
            Swal.fire('Error', 'La cantidad devuelta no puede ser menor a 0.', 'error');
            cantidadDevuelta = '';
        }

        if (cantidadDevuelta > cantidadTotal) {
            Swal.fire('Error', 'La cantidad devuelta no puede ser mayor a la cantidad total.', 'error');
            cantidadDevuelta = cantidadTotal;
        }

        setDevoluciones({
            ...devoluciones,
            [heladoId]: cantidadDevuelta,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`/api/nota/activas/${id}/finalizar`, { devoluciones });

            if (response.status === 200) {
                Swal.fire('Nota Finalizada', 'Los helados devueltos han sido registrados y el stock se ha actualizado.', 'success');
                navigate(`/factura/${id}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Hubo un problema al finalizar la nota';
            Swal.fire('Error', errorMessage, 'error');
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom color="black" sx={{ mb: 3, fontSize: { xs: '24px', sm: '32px' } }}>
                Finalizar Nota
            </Typography>
            <Typography variant="body1" align="center" gutterBottom color="black" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>
                Ingrese la cantidad de helados devueltos.
            </Typography>
            <form onSubmit={handleSubmit}>
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontSize: '16px' }}>
                                    <strong>Imagen</strong>
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '16px' }}>
                                    <strong>Helado</strong>
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '16px' }}>
                                    <strong>Cantidad Total</strong>
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '16px' }}>
                                    <strong>Cantidad Devuelta</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {catalogo.length > 0 ? (
                                catalogo.map((item) => (
                                    <TableRow key={item.helado_id._id}>
                                        <TableCell align="center">
                                            <img
                                                src={item.helado_id.imagen}
                                                alt={item.helado_id.nombre}
                                                width={80}
                                                height={80}
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px' }}>
                                            {item.helado_id.nombre}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px' }}>
                                            {item.cantidadTotal}
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                label="Devueltos"
                                                type="number"
                                                variant="outlined"
                                                fullWidth
                                                value={devoluciones[item.helado_id._id] || ''}
                                                onChange={(e) => handleDevolucionChange(item.helado_id._id, e.target.value)}
                                                inputProps={{ style: { fontSize: '16px' } }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ fontSize: '14px' }}>
                                        No hay helados disponibles en el catálogo.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 4, py: 2, fontSize: '16px' }}
                >
                    Finalizar Nota
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(`/notas-activas`)}
                    fullWidth
                    sx={{ mt: 2, py: 2, fontSize: '16px' }}
                >
                    Cancelar
                </Button>
            </form>
        </Container>
    );
};

export default FinalizarNota;
