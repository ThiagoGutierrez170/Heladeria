import { useState, useEffect } from 'react';
import { Typography, Paper, CircularProgress, IconButton, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import InfoModal from './VendedorDetalles';
import AddIcon from '@mui/icons-material/Add';



const VendedoresList = () => {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [selectedVendedor, setSelectedVendedor] = useState(null);
    const [openInfoModal, setOpenInfoModal] = useState(false);

    useEffect(() => {
        fetchVendedores();
    }, []);

    const fetchVendedores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vendedor/');
            setVendedores(response.data);
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };



    const handleDelete = async (vendedorId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás recuperar este vendedor!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
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
    };

    const handleEdit = (vendedorId) => {
        navigate(`/editar-vendedor/${vendedorId}`);
    };

    const handleInfo = (vendedorId) => {
        const vendedor = vendedores.find(v => v._id === vendedorId);
        setSelectedVendedor(vendedor);
        setOpenInfoModal(true);
    };

    const columns = [
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
                <div style={{ display: 'flex' }}>
                    <IconButton color="info" onClick={() => handleInfo(params.row.id)} sx={{ marginRight: '8px' }}>
                        <InfoIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleEdit(params.row.id)} sx={{ marginRight: '8px' }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <>
            <Helmet>
                <meta charSet="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/src/assets/images/vendedor.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Lista de Vendedores</title>
            </Helmet>

            <Typography variant="h3" align="center" gutterBottom color="secondary">
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
