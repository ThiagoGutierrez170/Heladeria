import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

export default HeladoDetalle;
