import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const RegistroFinalizados = () => {
    const [notasFinalizadas, setNotasFinalizadas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotasFinalizadas = async () => {
            try {
                const response = await axios.get('/api/nota/finalizadas');
                setNotasFinalizadas(response.data);
            } catch (error) {
                console.error('Error al cargar las notas finalizadas:', error);
            }
        };

        fetchNotasFinalizadas();
    }, []);

    const handleVerDetalle = (id) => {
        navigate(`/nota-detalle/${id}`);
    };

    const handleVerFactura = (id) => {
        navigate(`/factura/${id}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" color='black' gutterBottom>
                Registro de Notas Finalizadas
            </Typography>
            <Divider sx={{ my: 3 }} />

            {notasFinalizadas.map((nota) => {
                const gananciaBaseTotal = nota.detallesGanancias.reduce((total, detalle) => total + detalle.gananciaBase, 0);

                // Formatear la fecha de la nota
                const fechaNota = new Date(nota.createdAt).toLocaleDateString();

                return (
                    <Paper key={nota._id} sx={{ p: 3, mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1" color='black'><strong>Vendedor:</strong> {nota.vendedor_id?.nombre} {nota.vendedor_id?.apellido}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1" color='black'><strong>Playa:</strong> {nota.playa}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1" color='black'><strong>Clima:</strong> {nota.clima}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1" color='black'><strong>Ganancia Base Total:</strong> {gananciaBaseTotal.toFixed(0)} Gs</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1"><strong>Fecha:</strong> {fechaNota}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleVerDetalle(nota._id)}
                                    sx={{ mt: 2 }}
                                >
                                    Ver Detalle
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleVerFactura(nota._id)}
                                    sx={{ mt: 2 }}
                                >
                                    Ver Factura
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                );
            })}
        </Container>
    );
};

export default RegistroFinalizados;
