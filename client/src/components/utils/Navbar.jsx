import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
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

const pages = [
    { name: 'Helados', route: '/helados' },
    { name: 'Vendedores', route: '/vendedores' },
    { name: 'Notas Activas', route: '/notas-activas' },
    { name: 'Usuarios', route: '/usuarios' },
    { name: 'Registro de Notas', route: '/registro-finalizados' },
    { name: 'Vista de Supervisor', route: '/S-registro-finalizados' }
];
const settings = ['Perfil', 'Cuenta', 'Cerrar Sesión'];

const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
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
                
                {/* Navegación en pantalla grande */}
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Button
                            key={page.name}
                            color="inherit"
                            component={Link}
                            to={page.route}
                            sx={{
                                borderBottom: location.pathname === page.route ? '2px solid white' : 'none'
                            }}
                        >
                            {page.name}
                        </Button>
                    ))}
                </Box>

                {/* Menú desplegable para pantallas pequeñas */}
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

                {/* Menú de usuario */}
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
    );
};

export default Navbar;
