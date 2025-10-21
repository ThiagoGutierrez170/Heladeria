/* eslint-disable react/display-name */
import React, { lazy, Suspense, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Typography, Paper, CircularProgress, IconButton, Button, TextField, useTheme, useMediaQuery, Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';
const HeladoDetalles = lazy(() => import('./HeladoDetalle'));
import RecargaHelado from './RecargaHelado';


// Componente de Botones de Acción
const ActionButtons = React.memo(({ onEdit, onDelete, onInfo, onRecarga, isMobile, usuarioRol }) => (
    <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
        <IconButton size={isMobile ? "small" : "medium"} color="default" onClick={onInfo} sx={{ m: 0.5 }} aria-label="Información">
            <InfoIcon />
        </IconButton>
        
        <IconButton size={isMobile ? "small" : "medium"} color="secondary" onClick={onRecarga} sx={{ m: 0.5 }} aria-label="Recargar Stock">
            <AddIcon />
        </IconButton>

        <IconButton size={isMobile ? "small" : "medium"} color="primary" onClick={onEdit} sx={{ m: 0.5 }} aria-label="Editar">
            <EditIcon />
        </IconButton>
        
        {usuarioRol === 'administrador' && (
            <IconButton size={isMobile ? "small" : "medium"} color="error" onClick={onDelete} sx={{ m: 0.5 }} aria-label="Eliminar">
                <DeleteIcon />
            </IconButton>
        )}
    </Box>
));

// Componente Principal
const ListaHelados = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [helados, setHelados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [heladosFiltrados, setHeladosFiltrados] = useState([]);
    const [openInfoModal, setOpenInfoModal] = useState(false);
    const [openRecargaModal, setOpenRecargaModal] = useState(false);
    const [selectedHelado, setSelectedHelado] = useState(null);
    const gridRef = useRef(null);
    const navigate = useNavigate();

    const [usuarioRol, setUsuarioRol] = useState(localStorage.getItem('rol'));

    // Hook para actualizar el rol si cambia en localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setUsuarioRol(localStorage.getItem('rol'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Función CORREGIDA para obtener los helados: se eliminan los parámetros de paginación
    // para cargar todos los datos en el cliente y que ag-Grid maneje la paginación.
    const obtenerHelados = useCallback(async () => {
        setLoading(true);
        try {
            // ** CORRECCIÓN CLAVE **: Llamada sin parámetros de paginación para obtener todos los datos.
            const response = await api.get(`/helado/`); 
            
            // Asumiendo que `response.data` es el array completo de helados.
            setHelados(response.data);
            setHeladosFiltrados(response.data);
        } catch (error) {
            console.error('Error al obtener los helados:', error);
            Swal.fire('Error', 'Error al obtener los helados', 'error');
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        obtenerHelados();
    }, [obtenerHelados]);

    useEffect(() => {
        const filtrarHelados = () => {
            const filtrados = helados.filter((helado) =>
                helado.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
            );
            setHeladosFiltrados(filtrados);
        };
        filtrarHelados();
    }, [terminoBusqueda, helados]);

    const handleDelete = useCallback(async (heladoId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás recuperar este helado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await api.delete(`/helado/${heladoId}`);
                setHelados(prev => prev.filter(helado => helado._id !== heladoId));
                Swal.fire('Eliminado!', 'El helado ha sido eliminado.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al eliminar el helado.', 'error');
            }
        }
    }, []);


    const handleEdit = useCallback((heladoId) => {
        navigate(`/editar-helado/${heladoId}`);
    }, [navigate]);

    const handleInfo = useCallback((heladoId) => {
        const helado = helados.find(h => h._id === heladoId);
        setSelectedHelado(helado);
        setOpenInfoModal(true);
    }, [helados]);

    const handleRecarga = useCallback((heladoId) => {
        const helado = helados.find(h => h._id === heladoId);
        setSelectedHelado(helado);
        setOpenRecargaModal(true);
    }, [helados]);

    const getActionCellRenderer = useCallback((isMobileView) => (params) => (
        <ActionButtons
            onInfo={() => handleInfo(params.data._id || params.data.id)} 
            onEdit={() => handleEdit(params.data._id || params.data.id)}
            onDelete={() => handleDelete(params.data._id || params.data.id)}
            onRecarga={() => handleRecarga(params.data._id || params.data.id)}
            isMobile={isMobileView}
            usuarioRol={usuarioRol}
        />
    ), [handleInfo, handleEdit, handleDelete, handleRecarga, usuarioRol]);


    const mobileColumns = useMemo(() => [
        {
            headerName: "Helados",
            field: "nombre",
            flex: 1,
            minWidth: 150,
            cellRenderer: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                        src={params.data.imagen}
                        alt={params.value}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '4px',
                            objectFit: 'cover'
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{params.value}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            Stock: {params.data.stock}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            headerName: "Acciones",
            field: "acciones",
            width: 160,
            cellRenderer: getActionCellRenderer(true),
        }
    ], [getActionCellRenderer]); 

    const desktopColumns = useMemo(() => [
        {
            headerName: "Nombre",
            field: "nombre",
            flex: 1,
            minWidth: 300,
        },
        {
            headerName: "Imagen",
            field: "imagen",
            flex: 1,
            width: 100,
            cellRenderer: (params) => (
                <img
                    src={params.value}
                    alt={`${params.data.nombre} imagen`}
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '4px',
                        objectFit: 'cover'
                    }}
                />
            ),
        },
        {
            headerName: "Costo",
            field: "costo",
            flex: 1,
            width: 100,
            valueFormatter: (params) => `$${params.value}`, 
        },
        {
            headerName: "Precio Base",
            field: "precioBase",
            flex: 1,
            width: 120,
            valueFormatter: (params) => `$${params.value}`, 
        },
        {
            headerName: "Precio Venta",
            field: "precioVenta",
            flex: 1,
            width: 120,
            valueFormatter: (params) => `$${params.value}`, 
        },
        {
            headerName: "Stock",
            field: "stock",
            flex: 1,
            width: 100,
            cellStyle: (params) => (params.value < 5 ? { backgroundColor: '#ffdddd' } : null), 
        },
        {
            headerName: "Acciones",
            field: "acciones",
            width: 200,
            cellRenderer: getActionCellRenderer(false),
        }
    ], [getActionCellRenderer]); 

    return (
        <Box sx={{ padding: isMobile ? '16px' : '24px' }}>
            <Typography
                variant={isMobile ? "h6" : "h5"}
                align="center"
                gutterBottom
                color="primary"
                sx={{ mb: 3 }}
            >
                Lista de Helados 🍨
            </Typography>

            <Box sx={{
                display: 'flex',
                gap: '16px',
                flexDirection: isMobile ? 'column' : 'row',
                marginBottom: '16px'
            }}>
                <TextField
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    variant="outlined"
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    placeholder="Buscar helados por nombre"
                    InputProps={{
                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/agregar-helado')}
                    sx={{
                        minWidth: isMobile ? '100%' : 'auto',
                        height: isMobile ? '40px' : '56px'
                    }}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    {isMobile ? 'Agregar' : 'Agregar Helado'}
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <Paper
                    sx={{
                        // ** CORRECCIÓN CLAVE 2 **: Altura automática en móvil para que ag-Grid con autoHeight funcione.
                        height: isMobile ? 'auto' : '590px',
                        width: '100%',
                        overflow: isMobile ? 'visible' : 'hidden', // Asegura visibilidad en móvil
                        borderRadius: '8px'
                    }}
                    className="ag-theme-alpine"
                >
                    <AgGridReact
                        ref={gridRef}
                        rowData={heladosFiltrados.map((helado) => ({
                            ...helado,
                            id: helado._id, 
                        }))}
                        columnDefs={isMobile ? mobileColumns : desktopColumns}
                        pagination={true}
                        paginationPageSize={isMobile ? 20 : 10}
                        paginationPageSizeSelector={isMobile ? [20] : [10, 30, 50, 100]}
                        // ** CORRECCIÓN CLAVE 3 **: Usa 'autoHeight' en móvil.
                        domLayout={isMobile ? 'autoHeight' : 'normal'}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: !isMobile,
                        }}
                        suppressMovableColumns={isMobile}
                        headerHeight={isMobile ? 40 : 48}
                        rowHeight={isMobile ? 100 : 52}
                        gridOptions={{
                            paginationPageSize: isMobile ? 20 : 10,
                            paginationPageSizeSelector: isMobile ? [] : [10, 30, 50, 100],
                        }}
                    />
                </Paper>
            )}

            <Suspense fallback={<CircularProgress />}>
                {openInfoModal && selectedHelado && (
                    <HeladoDetalles
                        open={openInfoModal}
                        onClose={() => setOpenInfoModal(false)}
                        helado={selectedHelado}
                    />
                )}
                {openRecargaModal && selectedHelado && (
                    <RecargaHelado
                        open={openRecargaModal}
                        onClose={() => {
                            setOpenRecargaModal(false);
                            obtenerHelados(); // Recarga los datos después de cerrar el modal
                        }}
                        helado={selectedHelado}
                        obtenerHelados={obtenerHelados}
                    />
                )}
            </Suspense>
        </Box>
    );
};

export default ListaHelados;