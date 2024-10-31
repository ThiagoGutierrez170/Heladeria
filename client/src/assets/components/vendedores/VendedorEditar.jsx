import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Box,
    Stack,
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
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
                const response = await axios.get(`http://localhost:5000/api/vendedor/${id}`);
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

    const handleCancel = () => {
        navigate('/vendedores');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/vendedor/${id}`, vendedor);
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
        <>
            <Helmet>
                <meta charSet="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/src/assets/images/editar.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Editar Vendedor</title>
            </Helmet>
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    maxWidth: 'sm',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: 3,
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
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon />}
                        >
                            Actualizar
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancel}
                            startIcon={<CancelIcon />}
                        >
                            Cancelar
                        </Button>
                    </Stack>
                </form>
            </Container>
        </>
    );
};

export default EditarVendedor;
