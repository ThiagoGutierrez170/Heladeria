import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
    Container, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, Grid
} from '@mui/material';
import Swal from 'sweetalert2';
import { toPng } from 'html-to-image';

const NotaActiva = () => {
    const { id } = useParams();
    const [nota, setNota] = useState(null);
    const navigate = useNavigate();
    const [usuarioRol, setUsuarioRol] = useState(localStorage.getItem('rol'));

    useEffect(() => {
        const fetchNotaDetalle = async () => {
            try {
                setUsuarioRol(localStorage.getItem('rol'));
                const response = await api.get(`/nota/activas/${id}`);
                setNota(response.data);
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al cargar la nota.', 'error');
            }
        };
        fetchNotaDetalle();
    }, [id]);

    const handleDescargarImagen = () => {
        const node = document.getElementById('area-nota');
        if (!node) return;

        Swal.fire({
            title: 'Generando imagen...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        // Configuración para una imagen limpia y sin scroll
        const width = 325; // Ancho fijo ideal para móviles y PC

        toPng(node, { 
            backgroundColor: '#ffffff',
            width: width,
            style: {
                transform: 'scale(1)',
                padding: '20px',
                width: `${width}px`,
                height: 'auto',
                overflow: 'visible', // ELIMINA LAS BARRAS DE DESPLAZAMIENTO
                margin: '0'
            },
            filter: (domNode) => {
                if (domNode.tagName === 'TH' && domNode.innerText.trim() === 'Imagen') return false;
                if (domNode.tagName === 'TD' && domNode.getAttribute('data-column') === 'imagen') return false;
                if (domNode.tagName === 'IMG') return false;
                return true;
            }
        })
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `nota-${id}.png`;
            link.href = dataUrl;
            link.click();
            Swal.close();
        })
        .catch((error) => {
            console.error('Error al generar la imagen:', error);
            Swal.fire('Error', 'No se pudo generar la imagen.', 'error');
        });
    };

    // ... (funciones handleEditar, handleEliminar, etc. se mantienen igual)
    const handleEditar = () => navigate(`/editar-nota/${id}`);
    const handleRecargarCatalogo = () => navigate(`/recargar-catalogo/${id}`);
    const handleEliminar = async () => {
        const confirm = await Swal.fire({ title: '¿Estás seguro?', text: "Esta acción eliminará la nota.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Eliminar' });
        if (confirm.isConfirmed) {
            try { await api.delete(`/nota/${id}`); navigate('/notas-activas'); } 
            catch (error) { Swal.fire('Error!', 'Problema al eliminar.', 'error'); }
        }
    };
    const handleFinalizarNota = () => navigate(`/finalizar-nota/${id}`);

    if (!nota) return <Typography>Cargando...</Typography>;

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="center" mb={3}>
                <Button variant="contained" onClick={() => navigate('/notas-activas')} sx={{ px: 6 }}>
                    Volver
                </Button>
            </Box>

            {/* ÁREA DE CAPTURA - Optimizada */}
            <Box id="area-nota" sx={{ p: 1, backgroundColor: 'white' }}>
                <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}>
                    Detalle de Nota Activa
                </Typography>

                {/* Tabla Info Vendedor - Más compacta */}
                <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 'none', border: '1px solid #ddd' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Playa</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Clima</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Vendedor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontSize: '13px' }}>{nota.playa}</TableCell>
                                <TableCell sx={{ fontSize: '13px' }}>{nota.clima}</TableCell>
                                <TableCell sx={{ fontSize: '13px' }}>
                                    {nota.vendedor_id ? `${nota.vendedor_id.nombre} ${nota.vendedor_id.apellido}` : '---'}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="subtitle1" align="center" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Catálogo de Helados
                </Typography>

                {/* Tabla Productos - Sin scrollbars y con anchos fijos */}
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #ddd', overflow: 'hidden' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                                <TableCell data-column="imagen" align="center">Imagen</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Producto</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px', width: '80px' }}>Cant.</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {nota.catalogo.map((item) => (
                                <TableRow key={item.helado_id._id}>
                                    <TableCell data-column="imagen" align="center">
                                        <img src={item.helado_id.imagen} alt="" width={40} height={40} />
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '13px', lineHeight: 1.2 }}>
                                        {item.helado_id.nombre}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: '15px', fontWeight: 'bold' }}>
                                        {item.cantidadTotal}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Botones de acciones (Fuera del área de captura) */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={6} sm={4}><Button fullWidth variant="contained" color="primary" onClick={handleEditar}>Editar</Button></Grid>
                <Grid item xs={6} sm={4}><Button fullWidth variant="contained" color="secondary" onClick={handleRecargarCatalogo}>Recargar</Button></Grid>
                <Grid item xs={6} sm={4}><Button fullWidth variant="contained" color="warning" onClick={handleDescargarImagen}>Imagen</Button></Grid>
                {usuarioRol === 'administrador' && (
                    <Grid item xs={6} sm={4}><Button fullWidth variant="contained" color="error" onClick={handleEliminar}>Eliminar</Button></Grid>
                )}
                <Grid item xs={6} sm={4}><Button fullWidth variant="contained" color="success" onClick={handleFinalizarNota}>Finalizar</Button></Grid>
            </Grid>
        </Container>
    );
};

export default NotaActiva;