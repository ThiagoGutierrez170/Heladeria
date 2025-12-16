import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Box,
    Stack,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import api from '../../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const EditarVendedor = () => {
    const { id } = useParams();
    // Inicializamos con un objeto base para evitar errores de uncontrolled components
    const [vendedor, setVendedor] = useState({
        nombre: '',
        apellido: '',
        edad: '',
        ci: '',
        contacto: '',
        estado: true
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVendedor = async () => {
            try {
                const response = await api.get(`/vendedor/${id}`);
                setVendedor(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(true);
                setLoading(false);
            }
        };
        fetchVendedor();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVendedor({ ...vendedor, [name]: value });
    };

    // Manejador específico para el Checkbox
    const handleEstadoChange = (e) => {
        const { name, value } = e.target;
        setVendedor({ 
            ...vendedor, 
            // Si el campo es 'edad', lo convertimos a número (o string vacío si borran todo)
            [name]: name === 'edad' ? (value === '' ? '' : Number(value)) : value 
        });
    };

    const handleCancel = () => {
        navigate('/vendedores');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/vendedor/${id}`, vendedor);
            await Swal.fire('Éxito', 'El vendedor ha sido actualizado.', 'success');
            navigate('/vendedores');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Hubo un problema al actualizar el vendedor.', 'error');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography variant="body1" color="error.main" align="center" sx={{ mt: 5 }}>
                Error al cargar los datos del vendedor. Intente nuevamente.
            </Typography>
        );
    }

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                mt: 5,
                maxWidth: 'sm',
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: '#ffffff',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom color="primary" sx={{ mb: 3 }}>
                Editar Vendedor
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={vendedor.nombre}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="Apellido"
                    name="apellido"
                    value={vendedor.apellido}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="Edad"
                    name="edad"
                    type="number"
                    value={vendedor.edad}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="C.I."
                    name="ci"
                    value={vendedor.ci}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label="Contacto"
                    name="contacto"
                    value={vendedor.contacto}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    required
                />
                
                {/* Checkbox corregido */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!vendedor.estado} // Aseguramos que sea booleano
                            onChange={handleEstadoChange}
                            name="estado"
                            color="primary"
                        />
                    }
                    label={vendedor.estado ? "Activo" : "Inactivo"}
                    sx={{ mb: 3, color: '#333' }}
                />

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon />}
                        sx={{ minWidth: '120px' }}
                    >
                        Actualizar
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        startIcon={<CancelIcon />}
                        sx={{ minWidth: '120px' }}
                    >
                        Cancelar
                    </Button>
                </Stack>
            </form>
        </Container>
    );
};

export default EditarVendedor;