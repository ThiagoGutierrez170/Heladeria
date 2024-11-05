import React, { lazy, Suspense, useState, useMemo, useCallback, useEffect, useRef } from 'react'; // Agrega useRef aquí
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
const InfoModal = lazy(() => import('../vendedores/VendedorDetalles'));
import AddIcon from '@mui/icons-material/Add';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

const ActionButtons = React.memo(({ onEdit, onDelete, onInfo }) => (
    <div style={{ display: 'flex' }}>
        <IconButton color="default" onClick={onInfo} sx={{ marginRight: '8px' }}>
            <InfoIcon />
        </IconButton>
        <IconButton color="primary" onClick={onEdit} sx={{ marginRight: '8px' }}>
            <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={onDelete}>
            <DeleteIcon />
        </IconButton>
    </div>
));

const VendedoresList = () => {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [selectedVendedor, setSelectedVendedor] = useState(null);
    const [openInfoModal, setOpenInfoModal] = useState(false);
    const gridRef = useRef(null);

    const onExportClick = useCallback((type) => {
        const gridApi = gridRef.current.api;
        if (type === 'csv') {
            gridApi.exportDataAsCsv();
        } else if (type === 'excel') {
            gridApi.exportDataAsExcel();
        }
    }, []);

    const fetchVendedores = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/vendedor?page=${page}&pageSize=${pageSize}`);
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

    const columns = useMemo(() => [
        {
            groupId: "vendedoresGroupId",
            headerName: "Vendedores",
            children: [
                {
                    headerName: "Nombre",
                    field: "nombre",
                    flex: 1,
                    minWidth: 200,
                    columnChooserParams: {
                        suppressColumnFilter: true,
                        suppressColumnSelectAll: true,
                        suppressColumnExpandAll: true,
                    },
                },
                {
                    headerName: "Apellido",
                    field: "apellido",
                    flex: 1,
                    minWidth: 200,
                    columnChooserParams: {
                        suppressColumnFilter: true,
                        suppressColumnSelectAll: true,
                        suppressColumnExpandAll: true,
                    },
                },
                {
                    headerName: "C.I.",
                    field: "ci",
                    flex: 0.5,
                    minWidth: 150,
                },
                {
                    headerName: "Contacto",
                    field: "contacto",
                    flex: 1,
                    minWidth: 200,
                },
                {
                    headerName: "Estado",
                    field: "estado",
                    flex: 1,
                    minWidth: 100,
                },
                {
                    headerName: "Acciones",
                    field: "acciones",
                    cellRenderer: (params) => (
                        <ActionButtons
                            onInfo={() => handleInfo(params.data.id)}
                            onEdit={() => handleEdit(params.data.id)}
                            onDelete={() => handleDelete(params.data.id)}
                        />
                    ),
                },
            ],
        },
    ], [handleInfo, handleEdit, handleDelete]);


    return (
        <>
            <Typography variant="h5" align="center" gutterBottom color="primary">
                Lista de Vendedores
            </Typography>



            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <IconButton
                    variant="outlined"
                    onClick={() => onExportClick('excel')}
                    sx={{ marginLeft: '8px' }}
                >
                    <DocumentScannerIcon /> {/* Cambia a PublishIcon si prefieres el icono de publicar */}
                </IconButton>
                <Typography variant="button" style={{ marginLeft: '8px' }}>
                    
                </Typography>
            </div>


            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/agregar-vendedor')}
                sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#1976d2',
                    '&:hover': {
                        backgroundColor: '#155a8a',
                    },
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
                <Paper sx={{ height: 590, width: '100%', mt: 3 }} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={vendedores.map((vendedor) => ({
                            id: vendedor._id,
                            nombre: vendedor.nombre,
                            apellido: vendedor.apellido,
                            ci: vendedor.ci,
                            contacto: vendedor.contacto,
                            estado: vendedor.estado ? 'Activo' : 'Inactivo',
                        }))}
                        columnDefs={columns}
                        pagination={true}
                        paginationPageSize={10}
                        modules={[ExcelExportModule]}
                    />
                </Paper>
            )}
            <Suspense fallback={<CircularProgress color="secondary" />}>
                {openInfoModal && (
                    <InfoModal
                        open={openInfoModal}
                        onClose={() => setOpenInfoModal(false)}
                        vendedor={selectedVendedor}
                    />
                )}
            </Suspense>
        </>
    );
};

export default VendedoresList;
