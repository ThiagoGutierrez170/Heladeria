// cliente/src/utils/api.js
import axios from 'axios';

// Si tu backend espera rutas como /api/helado, entonces:
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;