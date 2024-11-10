import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Box,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const EditarUsuario = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const rolUsuario = localStorage.getItem('rol');
        if (rolUsuario !== 'administrador') {
            alert('Acceso no autorizado');
            navigate('/');
            return;
        }

        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`/api/usuarios/${id}`);
                setUsuario(response.data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchUsuario();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const handleCancel = () => {
        navigate('/usuarios');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/usuarios/${id}`, usuario);
            Swal.fire('Éxito', 'El usuario ha sido actualizado.', 'success');
            navigate('/usuarios');
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al actualizar el usuario.', 'error');
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
                Error al cargar los datos del usuario
            </Typography>
        );
    }

    return (
        <>
            <Helmet>
                <meta charSet="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/src/assets/images/editar.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Editar Usuario</title>
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
                    Editar Usuario
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Nombre de Usuario"
                        name="nombreUsuario"
                        value={usuario.nombreUsuario || ''}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Correo"
                        name="correo"
                        value={usuario.correo || ''}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                        required
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="rol-label">Rol</InputLabel>
                        <Select
                            labelId="rol-label"
                            name="rol"
                            value={usuario.rol || ''}
                            onChange={handleChange}
                            label="Rol"
                        >
                            <MenuItem value="administrador">Administrador</MenuItem>
                            <MenuItem value="usuario">Usuario</MenuItem>
                            <MenuItem value="supervisor">Supervisor</MenuItem>
                        </Select>
                    </FormControl>
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

export default EditarUsuario;