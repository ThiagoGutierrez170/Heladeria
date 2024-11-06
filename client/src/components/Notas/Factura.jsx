import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

const Factura = () => {
    const { id } = useParams(); // ID de la nota
    const [catalogo, setCatalogo] = useState([]);
    const [gananciaTotal, setGananciaTotal] = useState(0);

    useEffect(() => {
        const fetchNota = async () => {
            try {
                const response = await axios.get(`/api/nota/finalizadas/${id}/detalle`);
                const catalogoData = response.data.catalogo;

                // Realiza los cálculos de ganancia base para cada helado
                const catalogoCalculado = catalogoData.map((item) => {
                    // Calcula la cantidad total de helado (cantidad inicial + recargas)
                    const cantidadTotal = item.cantidad_inicial + (item.recargas?.reduce((acc, recarga) => acc + recarga, 0) || 0);

                    // Calcula la cantidad vendida restando la cantidad devuelta (si existe)
                    const cantidadVendida = cantidadTotal - (item.devoluciones || 0);

                    // Calcula la ganancia base del helado
                    const gananciaBaseHelado = cantidadVendida * item.helado_id.precio_base;

                    return {
                        nombre: item.helado_id.nombre,
                        gananciaBaseHelado,
                    };
                });

                // Calcula la ganancia base total de la nota
                const totalGanancia = catalogoCalculado.reduce((acc, item) => acc + item.gananciaBaseHelado, 0);

                setCatalogo(catalogoCalculado);
                setGananciaTotal(totalGanancia);
            } catch (error) {
                console.error('Error al cargar la nota:', error);
            }
        };

        fetchNota();
    }, [id]);

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Factura de Nota
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
                Ganancias Base de la Nota
            </Typography>
            <Divider sx={{ my: 3 }} />

            {catalogo.map((item, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body1"><strong>Helado:</strong> {item.nombre}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1"><strong>Ganancia base:</strong> ${item.gananciaBaseHelado.toFixed(2)}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            ))}

            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" align="center" sx={{ mt: 2 }}>
                Ganancia base total: ${gananciaTotal.toFixed(2)}
            </Typography>
        </Container>
    );
};

export default Factura;
