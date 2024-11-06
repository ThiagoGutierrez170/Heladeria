import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';

const RecargarCatalogo = () => {
    const { id } = useParams(); // ID de la nota
    const navigate = useNavigate();

    const [catalogo, setCatalogo] = useState([]);
    const [recargas, setRecargas] = useState({});

    useEffect(() => {
        const fetchCatalogo = async () => {
            try {
                const response = await axios.get(`/api/nota/activas/${id}`);
                setCatalogo(response.data.catalogo);
                // Inicializa el estado de recargas para cada helado en 0
                const initialRecargas = response.data.catalogo.reduce((acc, item) => {
                    acc[item.helado_id._id] = 0;
                    return acc;
                }, {});
                setRecargas(initialRecargas);
            } catch (error) {
                console.error('Error al cargar el catálogo:', error);
            }
        };

        fetchCatalogo();
    }, [id]);

    const handleRecargaChange = (heladoId, value) => {
        setRecargas({
            ...recargas,
            [heladoId]: parseInt(value, 10) || 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Envía las recargas al backend para actualizar la nota
            await axios.put(`/api/nota/recargar/${id}`, { recargas });
            Swal.fire('Recarga Exitosa', 'Las cantidades han sido recargadas en el catálogo.', 'success');
            navigate(`/notas-activas/${id}`);
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al recargar el catálogo', 'error');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Recargar Catálogo
            </Typography>
            <form onSubmit={handleSubmit}>
                {catalogo.map((item) => (
                    <Grid container spacing={2} key={item.helado_id._id} alignItems="center">
                        <Grid item xs={6}>
                            <Typography variant="body1">{item.helado_id.nombre}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Cantidad inicial: {item.cantidad_inicial} | Vendido: {item.cantidad_vendida}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Cantidad a Recargar"
                                type="number"
                                variant="outlined"
                                fullWidth
                                value={recargas[item.helado_id._id] || 0}
                                onChange={(e) => handleRecargaChange(item.helado_id._id, e.target.value)}
                            />
                        </Grid>
                    </Grid>
                ))}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Guardar Recargas
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(`/notas-activas/${id}`)}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Cancelar
                </Button>
            </form>
        </Container>
    );
};

export default RecargarCatalogo;
