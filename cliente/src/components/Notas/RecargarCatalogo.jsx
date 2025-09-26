import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import axios from 'axios';
import api from '../../utils/api';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Swal from 'sweetalert2';

const RecargarCatalogo = () => {
    const { id } = useParams(); // ID de la nota
    const navigate = useNavigate();

    const [catalogo, setCatalogo] = useState([]);
    const [helados, setHelados] = useState([]); // Lista de todos los helados activos
    const [recargas, setRecargas] = useState({});

    useEffect(() => {
        const fetchCatalogo = async () => {
            try {
                // Obtener los helados activos
                const heladosResponse = await api.get('/helado?estado=true');
                setHelados(heladosResponse.data);

                // Obtener la nota y el catálogo de la misma
                const response = await api.get(`/nota/activas/${id}`);
                
                if (response.data && Array.isArray(response.data.catalogo)) {
                    setCatalogo(response.data.catalogo);

                    // Inicializa el estado de recargas para cada helado como cadena vacía
                    const initialRecargas = response.data.catalogo.reduce((acc, item) => {
                        acc[item.helado_id._id] = ''; // Usamos cadena vacía en lugar de 0
                        return acc;
                    }, {});
                    setRecargas(initialRecargas);
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

    const handleRecargaChange = (heladoId, value) => {
        setRecargas({
            ...recargas,
            [heladoId]: value, // Ahora permitimos que el campo sea una cadena vacía
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/nota/recargar/${id}`, { recargas });
            Swal.fire('Recarga Exitosa', 'Las cantidades han sido recargadas en el catálogo.', 'success');
            navigate(`/notas-activas/`);
        } catch (error) {
            console.error('Error en la solicitud de recarga:', error.response || error);
            Swal.fire('Error', 'Hubo un problema al recargar el catálogo', 'error');
        }
    };

    // Obtener los helados que no están en la nota
    const heladosNoEnNota = helados.filter(helado => 
        !catalogo.some(item => item.helado_id._id === helado._id)
    );

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom color="black" sx={{ mb: 2 }}>
                Recargar Catálogo
            </Typography>
            <form onSubmit={handleSubmit}>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>Imagen</strong></TableCell>
                                <TableCell align="center"><strong>Helado</strong></TableCell>
                                <TableCell align="center"><strong>Cantidad Total</strong></TableCell>
                                <TableCell align="center"><strong>Cantidad a Recargar</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Helados que ya están en el catálogo de la nota */}
                            {catalogo.map((item) => (
                                <TableRow key={item.helado_id._id}>
                                    <TableCell align="center">
                                        <img
                                            src={item.helado_id.imagen}
                                            alt={item.helado_id.nombre}
                                            width={80}
                                            height={80}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.helado_id.nombre}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.cantidadTotal}
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            label="Recargar"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={recargas[item.helado_id._id] || ''}  // Usa cadena vacía por defecto
                                            onChange={(e) => handleRecargaChange(item.helado_id._id, e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Helados que no están en la nota */}
                            {heladosNoEnNota.map((helado) => (
                                <TableRow key={helado._id}>
                                    <TableCell align="center">
                                        <img
                                            src={helado.imagen}
                                            alt={helado.nombre}
                                            width={80}
                                            height={80}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {helado.nombre}
                                    </TableCell>
                                    <TableCell align="center">0</TableCell> {/* Inicialmente 0 cantidad */}
                                    <TableCell align="center">
                                        <TextField
                                            label="Recargar"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={recargas[helado._id] || ''}  // Usa cadena vacía por defecto
                                            onChange={(e) => handleRecargaChange(helado._id, e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

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
                    onClick={() => navigate(`/notas-activas`)}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Cancelar
                </Button> 
            </form>
            <br /><br />
        </Container>
    );
};

export default RecargarCatalogo;
