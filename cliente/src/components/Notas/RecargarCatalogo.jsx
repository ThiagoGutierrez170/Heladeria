import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Swal from 'sweetalert2';

const RecargarCatalogo = () => {
    const { id } = useParams(); // ID de la nota
    const navigate = useNavigate();

    const [catalogo, setCatalogo] = useState([]);
    const [recargas, setRecargas] = useState({});

    useEffect(() => {
        const fetchCatalogo = async () => {
            try {
                // Obtener todos los helados activos
                const response = await axios.get('/api/helado?estado=activo');
                const catalogoData = response.data.map(item => ({
                    ...item,
                    cantidadTotal: item.cantidadTotal || 0 // Asegura que cantidadTotal siempre esté definido
                }));
                setCatalogo(catalogoData);

                // Inicializa el estado de recargas para cada helado en 0
                const initialRecargas = catalogoData.reduce((acc, item) => {
                    acc[item._id] = 0;  // Usamos el _id del helado
                    return acc;
                }, {});
                setRecargas(initialRecargas);
            } catch (error) {
                console.error('Error al cargar el catálogo:', error);
            }
        };

        fetchCatalogo();
    }, []);

    const handleRecargaChange = (heladoId, value) => {
        setRecargas({
            ...recargas,
            [heladoId]: parseInt(value, 10) || 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar recargas a la API para actualizar los helados
            await axios.put(`/api/nota/recargar/${id}`, { recargas });
            Swal.fire('Recarga Exitosa', 'Las cantidades han sido recargadas en el catálogo.', 'success');
            navigate(`/notas-activas/`);
        } catch (error) {
            console.error('Error en la solicitud de recarga:', error.response || error);
            Swal.fire('Error', 'Hubo un problema al recargar el catálogo', 'error');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom>
                Recargar Catálogo
            </Typography>
            <form onSubmit={handleSubmit}>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>Helado</strong></TableCell>
                                <TableCell align="center"><strong>Cantidad Total</strong></TableCell>
                                <TableCell align="center"><strong>Cantidad a Recargar</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {catalogo.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell align="center">
                                        <Typography variant="body1">{item.nombre}</Typography>
                                    </TableCell>
                                    <TableCell align="center">{item.cantidadTotal}</TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            label="Recargar"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={recargas[item._id] || 0}
                                            onChange={(e) => handleRecargaChange(item._id, e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
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
                    Guardar Recargas 
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

export default RecargarCatalogo;
