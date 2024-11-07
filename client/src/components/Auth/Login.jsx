import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Stack, TextField, Typography, CircularProgress, Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Envia credenciales al servidor
            const response = await axios.post('/api/sesiones/login', { correo: email, contraseña: password });
            const { token, rol } = response.data; // Suponiendo que el servidor devuelve el token y el rol del usuario

            // Guarda el token y el rol en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('rol', rol);

            // Redirige al usuario a la página principal
            Swal.fire('Inicio de sesion !', 'Has iniciado correctamente.', 'success');
            navigate('/');
        } catch (error) {
            setLoading(false);
            setError('Correo o contraseña incorrectos');
            Swal.fire('Error!', 'Hubo un problema al iniciar sesion.', 'error');
        }
    };

    const handleRedirectToCreateUser = () => {
        navigate('/registro');  // Redirige a la página de crear usuario
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Box
                sx={{
                    boxShadow: 3,
                    p: 4,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Iniciar Sesión
                </Typography>
                <form onSubmit={handleLogin}>
                    <Stack spacing={3}>
                        <TextField
                            label="Correo electrónico"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={Boolean(error)}
                            helperText={error}
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={Boolean(error)}
                            helperText={error}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            fullWidth
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                backgroundColor: '#7E57C2',
                                '&:hover': { backgroundColor: '#673AB7' },
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Ingresar'}
                        </Button>
                    </Stack>
                </form>
                <Button
                    variant="text"
                    fullWidth
                    sx={{
                        mt: 2,
                        color: '#7E57C2',
                        '&:hover': { backgroundColor: 'transparent' },
                    }}
                    onClick={handleRedirectToCreateUser}
                >
                    ¿No tienes cuenta? Crear cuenta
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
