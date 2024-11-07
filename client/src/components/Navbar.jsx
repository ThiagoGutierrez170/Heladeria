import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Obtener el rol del usuario y el token desde localStorage
    const rolUsuario = localStorage.getItem('rol');
    const token = localStorage.getItem('token');

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                        component={Link}
                        to="/"
                    >
                        Gestión de Vendedores
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={handleMenuClick}
                        sx={{ display: { xs: 'block', md: 'none' } }} // Show only on small screens
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Mostrar Lista de Vendedores solo si es administrador */}
                    {(rolUsuario === 'administrador' || rolUsuario === 'supervisor') && (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/vendedores"
                            sx={{
                                borderBottom: location.pathname === "/vendedores" ? '2px solid white' : 'none',
                                display: { xs: 'none', md: 'block' },
                            }}
                        >
                            Lista de Vendedores
                        </Button>
                    )}

                    {/* Mostrar Lista de Helados a todos los roles */}
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

                    {/* Mostrar Lista de Usuarios solo si es administrador */}
                    {rolUsuario === 'administrador' && (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/usuarios"
                            sx={{
                                borderBottom: location.pathname === "/usuarios" ? '2px solid white' : 'none',
                                display: { xs: 'none', md: 'block' },
                            }}
                        >
                            Lista de Usuarios
                        </Button>
                    )}

                    {/* Mostrar Login solo si no está autenticado */}
                    {!token && (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/login"
                            sx={{
                                borderBottom: location.pathname === "/login" ? '2px solid white' : 'none',
                                display: { xs: 'none', md: 'block' },
                            }}
                        >
                            Login
                        </Button>
                    )}

                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ display: { xs: 'block', md: 'none' } }} // Show only on small screens
            >
                {/* Menu items */}
                {(rolUsuario === 'administrador' || rolUsuario === 'supervisor') && (
                    <MenuItem
                        component={Link}
                        to="/vendedores"
                        onClick={handleMenuClose}
                    >
                        Lista de Vendedores
                    </MenuItem>
                )}
                <MenuItem
                    component={Link}
                    to="/helados"
                    onClick={handleMenuClose}
                >
                    Lista de Helados
                </MenuItem>
                {rolUsuario === 'administrador' && (
                    <MenuItem
                        component={Link}
                        to="/usuarios"
                        onClick={handleMenuClose}
                    >
                        Lista de Usuarios
                    </MenuItem>
                )}
                {!token && (
                    <MenuItem
                        component={Link}
                        to="/login"
                        onClick={handleMenuClose}
                    >
                        Login
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};

export default Navbar;
