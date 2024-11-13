import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2/dist/sweetalert2.js';
//import 'sweetalert2/src/sweetalert2.scss';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const VendedoresForm = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [edad, setEdad] = useState("");
    const [ci, setCi] = useState("");
    const [contacto, setContacto] = useState("");
    const [estado, setEstado] = useState(true);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/vendedores');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!nombre) newErrors.nombre = 'Por favor proporciona el nombre';
        if (!apellido) newErrors.apellido = 'Por favor proporciona el apellido';
        if (!edad) newErrors.edad = 'Por favor proporciona la edad';
        if (!ci) newErrors.ci = 'Por favor proporciona su número de cédula';
        if (!contacto) newErrors.contacto = 'Por favor proporciona su contacto';
        if (!estado) newErrors.estado = 'Por favor proporciona el estado del vendedor';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post('/api/vendedor/', {
                    nombre, apellido, edad, ci, contacto, estado,
                });

                Swal.fire({
                    title: 'Vendedor agregado!',
                    text: 'Has agregado correctamente al vendedor.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                setSuccessMessage('Vendedor agregado exitosamente!');
                setNombre("");
                setApellido("");
                setEdad("");
                setCi("");
                setContacto("");
                setEstado(false);
                navigate('/vendedores');
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.response ? error.response.data.message : 'Hubo un problema al registrar al vendedor.',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
                setSuccessMessage('Error al agregar el vendedor.');
            }
        }
    };

    return (
        <>

            <Container
                maxWidth="sm"
                sx={{
                    p: 4,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
                    borderRadius: 2,
                    mt: 10,
                    backgroundColor: '#f5f5f5',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, color: '#333' }}>
                    Agregar Vendedor
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre"
                        variant="outlined"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        margin="normal"
                    />
                    <TextField
                        label="Apellido"
                        variant="outlined"
                        fullWidth
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        error={!!errors.apellido}
                        helperText={errors.apellido}
                        margin="normal"
                    />
                    <TextField
                        label="Edad"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                        error={!!errors.edad}
                        helperText={errors.edad}
                        margin="normal"
                    />
                    <TextField
                        label="Cédula de Identificación"
                        variant="outlined"
                        fullWidth
                        value={ci}
                        onChange={(e) => setCi(e.target.value)}
                        error={!!errors.ci}
                        helperText={errors.ci}
                        margin="normal"
                    />
                    <TextField
                        label="Contacto"
                        variant="outlined"
                        fullWidth
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        error={!!errors.contacto}
                        helperText={errors.contacto}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={estado}
                                onChange={(e) => setEstado(e.target.checked)}
                                sx={{
                                    '&.Mui-checked': {
                                        color: '#1976d2', // Color cuando está chequeado
                                    },
                                    '&.Mui-checked:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)', // Efecto hover
                                    },
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 28, // Tamaño del icono del checkbox
                                    },
                                }}
                            />
                        }
                        label="Estado"
                        sx={{
                            marginRight: 300,
                            fontSize: '16px', // Tamaño de la fuente de la etiqueta
                            color: '#333', // Color de la etiqueta
                        }}
                    />
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />} // Agregar icono de agregar
                                sx={{
                                    padding: '12px 24px', // Aumentar el padding
                                    fontSize: '16px', // Ajustar el tamaño de la fuente
                                    '&:hover': {
                                        backgroundColor: '#0056b3', // Color al pasar el mouse
                                    },
                                }}
                            >
                                Agregar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancel}
                                startIcon={<CancelIcon />}
                                sx={{
                                    padding: '12px 24px', // Aumentar el padding
                                    fontSize: '16px', // Ajustar el tamaño de la fuente
                                }}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>

                    {successMessage && (
                        <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                            {successMessage}
                        </Typography>
                    )}
                </form>
            </Container>
        </>
    );
};

export default VendedoresForm;
