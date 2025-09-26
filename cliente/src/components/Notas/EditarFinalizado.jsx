import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import axios from 'axios';
import api from '../../utils/api';
import {
    Container, Typography, Grid, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, Button
} from '@mui/material';
import Swal from 'sweetalert2';

const EditarFinalizado = () => {
    const { id } = useParams(); // Obtén el ID de la nota desde la URL
    const navigate = useNavigate();
    const [detallesGanancias, setDetallesGanancias] = useState([]);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false); // Para activar el modo de edición
    const [selectedHelado, setSelectedHelado] = useState(null); // Para almacenar el helado seleccionado

    useEffect(() => {
        const fetchNota = async () => {
            try {
                const response = await api.get(`/nota/finalizadas/${id}/detalle`);
                const { detallesGanancias } = response.data; // Ya no necesitamos las ganancias aquí
                setDetallesGanancias(detallesGanancias);
            } catch (error) {
                console.error('Error al cargar el detalle de la nota:', error);
            }
        };
        fetchNota();
    }, [id]);

    const handleEdit = (helado) => {
        setSelectedHelado({ ...helado }); // Asegurarse de que el objeto esté bien copiado
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedHelado((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const newErrors = {};

        // Validación
        if (selectedHelado.cantidadVendida < 0) newErrors.cantidadVendida = 'La cantidad vendida no puede ser negativa';
        if (selectedHelado.cantidadVendida > selectedHelado.cantidadOriginal) {
            newErrors.cantidadVendida = 'La cantidad vendida no puede ser mayor que la cantidad original';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Verifica el valor de selectedHelado.helado_id._id
            if (!selectedHelado.helado_id || !selectedHelado.helado_id._id) {
                console.error("El ID del helado no está definido");
                Swal.fire('Error', 'No se encontró el ID del helado', 'error');
                return;
            }

            try {
                // Hacer PUT con la información correcta
                await api.put(`/nota/finalizadas/${id}`, {
                    heladoId: selectedHelado.helado_id._id,  // Aquí se debe enviar el id del helado
                    cantidadVendida: selectedHelado.cantidadVendida
                });

                Swal.fire('Guardado', 'La cantidad vendida ha sido actualizada con éxito', 'success');
                setIsEditing(false);
                setSelectedHelado(null);

                // Volver a cargar los detalles de la nota
                const response = await api.get(`/nota/finalizadas/${id}/detalle`);
                setDetallesGanancias(response.data.detallesGanancias);

            } catch (error) {
                console.error('Error al guardar:', error.response ? error.response.data : error.message);
                Swal.fire('Error', 'Hubo un problema al actualizar la cantidad vendida', 'error');
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedHelado(null);
    };

    const formatearGs = (valor) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'decimal',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(valor);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" color="text.primary" gutterBottom>
                Editar Nota Finalizada
            </Typography>

            {isEditing ? (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                        Editar Cantidad Vendida de: {selectedHelado.nombre}
                    </Typography>
                    <TextField
                        label="Cantidad Vendida"
                        name="cantidadVendida"
                        value={selectedHelado.cantidadVendida}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.cantidadVendida}
                        helperText={errors.cantidadVendida}
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{ mt: 2, mr: 2 }}
                    >
                        Guardar Cambios
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        sx={{ mt: 2 }}
                    >
                        Cancelar
                    </Button>
                </Paper>
            ) : (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Imagen</strong></TableCell>
                                    <TableCell><strong>Nombre del helado</strong></TableCell>
                                    <TableCell align="center"><strong>Cantidad Vendida</strong></TableCell>
                                    <TableCell align="center"><strong>Acción</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detallesGanancias.map((helado) => (
                                    <TableRow key={helado.id}>
                                        <TableCell>
                                            <img
                                                src={helado.imagen}
                                                alt={helado.nombre}
                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                                            />
                                        </TableCell>
                                        <TableCell>{helado.nombre}</TableCell>
                                        <TableCell align="center">{helado.cantidadVendida}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEdit(helado)}
                                            >
                                                Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Container>
    );
};

export default EditarFinalizado;
