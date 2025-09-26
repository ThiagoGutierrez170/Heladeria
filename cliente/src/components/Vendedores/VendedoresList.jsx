/* eslint-disable react/display-name */
import React, { lazy, Suspense, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Typography, Paper, CircularProgress, IconButton, Button, useTheme, useMediaQuery } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
const InfoModal = lazy(() => import('../Vendedores/VendedorDetalles'));
import AddIcon from '@mui/icons-material/Add';

const ActionButtons = React.memo(({ onEdit, onDelete, onInfo, isMobile , usuarioRol }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center', // Centra los iconos horizontalmente
            alignItems: 'center', // Centra los iconos verticalmente
            gap: isMobile ? '10px' : '5px', // Espacio entre los iconos
            padding: isMobile ? '10px' : '0', // Padding para la vista móvil
            height: '100%', // Asegura que la altura ocupe todo el espacio disponible de la celda
        }}
    >
        <IconButton
            size={isMobile ? "large" : "medium"}
            color="default"
            onClick={onInfo}
            sx={{
                m: 0.5,
                minWidth: isMobile ? '50px' : 'auto',
                height: isMobile ? '50px' : 'auto',
                width: isMobile ? '50px' : 'auto',
                fontSize: isMobile ? '24px' : 'inherit',
            }}
        >
            <InfoIcon />
        </IconButton>
        <IconButton
            size={isMobile ? "large" : "medium"}
            color="primary"
            onClick={onEdit}
            sx={{
                m: 0.5,
                minWidth: isMobile ? '50px' : 'auto',
                height: isMobile ? '50px' : 'auto',
                width: isMobile ? '50px' : 'auto',
                fontSize: isMobile ? '24px' : 'inherit',
            }}
        >
            <EditIcon />
        </IconButton>
        {usuarioRol === 'administrador' && (
            <>
        <IconButton
            size={isMobile ? "large" : "medium"}
            color="error"
            onClick={onDelete}
            sx={{
                m: 0.5,
                minWidth: isMobile ? '50px' : 'auto',
                height: isMobile ? '50px' : 'auto',
                width: isMobile ? '50px' : 'auto',
                fontSize: isMobile ? '24px' : 'inherit',
            }}
        >
            <DeleteIcon />
        </IconButton>
            </>
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

    // Update role when localStorage changes
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
            const response = await axios.get(`/api/vendedor/`);
            setVendedores(response.data);
            if (!Array.isArray(response.data)) {
                console.error('Expected an array but got:', response.data);
                setVendedores([]);
            }
        } catch (error) {
            console.error('Error al obtener los vendedores:', error);
            Swal.fire('Error', 'Error al obtener los vendedores', 'error');
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
                await axios.delete(`/api/vendedor/${vendedorId}`);
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

    const mobileColumns = useMemo(() => [
        {
            headerName: "Vendedores",
            field: "nombre", // Suponiendo que "nombre" contiene solo el primer nombre
            flex: 1,
            minWidth: 150,
            cellRenderer: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>
                            {params.data.nombre} {params.data.apellido}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>
                            Estado: {params.data.estado}
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
                    onInfo={() => handleInfo(params.data._id)}
                    onEdit={() => handleEdit(params.data._id)}
                    onDelete={() => handleDelete(params.data._id)}
                    isMobile={true}
                    usuarioRol={usuarioRol}
                />
            ),
        }
    ], [handleInfo, handleEdit, handleDelete, usuarioRol]);

    const desktopColumns = useMemo(() => [
        {
            headerName: "Vendedores",
            children: [
                { headerName: "Nombre", field: "nombre", flex: 1, minWidth: 200 },
                { headerName: "Apellido", field: "apellido", flex: 1, minWidth: 200 },
                { headerName: "C.I.", field: "ci", flex: 0.5, minWidth: 150 },
                { headerName: "Contacto", field: "contacto", flex: 1, minWidth: 200 },
                { headerName: "Estado", field: "estado", flex: 1, minWidth: 100 },
                {
                    headerName: "Acciones",
                    field: "acciones",
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
            ],
        },
    ], [handleInfo, handleEdit, handleDelete, usuarioRol]);

    return (
        <>
            <div style={{ padding: isMobile ? '10px' : '2px' }}>
                <Typography variant={isMobile ? "h6" : "h5"} align="center" gutterBottom color="primary" sx={{ mb: 0 }}>
                    Lista de Vendedores
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/agregar-vendedor')}
                    sx={{
                        mb: 2,
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: '#1976d2',
                        '&:hover': { backgroundColor: '#155a8a' },
                    }}
                >
                    <AddIcon sx={{ mr: 0 }} />
                </Button>

                {loading ? (
                    <CircularProgress color="primary" />
                ) : error ? (
                    <Typography variant="body1" color="error.main" align="center">
                        Error al cargar la lista de vendedores
                    </Typography>
                ) : (
                    <Paper sx={{ height: isMobile ? '70vh' : '590px', width: '100%', borderRadius: '8px' }} className="ag-theme-alpine">
                        <AgGridReact
                            ref={gridRef}
                            rowData={vendedores.map((vendedor) => ({
                                _id: vendedor._id,
                                nombre: vendedor.nombre,
                                apellido: vendedor.apellido,
                                ci: vendedor.ci,
                                contacto: vendedor.contacto,
                                estado: vendedor.estado ? 'Activo' : 'Inactivo',
                            }))}
                            columnDefs={isMobile ? mobileColumns : desktopColumns}
                            pagination={true}
                            paginationPageSize={isMobile ? 20 : 10}
                            paginationPageSizeSelector={false}  // Desactiva el selector de páginas en móviles
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
                                fontSize: isMobile ? '36px' : '24px',
                            }}
                        />

                    </Paper>
                )}
                <Suspense fallback={<CircularProgress color="secondary" />}>
                    {openInfoModal && (
                        <InfoModal open={openInfoModal} onClose={() => setOpenInfoModal(false)} vendedor={selectedVendedor} />
                    )}
                </Suspense>
            </div>
        </>
    );
};

export default VendedoresList;
