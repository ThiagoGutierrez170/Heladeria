import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';

const FinalizarNota = () => {
    const { id } = useParams(); // ID de la nota
    const navigate = useNavigate();

    const [catalogo, setCatalogo] = useState([]);
    const [devoluciones, setDevoluciones] = useState({});

    // Cargar el catálogo cuando el componente se monta
    useEffect(() => {
        const fetchCatalogo = async () => {
            try {
                const response = await axios.get(`/api/nota/activas/${id}`);
                
                if (response.data && Array.isArray(response.data.catalogo)) {
                    setCatalogo(response.data.catalogo);

                    // Inicializa devoluciones con los helados del catálogo
                    const initialDevoluciones = response.data.catalogo.reduce((acc, item) => {
                        acc[item.helado_id._id] = 0; // Asegúrate de que 'helado_id' tenga '_id'
                        return acc;
                    }, {});
                    setDevoluciones(initialDevoluciones);
                } else {
                    throw new Error('El catálogo no está disponible o está mal formado');
                }
            } catch (error) {
                console.error('Error al cargar el catálogo:', error);
                Swal.fire('Error', 'Hubo un problema al cargar el catálogo.', 'error');
            }
        };

        fetchCatalogo();
    }, [id]);

    // Actualiza el valor de las devoluciones cuando el usuario cambia la cantidad
    const handleDevolucionChange = (heladoId, value) => {
        setDevoluciones({
            ...devoluciones,
            [heladoId]: parseInt(value, 10) || 0
        });
    };

    // Maneja el envío del formulario para finalizar la nota
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Envía las devoluciones al backend para finalizar la nota
            const response = await axios.put(`/api/nota/activas/${id}/finalizar`, { devoluciones });
            
            if (response.status === 200) {
                Swal.fire('Nota Finalizada', 'Los helados devueltos han sido registrados y el stock se ha actualizado.', 'success');
                navigate(`/factura/${id}`);
            }
        } catch (error) {
            // Mostrar el error que se recibe desde el backend si existe
            const errorMessage = error.response?.data?.error || 'Hubo un problema al finalizar la nota';
            Swal.fire('Error', errorMessage, 'error');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Finalizar Nota
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
                Ingrese la cantidad de helados devueltos para cada tipo.
            </Typography>
            <form onSubmit={handleSubmit}>
                {catalogo.length > 0 ? (
                    catalogo.map((item) => (
                        <Grid container spacing={2} key={item.helado_id._id} alignItems="center">
                            <Grid item xs={8}>
                                <Typography variant="body1">{item.helado_id.nombre}</Typography> {/* Nombre del helado */}
                                <Typography variant="body2" color="textSecondary">
                                    Cantidad inicial: {item.cantidad_inicial} | Vendido: {item.cantidad_vendida}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Cantidad devuelta"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    value={devoluciones[item.helado_id._id] || 0}
                                    onChange={(e) => handleDevolucionChange(item.helado_id._id, e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary" align="center">
                        No hay helados disponibles en el catálogo.
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Finalizar Nota
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

export default FinalizarNota;
