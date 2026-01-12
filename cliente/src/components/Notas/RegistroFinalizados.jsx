import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
    Container, Typography, Grid, Paper, Button, Divider, 
    Box, Pagination, CircularProgress, TextField, MenuItem 
} from '@mui/material';

const RegistroFinalizados = () => {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // 1. ESTADOS PARA FILTROS (Inputs y Aplicados)
    const [filterInputs, setFilterInputs] = useState({
        playa: '',
        startDate: '',
        endDate: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        playa: '',
        startDate: '',
        endDate: ''
    });

    const navigate = useNavigate();

    // 2. FUNCIÓN DE CARGA CONECTADA AL BACKEND
    const fetchNotasFinalizadas = useCallback(async (currentPage, filters) => {
        setLoading(true);
        try {
            // Construimos la query string con los filtros reales
            const params = new URLSearchParams({
                page: currentPage,
                limit: 20,
                playa: filters.playa || '',
                startDate: filters.startDate || '',
                endDate: filters.endDate || ''
            }).toString();

            const response = await api.get(`/nota/finalizadas?${params}`);
            
            setNotas(response.data.notas);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error al cargar las notas finalizadas:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. EFECTO: Se dispara al cambiar página o aplicar filtros
    useEffect(() => {
        fetchNotasFinalizadas(page, appliedFilters);
    }, [page, appliedFilters, fetchNotasFinalizadas]);

    // 4. MANEJADORES DE FILTROS
    const handleInputChange = (e) => {
        setFilterInputs({
            ...filterInputs,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyFilters = () => {
        setPage(1); // Resetear a la primera página al filtrar
        setAppliedFilters(filterInputs);
    };

    const handleClearFilters = () => {
        const reset = { playa: '', startDate: '', endDate: '' };
        setFilterInputs(reset);
        setAppliedFilters(reset);
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    const formatearGs = (valor) => {
        return new Intl.NumberFormat('es-PY').format(valor || 0);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 2, pb: 5 }}>
            {/* Título en NEGRO */}
            <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 3, color: 'black' }}>
                Registro de Notas Finalizadas
            </Typography>
            
            <Divider sx={{ my: 3 }} />

            {/* SECCIÓN DE FILTROS INTEGRADA */}
            <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            fullWidth
                            label="Playa"
                            name="playa"
                            value={filterInputs.playa}
                            onChange={handleInputChange}
                            size="small"
                        >
                            <MenuItem value="">Todas</MenuItem>
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
                            <Button variant="contained" fullWidth onClick={handleApplyFilters}>
                                Filtrar
                            </Button>
                            <Button variant="outlined" fullWidth onClick={handleClearFilters}>
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
                        <Typography align="center" color="textSecondary" sx={{ my: 5 }}>
                            No se encontraron notas con los criterios seleccionados.
                        </Typography>
                    ) : (
                        notas.map((nota) => (
                            <Paper key={nota._id} sx={{ p: 3, mb: 3, borderLeft: '6px solid #2e7d32' }} elevation={2}>
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
                                        <Typography variant="body1">
                                            {new Date(nota.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <Typography variant="subtitle2" color="textSecondary">Ganancia Base</Typography>
                                        <Typography variant="body1" color="success.main" fontWeight="bold">
                                            {formatearGs(nota.totalBase || nota.gananciaBaseTotal)} Gs
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
                        ))
                    )}

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