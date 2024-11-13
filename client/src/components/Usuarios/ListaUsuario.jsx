import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Avatar,
    Paper,
    Button
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';

const ListaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const rolUsuario = localStorage.getItem('rol');
        console.log(rolUsuario);
        if (rolUsuario !== 'administrador' || !token) {
            Swal.fire('Error', `Acceso no autorizado porque no tienes permiso.`, 'error');
            navigate('/');
            return;
        }

        const fetchUsuarios = async () => {
            try {
                const res = await axios.get('/api/usuario/lista', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsuarios(res.data);
            } catch (error) {
                console.error("Error al obtener los usuarios", error);
                Swal.fire('Error', 'No se pudo cargar la lista de usuarios', 'error');
            }
        };

        fetchUsuarios();
    }, [navigate]);

    const handleCrearUsuario = () => {
        navigate('/Crear-usuario');
    };

    const handleEdit = useCallback((usuarioId) => {
        if (!usuarioId) {
            Swal.fire('Error', 'ID de usuario no válido', 'error');
            return;
        }
        navigate(`/editar-usuario/${usuarioId}`);
    }, [navigate]);

    return (
        <Container component="main" maxWidth="md" sx={{ py: 4 }}>
            <Box
                component={Paper}
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: '#f5f5f5',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Lista de Usuarios
                </Typography>

                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCrearUsuario}
                    >
                        Crear Usuario
                    </Button>
                </Box>

                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {usuarios.map((usuario) => (
                        <ListItem
                            key={usuario._id} // Cambiado de id a _id
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 2,
                                px: 2,
                                mb: 2, // Añadido margen entre items
                                bgcolor: '#ffffff',
                                borderRadius: 1,
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
                                }
                            }}
                        >
                            <Avatar sx={{
                                bgcolor: 'primary.main',
                                mr: 2,
                                width: 45,
                                height: 45
                            }}>
                                <PersonIcon />
                            </Avatar>
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'text.primary',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {usuario.nombreUsuario}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ mt: 0.5 }}>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ mb: 0.5 }}
                                        >
                                            Correo: {usuario.correo}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{
                                                display: 'inline-block',
                                                bgcolor: usuario.rol === 'administrador' ? 'primary.light' : 'secondary.light',
                                                color: '#fff',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {usuario.rol.toUpperCase()}
                                        </Typography>
                                    </Box>
                                }
                            />
                            <IconButton
                                edge="end"
                                color="primary"
                                onClick={() => handleEdit(usuario._id)} // Cambiado de id a _id
                                sx={{
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        '& .MuiSvgIcon-root': {
                                            color: '#fff'
                                        }
                                    }
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default ListaUsuario;