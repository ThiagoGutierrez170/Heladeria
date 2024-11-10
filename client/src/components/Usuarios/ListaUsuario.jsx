import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ListaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const rolUsuario = localStorage.getItem('rol');
        console.log("rol del usuario", rolUsuario);
        if (rolUsuario !== 'administrador') {
            alert('Acceso no autorizado');
            navigate('/notas-activas');
            return;
        }

        const fetchUsuarios = async () => {
            const res = await axios.get('/api/usuarios/lista');
            setUsuarios(res.data);
        };
        fetchUsuarios();
    }, [navigate]);

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario.id}>
                        <Link to={`/usuarios/${usuario.id}`}>{usuario.nombreUsuario}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaUsuario;