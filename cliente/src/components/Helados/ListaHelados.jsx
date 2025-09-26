import React, { lazy, Suspense, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Typography, Paper, CircularProgress, IconButton, Button, TextField, useTheme, useMediaQuery } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
//import axios from 'axios';
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



const ActionButtons = React.memo(({ onEdit, onDelete, onInfo, onRecarga, isMobile, usuarioRol }) => (
    <div style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
        <IconButton size={isMobile ? "small" : "medium"} color="default" onClick={onInfo} sx={{ m: 0.5 }}>
            <InfoIcon />
        </IconButton>
        
        {usuarioRol === 'administrador' && (
            <>
                <IconButton size={isMobile ? "small" : "medium"} color="primary" onClick={onEdit} sx={{ m: 0.5 }}>
                    <EditIcon />
                </IconButton>
                <IconButton size={isMobile ? "small" : "medium"} color="error" onClick={onDelete} sx={{ m: 0.5 }}>
                    <DeleteIcon />
                </IconButton>
            </>
        )}

        <IconButton size={isMobile ? "small" : "medium"} color="secondary" onClick={onRecarga} sx={{ m: 0.5 }}>
            <AddIcon />
        </IconButton>
    </div>
));


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

    // Update role when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            setUsuarioRol(localStorage.getItem('rol'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const obtenerHelados = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const response = await api.get(`/helado?page=${page}&pageSize=${pageSize}`);
            setHelados(response.data);
            setHeladosFiltrados(response.data);
        } catch (error) {
            console.error('Error al obtener los helados:', error);
            Swal.fire('Error', 'Error al obtener los helados', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerHelados();
    }, []);

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
            cellRenderer: (params) => (
                <ActionButtons
                    onInfo={() => handleInfo(params.data.id)}
                    onEdit={() => handleEdit(params.data.id)}
                    onDelete={() => handleDelete(params.data.id)}
                    onRecarga={() => handleRecarga(params.data.id)}
                    isMobile={true}
                    usuarioRol={usuarioRol}
                />
            ),
        }
    ], [handleInfo, handleEdit, handleDelete, handleRecarga, usuarioRol]);

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
        },
        {
            headerName: "Precio Base",
            field: "precioBase",
            flex: 1,
            width: 120,
        },
        {
            headerName: "Precio Venta",
            field: "precioVenta",
            flex: 1,
            width: 120,
        },
        {
            headerName: "Stock",
            field: "stock",
            flex: 1,
            width: 100,
        },
        {
            headerName: "Acciones",
            field: "acciones",
            width: 200,
            cellRenderer: (params) => (
                <ActionButtons
                    onInfo={() => handleInfo(params.data.id)}
                    onEdit={() => handleEdit(params.data.id)}
                    onDelete={() => handleDelete(params.data.id)}
                    onRecarga={() => handleRecarga(params.data.id)}
                    isMobile={false}
                    usuarioRol={usuarioRol}
                    
                />
            ),
        }
    ], [handleInfo, handleEdit, handleDelete, handleRecarga,usuarioRol]);

    return (
        <div style={{ padding: isMobile ? '16px' : '24px' }}>
            <Typography
                variant={isMobile ? "h6" : "h5"}
                align="center"
                gutterBottom
                color="primary"
                sx={{ mb: 3 }}
            >
                Lista de Helados
            </Typography>

            <div style={{
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
                    placeholder="Buscar helados"
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
                    {!isMobile}
                </Button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <CircularProgress color="primary" />
                </div>
            ) : (
                <Paper
                    sx={{
                        height: isMobile ? '70vh' : '590px',
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: '8px'
                    }}
                    className="ag-theme-alpine"
                >
                    <AgGridReact
                        ref={gridRef}
                        rowData={heladosFiltrados.map((helado) => ({
                            id: helado._id,
                            nombre: helado.nombre,
                            imagen: helado.imagen,
                            costo: helado.costo,
                            precioBase: helado.precioBase,
                            precioVenta: helado.precioVenta,
                            stock: helado.stock,
                        }))}
                        columnDefs={isMobile ? mobileColumns : desktopColumns}
                        pagination={true}
                        paginationPageSize={isMobile ? 20 : 10}  // Página por defecto 20 en móvil y 10 en desktop
                        paginationPageSizeSelector={isMobile ? [20] : [10, 30, 50, 100]}  // Selector de tamaño de página solo en desktop
                        domLayout={isMobile ? 'autoHeight' : 'normal'}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: !isMobile,
                        }}
                        suppressMovableColumns={isMobile}
                        headerHeight={isMobile ? 40 : 48}
                        rowHeight={isMobile ? 100 : 52}
                        paginationPanelStyle={{
                            fontSize: isMobile ? '36px' : '24px', // Aumenta el tamaño de la fuente de los botones de paginación
                        }}
                        gridOptions={{
                            paginationPageSize: isMobile ? 20 : 10, // Página por defecto en móvil (20) y en escritorio (10)
                            paginationPageSizeSelector: isMobile ? [] : [10, 30, 50, 100], // No mostrar selector en móvil
                        }}
                    />
                </Paper>
            )}

            <Suspense fallback={<CircularProgress />}>
                {openInfoModal && (
                    <HeladoDetalles
                        open={openInfoModal}
                        onClose={() => setOpenInfoModal(false)}
                        helado={selectedHelado}
                    />
                )}
                {openRecargaModal && (
                    <RecargaHelado
                        open={openRecargaModal}
                        onClose={() => setOpenRecargaModal(false)}
                        helado={selectedHelado}
                        obtenerHelados={obtenerHelados}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default ListaHelados;