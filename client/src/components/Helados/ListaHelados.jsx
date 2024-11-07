<<<<<<< HEAD
import React, { lazy, Suspense, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Typography, Paper, CircularProgress, IconButton, Button, TextField } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const HeladoDetalles = lazy(() => import('./HeladoDetalle'));
import './helado.modules.css/ListaHelados.css';

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

const ListaHelados = () => {
    const [helados, setHelados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [heladosFiltrados, setHeladosFiltrados] = useState([]);
    const [openInfoModal, setOpenInfoModal] = useState(false);
    const [selectedHelado, setSelectedHelado] = useState(null);
    const gridRef = useRef(null);
    const navigate = useNavigate();

    const obtenerHelados = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/helado?page=${page}&pageSize=${pageSize}`);
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
=======
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListaHelados = () => {
    const [terminoBusqueda, setTerminoBusqueda] = useState(''); // Término de búsqueda
    const [helados, setHelados] = useState([]); // Lista completa de helados
    const [heladosFiltrados, setHeladosFiltrados] = useState([]); // Helados filtrados según búsqueda

    useEffect(() => {
        const obtenerHelados = async () => {
            try {
                // Realiza una solicitud GET a la API para obtener la lista de helados
                const response = await axios.get('/api/helados');
                // Actualiza el estado con la lista de helados obtenida
                setHelados(response.data);
                setHeladosFiltrados(response.data); // Inicializa los helados filtrados con la lista completa
            } catch (error) {
                console.error('Error al obtener los helados:', error);
            }
        };

>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2
        obtenerHelados();
    }, []);

    useEffect(() => {
<<<<<<< HEAD
=======
        // Filtra los helados según el término de búsqueda
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2
        const filtrarHelados = () => {
            const filtrados = helados.filter((helado) =>
                helado.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
            );
<<<<<<< HEAD
            setHeladosFiltrados(filtrados);
        };
        filtrarHelados();
    }, [terminoBusqueda, helados]);

    const handleDelete = useCallback(async (heladoId) => {
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
                await axios.delete(`http://localhost:5000/api/helado/${heladoId}`);
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

    const columns = useMemo(() => [
        {
            headerName: "Nombre",
            field: "nombre",
            flex: 1,
            minWidth: 100,
        },
        {
            headerName: "Imagen",
            field: "imagen",
            flex: 1,
            minWidth: 200,
            cellRenderer: (params) => (
                <img src={params.value} alt={`${params.data.nombre} imagen`} style={{ width: '50px', height: '50px' }} />
            ),
        },
        {
            headerName: "Costo",
            field: "costo",
            flex: 0.5,
            minWidth: 100,
        },
        {
            headerName: "Precio Base",
            field: "precioBase",
            flex: 1,
            minWidth: 100,
        },
        {
            headerName: "Precio Venta",
            field: "precioVenta",
            flex: 1,
            minWidth: 100,
        },
        {
            headerName: "Cantidad en Caja",
            field: "cantidadCaja",
            flex: 1,
            minWidth: 100,
        },
        {
            headerName: "Stock Disponible",
            field: "stock",
            flex: 1,
            minWidth: 100,
        },
        {
            headerName: "Acciones",
            field: "acciones",
            cellRenderer: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ActionButtons
                        onInfo={() => handleInfo(params.data.id)}
                        onEdit={() => handleEdit(params.data.id)}
                        onDelete={() => handleDelete(params.data.id)}
                    />
                </div>
            ),
        }
    ], [handleInfo, handleEdit, handleDelete]);

    return (
        <>
            <Typography variant="h5" align="center" gutterBottom color="primary">
                Lista de Helados
            </Typography>
            <div className="search-container">
                <TextField
                    className="search-input"
                    variant="outlined"
=======
            // Actualiza el estado de helados filtrados
            setHeladosFiltrados(filtrados);
        };

        filtrarHelados();
    }, [terminoBusqueda, helados]);

    return (
        <div className='contenedor-centrado'>
            <h1>Todos los Helados</h1>
            <div>
                <input
                    type="text"
                    className="buscador-texto"
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    placeholder='Buscar helados'
                />
            </div>
<<<<<<< HEAD
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/agregar-helado')}
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
            ) : (
                <Paper sx={{ height: 590, width: '100%', mt: 3 }} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={heladosFiltrados.map((helado) => ({
                            id: helado._id,
                            nombre: helado.nombre,
                            imagen: helado.imagen,
                            costo: helado.costo,
                            precioBase: helado.precioBase,
                            precioVenta: helado.precioVenta,
                            cantidadCaja: helado.cantidadCaja,
                            stock: helado.stock,
                            estado: helado.estado ? 'Activo' : 'Inactivo',
                        }))}
                        columnDefs={columns}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
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
            </Suspense>

        </>
=======
            <ul>
                {heladosFiltrados.map((helado) => (
                    <li key={helado._id}>
                        <Link to={`/helados/${helado._id}`} className="elemento-helado">
                            {helado.nombre}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2
    );
};

export default ListaHelados;
