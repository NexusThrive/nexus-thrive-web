// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://nexusthrive.com.co',
  integrations: [react()],
  // Las capturas ya se guardan optimizadas (WebP, 2400 px escritorio y 780 px
  // móvil): no hace falta Sharp en el build.
  image: { service: passthroughImageService() },
  vite: {
    // En desarrollo, Vite debe pre-empaquetar React (es CommonJS). Sin esto
    // `react-dom/client` llega sin `createRoot`, las islas no hidratan y
    // componentes como Auri se quedan como HTML estático.
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'ogl'],
    },
  },
});
