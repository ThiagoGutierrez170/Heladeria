import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Enviar las credenciales al servidor
            const response = await axios.post('/api/sesiones/login', { correo: email, contraseña: password });
            const { token, rol } = response.data; // Suponiendo que el servidor devuelve el token y el rol del usuario

            // Guarda el token y el rol en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('rol', rol);

            // Redirige al usuario a la página principal
            navigate('/');  // Puedes cambiar esta ruta si tienes una ruta específica para vendedores

        } catch (error) {
            setError('Correo o contraseña incorrectos');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f4f4f4'
            }}
        >
            <Grid container spacing={2} sx={{ maxWidth: 400 }}>
                <Grid item xs={12}>
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ color: '#800080' }}  // Usando el color primario del tema
                    >
                        Iniciar Sesión
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Correo electrónico"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Contraseña"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password"
                    />
                </Grid>
                {error && (
                    <Grid item xs={12}>
                        <Typography color="error" variant="body2">{error}</Typography>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLogin}
                        sx={{ backgroundColor: '#800080', color: 'white', '&:hover': { backgroundColor: '#FF3D00' } }}
                    >
                        Ingresar
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;