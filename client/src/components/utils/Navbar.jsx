import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Swal from 'sweetalert2';
import axios from 'axios';

const pages = [
    { name: 'Helados', route: '/helados' },
    { name: 'Vendedores', route: '/vendedores' },
    { name: 'Notas', route: '/notas-activas' },
    { name: 'Usuarios', route: '/usuarios' },
    { name: 'Registro de Notas', route: '/registro-finalizados' }
];
const settings = ['Perfil', 'Cuenta', 'Cerrar Sesión'];

const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        Swal.fire('Sesión cerrada correctamente', '', 'success');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                    onClick={handleOpenNavMenu}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Inicio
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Button key={page.name} color="inherit" component={Link} to={page.route}>
                            {page.name}
                        </Button>
                    ))}
                </Box>
                <Menu
                    anchorEl={anchorElNav}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                >
                    {pages.map((page) => (
                        <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                            <Button color="inherit" component={Link} to={page.route}>
                                {page.name}
                            </Button>
                        </MenuItem>
                    ))}
                </Menu>
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
                        {settings.map((setting) => (
                            <MenuItem
                                key={setting}
                                onClick={setting === 'Cerrar Sesión' ? handleLogout : handleCloseUserMenu}
                            >
                                {setting}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        <>
            <AppBar position="fixed" sx={{ backgroundColor: 'purple' }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                        component={Link}
                        to="/"
                    >
                        Gestión de Vendedores y Notas
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={handleMenuClick}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    {/* Navegación Principal en Pantallas Grandes */}
                    <Button color="inherit" component={Link} to="/usuarios"
                        sx={{ borderBottom: location.pathname === "/usuarios" ? '2px solid white' : 'none', display: { xs: 'none', md: 'block' } }}>
                        Usuarios
                    </Button>
                    <Button color="inherit" component={Link} to="/S-registro-finalizados"
                        sx={{ borderBottom: location.pathname === "/S-registro-finalizados" ? '2px solid white' : 'none', display: { xs: 'none', md: 'block' } }}>
                        Vista de Supervisor
                    </Button>
                    <Button color="inherit" component={Link} to="/vendedores"
                        sx={{ borderBottom: location.pathname === "/vendedores" ? '2px solid white' : 'none', display: { xs: 'none', md: 'block' } }}>
                        Lista de Vendedores
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/helados"
                        sx={{
                            borderBottom: location.pathname === "/helados" ? '2px solid white' : 'none',
                            display: { xs: 'none', md: 'block' }, 
                        }}
                    >
                        Lista de Helados
                    </Button>
                    <Button color="inherit" component={Link} to="/notas-activas"
                        sx={{ borderBottom: location.pathname === "/notas-activas" ? '2px solid white' : 'none', display: { xs: 'none', md: 'block' } }}>
                        Notas Activas
                    </Button>
                    <Button color="inherit" component={Link} to="/registro-finalizados"
                        sx={{ borderBottom: location.pathname === "/registro-finalizados" ? '2px solid white' : 'none', display: { xs: 'none', md: 'block' } }}>
                        Notas Finalizadas
                    </Button>

                </Toolbar>
            </AppBar>
            
            {/* Menú Lateral para Pantallas Pequeñas */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <MenuItem component={Link} to="/vendedores" onClick={handleMenuClose}>
                    Lista de Vendedores
                </MenuItem>
                <MenuItem component={Link} to="/agregar-vendedor" onClick={handleMenuClose}>
                    Agregar Vendedor
                </MenuItem>
                <MenuItem
                    component={Link}
                    to="/helados"
                    onClick={handleMenuClose}
                >
                    Lista de helados
                </MenuItem>
                <MenuItem component={Link} to="/notas-activas" onClick={handleMenuClose}>
                    Notas Activas
                </MenuItem>
                <MenuItem component={Link} to="/registro-finalizados" onClick={handleMenuClose}>
                    Notas Finalizadas
                </MenuItem>
                <MenuItem component={Link} to="/agregar-nota" onClick={handleMenuClose}>
                    Crear Nota
                </MenuItem>
            </Menu>
        </>
    );
};

export default Navbar;
