import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import IcecreamIcon from '@mui/icons-material/Icecream';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';

const items = [
    {
        title: "Helado de Chocolate",
        description: "Disfruta de nuestro helado de chocolate cremoso y exquisito, hecho con ingredientes seleccionados para un sabor inolvidable.",
        img: "https://www.arcor.com/ar/dist/images/nuestros_negocios/pic_helados2.jpg"
    },
    {
        title: "Helado de Fresa",
        description: "Nuestro helado de fresa es perfecto para los amantes de lo refrescante. Elaborado con fresas frescas para un sabor vibrante y dulce.",
        img: "https://i.ytimg.com/vi/a88rYs9--nM/sddefault.jpg"
    },
    {
        title: "Helado de Vainilla",
        description: "El clásico helado de vainilla que nunca pasa de moda, con un sabor suave y una textura cremosa que encanta a todos.",
        img: "https://elnenearg.vtexassets.com/arquivos/ids/170117/HELADO-ARCOR-BOMBONCITOS-COFLER-BLOCK-X18UN-1-13548.jpg?v=638605533685430000"
    }
];

function Home() {
    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Box display="flex" alignItems="center" mb={4} flexDirection="column" textAlign="center">
                <IcecreamIcon sx={{ fontSize: 60, color: '#6E65C7', marginBottom: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6E65C7', marginBottom: 2 }}>
                    Bienvenidos a la Experiencia de Sabores
                </Typography>
                <Typography variant="body1" sx={{ color: '#555', maxWidth: '600px' }}>
                    Sumérgete en el mundo de los helados artesanales, donde cada sabor es una invitación a un viaje de frescura y deleite. Nuestros helados están hechos con los mejores ingredientes, cuidadosamente seleccionados para ofrecerte una experiencia inolvidable.
                </Typography>
            </Box>

            {/* Carousel */}
            <Carousel>
                {items.map((item, i) => (
                    <Paper key={i} sx={{ position: 'relative', height: { xs: '250px', sm: '350px', md: '450px' }, borderRadius: 2, overflow: 'hidden' }}>
                        <img
                            src={item.img}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: 2,
                            textAlign: 'center'
                        }}>
                            <Typography variant="h5" fontWeight="bold">{item.title}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>{item.description}</Typography>
                        </Box>
                    </Paper>
                ))}
            </Carousel>
        </Container>
    );
}

export default Home;
