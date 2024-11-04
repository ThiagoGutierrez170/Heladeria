import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CrearUsuario = () => {
    const [usuario, setUsuario] = useState({
        nombreUsuario: '',
        correo: '',
        contraseña: '',
        rol: 'usuario'
    });
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
        try {
            await axios.post('/api/usuarios/crear', usuario);
            alert('Usuario creado con éxito');
            navigate('/usuarios');
        } catch (error) {
            alert('Error al crear usuario');
        }
    };

    return (
        <div>
            <h2>Crear Usuario</h2>
            <form onSubmit={handleSubmit}>
                <input name="nombreUsuario" placeholder="Nombre de Usuario" onChange={handleChange} required />
                <input name="correo" placeholder="Correo" type="email" onChange={handleChange} required />
                <input name="contraseña" placeholder="Contraseña" type="password" onChange={handleChange} required />
                <select name="rol" onChange={handleChange}>
                    <option value="usuario">Usuario</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="administrador">Administrador</option>
                </select>
                <button type="submit">Crear Usuario</button>
            </form>
        </div>
    );
};

export default CrearUsuario;