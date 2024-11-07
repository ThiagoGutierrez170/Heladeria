import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    TextField,
    Typography,
    Container,
    Box,
    CssBaseline,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';

 const  CrearUsuario = ( ) => {
    const [usuario, setUsuario] = useState({
        nombreUsuario: '',
        correo: '',
        contraseña: '',
        rol: 'usuario'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const rolUsuario = localStorage.getItem('rol'); // Suponiendo que el rol se guarda en localStorage
        if (rolUsuario !== 'administrador') {
            alert('Acceso no autorizado');
            navigate('/'); // Redirigir al inicio o a una página de acceso denegado
        }
    }, [navigate]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/usuario/crear', usuario);
            alert('Usuario creado con éxito');
            navigate('/usuarios');
        } catch (error) {
            alert('Error al crear usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Crear Usuario
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="nombreUsuario"
                        label="Nombre de Usuario"
                        name="nombreUsuario"
                        value={usuario.nombreUsuario}
                        onChange={handleChange}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="correo"
                        label="Correo"
                        name="correo"
                        type="email"
                        value={usuario.correo}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="contraseña"
                        label="Contraseña"
                        name="contraseña"
                        type="password"
                        value={usuario.contraseña}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="rol-label">Rol</InputLabel>
                        <Select
                            labelId="rol-label"
                            id="rol"
                            name="rol"
                            value={usuario.rol}
                            onChange={handleChange}
                            label="Rol"
                        >
                            <MenuItem value="usuario">Usuario</MenuItem>
                            <MenuItem value="supervisor">Supervisor</MenuItem>
                            <MenuItem value="administrador">Administrador</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Crear Usuario'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default CrearUsuario;