import { useState, useEffect } from 'react';
import { Container, Typography, Paper, CircularProgress, IconButton, Button } from '@mui/material';
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

const localeText = {
    // Tu configuración de texto
};

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
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    const handleDelete = async (vendedorId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás recuperar este vendedor!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/vendedor/${vendedorId}`);
                    setVendedores((prev) => prev.filter((vendedor) => vendedor._id !== vendedorId));
                    Swal.fire('Eliminado!', 'El vendedor ha sido eliminado.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'Hubo un problema al eliminar el vendedor.', 'error');
                }
            }
        });
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
        { field: 'nombre', headerName: 'Nombre', width: 150 },
        { field: 'apellido', headerName: 'Apellido', width: 150 },
        { field: 'ci', headerName: 'C.I.', width: 150 },
        { field: 'contacto', headerName: 'Contacto', width: 280 },
        { field: 'estado', headerName: 'Estado', width: 150 },
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
            
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 10,
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: 3,
                    backgroundColor: '#f9f9f9',
                    p: 4,
                }}
            >
                <Typography variant="h3" align="center" gutterBottom color="primary">
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
                                padding: '12px 24px', // Aumentar el padding
                                fontSize: '16px', // Ajustar el tamaño de la fuente
                                backgroundColor: '#1976d2', // Color de fondo
                                '&:hover': {
                                    backgroundColor: '#155a8a', // Color al pasar el mouse
                                },
                            }}
                        >
                            <AddIcon sx={{ mr: 1 }} />
                            Agregar Vendedor
                        </Button>
                {loading ? (
                    <CircularProgress color="primary" />
                ) : error ? (
                    <Typography variant="body1" color="error.main" align="center">
                        Error al cargar la lista de vendedores
                    </Typography>
                ) : (
                    <Paper sx={{ height: 400, width: '100%', mt: 3 }}>
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
                            pageSize={5}
                            rowsPerPageOptions={[5, 10]}
                            checkboxSelection
                            localeText={localeText}
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

                {/* Modal para mostrar detalles del vendedor */}
                <InfoModal
                    open={openInfoModal}
                    onClose={() => setOpenInfoModal(false)}
                    vendedor={selectedVendedor}
                />
            </Container>
        </>
    );
};

export default VendedoresList;
