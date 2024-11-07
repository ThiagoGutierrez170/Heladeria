import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, IconButton, Typography, Container, Box } from '@mui/material';

const ListaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const rolUsuario = localStorage.getItem('rol');
        if (rolUsuario !== 'administrador') {
            alert('Acceso no autorizado');
            navigate('/');
            return;
        }

        const fetchUsuarios = async () => {
            try {
                const res = await axios.get('/api/usuario/lista');
                setUsuarios(res.data);
            } catch (error) {
                console.error("Error al obtener los usuarios", error);
                alert('No se pudo cargar la lista de usuarios');
            }
        };
        fetchUsuarios();
    }, [navigate]);

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Lista de Usuarios
                </Typography>
                <List>
                    {usuarios.map((usuario) => (
                        <ListItem key={usuario.id} sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton edge="start" color="primary">
                                {/* Puedes agregar un icono aquí si es necesario */}
                            </IconButton>
                            <ListItemText
                                primary={usuario.nombreUsuario}
                                secondary={usuario.correo}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default ListaUsuario;
