import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

const NotaActiva = () => {
    const { id } = useParams();
    const [nota, setNota] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotaDetalle = async () => {
            try {
                const response = await axios.get(`/api/nota/activas/${id}`);
                setNota(response.data);
            } catch (error) {
                console.error('Error al obtener el detalle de la nota:', error);
            }
        };

        fetchNotaDetalle();
    }, [id]);

    const handleEditar = () => {
        navigate(`/editar-nota/${id}`);
    };

    const handleRecargarCatalogo = () => {
        navigate(`/recargar-catalogo/${id}`);
    };

    const handleEliminar = async () => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará la nota de forma permanente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`/api/nota/${id}`);
                Swal.fire('Eliminado!', 'La nota ha sido eliminada.', 'success');
                navigate('/notas-activas');
            } catch (error) {
                Swal.fire('Error!', 'Hubo un problema al eliminar la nota.', 'error');
            }
        }
    };

    // Nuevo manejador para redirigir a la vista de "Finalizar Nota"
    const handleFinalizarNota = () => {
        navigate(`/finalizar-nota/${id}`);
    };

    if (!nota) return <Typography>Cargando...</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Detalle de Nota Activa
            </Typography>
            <Typography variant="h6">Playa: {nota.playa}</Typography>
            <Typography variant="body1">Clima: {nota.clima}</Typography>
            <Typography variant="body1">Estado: {nota.estado}</Typography>
            <Typography variant="body1">
                Vendedor: {nota.vendedor_id ? nota.vendedor_id.nombre : 'No asignado'}
            </Typography>
            <Typography variant="h6" sx={{ mt: 3 }}>Catálogo</Typography>
            {Array.isArray(nota.catalogo) && nota.catalogo.length > 0 ? (
                nota.catalogo.map((item) => (
                    <div key={item.helado_id._id}>
                        <Typography variant="body2">
                            Helado: {item.helado_id.nombre} - Cantidad: {item.cantidadTotal}
                        </Typography>
                    </div>
                ))
            ) : (
                <Typography variant="body2">No hay artículos en el catálogo.</Typography>
            )}
            <Button variant="contained" color="primary" onClick={handleEditar} sx={{ mt: 3, mr: 2 }}>
                Editar
            </Button>
            <Button variant="contained" color="secondary" onClick={handleRecargarCatalogo} sx={{ mt: 3, mr: 2 }}>
                Recargar Catálogo
            </Button>
            <Button variant="contained" color="error" onClick={handleEliminar} sx={{ mt: 3 }}>
                Eliminar
            </Button>
            {/* Botón de Finalizar Nota */}
            <Button variant="contained" color="success" onClick={handleFinalizarNota} sx={{ mt: 3, ml: 2 }}>
                Finalizar Nota
            </Button>
        </Container>
    );
};

export default NotaActiva;
