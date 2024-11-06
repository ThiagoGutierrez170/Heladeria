import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

const DetalleNota = () => {
    const { id } = useParams();
    const [nota, setNota] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNota = async () => {
            try {
                const response = await axios.get(`/api/nota/finalizadas/${id}/detalle`);
                setNota(response.data);
            } catch (error) {
                console.error('Error al cargar la nota:', error);
            }
        };

        fetchNota();
    }, [id]);

    if (!nota) return <Typography variant="h6" align="center">Cargando...</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Detalle de Nota Finalizada
            </Typography>
            <Divider sx={{ my: 3 }} />

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Vendedor:</strong> {nota.vendedor_id.nombre} {nota.vendedor_id.apellido}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Playa:</strong> {nota.playa}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Clima:</strong> {nota.clima}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Total Ganancia Base:</strong> ${nota.gananciaBaseTotal?.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Total Ganancia Recargas:</strong> ${nota.gananciaRecargasTotal?.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Total Ganancia Helados Devueltos:</strong> ${nota.gananciaDevueltosTotal?.toFixed(2)}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" align="center" gutterBottom>
                Detalle de Helados
            </Typography>

            {nota.catalogo.map((helado, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Nombre:</strong> {helado.nombre}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Cantidad Total:</strong> {helado.cantidadTotal}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Cantidad Vendida:</strong> {helado.cantidadVendida}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Ganancia Base:</strong> ${helado.gananciaBase?.toFixed(2)}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            ))}

            <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(-1)} // Volver a la vista anterior
                    sx={{ mt: 2 }}
                >
                    Volver
                </Button>
            </Grid>
        </Container>
    );
};

export default DetalleNota;
