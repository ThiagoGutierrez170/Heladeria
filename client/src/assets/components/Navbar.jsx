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
                        Gestión de Vendedores
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={handleMenuClick}
                        sx={{ display: { xs: 'block', md: 'none' } }} // Show only on small screens
                    >
                        <MenuIcon />
                    </IconButton>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/vendedores"
                        sx={{
                            borderBottom: location.pathname === "/vendedores" ? '2px solid white' : 'none',
                            display: { xs: 'none', md: 'block' }, // Hide on small screens
                        }}
                    >
                        Lista de Vendedores
                    </Button>

                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ display: { xs: 'block', md: 'none' } }} // Show only on small screens
            >
                <MenuItem
                    component={Link}
                    to="/vendedores"
                    onClick={handleMenuClose}
                >
                    Lista de Vendedores
                </MenuItem>
                <MenuItem
                    component={Link}
                    to="/agregar-vendedor"
                    onClick={handleMenuClose}
                >
                    Agregar Vendedor
                </MenuItem>
            </Menu>
        </>
    );
};

export default Navbar;
