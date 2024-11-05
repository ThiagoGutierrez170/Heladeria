import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListaHelados = () => {
    const [terminoBusqueda, setTerminoBusqueda] = useState(''); // Término de búsqueda
    const [helados, setHelados] = useState([]); // Lista completa de helados
    const [heladosFiltrados, setHeladosFiltrados] = useState([]); // Helados filtrados según búsqueda

    useEffect(() => {
        const obtenerHelados = async () => {
            try {
                // Realiza una solicitud GET a la API para obtener la lista de helados
                const response = await axios.get('http://localhost:9999/api/helados');
                // Actualiza el estado con la lista de helados obtenida
                setHelados(response.data);
                setHeladosFiltrados(response.data); // Inicializa los helados filtrados con la lista completa
            } catch (error) {
                console.error('Error al obtener los helados:', error);
            }
        };

        obtenerHelados();
    }, []);

    useEffect(() => {
        // Filtra los helados según el término de búsqueda
        const filtrarHelados = () => {
            const filtrados = helados.filter((helado) =>
                helado.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
            );
            // Actualiza el estado de helados filtrados
            setHeladosFiltrados(filtrados);
        };

        filtrarHelados();
    }, [terminoBusqueda, helados]);

    return (
        <div className='contenedor-centrado'>
            <h1>Todos los Helados</h1>
            <div>
                <input
                    type="text"
                    className="buscador-texto"
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    placeholder='Buscar helados'
                />
            </div>
            <ul>
                {heladosFiltrados.map((helado) => (
                    <li key={helado._id}>
                        <Link to={`/helados/${helado._id}`} className="elemento-helado">
                            {helado.nombre}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaHelados;
