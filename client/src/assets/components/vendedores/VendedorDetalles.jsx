import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const InfoModal = ({ open, onClose, vendedor }) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm" // Ajustar el tamaño máximo del diálogo
        fullWidth // Hace que el diálogo use el ancho completo
    >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
            Detalles del Vendedor
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
                <strong>Nombre:</strong> {vendedor?.nombre}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>Apellido:</strong> {vendedor?.apellido}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>C.I.:</strong> {vendedor?.ci}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>Contacto:</strong> {vendedor?.contacto}
            </Typography>
            <Typography variant="h6" gutterBottom>
                <strong>Estado:</strong> {vendedor?.estado ? 'Activo' : 'Inactivo'}
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} variant="contained" color="primary">
                Cerrar
            </Button>
        </DialogActions>
    </Dialog>
);

export default InfoModal;
