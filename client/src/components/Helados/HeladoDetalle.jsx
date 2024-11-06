<<<<<<< HEAD
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

const HeladoDetalle = ({ open, onClose, helado }) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
    >
        <DialogTitle
            sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                backgroundColor: '#1976d2',
                color: 'white',
                padding: '16px 0'
            }}
        >
            Detalles del helado
            <Button
                onClick={onClose}
                sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            >
                <CloseIcon />
            </Button>
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
                <strong>Nombre:</strong> {helado?.nombre}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>Imagen url:</strong> {helado?.imagen}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>Costo:</strong> {helado?.costo}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>Precio base:</strong> {helado?.precioBase}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>Precio venta:</strong> {helado?.precioVenta}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>Cantidad:</strong> {helado?.cantidadCaja}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>Estado:</strong> {helado?.estado ? 'Activo' : 'Inactivo'}
            </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
        </DialogActions>
    </Dialog>
);
=======
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const HeladoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [helado, setHelado] = useState(null); // Estado inicial en `null` para mejor control
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("ID del helado:", id); // Verificar si id es correcto

        const obtenerHelado = async () => {
            try {
                const response = await axios.get(`/api/helados/${id}`);
                setHelado(response.data);
                console.log('Datos del helado:', response.data); // Confirmar si los datos son correctos
            } catch (error) {
                console.error('Error en la solicitud:', error);
                setError(error.message || 'Ha ocurrido un error');
            } finally {
                setLoading(false); // Asegurar que loading cambia correctamente
                console.log('Estado de loading:', loading); // Confirmar si loading cambia
            }
        };

        if (id) obtenerHelado(); // Solo llama a la función si `id` está definido
    }, [id]);

    const editarHelado = () => {
        navigate(`/editar/helado/${id}`);
    };

    const eliminarHelado = async () => {
        try {
            await axios.delete(`/api/helados/eliminar/${id}`);
            alert("Helado eliminado correctamente");
            navigate("/helados"); // Redirige a la lista de helados tras eliminar
        } catch (error) {
            console.error("Error al eliminar el helado:", error);
            setError(error.message || "Error al eliminar el helado");
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="helado-information-div">
            <h1>{helado?.nombre}</h1>
            <p className="helado-info">Costo: ${helado?.costo}</p>
            <p className="helado-info">Precio Base: ${helado?.precioBase}</p>
            <p className="helado-info">Precio de Venta: ${helado?.precioVenta}</p>
            <p className="helado-info">Cantidad en Caja: {helado?.cantidadCaja}</p>
            <p className="helado-info">Stock: {helado?.stock}</p>
            <p className="helado-info">Estado: {helado?.estado ? "Activo" : "Inactivo"}</p>
            {helado?.imagen && <img src={helado.imagen} alt={`${helado.nombre} imagen`} className="helado-imagen" />}

            <button className='update-button' onClick={editarHelado}>Editar Helado</button>
            <button className='delete-button' onClick={eliminarHelado}>Eliminar Helado</button>
        </div>
    );
};
>>>>>>> c9a7e4295bce673f20b2817298af1e8da77fa1b2

export default HeladoDetalle;
