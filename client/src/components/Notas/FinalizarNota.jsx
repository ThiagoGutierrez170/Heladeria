import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Swal from 'sweetalert2';

const FinalizarNota = () => {
    const { id } = useParams(); // ID de la nota
    const navigate = useNavigate();

    const [catalogo, setCatalogo] = useState([]);
    const [devoluciones, setDevoluciones] = useState({});

    // Cargar el catálogo cuando el componente se monta
    useEffect(() => {
        const fetchCatalogo = async () => {
            try {
                const response = await axios.get(`/api/nota/activas/${id}`);
                
                if (response.data && Array.isArray(response.data.catalogo)) {
                    setCatalogo(response.data.catalogo);

                    // Inicializa devoluciones con los helados del catálogo
                    const initialDevoluciones = response.data.catalogo.reduce((acc, item) => {
                        acc[item.helado_id._id] = 0; // Asegura que 'helado_id' tenga '_id'
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

    // Actualiza el valor de las devoluciones cuando el usuario cambia la cantidad
    const handleDevolucionChange = (heladoId, value) => {
        const cantidadTotal = catalogo.find(item => item.helado_id._id === heladoId)?.cantidadTotal;

        let cantidadDevuelta = parseInt(value, 10) || 0;

        // Validación para evitar valores negativos
        if (cantidadDevuelta < 0) {
            Swal.fire('Error', 'La cantidad devuelta no puede ser menor a 0.', 'error');
            cantidadDevuelta = 0; // Establecer el valor en 0 si el usuario ingresa un número negativo
        }

        // Validación para evitar que la cantidad devuelta sea mayor que la cantidad total
        if (cantidadDevuelta > cantidadTotal) {
            Swal.fire('Error', 'La cantidad devuelta no puede ser mayor a la cantidad total.', 'error');
            cantidadDevuelta = cantidadTotal; // Establecer el valor en la cantidad total si es mayor
        }

        setDevoluciones({
            ...devoluciones,
            [heladoId]: cantidadDevuelta
        });
    };

    // Maneja el envío del formulario para finalizar la nota
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
        <Container maxWidth="md">
            <br />
            <Typography variant="h4" align="center" color="black" gutterBottom>
                Finalizar Nota
            </Typography>
            <form onSubmit={handleSubmit}>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>Helado</strong></TableCell>
                                <TableCell align="center"><strong>Cantidad Total</strong></TableCell>
                                <TableCell align="center"><strong>Cantidad Devuelta</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {catalogo.length > 0 ? (
                                catalogo.map((item) => (
                                    <TableRow key={item.helado_id._id}>
                                        <TableCell align="center">{item.helado_id.nombre}</TableCell>
                                        <TableCell align="center">{item.cantidadTotal}</TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                label="Devueltos"
                                                type="number"
                                                variant="outlined"
                                                fullWidth
                                                value={devoluciones[item.helado_id._id] || 0}
                                                onChange={(e) => handleDevolucionChange(item.helado_id._id, e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
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
                    sx={{ mt: 3 }}
                >
                    Finalizar Nota
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(`/notas-activas`)}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Cancelar
                </Button>
            </form>
        </Container>
    );
};

export default FinalizarNota;
