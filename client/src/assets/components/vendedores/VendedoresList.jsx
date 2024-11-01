import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {DataGrid}  from '@mui/x-data-grid';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import InfoModal from './VendedorDetalles';
import AddIcon from '@mui/icons-material/Add';

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



    const fetchVendedores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vendedor/');
            if (Array.isArray(response.data)) {
                setVendedores(response.data);
            } else {
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
                await axios.delete(`http://localhost:5000/api/vendedor/${vendedorId}`);
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
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'apellido', headerName: 'Apellido', flex: 1 },
        { field: 'ci', headerName: 'C.I.', flex: 1 },
        { field: 'contacto', headerName: 'Contacto', flex: 2 },
        { field: 'estado', headerName: 'Estado', flex: 0.5 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 180,
            renderCell: (params) => (
                <ActionButtons
                    onInfo={() => handleInfo(params.row.id)}
                    onEdit={() => handleEdit(params.row.id)}
                    onDelete={() => handleDelete(params.row.id)}
                />
            ),
        },
    ], [handleInfo, handleEdit, handleDelete]);

    return (
        <>

            <Typography variant="h2" align="center" gutterBottom color="secondary">
                Lista de Vendedores
            </Typography>
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
                <Paper sx={{ height: 590, width: '100%', mt: 3 }}>
                    <DataGrid
                        rows={vendedores.map(vendedor => ({
                            id: vendedor._id,
                            nombre: vendedor.nombre,
                            apellido: vendedor.apellido,
                            ci: vendedor.ci,
                            contacto: vendedor.contacto,
                            estado: vendedor.estado ? 'Activo' : 'Inactivo',
                        }))}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 30]}
                        checkboxSelection
                        sx={{
                            border: 0,
                            '& .MuiDataGrid-cell': {
                                fontSize: 16,
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#1976d2',
                                color: '#fff',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                color: 'black',
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                backgroundColor: '#f5f5f5',
                            },
                        }}
                    />
                </Paper>
            )}

            <InfoModal
                open={openInfoModal}
                onClose={() => setOpenInfoModal(false)}
                vendedor={selectedVendedor}
            />
        </>
    );
};

export default VendedoresList;
