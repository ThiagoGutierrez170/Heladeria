import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RutaPrivada = ({ element }) => {
    const navigate = useNavigate();
    const estaAutenticado = localStorage.getItem('token');

    useEffect(() => {
        if (!estaAutenticado) {
            // Si no está autenticado, redirigir al login
            navigate('/login');
        }
    }, [estaAutenticado, navigate]);

    // Si está autenticado, mostrar el componente
    return estaAutenticado ? element : null;
};

export default RutaPrivada;