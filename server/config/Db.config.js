import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const URL_DB = process.env.MONGO_URI;

async function conectDB() {
    try {
        await mongoose.connect(URL_DB, {
            dbName: 'Heladeria',
        })
        console.log('Connectado con MongoDB');
    } catch (error) {
        console.error("Error al conectar a MongoDB", error);
        throw error;
      }
    }

export default conectDB;