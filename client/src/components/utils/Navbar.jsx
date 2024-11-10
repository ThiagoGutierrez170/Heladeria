import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const Navbar = () => {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
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
                        Notas Activas
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
