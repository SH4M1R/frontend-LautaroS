import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: "/", // Asegura que todas las rutas de tu SPA funcionen
  server: {
    host: true, // true permite acceder desde cualquier dispositivo de la red
    port: 9050,
  },
})
