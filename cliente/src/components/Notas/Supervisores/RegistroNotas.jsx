import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { 
    Container, Typography, Grid, Paper, Button, 
    Box, Pagination, CircularProgress, TextField, MenuItem 
} from '@mui/material';

const Registrofinalizados = () => {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Estado para los inputs del filtro
    const [filterInputs, setFilterInputs] = useState({
        playa: '',
        startDate: '',
        endDate: ''
    });

    // Estado persistente que se envía a la API
    const [appliedFilters, setAppliedFilters] = useState({
        playa: '',
        startDate: '',
        endDate: ''
    });

    const navigate = useNavigate();

    // Función de carga
    const fetchNotasSupervisor = useCallback(async (currentPage, filters) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 20,
                playa: filters.playa || '', 
                startDate: filters.startDate || '',
                endDate: filters.endDate || ''
            }).toString();

            const response = await api.get(`/nota/finalizadas/supervisor?${params}`);
            setNotas(response.data.notas);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error al cargar las notas:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Se dispara cuando cambia la página o se aplican filtros
    useEffect(() => {
        fetchNotasSupervisor(page, appliedFilters);
    }, [page, appliedFilters, fetchNotasSupervisor]);

    const handleInputChange = (e) => {
        setFilterInputs({
            ...filterInputs,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyFilters = () => {
        setPage(1); // Resetear a página 1
        setAppliedFilters(filterInputs); // Esto dispara el useEffect
    };

    const handleClearFilters = () => {
        const cleared = { playa: '', startDate: '', endDate: '' };
        setFilterInputs(cleared);
        setAppliedFilters(cleared);
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    const formatearGs = (valor) => new Intl.NumberFormat('es-PY').format(valor || 0);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, pb: 5 }}>
            {/* Título en color negro */}
            <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 3, color: 'black' }}>
                Control de Ventas (Supervisores)
            </Typography>
            
            {/* Sección de Filtros integrada en el mismo archivo */}
            <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            fullWidth
                            label="Filtrar por Playa"
                            name="playa"
                            value={filterInputs.playa}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                        >
                            <MenuItem value="">Todas las playas</MenuItem>
                            <MenuItem value="San José">San José</MenuItem>
                            <MenuItem value="Mboi ka´e">Mboi ka´e</MenuItem>
                            <MenuItem value="San Isidro">San Isidro</MenuItem>
                            <MenuItem value="Evento">Evento</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Desde"
                            type="date"
                            name="startDate"
                            value={filterInputs.startDate}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Hasta"
                            type="date"
                            name="endDate"
                            value={filterInputs.endDate}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box display="flex" gap={1}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                onClick={handleApplyFilters}
                            >
                                Filtrar
                            </Button>
                            <Button 
                                variant="outlined" 
                                fullWidth 
                                onClick={handleClearFilters}
                            >
                                Limpiar
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Box display="flex" justifyContent="center" my={5}><CircularProgress /></Box>
            ) : (
                <>
                    {notas.length === 0 ? (
                        <Typography align="center" sx={{ my: 5 }}>No se encontraron registros.</Typography>
                    ) : (
                        notas.map((nota) => (
                            <Paper key={nota._id} sx={{ p: 3, mb: 2, borderLeft: '6px solid #1976d2' }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle2" color="textSecondary">Vendedor</Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {nota.vendedor_id?.nombre} {nota.vendedor_id?.apellido}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={2}>
                                        <Typography variant="subtitle2" color="textSecondary">Playa</Typography>
                                        <Typography variant="body1">{nota.playa}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="subtitle2" color="textSecondary">Total Recaudado</Typography>
                                        <Typography variant="h6" color="primary">
                                            {formatearGs(nota.recaudacionTotal)} Gs
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Button 
                                            fullWidth 
                                            variant="contained" 
                                            onClick={() => navigate(`/S-detalle-nota/${nota._id}`)}
                                        >
                                            Ver Detalle
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))
                    )}

                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination 
                            count={totalPages} 
                            page={page} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default Registrofinalizados;