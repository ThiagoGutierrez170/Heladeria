import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,//Configura el puerto que queremos usar
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        selfHandleResponse: false,
        /*configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (proxyRes.statusCode === 401) {
              // Si el servidor responde con un 401, redirigimos al usuario a la página de login
              console.log("HAZ SIDO REDIRIGIDO");
              res.writeHead(401, {
                'Location': '/'
              });
              res.end();
              return;
            }
            proxyRes.pipe(res);
          });
        }*/
      },
    },
  },
})
