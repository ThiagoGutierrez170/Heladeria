import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from '@mui/material';

const RecargaHelado = ({ open, onClose, helado, obtenerHelados }) => {
    const [cajas, setCajas] = useState('');
    const [loading, setLoading] = useState(false); // Estado para controlar la animación de carga

    // Maneja los cambios en el input de cajas para el helado
    const handleCajasChange = (event) => {
        // Obtener el valor del campo y asegurarse de que sea un número positivo
        const value = Math.max(0, event.target.value); // Esto asegura que no sea negativo
        setCajas(value);
    };

    const handleRecargarStock = async () => {
        const cantidadCajas = parseInt(cajas, 10) || 0;
        if (cantidadCajas <= 0) {
            Swal.fire('Advertencia', 'Debe ingresar una cantidad válida de cajas', 'warning');
            return;
        }

        const nuevoStock = helado.stock + (cantidadCajas * helado.cantidadCaja);

        setLoading(true); // Activar la animación de carga

        try {
            await axios.put(`/api/helado/recargar/${helado._id}`, {
                cantidadCajas: cantidadCajas,  // Enviar solo la cantidad de cajas en el cuerpo
            });
            obtenerHelados(); // Actualizar la lista de helados
            Swal.fire('Éxito', `Stock de ${helado.nombre} actualizado a ${nuevoStock}`, 'success');
            onClose(); // Cerrar el modal tras la actualización
        } catch (error) {
            console.error('Error al realizar la recarga:', error.response ? error.response.data : error);
            Swal.fire('Error', error.response?.data?.error || 'Hubo un problema al recargar los helados', 'error');
        } finally {
            setLoading(false); // Desactivar la animación de carga
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Recargar Stock de {helado.nombre}</DialogTitle>
            <DialogContent>
                <Typography variant="h6">Stock Actual: {helado.stock}</Typography>
                <TextField
                    label="Cantidad de Cajas"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={cajas}
                    onChange={handleCajasChange}
                    min="0"
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={loading}>Cancelar</Button>
                <Button
                    onClick={handleRecargarStock}
                    color="primary"
                    disabled={!cajas || cajas <= 0 || loading} // Deshabilitar mientras carga
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Recargar Stock'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RecargaHelado;
