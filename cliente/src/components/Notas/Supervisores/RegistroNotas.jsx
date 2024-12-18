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

const RegistroFinalizados = () => {
    const [notasFinalizadas, setNotasFinalizadas] = useState([]);
    const [filteredNotas, setFilteredNotas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotasFinalizadas = async () => {
            try {
                const response = await axios.get('/api/nota/finalizadas');
                setNotasFinalizadas(response.data);
                setFilteredNotas(response.data);
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

        setFilteredNotas(filtered);
    };

    const handleVerDetalle = (id) => {
        navigate(`/S-detalle-nota/${id}`);
    };

    const formatearGs = (valor) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'decimal',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(valor);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 0 }}>
            <Typography variant="h4" align="center" color="black" gutterBottom>
                Registro de Notas Finalizadas 
            </Typography>
            <Divider sx={{ my: 3 }} />

            <BeachDateFilter onFilter={handleFilter} /> 

            {filteredNotas.map((nota) => {
                const fechaNota = new Date(nota.createdAt).toLocaleDateString();

                return (
                    <Paper key={nota._id} sx={{ p: 3, mb: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1" color="black">
                                    <strong>Vendedor:</strong> {nota.vendedor_id?.nombre} {nota.vendedor_id?.apellido}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1" color="black">
                                    <strong>Playa:</strong> {nota.playa}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1" color="black">
                                    <strong>Clima:</strong> {nota.clima}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1" color="black">
                                    <strong>Ganancia Total de Venta:</strong> {formatearGs(nota.gananciaVentaTotal)} Gs 
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body1">
                                    <strong>Fecha:</strong> {fechaNota}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleVerDetalle(nota._id)}
                                    sx={{ mt: 2, width: '100%' }}
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

export default RegistroFinalizados;
