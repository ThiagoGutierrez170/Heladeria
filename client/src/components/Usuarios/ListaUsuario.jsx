import React, { useEffect, useState } from 'react';
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
    Divider,
    Paper, Button
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Swal from 'sweetalert2';

const ListaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const rolUsuario = localStorage.getItem('rol');


//Ejemplo de ruta para editar http://localhost:3000/editar/usuario/672ccfdcdc88b235ea0c630d

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
        navigate('/registro');  // Cambia a la ruta correspondiente
    };


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
                            key={usuario.id}  
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 2,
                                px: 2,
                                bgcolor: '#ffffff',
                                borderRadius: 1,
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                }
                            }}
                        >
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                <PersonIcon />
                            </Avatar>
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 'bold', color: 'text.primary' }}
                                    >
                                        {usuario.nombreUsuario}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            Correo: {usuario.correo}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            Rol: {usuario.rol}
                                        </Typography>
                                    </>
                                }
                            />

                            <IconButton edge="end" color="primary">
                                {/* Aquí podrías agregar un icono de acción, si es necesario */}
                            </IconButton>
                        </ListItem>
                    ))}
                </List>

            </Box>
        </Container>
    );
};

export default ListaUsuario;
