import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '');
  
  // Obtenir l'URL de base de l'API (sans /api à la fin)
  const getApiBaseUrl = () => {
    if (env.VITE_MADABOOKING_API_URL) {
      return env.VITE_MADABOOKING_API_URL.replace(/\/api$/, '');
    }
    return mode === 'development' 
      ? 'http://127.0.0.1:8000' 
      : 'https://api.madabooking.mg';
  };

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        // Proxy pour les images : /img/{filename} -> {baseUrl}/api/images/{filename}
        '/img': {
          target: getApiBaseUrl(),
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/img/, '/api/images'),
        },
      },
    },
  };
});
