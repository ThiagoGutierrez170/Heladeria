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
            const response = await axios.post('/api/sesiones/login/', { correo: email, contraseña: password });
            const { token, usuario } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('rol', usuario.rol);

            Swal.fire('Inicio de sesión!', 'Has iniciado sesión correctamente.', 'success');
            navigate('/');
        } catch (error) {
            setLoading(false);
            setError('Correo o contraseña incorrectos');
            Swal.fire('Error!', 'Hubo un problema al iniciar sesión.', 'error');
        }
    };


    return (
        <Container 
            maxWidth={false} 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                padding: 0,
                backgroundImage: 'linear-gradient(to right, #80d0ff, #72c2ff, #64b5ff, #56a8ff)',
            }}
        >
            <Box
                sx={{
                    width: { xs: '90%', sm: '70%', md: '50%', lg: '40%' },
                    boxShadow: 6,
                    p: 5,
                    borderRadius: 4,
                    backgroundColor: '#e0f7fa',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Helado decorativo en la esquina */}
                <Box
                    component="img"
                    src="https://cdn-icons-png.flaticon.com/512/1159/1159215.png"
                    alt="Icono de helado"
                    sx={{
                        position: 'absolute',
                        width: 100,
                        height: 100,
                        top: -30,
                        right: -30,
                        opacity: 0.4,
                        transform: 'rotate(-20deg)',
                    }}
                />
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#039be5', fontWeight: 'bold' }}>
                    Iniciar Sesión
                </Typography>
                <Typography variant="body2" mb={3} sx={{ color: '#0277bd' }}>
                    ¡Bienvenido! Ingresa tus datos para disfrutar de nuestros helados virtuales.
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
                            sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
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
                            sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            fullWidth
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                backgroundColor: '#0288d1',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#0277bd' },
                                borderRadius: 2,
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Ingresar'}
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
