import React from 'react';
import { useLocation } from 'react-router-dom';

const Titulo = () => {
    const location = useLocation();

    React.useEffect(() => {
        switch (true) {
            case /^\/vendedores$/.test(location.pathname):
                document.title = 'Lista de Vendedores';
                break;
            case /^\/helados$/.test(location.pathname):
                document.title = 'Lista de Helados';
                break;
            case /^\/agregar-vendedor$/.test(location.pathname):
                document.title = 'Formulario de Vendedor';
                break;
            case /^\/editar-vendedor\/\d+$/.test(location.pathname):
                document.title = 'Editar Vendedor';
                break;
            case /^\/agregar-helado$/.test(location.pathname):
                document.title = 'Formulario de Helado';
                break;
            case /^\/editar-helado\/\d+$/.test(location.pathname):
                document.title = 'Editar Helado';
                break;
            case /^\/notas-activas$/.test(location.pathname):
                document.title = 'Notas Activas';
                break;
            case /^\/nota-activa\/\d+$/.test(location.pathname):
                document.title = 'Detalle de Nota Activa';
                break;
            case /^\/editar-nota\/\d+$/.test(location.pathname):
                document.title = 'Editar Nota';
                break;
            case /^\/recargar-catalogo\/\d+$/.test(location.pathname):
                document.title = 'Recargar Catálogo';
                break;
            case /^\/finalizar-nota\/\d+$/.test(location.pathname):
                document.title = 'Finalizar Nota';
                break;
            case /^\/factura\/\d+$/.test(location.pathname):
                document.title = 'Factura';
                break;
            case /^\/registro-finalizados$/.test(location.pathname):
                document.title = 'Registro de Notas Finalizadas';
                break;
            case /^\/nota-detalle\/\d+$/.test(location.pathname):
                document.title = 'Detalle de la Nota';
                break;
            case /^\/agregar-nota$/.test(location.pathname):
                document.title = 'Agregar Nota';
                break;
            case /^\/usuarios$/.test(location.pathname):
                document.title = 'Lista de Usuarios';
                break;
            case /^\/usuario-editar\/\d+$/.test(location.pathname):
                document.title = 'Editar Usuario';
                break;
            case /^\/crear-usuario$/.test(location.pathname):
                document.title = 'Crear Usuario';
                break;
            case /^\/S-registro-finalizados$/.test(location.pathname):
                document.title = 'Registros Finalizados - Supervisor';
                break;
            case /^\/S-detalle-nota\/\d+$/.test(location.pathname):
                document.title = 'Detalle de Nota - Supervisor';
                break;
            default:
                document.title = 'Aplicación';
        }
    }, [location]);

    return null;
};

export default Titulo;
