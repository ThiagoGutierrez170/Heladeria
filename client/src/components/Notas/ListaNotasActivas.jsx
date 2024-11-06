import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const ListaNotasActivas = () => {
    const [notas, setNotas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotasActivas = async () => {
            try {
                const response = await axios.get('/api/nota/activas');
                setNotas(response.data);
            } catch (error) {
                console.error('Error al obtener las notas activas:', error);
            }
        };

        fetchNotasActivas();
    }, []);

    const handleVerDetalle = (id) => {
        navigate(`/nota-activa/${id}`);
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Notas Activas
            </Typography>
            <Grid container spacing={3}>
                {notas.map((nota) => (
                    <Grid item xs={12} sm={6} md={4} key={nota._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{nota.playa}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Clima: {nota.clima}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Estado: {nota.estado}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Vendedor: {nota.vendedor_id ? `${nota.vendedor_id.nombre} ${nota.vendedor_id.apellido}` : 'Sin vendedor asignado'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleVerDetalle(nota._id)}
                                    sx={{ mt: 2 }}
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
