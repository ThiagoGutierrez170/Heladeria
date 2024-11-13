import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const InfoModal = ({ open, onClose, vendedor }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            fullScreen={fullScreen}
            PaperProps={{
                style: {
                    backgroundColor: '#ffffff',
                    borderRadius: fullScreen ? 0 : '8px',
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    padding: '18px 18px',
                    position: 'relative'
                }}
            >
                Detalles del vendedor
                <Button
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 18,
                        color: 'white'
                    }}
                >
                    <CloseIcon />
                </Button>
            </DialogTitle>
            <DialogContent sx={{ padding: { xs: 4, sm: 4 } }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'black', pb: 5, pt: 5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    <strong>Nombre:</strong> {vendedor?.nombre}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: 'black', pb: 5, pt: 5,fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    <strong>Apellido:</strong> {vendedor?.apellido}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: 'black', pb: 5, pt: 5,fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    <strong>C.I.:</strong> {vendedor?.ci}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: 'black', pb: 5, pt: 5,fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    <strong>Contacto:</strong> {vendedor?.contacto}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: 'black', pb: 5, pt: 5,fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    <strong>Estado:</strong> {vendedor?.estado ? 'Activo' : 'Inactivo'}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
                <Button variant="contained" color="primary" onClick={onClose} fullWidth={fullScreen}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InfoModal;
