import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import BeachDateFilter from '../BeachDateFilter.jsx'; // Importa el componente de filtrado

const RegistroFinalizadosS = () => {
    const [notasFinalizadas, setNotasFinalizadas] = useState([]);
    const [filteredNotas, setFilteredNotas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotasFinalizadas = async () => {
            try {
                const response = await axios.get('/api/nota/finalizadas');
                setNotasFinalizadas(response.data);
                setFilteredNotas(response.data); // Inicializa con todas las notas
            } catch (error) {
                console.error('Error al cargar las notas finalizadas:', error);
            }
        };

        fetchNotasFinalizadas();
    }, []);

    const handleFilter = (filters) => {
        const { beach, startDate, endDate } = filters;
        let filtered = notasFinalizadas;

        if (beach) {
            filtered = filtered.filter((nota) => nota.playa === beach);
        }

        if (startDate && endDate) {
            filtered = filtered.filter((nota) => {
                const noteDate = new Date(nota.createdAt);
                return noteDate >= new Date(startDate) && noteDate <= new Date(endDate);
            });
        }

        setFilteredNotas(filtered); // Actualiza las notas filtradas
    };

    // Función para ver el detalle de la nota
    const handleVerDetalle = (id) => {
        navigate(`/S-detalle-nota/${id}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" color="text.primary" gutterBottom>
                Registro de Notas Finalizadas
            </Typography>
            <Divider sx={{ my: 3 }} />

            {/* Agrega el filtro de playa y fecha */}
            <BeachDateFilter onFilter={handleFilter} />

            {filteredNotas.map((nota) => {
                // Calcular la ganancia base total sumando cada gananciaBase en detallesGanancias
                const gananciaBaseTotal = nota.detallesGanancias.reduce((total, detalle) => total + detalle.gananciaBase, 0);

                return (
                    <Paper key={nota._id} sx={{ p: 3, mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1"><strong>Vendedor:</strong> {nota.vendedor_id?.nombre} {nota.vendedor_id?.apellido}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1"><strong>Playa:</strong> {nota.playa}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1"><strong>Clima:</strong> {nota.clima}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1"><strong>Ganancia Base Total:</strong> {gananciaBaseTotal.toFixed(0)} Gs</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1"><strong>Fecha:</strong> {new Date(nota.createdAt).toLocaleDateString()}</Typography>
                            </Grid>
                            {/* Botones para ver detalle y factura */}
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
                        </Grid>
                    </Paper>
                );
            })}
        </Container>
    );
};

export default RegistroFinalizadosS;
