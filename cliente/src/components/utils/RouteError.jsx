import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const RouteError = () => {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        textAlign: 'center',
        padding: 4,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <ErrorOutlineIcon color="error" sx={{ fontSize: 80 }} />
      </Box>
      <Typography variant="h4" color="text.primary" gutterBottom>
        Error 404
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        La ruta que estás buscando no existe.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/')} 
        sx={{ mt: 2 }}
      >
        Volver a la página principal
      </Button>
    </Container>
  );
};

export default RouteError;
