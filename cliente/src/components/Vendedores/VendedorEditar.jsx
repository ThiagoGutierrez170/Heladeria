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
    FormHelperText,
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const EditarVendedor = () => {
    const { id } = useParams();
    const [vendedor, setVendedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVendedor = async () => {
            try {
                const response = await axios.get(`/api/vendedor/${id}`);
                setVendedor(response.data);
                setLoading(false);
            } catch (error) {
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

    const handleEstadoChange = (e) => {
        setVendedor({ ...vendedor, estado: e.target.checked });
    };

    const handleCancel = () => {
        navigate('/vendedores');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/vendedor/${id}`, vendedor);
            Swal.fire('Éxito', 'El vendedor ha sido actualizado.', 'success');
            navigate('/vendedores');
        } catch (error) {
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
            <Typography variant="body1" color="error.main" align="center">
                Error al cargar los datos del vendedor
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
                    autoFocus
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={vendedor.estado || false}
                            onChange={handleEstadoChange}
                            sx={{
                                '&.Mui-checked': {
                                    color: '#1976d2',
                                },
                            }}
                        />
                    }
                    label="Estado"
                    sx={{ mb: 3, fontSize: '16px', color: '#333' }}
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
