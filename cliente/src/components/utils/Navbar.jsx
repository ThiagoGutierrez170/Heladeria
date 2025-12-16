import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Tooltip,
    Menu,
    MenuItem,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IceCreamIcon from '@mui/icons-material/Icecream'; // Icono para Helados
import PeopleIcon from '@mui/icons-material/People'; // Icono para Vendedores
import NoteIcon from '@mui/icons-material/Note'; // Icono para Notas
import PersonIcon from '@mui/icons-material/Person'; // Icono para Usuarios
import AssignmentIcon from '@mui/icons-material/Assignment'; // Icono para Registro de Notas
import Swal from 'sweetalert2';
import './Navbar.css';

const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const usuarioRol = localStorage.getItem('rol');
    const navigate = useNavigate();

    // Función para abrir/cerrar el menú lateral
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Función para cerrar el menú lateral explícitamente
    const closeDrawer = () => {
        setDrawerOpen(false);
    };

    // Función para abrir el menú del usuario
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    // Función para cerrar el menú del usuario
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        Swal.fire('Sesión cerrada correctamente', '', 'success');
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: 1201 }}>
                <Toolbar>
                    <IconButton size="large" color="inherit" aria-label="menu" onClick={toggleDrawer} edge="start">
                        <MenuIcon />
                    </IconButton>
                    <IceCreamIcon sx={{ ml: 2, mr: 1 }} />
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                    >
                        Gestión de Inventario
                    </Typography>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Abrir configuración">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Usuario" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorElUser}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            sx={{ mt: '45px' }}
                        >
                            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Menú lateral desplegable */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Box 
                    sx={{ minWidth: 250, marginTop: '64px' }}
                    role="presentation"
                >
                    <List>
                        {/* Helados */}
                        {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                            <ListItem key="helados" disablePadding>
                                <ListItemButton component={Link} to="/helados" onClick={closeDrawer}>
                                    <IceCreamIcon sx={{ mr: 2 }} />
                                    <ListItemText primary="Helados" />
                                </ListItemButton>
                            </ListItem>
                        )}

                        {/* Vendedores */}
                        {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                            <ListItem key="vendedores" disablePadding>
                                <ListItemButton component={Link} to="/vendedores" onClick={closeDrawer}>
                                    <PeopleIcon sx={{ mr: 2 }} />
                                    <ListItemText primary="Vendedores" />
                                </ListItemButton>
                            </ListItem>
                        )}

                        {/* Notas Activas */}
                        {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                            <ListItem key="notas" disablePadding>
                                <ListItemButton component={Link} to="/notas-activas" onClick={closeDrawer}>
                                    <NoteIcon sx={{ mr: 2 }} />
                                    <ListItemText primary="Notas Activas" />
                                </ListItemButton>
                            </ListItem>
                        )}

                        {/* Notas Finalizadas */}
                        {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                            <ListItem key="notas-finalizadas" disablePadding>
                                <ListItemButton component={Link} to="/registro-finalizados" onClick={closeDrawer}>
                                    <AssignmentIcon sx={{ mr: 2 }} />
                                    <ListItemText primary="Notas Finalizadas" />
                                </ListItemButton>
                            </ListItem>
                        )}

                        {/* Submenú para supervisor - Registros Finalizados */}
                        {usuarioRol === 'supervisor' && (
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/S-registro-finalizados" onClick={closeDrawer}>
                                    <AssignmentIcon sx={{ mr: 2 }} />
                                    <ListItemText primary="Notas Finalizadas (Sup)" />
                                </ListItemButton>
                            </ListItem>
                        )}

                        {/* Usuarios */}
                        {usuarioRol === 'administrador' && (
                            <ListItem key="usuarios" disablePadding>
                                <ListItemButton component={Link} to="/usuarios" onClick={closeDrawer}>
                                    <PersonIcon sx={{ mr: 2 }} />
                                    <ListItemText primary="Usuarios" />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>

            {/* Contenido Principal */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
                {/* Aquí va el contenido principal de la aplicación */}
            </Box>
        </Box>
    );
};

export default Navbar;