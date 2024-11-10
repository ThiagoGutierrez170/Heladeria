import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CssBaseline,Stack
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import CancelIcon from '@mui/icons-material/Cancel';

const EditarUsuario = () => {
    const [usuario, setUsuario] = useState({
        nombreUsuario: '',
        correo: '',
        password: '',
        rol: 'usuario'
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const rolUsuario = localStorage.getItem('rol');
        if (rolUsuario !== 'administrador') {
            alert('Acceso no autorizado');
            navigate('/');
            return;
        }

        const fetchUsuario = async () => {
            const res = await axios.get(`/api/usuario/${id}`);
            setUsuario(res.data);
        };
        fetchUsuario();
    }, [id, navigate]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/usuario/${id}`, usuario);
            Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado.', 'success');
            navigate(`/usuario/${id}`);
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al actualizar el usuario.', 'error');
        }
    };

    const handleCancel = () => {
        navigate('/usuarios');
    };




    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Editar Usuario
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        label="Nombre de Usuario"
                        name="nombreUsuario"
                        value={usuario.nombreUsuario}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Correo"
                        name="correo"
                        value={usuario.correo}
                        type="email"
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Contraseña"
                        name="password"
                        value={usuario.password}
                        type="password"
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select
                            name="rol"
                            value={usuario.rol}
                            onChange={handleChange}
                            label="Rol"
                        >
                            <MenuItem value="usuario">Usuario</MenuItem>
                            <MenuItem value="supervisor">Supervisor</MenuItem>
                            <MenuItem value="administrador">Administrador</MenuItem>
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
                </Box>
            </Box>
        </Container>
    );
};

export default EditarUsuario;
