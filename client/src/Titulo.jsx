import React from 'react';
import { useLocation } from 'react-router-dom';

const Titulo = () => {
    const location = useLocation();

    React.useEffect(() => {
        switch (location.pathname) {
            case '/vendedores':
                document.title = 'Lista de  Vendedores';
                break;
            case '/helados':
                document.title = 'Lista de Helados';
                break;
            case '/agregar-vendedor':
                document.title = 'Agregar Vendedor';
                break;
            case '/editar-vendedor':
                document.title = 'Editar Vendedor';
                break;
            case '/agregar-helado':
                document.title = 'Agregar Helado';
                break;
            case '/editar-helado':
                document.title = 'Editar Helado';
                break;
            case '/generar-vendedores':
                document.title = 'Generar Vendedores';
                break;
            case '/ruta1':
                document.title = 'Título Ruta 1';
                break;
            case '/ruta2':
                document.title = 'Título Ruta 2';
                break;
            default:
                document.title = 'Inicio de la Aplicación';
        }
    }, [location]);

    return null;
};

export default Titulo;