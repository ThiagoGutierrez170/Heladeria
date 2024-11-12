import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import Login from './Login';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const rolUsuario = localStorage.getItem('rol');

    // Verifica si el usuario está autenticado
    if (!token) {
        return <Navigate to="login" />
    }

    // Verifica el rol del usuario
    if (rolUsuario === 'administrador') {
        // El administrador puede acceder a todas las rutas
        return <Outlet />
    } else if (rolUsuario === 'usuario') {
        // El usuario solo puede acceder a las rutas públicas, no a la de usuarios
        const publicRoutes = ['/helados', '/agregar-helado', '/editar-helado/:id', '/recargar-helado/:id', '/helado-detalle/:id', '/vendedores', '/agregar-vendedor', '/editar-vendedor/:id', '/notas-activas', '/nota-activa/:id', '/editar-nota/:id', '/recargar-catalogo/:id', '/finalizar-nota/:id', '/factura/:id', '/registro-finalizados', '/nota-detalle/:id', '/agregar-nota'];
        return publicRoutes.includes(window.location.pathname) ? <Outlet /> : <Navigate to="/" />
    } else if (rolUsuario === 'supervisor') {
        // El supervisor solo puede acceder a las notas activas
        const allowedRoutes = ['/notas-activas', '/nota-activa/:id', '/editar-nota/:id', '/recargar-catalogo/:id', '/finalizar-nota/:id', '/factura/:id'];
        return allowedRoutes.includes(window.location.pathname) ? <Outlet /> : <Navigate to="/notas-activas" />
    } else {
        // Si el rol no es válido, redirigir al login
        return <Navigate to="login" />
    }
}

export default ProtectedRoute;