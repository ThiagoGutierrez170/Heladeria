import dotenv from "dotenv";
import express from "express";
import conectDB from './config/Db.config.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

import vendedorRouter from './src/routes/vendedor.routes.js';
import heladoRouter from './src/routes/helado.routes.js';
import notaRouter from './src/routes/nota.routes.js';
import sesionesRouter from "./src/routes/sesiones.routes.js";
import usuarioRouter from "./src/routes/usuario.routes.js";

app.use('/api/vendedor', vendedorRouter);
app.use('/api/helado', heladoRouter);
app.use('/api/nota', NotaRouter);
app.use('/api/sesion', sesionesRouter);
app.use('/api/usuario', usuarioRouter);


conectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el http://localhost:${PORT}`);
});

