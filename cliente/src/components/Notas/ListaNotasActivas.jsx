import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const ListaNotasActivas = () => {
    const [notas, setNotas] = useState([]);
    const [filteredNotas, setFilteredNotas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotasActivas = async () => {
            try {
                const response = await axios.get('/api/nota/activas');
                const data = response.data.map((nota) => ({
                    ...nota,
                    title: nota.nombre || nota.playa,
                    firstLetter: (nota.nombre || nota.playa)[0].toUpperCase()
                }));
                setNotas(data);
                setFilteredNotas(data);
            } catch (error) {
                console.error('Error al obtener las notas activas:', error);
            }
        };

        fetchNotasActivas();
    }, []);

    const handleSearch = (event, value) => {
        setSearchTerm(value.toLowerCase());
        const filtered = notas.filter((nota) =>
            nota.playa.toLowerCase().includes(value.toLowerCase()) ||
            (nota.nombre && nota.nombre.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredNotas(filtered);
    };

    const handleVerDetalle = (id) => {
        navigate(`/nota-activa/${id}`);
    };

    return (
        <Container>
            <Typography variant="h4" align="center" color='black' m={4} gutterBottom>
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

            <Autocomplete
                options={notas}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.title}
                onInputChange={handleSearch}
                sx={{
                    width: {
                        xs: '100%',
                        sm: '80%',
                        md: 1300
                    },
                    mb: 4
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Buscar por playa" />
                )}
            />
            <Grid container spacing={3}>
                {filteredNotas.map((nota) => (
                    <Grid item xs={12} sm={6} md={4} key={nota._id}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {nota.playa}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    Clima: {nota.clima}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    Estado: {nota.estado}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Vendedor: {nota.vendedor_id ? `${nota.vendedor_id.nombre} ${nota.vendedor_id.apellido}` : 'Sin vendedor asignado'}
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
