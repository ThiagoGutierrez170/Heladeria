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
                document.title = 'Formulario de  Vendedor';
                break;
            case '/editar-vendedor':
                document.title = 'Editar Vendedor';
                break;
            case '/agregar-helado':
                document.title = 'Formulario de Helado';
                break;
            case '/editar-helado':
                document.title = 'Editar Helado';
                break;
            case '/generar-vendedores':
                document.title = 'Generar Vendedores';
                break;
            case 'notas-activas':
                document.title = 'Notas Activas';
                break;
            case 'nota-inactiva':
                document.title = 'Detalle de Nota Inactiva';
                break;
            case 'editar-nota':
                document.title = 'Editar Nota';
                break;
            case 'recargar-catalogo':
                document.title = 'Recargar Catálogo';
                break;
            case 'finalizar-nota':
                document.title = 'Finalizar Nota';
                break;
            case 'factura':
                document.title = 'Factura';
                break;
            case 'registro-finalizados':
                document.title = 'Registro de Notas Finalizadas';
                break;
            case 'detalle-nota':
                document.title = 'Detalle de la Nota';
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