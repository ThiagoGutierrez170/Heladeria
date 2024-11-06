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

    // Función para ver el detalle de la nota
    const handleVerDetalle = (id) => {
        navigate(`/nota-detalle/${id}`);
    };

    // Función para ver la factura de la nota
    const handleVerFactura = (id) => {
        navigate(`/factura/${id}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Registro de Notas Finalizadas
            </Typography>
            <Divider sx={{ my: 3 }} />

            {notasFinalizadas.map((nota) => (
                <Paper key={nota._id} sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body1"><strong>Vendedor:</strong> {nota.vendedor_id.nombre} {nota.vendedor_id.apellido}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body1"><strong>Playa:</strong> {nota.playa}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body1"><strong>Clima:</strong> {nota.clima}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body1"><strong>Ganancia Base Total:</strong> ${nota.gananciaBaseTotal?.toFixed(2)}</Typography>
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
            ))}
        </Container>
    );
};

export default RegistroFinalizados;
