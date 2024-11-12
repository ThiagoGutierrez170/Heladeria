import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IceCreamIcon from '@mui/icons-material/Icecream'; // Icono para Helados
import PeopleIcon from '@mui/icons-material/People'; // Icono para Vendedores
import NoteIcon from '@mui/icons-material/Note'; // Icono para Notas
import PersonIcon from '@mui/icons-material/Person'; // Icono para Usuarios
import AssignmentIcon from '@mui/icons-material/Assignment'; // Icono para Registro de Notas
import Swal from 'sweetalert2';
import IcecreamIcon from '@mui/icons-material/Icecream';
import './Navbar.css';

const pages = [
    { name: 'Helados', route: '/helados', icon: <IceCreamIcon /> },
    { name: 'Vendedores', route: '/vendedores', icon: <PeopleIcon /> },
    { name: 'Notas', route: '/notas-activas', icon: <NoteIcon /> },
    { name: 'Usuarios', route: '/usuarios', icon: <PersonIcon /> },
    { name: 'Notas Finalizadas', route: '/registro-finalizados', icon: <AssignmentIcon /> }
];

const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState({}); // Estado para manejar submenús

    const usuarioRol = localStorage.getItem('rol');

    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Función para abrir el menú de usuario
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    // Función para cerrar el menú de usuario
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        Swal.fire('Sesión cerrada correctamente', '', 'success');
        navigate('/login');
    };


    const toggleSubmenu = (name) => {
        setOpenSubmenu((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: 1201 }}>
                <Toolbar>
                    <IconButton size="large" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                       
                    </IconButton>
                    <IcecreamIcon />
                    <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' , marginLeft: '10px' }}>
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

            {/* Sidebar */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
                <List>

                    <ListItem button onClick={() => toggleSubmenu('')}>
                        {openSubmenu[''] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openSubmenu['']} timeout="auto" unmountOnExit>

                    </Collapse>
                    <br />
                    {/* Vendedores */}
                    {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                        <>
                            <ListItem button onClick={() => toggleSubmenu('vendedores')}>
                                <ListItemText primary="Gestión de Vendedores" /> {/* Cambiado el nombre aquí */}
                                {openSubmenu['vendedores'] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openSubmenu['vendedores']} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {pages.filter(page => page.name === "Vendedores").map(page => (
                                        <ListItem key={page.name} disablePadding>
                                            <ListItemButton component={Link} to={page.route}>
                                                {page.icon}
                                                <ListItemText primary={page.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </>
                    )}

                    {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                        <>
                            <ListItem button onClick={() => toggleSubmenu('helados')}>
                                <ListItemText primary="Helados" />
                                {openSubmenu['helados'] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openSubmenu['helados']} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {pages.filter(page => page.name === "Helados").map(page => (
                                        <ListItem key={page.name} disablePadding>
                                            <ListItemButton component={Link} to={page.route}>
                                                {page.icon}
                                                <ListItemText primary={page.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </>
                    )}

                    {/* Notas finalizadas */}
                    {(usuarioRol === 'administrador' || usuarioRol === 'usuario' || usuarioRol === 'supervisor') && (
                        <>
                            <ListItemButton onClick={() => toggleSubmenu('notas-finalizadas')}>
                                <ListItemText primary="Registros Finalizados" />
                                {openSubmenu['notas-finalizadas'] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openSubmenu['notas-finalizadas']} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {pages.filter(page => page.name === "Notas Finalizadas").map(page => (
                                        <ListItem key={page.name} disablePadding>
                                            <ListItemButton component={Link} to={page.route}>
                                                {page.icon}
                                                <ListItemText primary={page.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </>
                    )}


                    {/* Notas */}
                    {(usuarioRol === 'administrador' || usuarioRol === 'usuario') && (
                        <>
                            <ListItem button onClick={() => toggleSubmenu('notas')}>
                                <ListItemText primary="Notas Activas" />
                                {openSubmenu['notas'] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openSubmenu['notas']} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {pages.filter(page => page.name === "Notas").map(page => (
                                        <ListItem key={page.name} disablePadding>
                                            <ListItemButton component={Link} to={page.route}>
                                                {page.icon}
                                                <ListItemText primary={page.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </>
                    )}

                    {/* Usuarios */}
                    {usuarioRol === 'administrador' && (
                        <>
                            <ListItem button onClick={() => toggleSubmenu('usuarios')}>
                                <ListItemText primary="Usuarios" />
                                {openSubmenu['usuarios'] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openSubmenu['usuarios']} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {pages.filter(page => page.name === "Usuarios").map(page => (
                                        <ListItem key={page.name} disablePadding>
                                            <ListItemButton component={Link} to={page.route}>
                                                {page.icon}
                                                <ListItemText primary={page.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </>
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