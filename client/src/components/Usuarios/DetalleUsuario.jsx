import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    Typography,
    Container,
    Box,
    CssBaseline,
    IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const DetalleUsuario = () => {
    const [usuario, setUsuario] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const rolUsuario = localStorage.getItem('rol');
        if (rolUsuario !== 'administrador') {
            alert('Acceso no autorizado');
            navigate('/');
            return;
        }

        const fetchUsuario = async () => {
            const res = await axios.get(`/api/usuario/${id}`);
            setUsuario(res.data);
        };
        fetchUsuario();
    }, [id, navigate]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
        if (confirmDelete) {
            try {
                await axios.delete(`/api/usuario/eliminar/${id}`);
                alert('Usuario eliminado');
                navigate('/usuarios');
            } catch (error) {
                alert('Error al eliminar usuario');
            }
        }
    };

    if (!usuario) return <p>Cargando...</p>;

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Detalles de Usuario
                </Typography>
                <Typography variant="h6" component="p" color="textSecondary">
                    Nombre de Usuario: {usuario.nombreUsuario}
                </Typography>
                <Typography variant="h6" component="p" color="textSecondary">
                    Correo: {usuario.correo}
                </Typography>
                <Typography variant="h6" component="p" color="textSecondary">
                    Rol: {usuario.rol}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, marginTop: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/usuarios/editar/${id}`)}
                    >
                        Editar Usuario
                    </Button>
                    <IconButton
                        color="error"
                        onClick={handleDelete}
                        aria-label="eliminar usuario"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>
        </Container>
    );
};

export default DetalleUsuario;
