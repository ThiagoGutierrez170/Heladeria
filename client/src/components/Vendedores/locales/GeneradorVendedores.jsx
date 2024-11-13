import { useState } from 'react';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { Button } from '@mui/material';

const GenerarVendedoresPrueba = () => {
    const [loading, setLoading] = useState(false);
    const numeroDeVendedores = 10;

    const generarVendedores = () => {
        return Array.from({ length: numeroDeVendedores }, () => ({
            nombre: faker.person.firstName(),
            apellido: faker.person.lastName(),
            edad: faker.number.int({ min: 18, max: 60 }),
            ci: faker.number.int({ min: 100000, max: 999999 }),
            contacto: faker.phone.number(),
            estado: faker.datatype.boolean(),
        }));
    };

    const enviarDatos = async () => {
        setLoading(true);
        const vendedores = generarVendedores();

        try {
            for (const vendedor of vendedores) {
                await axios.post('/api/vendedor', vendedor);
            }
            console.log('Todos los vendedores han sido creados');
        } catch (error) {
            console.error('Error al enviar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={enviarDatos} disabled={loading}>
                {loading ? 'Generando datos...' : 'Generar Vendedores de Prueba'}
            </Button>
        </div>
    );
};

export default GenerarVendedoresPrueba;
