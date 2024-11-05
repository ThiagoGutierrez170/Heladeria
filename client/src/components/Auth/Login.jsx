import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Envia credenciales al servidor
            const response = await axios.post('/api/sesiones/login', { correo: email, contraseña: password });
            const { token, rol } = response.data; // Suponiendo que el servidor devuelve el token y el rol del usuario

            // Guarda el token y el rol en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('rol', rol);

            // Redirige al usuario a la página principal
            navigate('/');

        } catch (error) {
            setError('Correo o contraseña incorrectos');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Ingresar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;