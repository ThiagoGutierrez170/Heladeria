import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import api from '../../utils/api';
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
    InputLabel,
    Paper,
    CircularProgress
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from 'sweetalert2';


const CrearUsuario = () => {
    const [usuario, setUsuario] = useState({
        nombreUsuario: '',
        correo: '',
        contraseña: '',
        rol: 'usuario'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const rolUsuario = localStorage.getItem('rol');
        if (rolUsuario !== 'administrador') {
            alert('Acceso no autorizado');
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/usuario/', usuario);
            Swal.fire('Usuario agregado!', 'Has agregado correctamente al usuario.', 'success');
            navigate('/usuarios');
        } catch (error) {
            Swal.fire('Error', 'Error al crear usuario', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
            <CssBaseline />
            <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
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
                            sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
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
                            sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
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
                            sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
                        />
                        <FormControl fullWidth margin="normal" sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}>
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
                            
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2, p: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear Usuario'}
                        </Button>

                       
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/usuarios')}
                                startIcon={<CancelIcon />}
                                sx={{ mt: 3, mb: 2, p: 1.5, ml: 2 }}
                            >
                                Cancelar
                            </Button>
                        
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default CrearUsuario;
