import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarUsuario = () => {
    const [usuario, setUsuario] = useState({
        nombreUsuario: '',
        correo: '',
        rol: 'usuario'
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const rolUsuario = localStorage.getItem('rol');
        if (rolUsuario !== 'administrador') {
            alert('Acceso no autorizado');
            navigate('/');
            return;
        }

        const fetchUsuario = async () => {
            const res = await axios.get(`/api/usuarios/${id}`);
            setUsuario(res.data);
        };
        fetchUsuario();
    }, [id, navigate]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/usuarios/editar/${id}`, usuario);
            alert('Usuario actualizado con éxito');
            navigate(`/usuarios/${id}`);
        } catch (error) {
            alert('Error al actualizar usuario');
        }
    };

    return (
        <div>
            <h2>Editar Usuario</h2>
            <form onSubmit={handleSubmit}>
                <input name="nombreUsuario" value={usuario.nombreUsuario} onChange={handleChange} required />
                <input name="correo" value={usuario.correo} type="email" onChange={handleChange} required />
                <select name="rol" value={usuario.rol} onChange={handleChange}>
                    <option value="usuario">Usuario</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="administrador">Administrador</option>
                </select>
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarUsuario;