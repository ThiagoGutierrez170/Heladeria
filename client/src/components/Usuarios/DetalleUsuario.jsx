import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DetalleUsuario = () => {
    const [usuario, setUsuario] = useState(null);
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

    const handleDelete = async () => {
        const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
        if (confirmDelete) {
            try {
                await axios.delete(`/api/usuarios/eliminar/${id}`);
                alert('Usuario eliminado');
                navigate('/usuarios');
            } catch (error) {
                alert('Error al eliminar usuario');
            }
        }
    };

    if (!usuario) return <p>Cargando...</p>;

    return (
        <div>
            <h2>Detalles de Usuario</h2>
            <p>Nombre de Usuario: {usuario.nombreUsuario}</p>
            <p>Correo: {usuario.correo}</p>
            <p>Rol: {usuario.rol}</p>
            <button onClick={() => navigate(`/usuarios/editar/${id}`)}>Editar Usuario</button>
            <button onClick={handleDelete}>Eliminar Usuario</button>
        </div>
    );
};

export default DetalleUsuario;