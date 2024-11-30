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

const pages = [
    { name: 'Helados', route: '/helados', icon: <IceCreamIcon /> },
    { name: 'Vendedores', route: '/vendedores', icon: <PeopleIcon /> },
    { name: 'Notas Activas', route: '/notas-activas', icon: <NoteIcon /> },
    { name: 'Notas Finalizadas', route: '/registro-finalizados', icon: <AssignmentIcon /> },
    { name: 'Usuarios', route: '/usuarios', icon: <PersonIcon /> },
];

const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const usuarioRol = localStorage.getItem('rol');

    const navigate = useNavigate();

    // Función para abrir/cerrar el menú lateral
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
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
            {/* Navbar superior */}
            <AppBar position="fixed" sx={{ zIndex: 1201 }}>
                <Toolbar>
                    <IconButton size="large" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <IceCreamIcon />
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', marginLeft: '10px' }}
                    >
                        Gestión de Inventario de Helados
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
                <br /><br /><br />
                <List>
                    {/* Helados */}
                    {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                        <ListItem key="helados" disablePadding>
                            <ListItemButton component={Link} to="/helados">
                                <IceCreamIcon />
                                <ListItemText primary="Helados" />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* Vendedores */}
                    {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                        <ListItem key="vendedores" disablePadding>
                            <ListItemButton component={Link} to="/vendedores">
                                <PeopleIcon />
                                <ListItemText primary="Vendedores" />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* Notas Activas */}
                    {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                        <ListItem key="notas" disablePadding>
                            <ListItemButton component={Link} to="/notas-activas">
                                <NoteIcon />
                                <ListItemText primary="Notas Activas" />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* Notas Finalizadas */}
                    {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                        <ListItem key="notas-finalizadas" disablePadding>
                            <ListItemButton component={Link} to="/registro-finalizados">
                                <AssignmentIcon />
                                <ListItemText primary="Notas Finalizadas" />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* Usuarios */}
                    {usuarioRol === 'administrador' && (
                        <ListItem key="usuarios" disablePadding>
                            <ListItemButton component={Link} to="/usuarios">
                                <PersonIcon />
                                <ListItemText primary="Usuarios" />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </Drawer>

            {/* Contenido Principal */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
                {/* Aquí va el contenido principal de la aplicación */}
            </Box>
        </Box>
    );
};

export default Navbar;
