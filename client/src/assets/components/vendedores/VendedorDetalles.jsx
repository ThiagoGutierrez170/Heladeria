import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

const InfoModal = ({ open, onClose, vendedor }) => (
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
            Detalles del Vendedor
            <Button 
                onClick={onClose} 
                sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }} 
            >
                <CloseIcon />
            </Button>
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
        <DialogActions sx={{ padding: 2 }}>
        </DialogActions>
    </Dialog>
);

export default InfoModal;
