import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
    Container, Typography, Grid, Paper, Button, Divider, 
    Box, Pagination, CircularProgress 
} from '@mui/material';
import BeachDateFilter from './BeachDateFilter.jsx';

const RegistroFinalizados = () => {
    const [notas, setNotas] = useState([]); // Notas de la página actual
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const navigate = useNavigate();

    // Función para cargar notas con paginación
    const fetchNotasFinalizadas = async (currentPage) => {
        setLoading(true);
        try {
            // Enviamos el número de página a la API
            const response = await api.get(`/nota/finalizadas?page=${currentPage}&limit=20`);
            
            // La API ahora devuelve { notas, totalPages, currentPage, totalRecords }
            setNotas(response.data.notas);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error al cargar las notas finalizadas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotasFinalizadas(page);
    }, [page]); // Se dispara cada vez que "page" cambia

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0); // Sube al inicio al cambiar de página
    };

    // Nota: El filtrado local se mantiene igual, pero recuerda que 
    // solo filtrará sobre los registros de la página actual.
    const [filteredNotas, setFilteredNotas] = useState([]);
    useEffect(() => {
        setFilteredNotas(notas);
    }, [notas]);

    const handleFilter = (filters) => {
        const { beach, startDate, endDate } = filters;
        let filtered = notas;

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

    const formatearGs = (valor) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(valor);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 2, pb: 5 }}>
            <Typography variant="h4" align="center" color="black" gutterBottom sx={{ fontWeight: 'bold' }}>
                Registro de Notas Finalizadas
            </Typography>
            <Divider sx={{ my: 3 }} />

            <BeachDateFilter onFilter={handleFilter} /> 

            {loading ? (
                <Box display="flex" justifyContent="center" my={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {filteredNotas.map((nota) => (
                        <Paper key={nota._id} sx={{ p: 3, mb: 3, border: '1px solid #eee' }} elevation={2}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="subtitle2" color="textSecondary">Vendedor</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {nota.vendedor_id?.nombre} {nota.vendedor_id?.apellido}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3} md={2}>
                                    <Typography variant="subtitle2" color="textSecondary">Playa</Typography>
                                    <Typography variant="body1">{nota.playa}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={3} md={2}>
                                    <Typography variant="subtitle2" color="textSecondary">Fecha</Typography>
                                    <Typography variant="body1">{new Date(nota.createdAt).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <Typography variant="subtitle2" color="textSecondary">Ganancia Base</Typography>
                                    <Typography variant="body1" color="primary" fontWeight="bold">
                                        {formatearGs(nota.gananciaBaseTotal)} Gs
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box display="flex" gap={1}>
                                        <Button 
                                            fullWidth 
                                            variant="contained" 
                                            size="small"
                                            onClick={() => navigate(`/nota-detalle/${nota._id}`)}
                                        >
                                            Detalle
                                        </Button>
                                        <Button 
                                            fullWidth 
                                            variant="outlined" 
                                            color="secondary" 
                                            size="small"
                                            onClick={() => navigate(`/factura/${nota._id}`)}
                                        >
                                            Factura
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}

                    {/* CONTROL DE PAGINACIÓN */}
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination 
                            count={totalPages} 
                            page={page} 
                            onChange={handlePageChange} 
                            color="primary" 
                            size="large"
                            showFirstButton 
                            showLastButton
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default RegistroFinalizados;