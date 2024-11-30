import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

const ListaNotasActivas = () => {
    const [notas, setNotas] = useState([]);
    const [filteredNotas, setFilteredNotas] = useState([]);
    const [selectedPlaya, setSelectedPlaya] = useState('');
    const navigate = useNavigate();

    // Las opciones de playas
    const playas = ['San José', 'Mboi ka´e', 'San Isidro', 'Evento'];

    useEffect(() => {
        const fetchNotasActivas = async () => {
            try {
                const response = await axios.get('/api/nota/activas');
                const data = response.data.map((nota) => ({
                    ...nota,
                    title: nota.playa, // Aseguramos que el campo title sea la playa
                }));
                setNotas(data);
                setFilteredNotas(data); // Inicialmente muestra todas
            } catch (error) {
                console.error('Error al obtener las notas activas:', error);
            }
        };

        fetchNotasActivas();
    }, []);

    const handlePlayaChange = (event) => {
        const selected = event.target.value;
        setSelectedPlaya(selected);

        // Filtramos las notas por la playa seleccionada
        const filtered = notas.filter((nota) =>
            nota.playa.toLowerCase().includes(selected.toLowerCase())
        );
        setFilteredNotas(filtered);
    };

    const handleVerDetalle = (id) => {
        navigate(`/nota-activa/${id}`);
    };

    return (
        <Container>
            <Typography variant="h4" align="center" color="black" m={4} gutterBottom>
                Notas Activas
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/agregar-nota')}
                sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#1976d2',
                    '&:hover': {
                        backgroundColor: '#155a8a',
                    },
                }}
            >
                +
            </Button>

            {/* Select para filtrar por playa */}
            <Box sx={{ mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>Selecciona una Playa</InputLabel>
                    <Select
                        value={selectedPlaya}
                        onChange={handlePlayaChange}
                        label="Selecciona una Playa"
                    >
                        <MenuItem value="">
                            <em>Todos</em>
                        </MenuItem>
                        {playas.map((playa) => (
                            <MenuItem key={playa} value={playa}>
                                {playa}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {filteredNotas.map((nota) => (
                    <Grid item xs={12} sm={6} md={4} key={nota._id}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {nota.playa}
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {nota.vendedor_id
                                        ? `${nota.vendedor_id.nombre} ${nota.vendedor_id.apellido}`
                                        : 'Sin vendedor asignado'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handleVerDetalle(nota._id)}
                                    sx={{
                                        padding: '12px 16px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: '#1565c0',
                                        },
                                    }}
                                >
                                    Ver Detalle
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ListaNotasActivas;
