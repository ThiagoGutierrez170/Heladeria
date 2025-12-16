/* eslint-disable react/display-name */
import React, { lazy, Suspense, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Typography, Paper, CircularProgress, IconButton, Button, useTheme, useMediaQuery, Chip, Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../../utils/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';

const InfoModal = lazy(() => import('../Vendedores/VendedorDetalles'));

const ActionButtons = React.memo(({ onEdit, onDelete, onInfo, isMobile, usuarioRol }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '10px' : '5px',
            height: '100%',
            width: '100%'
        }}
    >
        <IconButton size={isMobile ? "large" : "small"} onClick={onInfo} color="info">
            <InfoIcon fontSize={isMobile ? "medium" : "small"} />
        </IconButton>
        <IconButton size={isMobile ? "large" : "small"} onClick={onEdit} color="primary">
            <EditIcon fontSize={isMobile ? "medium" : "small"} />
        </IconButton>
        {usuarioRol === 'administrador' && (
            <IconButton size={isMobile ? "large" : "small"} onClick={onDelete} color="error">
                <DeleteIcon fontSize={isMobile ? "medium" : "small"} />
            </IconButton>
        )}
    </div>
));

const VendedoresList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [selectedVendedor, setSelectedVendedor] = useState(null);
    const [openInfoModal, setOpenInfoModal] = useState(false);
    const gridRef = useRef(null);

    const [usuarioRol, setUsuarioRol] = useState(localStorage.getItem('rol'));

    useEffect(() => {
        const handleStorageChange = () => {
            setUsuarioRol(localStorage.getItem('rol'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const fetchVendedores = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/vendedor/`);
            
            // Aseguramos el orden: Activos (true) primero, Inactivos (false) al final
            const listaOrdenada = response.data.sort((a, b) => {
                if (a.estado === b.estado) return 0;
                return a.estado ? -1 : 1;
            });
            
            setVendedores(listaOrdenada);
        } catch (error) {
            console.error('Error al obtener los vendedores:', error);
            Swal.fire('Error', 'Error al obtener los vendedores', 'error');
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendedores();
    }, []);

    const handleDelete = useCallback(async (vendedorId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás recuperar este vendedor!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await api.delete(`/vendedor/${vendedorId}`);
                setVendedores(prev => prev.filter(vendedor => vendedor._id !== vendedorId));
                Swal.fire('Eliminado!', 'El vendedor ha sido eliminado.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al eliminar el vendedor.', 'error');
            }
        }
    }, []);

    const handleEdit = useCallback((vendedorId) => {
        navigate(`/editar-vendedor/${vendedorId}`);
    }, [navigate]);

    const handleInfo = useCallback((vendedorId) => {
        const vendedor = vendedores.find(v => v._id === vendedorId);
        setSelectedVendedor(vendedor);
        setOpenInfoModal(true);
    }, [vendedores]);

    // --- COLUMNAS MÓVIL (Solo Nombre) ---
    const mobileColumns = useMemo(() => [
        {
            headerName: "Vendedores",
            field: "nombre",
            flex: 1, 
            minWidth: 150,
            cellRenderer: (params) => (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    height: '100%', 
                    lineHeight: '1.4',
                    paddingLeft: '5px'
                }}>
                    {/* Solo mostramos el nombre */}
                    <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#333' }}>
                        {params.data.nombre} 
                    </span>
                    <span style={{ 
                        fontSize: '0.8rem', 
                        color: params.data.estado ? '#2e7d32' : '#d32f2f',
                        display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                        <span style={{ 
                            width: '8px', height: '8px', borderRadius: '50%', 
                            backgroundColor: params.data.estado ? '#2e7d32' : '#d32f2f',
                            display: 'inline-block'
                        }}></span>
                        {params.data.estado ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            ),
        },
        {
            headerName: "Acciones",
            width: 140, 
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 },
            cellRenderer: (params) => (
                <ActionButtons
                    onInfo={() => handleInfo(params.data._id)}
                    onEdit={() => handleEdit(params.data._id)}
                    onDelete={() => handleDelete(params.data._id)}
                    isMobile={true}
                    usuarioRol={usuarioRol}
                />
            ),
        }
    ], [handleInfo, handleEdit, handleDelete, usuarioRol]);

    // --- COLUMNAS ESCRITORIO (Solo Nombre) ---
    const desktopColumns = useMemo(() => [
        { headerName: "Nombre", field: "nombre", flex: 1 },
        // Eliminé la columna "Apellido"
        { headerName: "C.I.", field: "ci", width: 120 },
        { 
            headerName: "Estado", 
            field: "estado", 
            width: 120,
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: (params) => (
                <Chip 
                    label={params.value ? "Activo" : "Inactivo"} 
                    color={params.value ? "success" : "default"} 
                    size="small" 
                    variant="outlined"
                />
            )
        },
        {
            headerName: "Acciones",
            field: "acciones",
            width: 120,
            cellRenderer: (params) => (
                <ActionButtons
                    onInfo={() => handleInfo(params.data._id)}
                    onEdit={() => handleEdit(params.data._id)}
                    onDelete={() => handleDelete(params.data._id)}
                    isMobile={false}
                    usuarioRol={usuarioRol}
                />
            ),
        },
    ], [handleInfo, handleEdit, handleDelete, usuarioRol]);

    return (
        <div style={{ 
            padding: isMobile ? '10px 5px' : '20px', 
            maxWidth: '1200px', 
            margin: '0 auto',
            height: '100vh', 
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={1}>
                <Typography variant={isMobile ? "h5" : "h4"} component="h1" color="primary" fontWeight="bold">
                    Vendedores
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/agregar-vendedor')}
                    size={isMobile ? "medium" : "large"}
                >
                    Nuevo
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center">Error al cargar datos.</Typography>
            ) : (
                <div style={{ 
                    flex: 1, 
                    width: '100%', 
                    overflow: 'hidden' 
                }} 
                className="ag-theme-alpine"
                >
                    <AgGridReact
                        ref={gridRef}
                        rowData={vendedores}
                        columnDefs={isMobile ? mobileColumns : desktopColumns}
                        // --- SIN PAGINACIÓN ---
                        pagination={false} 
                        domLayout={'normal'} 
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: true,
                            suppressMenu: isMobile,
                        }}
                        rowHeight={isMobile ? 80 : 50}
                        headerHeight={50}
                        animateRows={true}
                    />
                </div>
            )}

            <Suspense fallback={null}>
                {openInfoModal && selectedVendedor && (
                    <InfoModal 
                        open={openInfoModal} 
                        onClose={() => setOpenInfoModal(false)} 
                        vendedor={selectedVendedor} 
                    />
                )}
            </Suspense>
        </div>
    );
};

export default VendedoresList;